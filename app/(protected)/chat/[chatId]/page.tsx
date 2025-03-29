import React from 'react';

const ChatRoomPage = ({ params }: { params: { chatId: string } }) => {
    return (
        <div>
            <h1>Chat Room: {params.chatId}</h1>
            {/* Render chat components for this specific chat room */}
        </div>
    );
};

export default ChatRoomPage;
