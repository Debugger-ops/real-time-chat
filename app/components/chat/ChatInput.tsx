import React, { useState } from 'react';

const ChatInput = () => {
    const [message, setMessage] = useState('');

    const handleSendMessage = () => {
        // Logic to send message
        setMessage('');
    };

    return (
        <div>
            <input 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="Type a message" 
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default ChatInput;
