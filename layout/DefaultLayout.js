import React from 'react';

const DefaultLayout = ({ children }) => {
    return (
        <div style={{ minHeight: '100vh', padding: '0 20px' }}>
            <main>{children}</main>
        </div>
    );
};

export default DefaultLayout;
