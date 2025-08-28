import { useState } from 'react';

import TypingIntro from './components/TypingIntro';
import { CommandInput } from './components/CommandInput';
import { ChatWindow } from './components/ChatWindow';
import { SuggestedPrompts } from './components/SuggestedPrompts';

export default function App() {
  const [bootComplete, setBootComplete] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', type: 'text', content: 'Hi, I\'m A.D.I(Adi\'s digital Intelligence). Ask me anything about Aditya.' }
  ]);

  const handleUserMessage = async (userInput) => {
    const trimmedInput = userInput.trim().toLowerCase();

    if (trimmedInput === 'clear') {
      setMessages([{ sender: 'bot', type: 'text', content: 'Hello, A.D.I  here!' }]);
      return;
    }

    if (trimmedInput === 'whoami') {
      setMessages(prev => [...prev, {
        sender: 'bot',
        type: 'text',
        content: "You are a guest on Adi's cmd. Ask me anything about Aditya."
      }]);
      return;
    }

    if (trimmedInput === 'help' || trimmedInput === 'commands') {
      setMessages(prev => [...prev, {
        sender: 'bot',
        type: 'text',
        content: ` Available commands:\n- clear \n- whoami\n- show resume / photo.\n- help / commands\n- version\n- date / time\n- open github \n- Or you can ask in Natural Lang.`
      }]);
      return;
    }

    if (trimmedInput === 'version') {
      setMessages(prev => [...prev, {
        sender: 'bot',
        type: 'text',
        content: `v3.0.0 🤖`
      }]);
      return;
    }

    if (trimmedInput === 'date' || trimmedInput === 'time') {
      const now = new Date().toLocaleString();
      setMessages(prev => [...prev, {
        sender: 'bot',
        type: 'text',
        content: `📅 Current system time: ${now}`
      }]);
      return;
    }

    if (trimmedInput === 'open github') {
      window.open("https://github.com/adityavankani", "_blank");
      setMessages(prev => [...prev, {
        sender: 'bot',
        type: 'link',
        content: "https://github.com/adityavankani"
      }]);
      return;
    }

    const newMessages = [
      ...messages,
      { sender: 'user', type: 'text', content: userInput }
    ];
    setMessages(newMessages);

    try {
      const res = await fetch("https://adi-backend-413192125710.us-central1.run.app/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userInput })
      });

      const data = await res.json();
      const botMsg = {
        sender: 'bot',
        type: data.type || 'text',
        content: data.content || data.text
      };
      setMessages([...newMessages, botMsg]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          sender: 'bot',
          type: 'text',
          content: '❌ Oops! Failed to fetch response.'
        }
      ]);
    }
  };

  return (
    <>
      {!bootComplete ? (
        <TypingIntro onComplete={() => setBootComplete(true)} />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-black via-[#1e1e1e] to-[#111] text-green-400 font-mono flex flex-col items-center justify-center p-4 space-y-6">
          {!isTerminalOpen ? (
            <div className="text-center space-y-6 animate-fade-in">
              <h1 className="text-4xl font-bold text-green-500 drop-shadow-lg">Adi's Terminal</h1>
              <button
                onClick={() => setIsTerminalOpen(true)}
                className="bg-green-700 hover:shadow-glow transition duration-300 px-8 py-3 rounded-lg text-white text-xl shadow-lg border border-green-800"
              >
                🖥️ Boot Up A.D.I
              </button>
            </div>
          ) : (
            <>
              <div
                className={`w-full max-w-5xl bg-[#121212] border border-[#2a2a2a] rounded-xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
                  isMinimized ? 'h-[40px]' : 'h-[80vh]'
                }`}
              >
                <div className="bg-[#2e2e2e] p-3 flex items-center space-x-2 border-b border-[#444]">
                  <button
                    onClick={() => setIsTerminalOpen(false)}
                    className="w-3 h-3 bg-red-500 rounded-full hover:scale-110 transition-transform"
                  />
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="w-3 h-3 bg-yellow-500 rounded-full hover:scale-110 transition-transform"
                  />
                  <button
                    onClick={() => setIsMinimized(false)}
                    className="w-3 h-3 bg-green-500 rounded-full hover:scale-110 transition-transform"
                  />
                  <span className="text-sm text-gray-300 ml-4 font-semibold">Adi's terminal.exe</span>
                </div>
                {!isMinimized && (
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-transparent">
                    <ChatWindow messages={messages} />
                    <CommandInput onSubmit={handleUserMessage} />
                  </div>
                )}
              </div>

              {!isMinimized && (
                <div className="w-full max-w-5xl mt-4 animate-fade-in">
                  <SuggestedPrompts onSelect={handleUserMessage} />
                </div>
              )}
            </>
          )}

          <div className="w-full max-w-5xl pt-6 flex flex-col items-center border-t border-green-700 mt-10">
            <h2 className="text-green-400 text-lg font-semibold mb-2">🌐 Connect with Aditya:</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://github.com/adityavankani"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-800 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition duration-300 shadow-lg"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/adityavankani"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-800 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition duration-300 shadow-lg"
              >
                LinkedIn
              </a>
              <a
                href="mailto:adivankani@gmail.com"
                className="bg-green-800 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition duration-300 shadow-lg"
              >
                Email
              </a>
              <a
                href="https://x.com/Adi_Vankani"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-800 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition duration-300 shadow-lg"
              >
                X (Twitter)
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}