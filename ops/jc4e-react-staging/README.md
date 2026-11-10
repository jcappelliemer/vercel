# jc4e React staging rebuild

This staging-only pipeline replaces the former Vercel deploy hook.

1. AEO Orchestra posts to the authenticated REST endpoint exposed by
   `solaris-static-replica`.
2. WordPress writes a request file under its uploads volume.
3. `orchestra-jc4e-react-rebuild.path` starts the rebuild service.
4. The service builds the pinned `codex/headless-orchestra-staging-qa`
   checkout, fetches the current Orchestra manifest, audits it, exports the
   static WordPress replica, and swaps it atomically.
5. The previous replica is archived under
   `/opt/seo-orchestra/rollback/solaris-static-replica/` before every swap.

The build always emits `noindex` staging output and keeps canonical URLs on
`https://www.solarisfilms.it`. It does not publish to Vercel and does not
modify the public Solaris WordPress installation.

Runtime paths:

- source: `/opt/solaris-react-staging/repo`
- executable: `/opt/solaris-react-staging/bin/rebuild.sh`
- log: `/var/log/orchestra-jc4e-react-rebuild.log`
- queue: WordPress uploads `solaris-static-replica-rebuild/`
