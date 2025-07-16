// ChatMe JavaScript SDK
// This is a minimal stub for documentation and demo purposes.

class ChatMe {
  constructor({ token, userId }) {
    this.token = token;
    this.userId = userId || null;
    this.historyEnabled = true;
    this.botPersona = { name: 'ChatMeBot', tone: 'neutral' };
  }

  setBotPersona(name, tone = 'neutral') {
    this.botPersona = { name, tone };
  }

  initChat(config) {
    if (typeof config === 'string') {
      throw new Error('initChat now requires a config object: { token, userId }');
    }
    this.token = config.token;
    this.userId = config.userId || null;
    // Simulate chat start
    return { started: true, userId: this.userId };
  }

  requestRating() {
    // Simulate feedback prompt
    return 'Feedback prompt shown';
  }

  disableHistory() {
    this.historyEnabled = false;
  }

  // Deprecated method for demo
  enableFeedbackPrompt() {
    // Simulate deprecated feedback prompt
    return 'Deprecated feedback prompt shown';
  }
}

// Export for both browser and Node.js
if (typeof window !== 'undefined') {
  window.ChatMe = ChatMe;
}

module.exports = ChatMe;
