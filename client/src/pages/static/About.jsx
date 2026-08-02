import { HeartPulse, ShieldCheck, Truck, Users } from 'lucide-react';

const About = () => {
  const features = [
    { icon: ShieldCheck, title: 'Secure & Verified', desc: 'All prescriptions are verified by licensed pharmacists.' },
    { icon: Truck, title: 'Fast Delivery', desc: 'Get your medicines delivered to your doorstep quickly.' },
    { icon: HeartPulse, title: 'Quality Assurance', desc: 'We ensure 100% genuine and quality-checked medicines.' },
    { icon: Users, title: '24/7 Support', desc: 'Our customer support team is always here to help.' },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About PharmaPlus</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          PharmaPlus is a modern online pharmacy management system dedicated to making healthcare accessible, affordable, and convenient for everyone. We bridge the gap between technology and healthcare to provide a seamless medicine ordering experience.
        </p>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {features.map((f, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <f.icon className="w-6 h-6 text-brand-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
            <p className="text-sm text-gray-500">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-brand-600 text-white p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-brand-50 max-w-2xl mx-auto">
          To digitalize pharmacy management, reduce paperwork, and simplify medicine ordering so you can focus on what matters most—your health.
        </p>
      </div>
    </div>
  );
};

export default About;