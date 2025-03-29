import React from 'react';

const Button = ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
);

export default Button;
