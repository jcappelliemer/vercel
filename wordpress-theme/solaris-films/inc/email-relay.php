<?php
/**
 * Solaris Films — Email Relay via WP REST API
 * Il backend FastAPI chiama questo endpoint per inviare email tramite wp_mail()
 */

// Registra endpoint REST per invio email
function solaris_register_email_relay() {
    register_rest_route('solaris/v1', '/send-email', array(
        'methods' => 'POST',
        'callback' => 'solaris_handle_email_relay',
        'permission_callback' => '__return_true',
    ));
}
add_action('rest_api_init', 'solaris_register_email_relay');

function solaris_handle_email_relay($request) {
    // Verifica chiave segreta
    $secret = $request->get_header('X-Solaris-Key');
    $expected = get_option('solaris_email_relay_key', '');

    if (empty($expected) || $secret !== $expected) {
        return new WP_REST_Response(array('error' => 'Unauthorized'), 403);
    }

    $params = $request->get_json_params();
    $subject  = sanitize_text_field($params['subject'] ?? '');
    $html     = wp_kses_post($params['html'] ?? '');
    $reply_to = sanitize_email($params['reply_to'] ?? '');
    $to       = sanitize_email($params['to'] ?? get_option('admin_email'));

    if (empty($subject) || empty($html)) {
        return new WP_REST_Response(array('error' => 'Missing subject or html'), 400);
    }

    // Headers
    $headers = array('Content-Type: text/html; charset=UTF-8');
    if (!empty($reply_to)) {
        $headers[] = 'Reply-To: ' . $reply_to;
    }
    $headers[] = 'From: Solaris Films <info@solarisfilms.it>';

    $sent = wp_mail($to, $subject, $html, $headers);

    if ($sent) {
        return new WP_REST_Response(array('status' => 'sent'), 200);
    } else {
        return new WP_REST_Response(array('error' => 'wp_mail failed'), 500);
    }
}

// Registra setting per la chiave segreta
function solaris_email_relay_settings() {
    register_setting('solaris_settings_group', 'solaris_email_relay_key', 'sanitize_text_field');
}
add_action('admin_init', 'solaris_email_relay_settings');
