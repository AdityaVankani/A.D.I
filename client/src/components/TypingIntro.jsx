// ask-adi/client/src/components/TypingIntro.jsx
import { useState, useEffect } from 'react';

const lines = [
  "Initializing A.D.I...",
  "Boot sequence complete.",
  "Loading memory modules...",
  "System online..."
];

export default function TypingIntro({ onComplete }) {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (currentLine >= lines.length) {
      const timer = setTimeout(() => onComplete(), 500);
      return () => clearTimeout(timer);
    }

    const currentText = lines[currentLine];

    if (charIndex <= currentText.length) {
      const timeout = setTimeout(() => {
        const updated = [...displayedLines];
        updated[currentLine] = currentText.slice(0, charIndex);
        setDisplayedLines(updated);
        setCharIndex(charIndex + 1);
      }, 40);

      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setDisplayedLines([...displayedLines, ""]);
        setCurrentLine(currentLine + 1);
        setCharIndex(0);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [charIndex, currentLine, displayedLines, onComplete]);

  return (
  <div className="flex items-center justify-center min-h-screen bg-black">
    <div className="font-mono text-green-500 bg-black p-4 rounded shadow-lg w-full max-w-2xl mx-auto">
      {displayedLines.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  </div>
);
}
