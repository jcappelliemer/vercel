<?php
/**
 * WordPress-context regression tests for the static replica chat endpoints.
 */

if (!defined('ABSPATH')) {
    throw new RuntimeException('WordPress must be loaded first.');
}
if (!function_exists('solaris_static_replica_handle_chat')) {
    require dirname(__DIR__) . '/solaris-static-replica.php';
}

$requests = array();
$knowledge_available = true;
$http_mock = function ($preempt, $args, $url) use (&$requests, &$knowledge_available) {
    $requests[] = array('url' => $url, 'args' => $args);
    if (strpos($url, '/public/chatbot/knowledge/search') !== false) {
        if (!$knowledge_available) {
            return array(
                'headers' => array('content-type' => 'application/json'),
                'body' => wp_json_encode(array('detail' => 'Unavailable')),
                'response' => array('code' => 503, 'message' => 'Unavailable'),
                'cookies' => array(),
                'filename' => null,
            );
        }
        return array(
            'headers' => array('content-type' => 'application/json'),
            'body' => wp_json_encode(array(
                'tokens' => array('caldo', 'antisolare'),
                'sources' => array(array(
                    'title' => 'Guida antisolari Solaris',
                    'source_type' => 'solaris',
                    'origin_url' => 'https://www.solarisfilms.it/guida-tecnica/',
                    'score' => 91,
                    'snippet' => 'Le pellicole antisolari riducono il calore: non &#xE8; necessario sostituire i vetri.',
                )),
            )),
            'response' => array('code' => 200, 'message' => 'OK'),
            'cookies' => array(),
            'filename' => null,
        );
    }
    if (strpos($url, '/public/forms/contact/plain') !== false) {
        return array(
            'headers' => array('content-type' => 'application/json'),
            'body' => wp_json_encode(array('ok' => true, 'lead_id' => 'lead-test-1')),
            'response' => array('code' => 200, 'message' => 'OK'),
            'cookies' => array(),
            'filename' => null,
        );
    }
    if (strpos($url, '/public/forms/quote-request/plain') !== false) {
        return array(
            'headers' => array('content-type' => 'application/json'),
            'body' => wp_json_encode(array('ok' => true, 'lead_id' => 'quote-test-1')),
            'response' => array('code' => 200, 'message' => 'OK'),
            'cookies' => array(),
            'filename' => null,
        );
    }
    return $preempt;
};
add_filter('pre_http_request', $http_mock, 10, 3);
$crm_key_mock = function () {
    return 'test-key';
};
add_filter('solaris_static_replica_crm_webhook_key', $crm_key_mock);
$wordpress_knowledge_mock = function () {
    return array(array(
        'title' => 'Pagina Solaris locale',
        'source_type' => 'solaris',
        'origin_url' => 'https://www.solarisfilms.it/guida-tecnica/',
        'score' => 80,
        'snippet' => 'La pagina WordPress locale contiene indicazioni tecniche sulle pellicole per vetri.',
    ));
};
add_filter('solaris_static_replica_wordpress_knowledge', $wordpress_knowledge_mock, 10, 0);
$temporary_files = array();

try {
    $terms = solaris_static_replica_knowledge_search_terms('Quale pellicola aiuta a ridurre caldo e abbagliamento?');
    if (in_array('aiuta', $terms, true) || !in_array('antisolare', $terms, true)) {
        throw new RuntimeException('Chat knowledge terms did not prioritize the technical intent.');
    }

    ob_start();
    solaris_static_replica_handle_chat(array(
        'message' => 'Come posso ridurre il caldo?',
        'page_path' => '/',
        'session_id' => 'session-test',
    ));
    $chat = json_decode(ob_get_clean(), true);
    if (!is_array($chat) || ($chat['knowledge_status'] ?? '') !== 'crm') {
        throw new RuntimeException('Chat knowledge proxy did not return a successful response.');
    }
    if (($chat['session_id'] ?? '') !== 'session-test' || count($chat['sources'] ?? array()) !== 1) {
        throw new RuntimeException('Chat response contract is incomplete.');
    }
    if (strpos((string) ($chat['response'] ?? ''), 'pellicole antisolari') === false) {
        throw new RuntimeException('Chat response did not use the mocked knowledge source.');
    }
    if (strpos((string) ($chat['response'] ?? ''), '&#') !== false || strpos((string) ($chat['response'] ?? ''), 'non è necessario') === false) {
        throw new RuntimeException('Chat response did not decode HTML entities.');
    }

    $knowledge_available = false;
    ob_start();
    solaris_static_replica_handle_chat(array(
        'message' => 'Mi serve una guida tecnica locale',
        'page_path' => '/',
    ));
    $wordpress_chat = json_decode(ob_get_clean(), true);
    if (($wordpress_chat['knowledge_status'] ?? '') !== 'wordpress' || count($wordpress_chat['sources'] ?? array()) !== 1) {
        throw new RuntimeException('Chat did not fall back to the local WordPress knowledge.');
    }

    $before_invalid = count($requests);
    ob_start();
    solaris_static_replica_handle_chat_lead(array(
        'nome' => 'Test',
        'email' => 'test@example.invalid',
        'privacy_accettata' => false,
    ));
    $invalid = json_decode(ob_get_clean(), true);
    if (($invalid['detail'] ?? '') !== 'Privacy non accettata' || count($requests) !== $before_invalid) {
        throw new RuntimeException('Invalid lead was forwarded to the CRM.');
    }

    ob_start();
    solaris_static_replica_handle_chat_lead(array(
        'nome' => 'Test',
        'cognome' => 'Headless',
        'email' => 'test@example.invalid',
        'privacy_accettata' => true,
        'interesse' => 'Pellicole antisolari',
        'page_path' => '/',
        'source_url' => 'https://www.solarisfilms.it/',
        'session_id' => 'session-test',
        'transcript' => array(array('type' => 'user', 'text' => 'Vorrei ridurre il caldo.')),
    ));
    $lead = json_decode(ob_get_clean(), true);
    if (($lead['crm_status'] ?? '') !== 'sent' || ($lead['id'] ?? '') !== 'lead-test-1') {
        throw new RuntimeException('Valid lead was not confirmed as delivered.');
    }
    $last_request = end($requests);
    $body = $last_request['args']['body'] ?? array();
    if (($body['form_code'] ?? '') !== 'chatbot' || ($body['privacy_acceptance'] ?? '') !== 'true') {
        throw new RuntimeException('CRM lead payload is missing consent or source fields.');
    }
    if (strpos((string) ($body['request_notes'] ?? ''), 'Ultimi messaggi chat') === false) {
        throw new RuntimeException('CRM lead payload is missing the chat transcript.');
    }

    $before_invalid_form = count($requests);
    ob_start();
    solaris_static_replica_handle_public_form('contact', array(
        'first_name' => 'Test',
        'email' => 'test@example.invalid',
        'privacy_acceptance' => 'false',
    ), array(), false);
    $invalid_form = json_decode(ob_get_clean(), true);
    if (($invalid_form['detail'] ?? '') !== 'Privacy non accettata' || count($requests) !== $before_invalid_form) {
        throw new RuntimeException('Invalid public form was forwarded to the CRM.');
    }

    ob_start();
    solaris_static_replica_handle_public_form('contact', array(
        'first_name' => 'Test',
        'email' => 'test@example.invalid',
        'privacy_acceptance' => 'true',
        'form_code' => 'contattaci',
    ), array(), false);
    $contact = json_decode(ob_get_clean(), true);
    $contact_request = end($requests);
    if (($contact['lead_id'] ?? '') !== 'lead-test-1' || strpos($contact_request['url'] ?? '', '/public/forms/contact/plain') === false) {
        throw new RuntimeException('Contact proxy did not forward to the expected CRM form.');
    }
    if (strpos((string) ($contact_request['args']['headers']['Content-Type'] ?? ''), 'multipart/form-data; boundary=') !== 0
        || strpos((string) ($contact_request['args']['body'] ?? ''), 'name="first_name"') === false) {
        throw new RuntimeException('Contact proxy did not preserve the multipart contract.');
    }

    ob_start();
    solaris_static_replica_handle_public_form('quote', array(
        'first_name' => 'Test',
        'email' => 'test@example.invalid',
        'privacy_acceptance' => 'true',
        'form_code' => 'richiedi_preventivo',
    ), array(), false);
    $quote = json_decode(ob_get_clean(), true);
    $quote_request = end($requests);
    if (($quote['lead_id'] ?? '') !== 'quote-test-1' || strpos($quote_request['url'] ?? '', '/public/forms/quote-request/plain') === false) {
        throw new RuntimeException('Quote proxy did not forward to the expected CRM form.');
    }

    $temporary_files[] = wp_tempnam('solaris-one.txt');
    $temporary_files[] = wp_tempnam('solaris-two.txt');
    file_put_contents($temporary_files[0], 'one');
    file_put_contents($temporary_files[1], 'two');
    $multipart = solaris_static_replica_build_multipart(array('privacy_acceptance' => 'true'), array(
        'attachment_image' => array(
            'name' => array('one.txt', 'two.txt'),
            'type' => array('text/plain', 'text/plain'),
            'tmp_name' => $temporary_files,
            'error' => array(UPLOAD_ERR_OK, UPLOAD_ERR_OK),
            'size' => array(3, 3),
        ),
    ), false);
    if (is_wp_error($multipart) || substr_count($multipart['body'] ?? '', 'name="attachment_image"; filename=') !== 2) {
        throw new RuntimeException('Multipart builder did not preserve multiple attachments.');
    }

    echo "static_replica_dynamic_api=PASS\n";
} finally {
    remove_filter('pre_http_request', $http_mock, 10);
    remove_filter('solaris_static_replica_crm_webhook_key', $crm_key_mock);
    remove_filter('solaris_static_replica_wordpress_knowledge', $wordpress_knowledge_mock, 10);
    foreach ($temporary_files as $temporary_file) {
        if (is_string($temporary_file) && file_exists($temporary_file)) {
            unlink($temporary_file);
        }
    }
}
