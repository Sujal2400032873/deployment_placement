import React from 'react';
import Card from './Card';
import { Briefcase, Users, TrendingUp, Shield, FileText, MessageSquare } from 'lucide-react';

const features = [
  { icon: Briefcase, title: 'Job Posting', desc: 'Post and manage job openings with ease.' },
  { icon: Users, title: 'Student Dashboard', desc: 'Personalized dashboard for students.' },
  { icon: TrendingUp, title: 'Analytics', desc: 'Placement metrics and performance reports.' },
  { icon: Shield, title: 'Secure System', desc: 'Role-based access and secure data.' },
  { icon: FileText, title: 'Resume Tracking', desc: 'Track resumes and shortlist candidates.' },
  { icon: MessageSquare, title: 'Communication', desc: 'Built-in messaging for coordination.' }
];

const FeaturesGrid = () => {
  return (
    <section id="features" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Powerful Features</h2>
          <p className="text-gray-600 mt-2">Everything you need to run successful campus placements.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Card key={i} className="transform hover:-translate-y-2 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{f.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{f.desc}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
