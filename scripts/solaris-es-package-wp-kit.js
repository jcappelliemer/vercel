const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const themeDir = path.join(root, "wordpress", "solaris-es-theme");
const muPlugin = path.join(root, "wordpress", "mu-plugins", "solaris-es-content-types.php");
const outDir = path.join(root, "wordpress", "solaris-es-install-kit");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyRecursive(from, to) {
  const stat = fs.statSync(from);
  if (stat.isDirectory()) {
    ensureDir(to);
    for (const entry of fs.readdirSync(from)) {
      copyRecursive(path.join(from, entry), path.join(to, entry));
    }
    return;
  }

  ensureDir(path.dirname(to));
  fs.copyFileSync(from, to);
}

function listFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) files.push(...listFiles(full));
    else files.push(full);
  }
  return files;
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function rel(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function main() {
  if (!fs.existsSync(themeDir)) throw new Error(`Missing theme directory: ${rel(themeDir)}`);
  if (!fs.existsSync(muPlugin)) throw new Error(`Missing mu-plugin: ${rel(muPlugin)}`);

  fs.rmSync(outDir, { recursive: true, force: true });

  const themeTarget = path.join(outDir, "wp-content", "themes", "solaris-es-theme");
  const muPluginTarget = path.join(outDir, "wp-content", "mu-plugins", "solaris-es-content-types.php");

  copyRecursive(themeDir, themeTarget);
  copyRecursive(muPlugin, muPluginTarget);

  const files = listFiles(outDir).sort();
  const manifest = {
    generated_at: new Date().toISOString(),
    purpose: "Solarisfilms.es WordPress install kit. Copy contents into the dedicated .es WordPress instance only.",
    install_root: "wp-content/",
    includes: {
      theme: "wp-content/themes/solaris-es-theme/",
      mu_plugin: "wp-content/mu-plugins/solaris-es-content-types.php"
    },
    warnings: [
      "Do not install on solarisfilms.it.",
      "Do not publish imported drafts before legal, contact and copy review.",
      "Do not hardcode the AEO Orchestra badge in this theme."
    ],
    files: files.map((file) => ({
      path: path.relative(outDir, file).replace(/\\/g, "/"),
      bytes: fs.statSync(file).size,
      sha256: sha256(file)
    }))
  };

  fs.writeFileSync(path.join(outDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(JSON.stringify({
    output: rel(outDir),
    files: manifest.files.length,
    theme: rel(themeTarget),
    mu_plugin: rel(muPluginTarget),
    manifest: rel(path.join(outDir, "manifest.json"))
  }, null, 2));
}

main();
