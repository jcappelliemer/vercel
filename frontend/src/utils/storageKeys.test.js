import {
  CHAT_MESSAGES_KEY,
  CHAT_SESSION_KEY,
  SETTINGS_STORAGE_KEY,
} from './storageKeys';

describe('browser storage namespaces', () => {
  test('do not reuse cache keys that may contain legacy chatbot copy', () => {
    expect(SETTINGS_STORAGE_KEY).toBe('solaris_settings_cache_v3');
    expect(CHAT_MESSAGES_KEY).toBe('solaris_chatbot_messages_v2');
    expect(CHAT_SESSION_KEY).toBe('solaris_chatbot_session_v2');
  });
});
