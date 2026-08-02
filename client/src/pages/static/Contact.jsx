import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { contactService } from '../../services/contact.service';

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get form data manually since we aren't using react-hook-form here
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    setIsLoading(true);
    try {
      await contactService.submitForm(data);
      toast.success('Message sent! We will get back to you soon.');
      e.target.reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
        <p className="text-lg text-gray-600">Have questions? We'd love to hear from you.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="bg-brand-50 p-3 rounded-lg">
              <MapPin className="w-6 h-6 text-brand-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Our Address</h3>
              <p className="text-gray-600 mt-1">123 Health Street, Med City, NY 10001</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-brand-50 p-3 rounded-lg">
              <Phone className="w-6 h-6 text-brand-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Phone Number</h3>
              <p className="text-gray-600 mt-1">+91 9876543210</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-brand-50 p-3 rounded-lg">
              <Mail className="w-6 h-6 text-brand-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Email Address</h3>
              <p className="text-gray-600 mt-1">abhishekkumar63871@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              {/* Add name="name" */}
              <input type="text" name="name" required className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-brand-500 focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              {/* Add name="email" */}
              <input type="email" name="email" required className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-brand-500 focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              {/* Add name="message" */}
              <textarea name="message" rows="4" required className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-brand-500 focus:border-brand-500"></textarea>
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-brand-600 text-white py-2 rounded-md font-semibold hover:bg-brand-700 flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;