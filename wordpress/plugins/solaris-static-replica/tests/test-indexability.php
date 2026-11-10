<?php
/**
 * WordPress-context regression test for private/public robots handling.
 * Run after loading WordPress and the static replica plugin.
 */

if (!defined('ABSPATH')) {
    throw new RuntimeException('WordPress must be loaded first.');
}
if (!function_exists('solaris_static_replica_prepare_html')) {
    require dirname(__DIR__) . '/solaris-static-replica.php';
}

$missing = '__solaris_blog_public_missing__';
$saved = get_option('blog_public', $missing);
$sample = '<!doctype html><html><head><meta name="robots" content="noindex, nofollow"></head><body><main>Page</main></body></html>';

try {
    update_option('blog_public', 0);
    if (!solaris_static_replica_is_private()) {
        throw new RuntimeException('Integer zero was not recognized as private.');
    }

    $private = solaris_static_replica_prepare_html($sample);
    if (substr_count($private, 'noindex, nofollow') !== 1) {
        throw new RuntimeException('Private replica did not emit exactly one noindex directive.');
    }

    update_option('blog_public', 1);
    $public = solaris_static_replica_prepare_html($sample);
    if (solaris_static_replica_is_private()) {
        throw new RuntimeException('Integer one was incorrectly recognized as private.');
    }
    if (substr_count($public, 'index, follow') !== 1 || strpos($public, 'noindex') !== false) {
        throw new RuntimeException('Public replica did not become indexable.');
    }

    echo "static_replica_indexability=PASS\n";
} finally {
    if ($saved === $missing) {
        delete_option('blog_public');
    } else {
        update_option('blog_public', $saved);
    }
}
