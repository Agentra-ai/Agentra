import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const NotFound = () => {
    redirect('/signin')
};

export default NotFound;