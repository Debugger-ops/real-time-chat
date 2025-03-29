import React from 'react';

const Modal = ({ children, isOpen }: any) => {
    if (!isOpen) return null;

    return (
        <div className="modal">
            {children}
            {/* Add close functionality */}
        </div>
    );
};

export default Modal;
