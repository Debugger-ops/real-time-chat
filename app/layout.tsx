import React from 'react';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

const Layout = ({ children }) => (
   <>
       <Navbar />
       <Sidebar />
       <main>{children}</main>
   </>
);

export default Layout;
