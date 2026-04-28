import React, { useEffect, useState } from 'react';

const useCountUp = (target, duration = 1500) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const stepTime = Math.max(20, Math.floor(duration / target));
    const timer = setInterval(() => {
      start += Math.ceil(target / (duration / stepTime));
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      setValue(start);
    }, stepTime);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
};

const Stats = () => {
  const students = useCountUp(1200, 1600);
  const companies = useCountUp(320, 1600);
  const placements = useCountUp(980, 1600);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-4xl font-extrabold text-blue-600">{students}+</p>
            <p className="text-gray-600">Students Registered</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-blue-600">{companies}+</p>
            <p className="text-gray-600">Companies</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-blue-600">{placements}%</p>
            <p className="text-gray-600">Placement Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
