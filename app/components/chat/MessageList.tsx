import React from 'react';

const MessageList = () => {
    // Replace with actual messages data fetching logic
    const messages = [{ id: 1, text: "Hello!" }, { id: 2, text: "Hi there!" }];

    return (
        <ul>
            {messages.map(message => (
                <li key={message.id}>{message.text}</li>
            ))}
        </ul>
    );
};

export default MessageList;
