import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';

const RegisterPage = () => {
    const { register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        await register(email, password);
        router.push('/(auth)/login/page');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="email" type="email" placeholder="Email" required />
            <input name="password" type="password" placeholder="Password" required />
            <button type="submit">Register</button>
        </form>
    );
};

export default RegisterPage;
