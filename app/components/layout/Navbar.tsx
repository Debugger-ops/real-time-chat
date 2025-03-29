import React from 'react';
import Link from 'next/link';

const Navbar = () => (
    <nav>
        <Link href="/(auth)/login/page">Login</Link>
        <Link href="/(auth)/register/page">Register</Link>
        <Link href="/(protected)/dashboard/page">Dashboard</Link>
    </nav>
);

export default Navbar;
