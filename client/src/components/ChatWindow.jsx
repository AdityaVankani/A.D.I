// ask-adi/client/src/components/ChatWindow.jsx

export function ChatWindow({ messages }) {
  return (
    <div className="space-y-2 overflow-y-auto">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`whitespace-pre-wrap ${
            msg.sender === 'user' ? 'text-green-200' : 'text-green-500'
          }`}
        >
          <span className="pr-2">{msg.sender === 'user' ? 'You:' : 'A.D.I >'}</span>

          {/* Handle text responses */}
          {msg.type === 'text' && (
            <p className="inline">{msg.content}</p>
          )}

          {/* Handle image responses */}
          {msg.type === 'image' && (
            <div className="mt-2">
              <img
                src={msg.content}
                alt="Adi's PA Visual Output"
                className="max-w-sm rounded-md border border-green-800 w-40 h-50"
              />
            </div>
          )}

          {/* Handle link responses */}
          {msg.type === 'link' && (
            <div className="mt-1">
              <a
                href={msg.content}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-400"
              >
                🔗 Open Link
              </a>
            </div>
          )}

          {/* Handle PDF resume responses */}
          {msg.type === 'pdf' && (
            <div className="mt-1">
              <a
                href="https://drive.google.com/file/d/1y79mRTIvXjZx2hp0IJo1zJ4rJZx4_n3A/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 underline"
              >
                📄 View Resume (PDF)
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}