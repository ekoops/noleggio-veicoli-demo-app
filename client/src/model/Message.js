class Message {
  constructor(header, messages) {
    this.header = header ? header.toString() : "";
    this.messages =
      Object.prototype.toString.call(messages).slice(8, -1) === "Array"
        ? messages
        : [];
  }

  static fromObject({ header, messages }) {
    return new Message(header, messages);
  }
}

export default Message;
