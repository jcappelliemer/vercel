<?php
/**
 * Solaris Films — Vercel Deploy Webhook
 * Triggers a Vercel rebuild when content is saved in WordPress
 */

function solaris_trigger_vercel_deploy($post_id, $post, $update) {
    // Skip autosaves, revisions, and non-published posts
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (wp_is_post_revision($post_id)) return;
    if ($post->post_status !== 'publish') return;

    // Only trigger for our content types
    $allowed_types = array('prodotto', 'servizio_locale', 'focus_tecnico', 'pagina_info', 'page');
    if (!in_array($post->post_type, $allowed_types)) return;

    $webhook_url = get_option('solaris_vercel_webhook', '');
    if (empty($webhook_url)) return;

    // Fire and forget — non-blocking
    wp_remote_post($webhook_url, array(
        'timeout' => 5,
        'blocking' => false,
        'body' => '',
    ));
}
add_action('save_post', 'solaris_trigger_vercel_deploy', 20, 3);

/**
 * Also trigger when theme settings are saved
 */
function solaris_trigger_vercel_on_settings($old_value, $new_value) {
    $webhook_url = get_option('solaris_vercel_webhook', '');
    if (empty($webhook_url)) return;

    wp_remote_post($webhook_url, array(
        'timeout' => 5,
        'blocking' => false,
        'body' => '',
    ));
}
add_action('update_option_solaris_options', 'solaris_trigger_vercel_on_settings', 10, 2);
