import React from 'react';

const UserList = () => {
    // Replace with actual users data fetching logic
    const users = [{ id: 1, name: "User 1" }, { id: 2, name: "User 2" }];

    return (
        <ul>
            {users.map(user => (
                <li key={user.id}>{user.name}</li>
            ))}
        </ul>
    );
};

export default UserList;
