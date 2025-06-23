// ask-adi/client/src/components/CommandInput.jsx
import { useState } from 'react';

export function CommandInput({ onSubmit }) {
  const [input, setInput] = useState('');

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      onSubmit(input);
      setInput('');
    }
  };

  return (
  <div className="w-full flex items-center gap-2">
    <span className="text-green-500 text-lg">&gt;</span>
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={handleKeyPress}
      placeholder="Type your question and press Enter..."
      className="flex-1 bg-transparent border-b border-green-500 focus:outline-none text-green-400 placeholder-green-700 py-2"
      autoFocus
    />
  </div>
);
}