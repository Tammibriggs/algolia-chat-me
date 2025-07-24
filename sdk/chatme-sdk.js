// ChatMe JavaScript SDK
// This is a minimal stub for documentation and demo purposes.

class ChatMe {
  constructor({ token, userId }) {
    this.token = token;
    this.userId = userId || null;
    this.historyEnabled = true;
    this.botPersona = {
      name: "ChatMeBot",
      tone: "neutral",
      description: "AI BOT",
    };
  }

  setBotPersona(name, tone = "neutral", description) {
    this.botPersona = { name, tone, description };
  }

  init(config) {
    if (typeof config === "string") {
      throw new Error("init now requires a config object: { token, userId }");
    }
    this.token = config.token;
    this.userId = config.userId || null;
    // Simulate chat start
    return { started: true, userId: this.userId };
  }

  requestRating() {
    // Simulate feedback prompt
    return "Feedback prompt shown";
  }

  disableHistory() {
    this.historyEnabled = false;
  }

  // Deprecated method for demo
  enableFeedbackPrompt() {
    // Simulate deprecated feedback prompt
    return "Deprecated feedback prompt shown";
  }
}

// Export for both browser and Node.js
if (typeof window !== "undefined") {
  window.ChatMe = ChatMe;
}

module.exports = ChatMe;
