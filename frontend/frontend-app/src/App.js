import React, {useState} from "react";
import "./App.css";

function App() {
  // ---------- STATES ----------
  const [topic, setTopic] = useState("");
  const [doubt, setDoubt] = useState("");
  const [answerType, setAnswerType] = useState("2");

  const [activeTab, setActiveTab] = useState("explain");

  const [loading, setLoading] = useState(false);

  // Chat-style messages (THIS IS PRO LEVEL)
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // ---------- API CALL ----------
  const callAPI = async (endpoint, body) => {
    setLoading(true);

    // user message
    const userMsg = {
      role: "user",
      text: body.topic || body.doubt || "Request"
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await fetch(`http://localhost:5000/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      // AI response
      const aiMsg = {
        role: "ai",
        text: data.result
      };

      setMessages((prev) => [...prev, aiMsg]);

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "❌ Error connecting to backend" }
      ]);
    }

    setLoading(false);
  };

  // ---------- SEND HANDLER ----------
  const handleSend = () => {
    if (activeTab === "explain") {
      callAPI("explain", { topic, answerType });
    }

    if (activeTab === "quiz") {
      callAPI("quiz", { topic });
    }

    if (activeTab === "flash") {
      callAPI("flashcards", { topic });
    }

    if (activeTab === "doubt") {
      callAPI("doubt", { doubt });
    }
    if (activeTab === "studyplan") {
    callAPI("studyplan", { topic });
  }

  if (activeTab === "notes") {
    callAPI("notes", { topic });
  }
  setTopic("");
  setDoubt("");
  };
    if (!isLoggedIn) {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#0f172a",
        color: "white",
      }}
    >
      <h1 style={{ fontSize: "40px" }}>📚 AI Study Buddy</h1>

      <p style={{ color: "#94a3b8" }}>
        Your Personal Learning Assistant
      </p>

      <input
  type="text"
  placeholder="Enter your name"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  style={{
    padding: "14px",
    width: "350px",
    borderRadius: "14px",
    border: "1px solid #334155",
    marginTop: "20px",
    backgroundColor: "#1e293b",
    color: "white",
    outline: "none",
    boxShadow: "0 0 20px rgba(16,163,127,0.2)"
  }}
/>

      <button
  onClick={() => setIsLoggedIn(true)}
  style={{
    marginTop: "20px",
    padding: "14px 28px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#10a37f",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 0 20px rgba(16,163,127,0.3)"
  }}
>
  Enter
</button>
    </div>
  );
}
  return (
    <div style={styles.container}>

      {/* ================= SIDEBAR ================= */}
      <div style={styles.sidebar}>
        <div style={{ marginBottom: "20px", textAlign: "center" }}>

  <div
    style={{
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      backgroundColor: "#10a37f",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 10px auto",
      fontSize: "24px",
      fontWeight: "bold",
      color: "white"
    }}
  >
    {username ? username.charAt(0).toUpperCase() : "U"}
  </div>

  <h2 style={styles.logo}>📚 AI Study Buddy</h2>
  <button
  style={styles.newChatBtn}
  onClick={() => setMessages([])}
>
  ➕ New Chat
</button>

  <p
    style={{
      color: "#94a3b8",
      fontSize: "14px"
    }}
  >
    Welcome, {username} 👋
  </p>

</div>
        <button
  style={{
    ...styles.tab,
    backgroundColor:
      activeTab === "explain" ? "#10a37f" : "#1f2937"
  }}
  onClick={() => setActiveTab("explain")}
>
  📘 Explain
</button>
        <button
  style={{
    ...styles.tab,
    backgroundColor:
      activeTab === "quiz" ? "#10a37f" : "#1f2937"
  }}
  onClick={() => setActiveTab("quiz")}
>
  🧠 Quiz
</button>
        <button
  style={{
    ...styles.tab,
    backgroundColor:
      activeTab === "flash" ? "#10a37f" : "#1f2937"
  }}
  onClick={() => setActiveTab("flash")}
>
  🧾 Flashcards
</button>
        <button
  style={{
    ...styles.tab,
    backgroundColor:
      activeTab === "doubt" ? "#10a37f" : "#1f2937"
  }}
  onClick={() => setActiveTab("doubt")}
>
  💬 Doubt
</button>
        <button
  style={{
    ...styles.tab,
    backgroundColor:
      activeTab === "studyplan" ? "#10a37f" : "#1f2937"
  }}
  onClick={() => setActiveTab("studyplan")}
>
  📅 Study Plan
</button>
<button
  style={{
    ...styles.tab,
    backgroundColor:
      activeTab === "notes" ? "#10a37f" : "#1f2937"
  }}
  onClick={() => setActiveTab("notes")}
>
  📄 Notes
</button>
      </div>
      {/* ================= MAIN CHAT ================= */}
      <div style={styles.main}>

        {/* CHAT WINDOW */}
        <div style={styles.chatBox}>
          {messages.length === 0 && !loading && (
  <div
    style={{
      textAlign: "center",
      color: "#94a3b8",
      marginTop: "100px"
    }}
  >
    <h1 style={{ color: "white" }}>
      📚 Welcome to AI Study Buddy
    </h1>

    <p>Your personal AI learning assistant</p>

    <div
      style={{
        marginTop: "25px",
        lineHeight: "2"
      }}
    >
      <p>📘 Explain any topic</p>
      <p>🧠 Generate quizzes</p>
      <p>🧾 Create flashcards</p>
      <p>💬 Solve doubts instantly</p>
      <p>📅 Build study plans</p>
    </div>

    <p style={{ marginTop: "25px" }}>
      Start by entering a topic below 🚀
    </p>
  </div>
)}
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.msg,
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                backgroundColor:
                  msg.role === "user" ? "#3b82f6" : "#1e293b",
              }}
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <div style={styles.typing}>🤖 AI is thinking...</div>
          )}
        </div>

        {/* INPUT AREA */}
        <div style={styles.inputBox}>

          {activeTab !== "doubt" ? (
            <input
  style={styles.input}
  placeholder="Enter topic..."
  value={topic}
  onChange={(e) => setTopic(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  }}
/>
          ) : (
            <input
  style={styles.input}
  placeholder="Ask doubt..."
  value={doubt}
  onChange={(e) => setDoubt(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  }}
/>
          )}

          {activeTab === "explain" && (
            <select
              value={answerType}
              onChange={(e) => setAnswerType(e.target.value)}
              style={styles.select}
            >
              <option value="2">2 Marks</option>
              <option value="5">5 Marks</option>
              <option value="10">10 Marks</option>
            </select>
          )}

          <button onClick={handleSend} style={styles.button}>
            Send
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;

// ================= STYLES =================
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#0f172a",
    fontFamily: "Arial",
  },

  sidebar: {
    width: "260px",
    backgroundColor: "#111827",
    padding: "15px",
  },

  logo: {
    color: "white",
    marginBottom: "15px",
  },

  tab: {
  width: "100%",
  padding: "12px",
  marginBottom: "8px",
  backgroundColor: "#1f2937",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  transition: "all 0.3s ease",
},
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  chatBox: {
  flex: 1,
  padding: "30px",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
},
  newChatBtn: {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  backgroundColor: "#10a37f",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
},

  msg: {
  padding: "16px",
  borderRadius: "18px",
  color: "white",
  maxWidth: "75%",
  whiteSpace: "pre-wrap",
  lineHeight: "1.7",
  fontSize: "15px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
  wordBreak: "break-word",
  animation: "fadeIn 0.3s ease",
},

  typing: {
  color: "#93c5fd",
  fontStyle: "italic",
  padding: "10px",
},
  inputBox: {
    display: "flex",
    gap: "10px",
    padding: "15px",
    backgroundColor: "#111827",
  },

  input: {
  flex: 1,
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #374151",
  backgroundColor: "#1e293b",
  color: "white",
  outline: "none",
},

  select: {
    padding: "10px",
    borderRadius: "8px",
  },

  button: {
  padding: "12px 20px",
  backgroundColor: "#10a37f",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  fontWeight: "600",
},
};