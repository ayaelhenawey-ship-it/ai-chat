import { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Replace 3000 with your backend port if different
// اتأكدي إن السطر ده كدة بالظبط
const response = await fetch('http://localhost:3000/chat', {        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'ai', text: data.reply }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { role: 'ai', text: "Error connecting to server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <h1>Gamgam AI</h1>
        <div className="status">
          <span className="dot"></span> Online
        </div>
      </nav>

      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`bubble-wrapper ${msg.role}`}>
            <div className="bubble">{msg.text}</div>
          </div>
        ))}
        {isLoading && <div className="loading">Gamgam is thinking...</div>}
      </div>

      <div className="input-group">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..." 
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;