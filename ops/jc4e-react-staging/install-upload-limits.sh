#!/usr/bin/env bash
set -Eeuo pipefail

WP_ROOT="${WP_ROOT:-/var/lib/docker/volumes/wordpress-jc4e_wordpress/_data}"
WP_CONTAINER="${WP_CONTAINER:-wordpress-jc4e-wordpress-1}"
HTACCESS="${WP_ROOT}/.htaccess"
BACKUP_ROOT="${BACKUP_ROOT:-/opt/solaris-react-staging/config-backups}"

if [[ ! -d "${WP_ROOT}" || ! -f "${HTACCESS}" ]]; then
    echo "WordPress root or .htaccess not found: ${WP_ROOT}" >&2
    exit 1
fi

RESOLVED_ROOT="$(realpath -e "${WP_ROOT}")"
RESOLVED_HTACCESS="$(realpath -e "${HTACCESS}")"
if [[ "${RESOLVED_HTACCESS}" != "${RESOLVED_ROOT}/.htaccess" ]]; then
    echo "Refusing unexpected .htaccess path: ${RESOLVED_HTACCESS}" >&2
    exit 1
fi

mkdir -p "${BACKUP_ROOT}"
BACKUP="${BACKUP_ROOT}/jc4e-htaccess-pre-upload-limits-$(date -u +%Y%m%dT%H%M%SZ)"
cp --preserve=mode,ownership,timestamps "${HTACCESS}" "${BACKUP}"

python3 - "${HTACCESS}" <<'PY'
from pathlib import Path
import os
import sys
import tempfile

path = Path(sys.argv[1])
start = "# BEGIN Solaris Headless Upload Limits"
end = "# END Solaris Headless Upload Limits"
block = """# BEGIN Solaris Headless Upload Limits
<IfModule mod_php.c>
php_value upload_max_filesize 10M
php_value post_max_size 32M
php_value max_file_uploads 10
</IfModule>
# END Solaris Headless Upload Limits
"""
text = path.read_text(encoding="utf-8")
if start in text and end in text:
    before, remainder = text.split(start, 1)
    _, after = remainder.split(end, 1)
    updated = before.rstrip() + "\n\n" + block + after.lstrip("\n")
else:
    updated = block + "\n" + text.lstrip("\n")

fd, temporary = tempfile.mkstemp(prefix=".htaccess.solaris-", dir=path.parent)
try:
    with os.fdopen(fd, "w", encoding="utf-8", newline="\n") as handle:
        handle.write(updated)
    os.chmod(temporary, path.stat().st_mode)
    os.replace(temporary, path)
finally:
    if os.path.exists(temporary):
        os.unlink(temporary)
PY

if ! docker exec "${WP_CONTAINER}" apache2ctl -t >/dev/null; then
    cp --preserve=mode,ownership,timestamps "${BACKUP}" "${HTACCESS}"
    echo "Apache rejected the upload-limit block; backup restored." >&2
    exit 1
fi

echo "Upload limits installed. Backup: ${BACKUP}"
