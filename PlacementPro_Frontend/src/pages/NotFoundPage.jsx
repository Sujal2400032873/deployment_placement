import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <section className="h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-6xl font-bold text-blue-600">404</h1>
      <p className="text-xl text-gray-700 mb-6">Page not found.</p>
      <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Go Home</Link>
    </section>
  );
};

export default NotFoundPage;
