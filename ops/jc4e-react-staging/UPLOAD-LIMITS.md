# WordPress upload limits

The headless contact and quote proxies accept up to 10 attachments, 10 MB per file and 28 MB in total. The WordPress Apache runtime must allow the request before the plugin can validate it.

Apply the versioned limits on the jc4e staging/production WordPress volume with:

```bash
bash ops/jc4e-react-staging/install-upload-limits.sh
```

The script creates a persistent backup, writes a managed block outside the WordPress-generated markers, validates Apache configuration and restores the backup if validation fails.
