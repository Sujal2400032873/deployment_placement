import React from 'react';
import Button from './Button';

const CTA = ({ onStart }) => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-tl-3xl rounded-tr-3xl mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-3">Start Your Placement Journey</h2>
        <p className="text-blue-100 mb-6">Join colleges and companies who trust PlacementPro to manage campus hires.</p>
        <Button size="lg" onClick={onStart} className="bg-white text-blue-600">Start Your Placement Journey</Button>
      </div>
    </section>
  );
};

export default CTA;
