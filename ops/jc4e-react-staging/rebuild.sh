#!/usr/bin/env bash
set -Eeuo pipefail

REPO_ROOT="/opt/solaris-react-staging/repo"
FRONTEND_CACHE="${REPO_ROOT}/frontend/node_modules"
WORK_ROOT="/opt/solaris-react-staging/runs"
PLUGIN_PARENT="/var/lib/docker/volumes/wordpress-jc4e_wordpress/_data/wp-content/plugins"
ACTIVE_PLUGIN="${PLUGIN_PARENT}/solaris-static-replica"
QUEUE_DIR="/var/lib/docker/volumes/wordpress-jc4e_wordpress/_data/wp-content/uploads/solaris-static-replica-rebuild"
ROLLBACK_ROOT="/opt/seo-orchestra/rollback/solaris-static-replica"
LOG_FILE="/var/log/orchestra-jc4e-react-rebuild.log"
WP_CONTAINER="wordpress-jc4e-wordpress-1"
WP_ORIGIN="https://wordpress-jc4e.srv1502079.hstgr.cloud"
PUBLIC_ORIGIN="https://www.solarisfilms.it"
PORT="4195"
MIN_ORCHESTRA_PAGES="150"
RUN_RETENTION="${RUN_RETENTION:-5}"

safe_remove_tree() {
    local target="$1"
    local allowed_root="$2"
    if [[ -z "${target}" || "${target}" != "${allowed_root}/"* || "${target}" == "${allowed_root}/" ]]; then
        echo "[$(date -u +%FT%TZ)] refusing unsafe removal: ${target}"
        return 1
    fi
    rm -rf -- "${target}"
}

prune_old_runs() {
    if [[ ! "${RUN_RETENTION}" =~ ^[1-9][0-9]*$ ]]; then
        echo "[$(date -u +%FT%TZ)] invalid RUN_RETENTION: ${RUN_RETENTION}"
        return 1
    fi

    local -a runs=()
    local name target resolved
    mapfile -t runs < <(
        find "${WORK_ROOT}" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' \
            | grep -E '^20[0-9]{6}T[0-9]{6}Z$' \
            | sort -r
    )
    for name in "${runs[@]:${RUN_RETENTION}}"; do
        target="${WORK_ROOT}/${name}"
        resolved="$(realpath -e "${target}")"
        if [[ ! "${resolved}" =~ ^${WORK_ROOT}/20[0-9]{6}T[0-9]{6}Z$ ]]; then
            echo "[$(date -u +%FT%TZ)] refusing unsafe run cleanup: ${resolved}"
            return 1
        fi
        safe_remove_tree "${resolved}" "${WORK_ROOT}"
        echo "[$(date -u +%FT%TZ)] pruned old run: ${name}"
    done
}

mkdir -p "${WORK_ROOT}" "${ROLLBACK_ROOT}" "${QUEUE_DIR}"
touch "${LOG_FILE}"
chmod 640 "${LOG_FILE}"
exec >>"${LOG_FILE}" 2>&1

echo "[$(date -u +%FT%TZ)] rebuild requested"

exec 9>/run/lock/orchestra-jc4e-react-rebuild.lock
if ! flock -n 9; then
    echo "[$(date -u +%FT%TZ)] another rebuild is active; request remains queued"
    exit 0
fi

if [[ ! -d "${REPO_ROOT}/.git" || ! -d "${FRONTEND_CACHE}" ]]; then
    echo "[$(date -u +%FT%TZ)] source checkout or dependency cache missing"
    exit 1
fi

prune_old_runs

BUILD_ID="$(date -u +%Y%m%dT%H%M%SZ)"
RUN_DIR="${WORK_ROOT}/${BUILD_ID}"
SOURCE_DIR="${RUN_DIR}/source"
FRONTEND_DIR="${SOURCE_DIR}/frontend"
EXPORT_DIR="${RUN_DIR}/solaris-static-replica"
REQUEST_DIR="${RUN_DIR}/rebuild-requests"
NEW_PLUGIN="${PLUGIN_PARENT}/.solaris-static-replica.new-${BUILD_ID}"
OLD_PLUGIN="${PLUGIN_PARENT}/.solaris-static-replica.old-${BUILD_ID}"
SERVER_LOG="${RUN_DIR}/next-server.log"
SERVER_PID=""
SWAPPED=0

cleanup() {
    if [[ -n "${SERVER_PID}" ]] && kill -0 "${SERVER_PID}" 2>/dev/null; then
        kill "${SERVER_PID}" 2>/dev/null || true
        wait "${SERVER_PID}" 2>/dev/null || true
    fi
    if [[ "${SWAPPED}" -eq 0 && -d "${OLD_PLUGIN}" && ! -d "${ACTIVE_PLUGIN}" ]]; then
        mv "${OLD_PLUGIN}" "${ACTIVE_PLUGIN}"
    fi
    if [[ -d "${NEW_PLUGIN}" ]]; then
        safe_remove_tree "${NEW_PLUGIN}" "${PLUGIN_PARENT}"
    fi
}
trap cleanup EXIT

mkdir -p "${SOURCE_DIR}" "${REQUEST_DIR}"
shopt -s nullglob
REQUEST_FILES=("${QUEUE_DIR}"/request-*.json)
if (( ${#REQUEST_FILES[@]} > 0 )); then
    mv -- "${REQUEST_FILES[@]}" "${REQUEST_DIR}/"
fi
shopt -u nullglob
echo "[$(date -u +%FT%TZ)] claimed rebuild requests: ${#REQUEST_FILES[@]}"

COMMIT="$(git -C "${REPO_ROOT}" rev-parse HEAD)"
git -C "${REPO_ROOT}" archive HEAD | tar -xf - -C "${SOURCE_DIR}"
ln -s "${FRONTEND_CACHE}" "${FRONTEND_DIR}/node_modules"

ORCHESTRA_LICENSE="$(docker exec "${WP_CONTAINER}" wp option get seo_aeo_orchestra_license_key --allow-root)"
if [[ -z "${ORCHESTRA_LICENSE}" ]]; then
    echo "[$(date -u +%FT%TZ)] Orchestra license is not configured"
    exit 1
fi

export ORCHESTRA_LICENSE
export ORCHESTRA_BASE="${WP_ORIGIN}"
export REACT_APP_WP_URL="${WP_ORIGIN}"
export WP_URL="${WP_ORIGIN}"
export NEXT_PUBLIC_WP_ORIGIN="${WP_ORIGIN}"
export NEXT_PUBLIC_SITE_URL="${PUBLIC_ORIGIN}"
export NEXT_PUBLIC_SITE_ORIGIN="${PUBLIC_ORIGIN}"
export NEXT_PUBLIC_SITE_INDEXABLE="0"
export WP_FETCH_TIMEOUT_MS="30000"
export NEXT_TELEMETRY_DISABLED="1"

cd "${FRONTEND_DIR}"
npm run build

ORCHESTRA_PAGE_COUNT="$(jq -r '.byPath | length' src/data/orchestra-fixes.json)"
if [[ ! "${ORCHESTRA_PAGE_COUNT}" =~ ^[0-9]+$ ]] || (( ORCHESTRA_PAGE_COUNT < MIN_ORCHESTRA_PAGES )); then
    echo "[$(date -u +%FT%TZ)] manifest guard failed: ${ORCHESTRA_PAGE_COUNT} pages"
    exit 1
fi

./node_modules/.bin/next start --hostname 127.0.0.1 --port "${PORT}" >"${SERVER_LOG}" 2>&1 &
SERVER_PID=$!
for _ in $(seq 1 60); do
    if curl -fsS --max-time 3 "http://127.0.0.1:${PORT}/" >/dev/null; then
        break
    fi
    sleep 1
done
if ! curl -fsS --max-time 5 "http://127.0.0.1:${PORT}/" >/dev/null; then
    echo "[$(date -u +%FT%TZ)] local Next server did not become ready"
    exit 1
fi

HEADLESS_AUDIT_BASE="http://127.0.0.1:${PORT}" \
    python3 scripts/audit-headless.py src/data/orchestra-fixes.json

python3 scripts/export-wp-static-replica.py \
    --base "http://127.0.0.1:${PORT}" \
    --frontend-root "${FRONTEND_DIR}" \
    --out "${EXPORT_DIR}" \
    --public-origin "${PUBLIC_ORIGIN}" \
    --git-commit "${COMMIT}" \
    --workers 8 \
    --timeout 20

mkdir -p "${NEW_PLUGIN}"
cp "${SOURCE_DIR}/wordpress/plugins/solaris-static-replica/solaris-static-replica.php" "${NEW_PLUGIN}/"
cp -a "${EXPORT_DIR}" "${NEW_PLUGIN}/static"
php -l "${NEW_PLUGIN}/solaris-static-replica.php"

if [[ -d "${ACTIVE_PLUGIN}" ]]; then
    tar -C "${PLUGIN_PARENT}" -czf "${ROLLBACK_ROOT}/jc4e-pre-${BUILD_ID}.tgz" solaris-static-replica
    mv "${ACTIVE_PLUGIN}" "${OLD_PLUGIN}"
fi
mv "${NEW_PLUGIN}" "${ACTIVE_PLUGIN}"

if ! curl -fsS --max-time 20 "${WP_ORIGIN}/" >/dev/null; then
    safe_remove_tree "${ACTIVE_PLUGIN}" "${PLUGIN_PARENT}"
    if [[ -d "${OLD_PLUGIN}" ]]; then
        mv "${OLD_PLUGIN}" "${ACTIVE_PLUGIN}"
    fi
    echo "[$(date -u +%FT%TZ)] live staging smoke failed; previous replica restored"
    exit 1
fi

SWAPPED=1
if [[ -d "${OLD_PLUGIN}" ]]; then
    safe_remove_tree "${OLD_PLUGIN}" "${PLUGIN_PARENT}"
fi
PENDING_REQUESTS="$(find "${QUEUE_DIR}" -maxdepth 1 -type f -name 'request-*.json' | wc -l)"
echo "[$(date -u +%FT%TZ)] PASS commit=${COMMIT} pages=${ORCHESTRA_PAGE_COUNT} build=${BUILD_ID} pending_requests=${PENDING_REQUESTS}"
