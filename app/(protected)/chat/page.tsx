import React from 'react';
import ChatInput from '../../components/chat/ChatInput';
import MessageList from '../../components/chat/MessageList';

const ChatPage = () => {
    return (
        <div>
            <h1>Chat Room</h1>
            <MessageList />
            <ChatInput />
        </div>
    );
};

export default ChatPage;
