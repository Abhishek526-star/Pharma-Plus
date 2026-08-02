const Terms = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>
      
      <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
        <p>Last updated: {new Date().getFullYear()}</p>
        
        <h2 className="text-xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
        <p>By accessing and using PharmaPlus, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.</p>

        <h2 className="text-xl font-semibold text-gray-900">2. Medical Disclaimer</h2>
        <p>The information and services provided by PharmaPlus are for general informational purposes only. They are not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or qualified health provider.</p>

        <h2 className="text-xl font-semibold text-gray-900">3. Prescription Policy</h2>
        <p>For medicines requiring a prescription, you must upload a valid prescription issued by a registered medical practitioner. Our pharmacists reserve the right to accept or reject any prescription based on verification.</p>

        <h2 className="text-xl font-semibold text-gray-900">4. Limitation of Liability</h2>
        <p>PharmaPlus shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of our services or any products purchased through our platform.</p>
      </div>
    </div>
  );
};

export default Terms;