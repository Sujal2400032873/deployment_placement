import React, { useEffect, useRef, useState } from 'react';

const Reveal = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          // Setting the visibility to false when it scrolls out will make it pop-up again when scrolling back
          setIsVisible(false);
        }
      },
      {
        rootMargin: '0px 0px -100px 0px', // Triggers when element is 100px above bottom
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Reveal;
