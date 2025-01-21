import React from 'react';
import Link from 'next/link';

const NotFound = () => {
    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <h1>404 - Page Not Found</h1>
            <p>Sorry, the page you are looking for does not exist.</p>
            <Link href="apps/explore">
                <a>Go back to Home</a>
            </Link>
        </div>
    );
};

export default NotFound;