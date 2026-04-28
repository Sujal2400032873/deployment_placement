import React from 'react';
import LandingNavbar from '../components/LandingNavbar';
import Hero from '../components/Hero';
import FeaturesGrid from '../components/FeaturesGrid';
import Stats from '../components/Stats';
import WhyChoose from '../components/WhyChoose';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import LandingFooter from '../components/LandingFooter';

const LandingPage = ({ onLoginClick, onSignupClick }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <LandingNavbar onLogin={() => onLoginClick && onLoginClick()} onSignup={() => onSignupClick && onSignupClick()} />
      <main>
        <Hero onGetStarted={() => onLoginClick && onLoginClick()} />
        <FeaturesGrid />
        <Stats />
        <WhyChoose />
        <Testimonials />
        <CTA onStart={() => onSignupClick && onSignupClick()} />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
