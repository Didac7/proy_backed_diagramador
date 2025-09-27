import React, { useState } from 'react';

const ChatInput = ({ onSend }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div style={{ display: 'flex', gap: 8, margin: '16px 0' }}>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Escribe tus entidades y relaciones..."
        style={{ flex: 1, padding: 8, fontSize: 16 }}
        onKeyDown={e => e.key === 'Enter' && handleSend()}
      />
      <button onClick={handleSend} style={{ padding: '8px 16px', fontSize: 16 }}>Enviar</button>
    </div>
  );
};

export default ChatInput;
