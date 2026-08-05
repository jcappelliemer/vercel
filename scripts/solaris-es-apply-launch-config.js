const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const defaultPayloadPath = path.join(
  root,
  "docs",
  "solaris-es",
  "solarisfilms-es-wp-import-payload-2026-08-05.json"
);
const defaultOutPath = path.join(
  root,
  "docs",
  "solaris-es",
  "generated",
  "solarisfilms-es-wp-import-payload-configured.json"
);

const placeholderPattern = /\[[A-Z0-9_]+\]/g;
const placeholderMap = {
  "[TELEFONO_ES]": ["contacts", "phone"],
  "[WHATSAPP_ES]": ["contacts", "whatsapp"],
  "[EMAIL_ES]": ["contacts", "email"],
  "[DIRECCION_ES]": ["contacts", "address_public"]
};

function parseArgs(argv) {
  const args = {
    config: "",
    payload: defaultPayloadPath,
    out: defaultOutPath,
    inPlace: false,
    confirmInPlace: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--config") args.config = path.resolve(argv[++i]);
    else if (arg === "--payload") args.payload = path.resolve(argv[++i]);
    else if (arg === "--out") args.out = path.resolve(argv[++i]);
    else if (arg === "--in-place") args.inPlace = true;
    else if (arg === "--confirm-in-place") args.confirmInPlace = true;
    else if (arg === "--help") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!args.config) {
    throw new Error("Missing --config <file>. Use the template and create a local config file.");
  }

  if (args.inPlace) {
    args.out = args.payload;
    if (!args.confirmInPlace) {
      throw new Error("--in-place requires --confirm-in-place. Default flow writes a separate configured payload.");
    }
  }

  return args;
}

function printHelp() {
  console.log(`
Solaris ES launch config applier

Create a local config from the template, then generate a configured payload:
  node scripts/solaris-es-apply-launch-config.js --config docs/solaris-es/solarisfilms-es-launch-config.local.json

Options:
  --config <file>        Required. Local JSON with real ES contacts/company values.
  --payload <file>       Source payload. Default: docs/solaris-es/solarisfilms-es-wp-import-payload-2026-08-05.json
  --out <file>           Output payload copy. Default: docs/solaris-es/generated/solarisfilms-es-wp-import-payload-configured.json
  --in-place             Write back to --payload. Requires --confirm-in-place.
  --confirm-in-place     Safety confirmation for --in-place.

Safety:
  - Does not write to WordPress.
  - Does not publish or deploy.
  - Refuses to write if required launch values are missing or placeholder-like.
`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function getValue(object, segments) {
  return segments.reduce((current, segment) => {
    if (!current || typeof current !== "object") return "";
    return current[segment];
  }, object);
}

function text(value) {
  return String(value ?? "").trim();
}

function isPlaceholderLike(value) {
  const normalized = text(value);
  if (!normalized) return true;
  if (placeholderPattern.test(normalized)) {
    placeholderPattern.lastIndex = 0;
    return true;
  }
  placeholderPattern.lastIndex = 0;
  return /^(tbd|todo|da definire|n\/a|null|undefined)$/i.test(normalized);
}

function validateConfig(config) {
  const required = [
    { key: "contacts.email", path: ["contacts", "email"] },
    { key: "contacts.phone", path: ["contacts", "phone"] },
    { key: "contacts.whatsapp", path: ["contacts", "whatsapp"] },
    { key: "contacts.address_public", path: ["contacts", "address_public"] }
  ];

  const optionalWarnings = [
    { key: "company.tax_id", path: ["company", "tax_id"] },
    { key: "company.address", path: ["company", "address"] },
    { key: "crm.base_url", path: ["crm", "base_url"] }
  ];

  const blockers = [];
  const warnings = [];

  for (const field of required) {
    const value = getValue(config, field.path);
    if (isPlaceholderLike(value)) {
      blockers.push({ field: field.key, reason: "missing_or_placeholder" });
    }
  }

  for (const field of optionalWarnings) {
    const value = getValue(config, field.path);
    if (isPlaceholderLike(value)) {
      warnings.push({ field: field.key, reason: "missing_optional_launch_value" });
    }
  }

  return { blockers, warnings };
}

function collectPlaceholders(value, results = []) {
  if (typeof value === "string") {
    const matches = value.match(placeholderPattern) || [];
    for (const match of matches) results.push(match);
  } else if (Array.isArray(value)) {
    for (const item of value) collectPlaceholders(item, results);
  } else if (value && typeof value === "object") {
    for (const item of Object.values(value)) collectPlaceholders(item, results);
  }
  return results;
}

function replaceInValue(value, replacements) {
  if (typeof value === "string") {
    let output = value;
    for (const [placeholder, replacement] of Object.entries(replacements)) {
      output = output.split(placeholder).join(replacement);
    }
    return output;
  }

  if (Array.isArray(value)) {
    return value.map((item) => replaceInValue(item, replacements));
  }

  if (value && typeof value === "object") {
    const output = {};
    for (const [key, item] of Object.entries(value)) {
      output[key] = replaceInValue(item, replacements);
    }
    return output;
  }

  return value;
}

function buildReplacements(config) {
  const replacements = {};
  for (const [placeholder, configPath] of Object.entries(placeholderMap)) {
    replacements[placeholder] = text(getValue(config, configPath));
  }
  return replacements;
}

function unique(values) {
  return [...new Set(values)].sort();
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const payload = readJson(args.payload);
  const config = readJson(args.config);

  if (!Array.isArray(payload.items)) {
    throw new Error("Payload does not contain items[].");
  }

  const beforePlaceholders = unique(collectPlaceholders(payload));
  const configValidation = validateConfig(config);

  if (configValidation.blockers.length) {
    console.error(JSON.stringify({
      ok: false,
      wrote: false,
      reason: "launch_config_blocked",
      blockers: configValidation.blockers,
      warnings: configValidation.warnings,
      placeholders_before: beforePlaceholders
    }, null, 2));
    process.exit(1);
  }

  const replacements = buildReplacements(config);
  const configuredPayload = replaceInValue(payload, replacements);
  configuredPayload.configuration_applied_at = new Date().toISOString();
  configuredPayload.configuration_source = path.relative(root, args.config).replace(/\\/g, "/");
  configuredPayload.launch_config = {
    company: {
      legal_name: text(config.company && config.company.legal_name),
      commercial_name: text(config.company && config.company.commercial_name),
      province: text(config.company && config.company.province),
      country: text(config.company && config.company.country)
    },
    contacts: {
      email: text(config.contacts && config.contacts.email),
      phone: text(config.contacts && config.contacts.phone),
      whatsapp: text(config.contacts && config.contacts.whatsapp),
      service_area: text(config.contacts && config.contacts.service_area)
    },
    crm: {
      tenant: text(config.crm && config.crm.tenant),
      base_url: text(config.crm && config.crm.base_url)
    }
  };

  const afterPlaceholders = unique(collectPlaceholders(configuredPayload));
  if (afterPlaceholders.length) {
    console.error(JSON.stringify({
      ok: false,
      wrote: false,
      reason: "placeholders_remain_after_replacement",
      placeholders_before: beforePlaceholders,
      placeholders_after: afterPlaceholders
    }, null, 2));
    process.exit(1);
  }

  const updatedPaths = payload.items
    .filter((item, index) => JSON.stringify(item) !== JSON.stringify(configuredPayload.items[index]))
    .map((item) => item.path);

  fs.mkdirSync(path.dirname(args.out), { recursive: true });
  fs.writeFileSync(args.out, `${JSON.stringify(configuredPayload, null, 2)}\n`);

  console.log(JSON.stringify({
    ok: true,
    wrote: path.relative(root, args.out).replace(/\\/g, "/"),
    mode: args.inPlace ? "in-place" : "copy",
    placeholders_before: beforePlaceholders,
    placeholders_after: afterPlaceholders,
    updated_paths: updatedPaths,
    warnings: configValidation.warnings
  }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
