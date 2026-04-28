import React from 'react';

const testimonials = [
  { name: 'Riya Sharma', role: 'Student', quote: 'PlacementPro made applying to jobs effortless — I got interviews within weeks!', avatar: 'https://i.pravatar.cc/80?img=32' },
  { name: 'Aman Verma', role: 'Recruiter', quote: 'A clean pipeline and great candidate matching. Our hiring cycle shortened significantly.', avatar: 'https://i.pravatar.cc/80?img=12' },
  { name: 'Dr. Patel', role: 'Placement Officer', quote: 'Comprehensive analytics helped us improve placement rates year over year.', avatar: 'https://i.pravatar.cc/80?img=47' }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">What People Say</h2>
          <p className="text-gray-600 mt-2">Feedback from students, recruiters and placement officers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="p-6 bg-white rounded-lg shadow">
              <div className="flex items-center gap-4 mb-3">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
              <p className="text-gray-600">“{t.quote}”</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
