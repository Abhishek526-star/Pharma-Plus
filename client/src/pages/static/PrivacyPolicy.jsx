const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
        <p>Last updated: {new Date().getFullYear()}</p>
        
        <h2 className="text-xl font-semibold text-gray-900">1. Information We Collect</h2>
        <p>We collect information you provide directly to us, such as your name, email address, phone number, delivery address, and health-related information when you upload prescriptions. We also automatically collect certain information about your device and usage patterns.</p>

        <h2 className="text-xl font-semibold text-gray-900">2. How We Use Your Information</h2>
        <p>We use your information to process orders, verify prescriptions, deliver medicines, communicate with you about your orders, and provide customer support. We may also use your information to comply with legal obligations.</p>

        <h2 className="text-xl font-semibold text-gray-900">3. Data Security</h2>
        <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful access, accidental loss, destruction, or damage. All payment transactions are processed securely through Razorpay.</p>

        <h2 className="text-xl font-semibold text-gray-900">4. Sharing Your Information</h2>
        <p>We do not sell or rent your personal information to third parties. We may share your data with trusted partners who assist us in operating our website, conducting our business, or servicing you, as long as those parties agree to keep this information confidential.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;