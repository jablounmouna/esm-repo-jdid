
import { useState } from "react";

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hello! Welcome to Handmade Shop. How can I help you?",
    },
  ]);

  const sendMessage = () => {
    const text = message.trim();

    if (!text) return;

    // Add user's message
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: text,
      },
    ]);

    setMessage("");

    // Temporary bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "🤖 Thanks for your message! I'm here to help you with our products and orders.",
        },
      ]);
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "25px",
          right: "25px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "none",
          background: "#111827",
          color: "white",
          fontSize: "25px",
          cursor: "pointer",
          zIndex: 9999,
        }}
      >
        {open ? "✕" : "🤖"}
      </button>

      {/* Chat window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "95px",
            right: "25px",
            width: "350px",
            height: "450px",
            background: "white",
            borderRadius: "20px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#111827",
              color: "white",
              padding: "18px",
              fontWeight: "bold",
              fontSize: "17px",
            }}
          >
            🤖 Handmade Assistant
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "15px",
              overflowY: "auto",
              background: "#f9fafb",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "10px 14px",
                    borderRadius: "15px",
                    background:
                      msg.sender === "user" ? "#111827" : "#e5e7eb",
                    color: msg.sender === "user" ? "white" : "#111827",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div
            style={{
              display: "flex",
              padding: "10px",
              borderTop: "1px solid #ddd",
              background: "white",
            }}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write a message..."
              style={{
                flex: 1,
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                outline: "none",
              }}
            />

            <button
              onClick={sendMessage}
              style={{
                marginLeft: "8px",
                padding: "10px 15px",
                border: "none",
                borderRadius: "10px",
                background: "#111827",
                color: "white",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
