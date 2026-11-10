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
                    'snippet' => 'Le pellicole antisolari riducono il calore e l abbagliamento sulle superfici vetrate.',
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

try {
    ob_start();
    solaris_static_replica_handle_chat(array(
        'message' => 'Come posso ridurre il caldo?',
        'page_path' => '/',
        'session_id' => 'session-test',
    ));
    $chat = json_decode(ob_get_clean(), true);
    if (!is_array($chat) || ($chat['knowledge_status'] ?? '') !== 'ok') {
        throw new RuntimeException('Chat knowledge proxy did not return a successful response.');
    }
    if (($chat['session_id'] ?? '') !== 'session-test' || count($chat['sources'] ?? array()) !== 1) {
        throw new RuntimeException('Chat response contract is incomplete.');
    }
    if (strpos((string) ($chat['response'] ?? ''), 'pellicole antisolari') === false) {
        throw new RuntimeException('Chat response did not use the mocked knowledge source.');
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

    echo "static_replica_dynamic_api=PASS\n";
} finally {
    remove_filter('pre_http_request', $http_mock, 10);
    remove_filter('solaris_static_replica_crm_webhook_key', $crm_key_mock);
    remove_filter('solaris_static_replica_wordpress_knowledge', $wordpress_knowledge_mock, 10);
}
