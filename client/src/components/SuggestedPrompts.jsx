// ask-adi/client/src/components/SuggestedPrompts.jsx
export function SuggestedPrompts({ onSelect }) {
  const prompts = [
    'Who is Aditya?',
    "Show me Aditya's projects.",
    'What stack does Aditya use?',
    'What are Aditya\'s skills?',
    'What is Aditya\'s experience?',
    'How can I contact Aditya?',
    'Adi\'s Personal interest',
    'Help',
    // 'What is Aditya\'s educational background?',
  ];

  return (
    <div className="pt-6">
      <p className="mb-2 text-green-600">Try asking:</p>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(prompt)}
            className="bg-green-800 text-green-100 hover:bg-green-600 px-3 py-1 rounded-md text-sm"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}