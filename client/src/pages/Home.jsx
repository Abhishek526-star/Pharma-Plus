import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Search, 
  ArrowLeft, 
  FileUp, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  X,
  Layers,
  HeartPulse,
  Activity,
  Pill,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Award,
  Zap,
  ThermometerSnowflake,
  Lock,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { categoryService } from '../services/category.service';
import { medicineService } from '../services/medicine.service';
import MedicineCard from '../components/medicine/MedicineCard';

const Home = () => {
    const navigate = useNavigate();
    const [sections, setSections] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Search states
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Coupon copied state
    const [copiedCoupon, setCopiedCoupon] = useState(false);

    // FAQ Accordion state
    const [openFaqIndex, setOpenFaqIndex] = useState(0);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const catRes = await categoryService.getAllCategories();
                const fetchedCategories = catRes.data.data;
                setCategories(fetchedCategories);

                const medPromises = fetchedCategories.map(cat =>
                    medicineService.getAllMedicines({ category: cat._id })
                );

                const medResults = await Promise.all(medPromises);

                const combinedData = fetchedCategories.map((cat, idx) => ({
                    category: cat,
                    medicines: medResults[idx].data.data.slice(0, 4)
                })).filter(section => section.medicines.length > 0);

                setSections(combinedData);
            } catch (error) {
                toast.error('Failed to load home data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!searchTerm.trim()) return;

        setIsLoading(true);
        setIsSearching(true);
        try {
            const res = await medicineService.getAllMedicines({ search: searchTerm.trim() });
            setSearchResults(res.data.data);
        } catch (error) {
            toast.error('Search failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickQuery = (query) => {
        setSearchTerm(query);
        setIsLoading(true);
        setIsSearching(true);
        medicineService.getAllMedicines({ search: query })
            .then(res => {
                setSearchResults(res.data.data);
                // Scroll to search results view smoothly
                window.scrollTo({ top: 400, behavior: 'smooth' });
            })
            .catch(() => toast.error('Search failed'))
            .finally(() => setIsLoading(false));
    };

    const clearSearch = () => {
        setSearchTerm('');
        setSearchResults([]);
        setIsSearching(false);
    };

    const copyCouponCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCoupon(true);
        toast.success(`Coupon code ${code} copied!`);
        setTimeout(() => setCopiedCoupon(false), 2500);
    };

    // Health concerns data list
    const healthConcerns = [
        { name: 'Cardiac & BP', query: 'cardiac', icon: HeartPulse, color: 'from-rose-500/15 to-red-500/10 text-rose-700 border-rose-200/80' },
        { name: 'Diabetes Care', query: 'diabetes', icon: Activity, color: 'from-amber-500/15 to-orange-500/10 text-amber-800 border-amber-200/80' },
        { name: 'Pain & Fever', query: 'pain', icon: Zap, color: 'from-blue-500/15 to-indigo-500/10 text-blue-700 border-blue-200/80' },
        { name: 'Digestion & Gut', query: 'stomach', icon: Pill, color: 'from-emerald-500/15 to-teal-500/10 text-emerald-800 border-emerald-200/80' },
        { name: 'Skin & Derma', query: 'skin', icon: Sparkles, color: 'from-purple-500/15 to-pink-500/10 text-purple-700 border-purple-200/80' },
        { name: 'Immunity & Cold', query: 'vitamin', icon: ShieldCheck, color: 'from-green-500/15 to-lime-500/10 text-green-800 border-green-200/80' },
        { name: 'Bone & Joint', query: 'calcium', icon: Award, color: 'from-cyan-500/15 to-sky-500/10 text-cyan-800 border-cyan-200/80' },
        { name: 'Respiratory Care', query: 'cough', icon: Stethoscope, color: 'from-violet-500/15 to-indigo-500/10 text-violet-800 border-violet-200/80' },
    ];

    // FAQ items list
    const faqs = [
        {
            q: 'How do I order prescription medicines on PharmaPlus?',
            a: 'Simply click "Upload Prescription" on our header or home page, attach a clear photo or PDF of your doctor\'s prescription, and submit. Our licensed pharmacists will verify it, prepare your cart, and notify you to confirm your delivery address.'
        },
        {
            q: 'Are the medicines genuine and checked for expiry dates?',
            a: 'Yes, 100%. All medications are directly procured from WHO-GMP certified manufacturers and authorized distributors. We guarantee minimum 6+ months shelf life on all dispatched medicines.'
        },
        {
            q: 'How fast will my medicine order be delivered?',
            a: 'Standard orders are delivered within 24–48 hours. In select metro zones, express 2-hour doorstep delivery is available for urgent chronic and acute healthcare necessities.'
        },
        {
            q: 'What payment methods can I use at checkout?',
            a: 'We accept all major payment methods through our secure 256-bit SSL Razorpay integration: UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards, Net Banking, and Cash on Delivery (COD).'
        },
        {
            q: 'What if a medicine in my order is out of stock?',
            a: 'Our registered pharmacists will contact you to offer exact therapeutic generic substitutes with identical chemical composition and dosage, or notify you as soon as new inventory arrives.'
        }
    ];

    if (isLoading && sections.length === 0 && !isSearching) {
        return (
            <div className="space-y-8 animate-pulse pb-16">
                <div className="h-96 bg-slate-200 rounded-3xl"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {[...Array(4)].map((_, j) => (
                        <div key={j} className="bg-white rounded-2xl border border-slate-100 p-4 h-64"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-16 pb-16">
            
            {/* 1. HERO SECTION: Split Layout with Live Stats & Prescription Desk */}
            <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-brand-800 via-brand-700 to-emerald-800 text-white shadow-xl shadow-brand-950/15 p-6 sm:p-10 lg:p-14">
                {/* Ambient Glows */}
                <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                <div className="absolute left-1/3 -bottom-28 w-[450px] h-[450px] rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* Left Column: Headline & Search */}
                    <div className="lg:col-span-7 text-left space-y-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide uppercase">
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            India's Trusted Online Pharmacy
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                            Genuine Medicines Delivered to Your Doorstep
                        </h1>

                        <p className="text-brand-100 text-sm sm:text-base font-light max-w-xl leading-relaxed">
                            Verified by registered pharmacists. 100% authentic pharmaceuticals, healthcare essentials, and chronic medication refills at flat discounted prices.
                        </p>

                        {/* Pill-shaped Search Bar */}
                        <form onSubmit={handleSearch} className="bg-white rounded-2xl p-2 shadow-2xl flex items-center gap-2 border border-white/40 max-w-xl">
                            <div className="relative grow flex items-center">
                                <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search 5,000+ medicines, vitamins, brands..."
                                    className="w-full pl-12 pr-10 py-3.5 border-none focus:outline-hidden text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium"
                                />
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md shadow-brand-600/30 flex items-center gap-1.5 shrink-0 cursor-pointer"
                            >
                                <Search className="w-4 h-4" />
                                <span className="hidden sm:inline">Search</span>
                            </button>
                        </form>

                        {/* Quick Search Tag Chips */}
                        <div className="flex items-center flex-wrap gap-2 text-xs pt-1">
                            <span className="text-brand-200 font-medium">Trending:</span>
                            {['Paracetamol', 'Vitamin D3', 'Metformin', 'Amoxicillin', 'Azithromycin'].map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => handleQuickQuery(tag)}
                                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-colors cursor-pointer"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>

                        {/* Live Trust Metrics Row */}
                        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/15">
                            <div>
                                <span className="block text-2xl font-black text-white">50K+</span>
                                <span className="text-[11px] text-brand-200">Happy Patients</span>
                            </div>
                            <div>
                                <span className="block text-2xl font-black text-white">100%</span>
                                <span className="text-[11px] text-brand-200">Genuine Meds</span>
                            </div>
                            <div>
                                <span className="block text-2xl font-black text-white">2 Hours</span>
                                <span className="text-[11px] text-brand-200">Express Delivery</span>
                            </div>
                            <div>
                                <span className="block text-2xl font-black text-amber-300">4.9 ★</span>
                                <span className="text-[11px] text-brand-200">Patient Rating</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Express Prescription Desk Card */}
                    <div className="lg:col-span-5">
                        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 text-slate-800 shadow-2xl border border-white/40 space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/30">
                                        <FileUp className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base text-slate-900 leading-tight">
                                            Quick Prescription Desk
                                        </h3>
                                        <p className="text-xs text-slate-500">
                                            Order with Doctor's Slip in 2 min
                                        </p>
                                    </div>
                                </div>
                                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold tracking-wide uppercase border border-emerald-200">
                                    Online
                                </span>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-start gap-3 text-xs text-slate-600">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <span>Upload prescription photo or PDF from your mobile/PC</span>
                                </div>
                                <div className="flex items-start gap-3 text-xs text-slate-600">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <span>Certified pharmacists verify dosage & check drug interactions</span>
                                </div>
                                <div className="flex items-start gap-3 text-xs text-slate-600">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <span>Medicines added to cart with flat 20% discount applied</span>
                                </div>
                            </div>

                            <Link
                                to="/prescriptions"
                                className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-slate-900/20 cursor-pointer"
                            >
                                <FileUp className="w-4 h-4 text-amber-400" />
                                Upload Prescription Now
                            </Link>

                            <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
                                <Lock className="w-3 h-3 text-slate-400" /> 100% Confidential & Secure Cloud Storage
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. THE THREE SERVICE PILLARS (Top Pharmacy Platform Signature) */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between">
                    <div className="space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FileUp className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-base text-slate-900">
                            Order with Prescription
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Don't know medicine names? Just upload your doctor's slip and our pharmacists will fulfill it for you.
                        </p>
                    </div>
                    <Link
                        to="/prescriptions"
                        className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800"
                    >
                        Upload Now <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between">
                    <div className="space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Pill className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-base text-slate-900">
                            Explore OTC & Wellness
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Vitamins, baby care, daily supplements, and personal hygiene essentials delivered at discounted prices.
                        </p>
                    </div>
                    <Link
                        to="/medicines"
                        className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
                    >
                        Browse Catalog <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between">
                    <div className="space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Stethoscope className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-base text-slate-900">
                            Licensed Verification
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Every single order is audited by verified healthcare experts to protect against contraindications.
                        </p>
                    </div>
                    <div className="mt-5 flex items-center gap-1 text-xs font-bold text-emerald-700">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        100% Certified Pharmacists
                    </div>
                </div>
            </section>

            {/* 3. PROMOTIONAL OFFER DUAL-BANNERS */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Banner 1: Coupon Code */}
                <div className="rounded-3xl p-6 sm:p-8 bg-linear-to-r from-emerald-600 to-brand-700 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md shadow-brand-900/10">
                    <div className="space-y-2 text-center sm:text-left">
                        <span className="inline-block px-2.5 py-1 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider">
                            Special Welcome Deal
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black">
                            Flat 20% OFF on First Order
                        </h3>
                        <p className="text-xs text-brand-100">
                            Use code at checkout. Valid across all medicines.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md p-2 rounded-2xl border border-white/30 shrink-0">
                        <span className="font-mono font-bold text-xs sm:text-sm px-3 text-white">
                            PHARMAPLUS20
                        </span>
                        <button
                            type="button"
                            onClick={() => copyCouponCode('PHARMAPLUS20')}
                            className="bg-white text-slate-900 hover:bg-slate-100 p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                            {copiedCoupon ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Banner 2: Refill Subscription */}
                <div className="rounded-3xl p-6 sm:p-8 bg-linear-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md shadow-slate-900/10">
                    <div className="space-y-2 text-center sm:text-left">
                        <span className="inline-block px-2.5 py-1 rounded-full bg-indigo-500/30 text-[10px] font-black uppercase tracking-wider text-indigo-300">
                            Monthly Refill Club
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black">
                            Never Run Out of Medicines
                        </h3>
                        <p className="text-xs text-slate-300">
                            Set up auto-delivery for BP, Diabetes, and daily meds.
                        </p>
                    </div>

                    <Link
                        to="/medicines"
                        className="px-5 py-3 rounded-2xl bg-brand-500 hover:bg-brand-400 text-white text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs shadow-brand-500/20"
                    >
                        Explore Refills
                    </Link>
                </div>
            </section>

            {/* 4. SHOP BY HEALTH CONCERN (The Signature Pharmacy Experience) */}
            <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <HeartPulse className="w-6 h-6 text-brand-600" /> Shop by Health Concern
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Carefully curated medicines and therapeutic solutions for common health conditions
                        </p>
                    </div>
                    <Link to="/medicines" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                        View All Categories <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
                    {healthConcerns.map((concern, idx) => {
                        const Icon = concern.icon;
                        return (
                            <button
                                key={idx}
                                onClick={() => handleQuickQuery(concern.query)}
                                className={`bg-linear-to-b ${concern.color} rounded-2xl p-4 text-center border shadow-2xs hover:shadow-md transition-all hover:-translate-y-1 group flex flex-col items-center justify-center cursor-pointer`}
                            >
                                <div className="w-12 h-12 rounded-xl bg-white shadow-2xs flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold leading-tight line-clamp-2">
                                    {concern.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* 5. SEARCH RESULTS OR DYNAMIC CATEGORY MEDICINES */}
            {isSearching ? (
                <section className="space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                                Results for "{searchTerm}"
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Showing {searchResults.length} verified pharmaceutical items
                            </p>
                        </div>
                        <button
                            onClick={clearSearch}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-brand-700 bg-brand-50 rounded-xl hover:bg-brand-100 transition-colors cursor-pointer"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
                        </button>
                    </div>

                    {searchResults.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                                <Package className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">No medicines found</h3>
                            <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
                                We couldn't find any products matching "{searchTerm}". Try checking your spelling or upload your prescription directly.
                            </p>
                            <div className="flex items-center justify-center gap-3">
                                <button
                                    onClick={clearSearch}
                                    className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 cursor-pointer"
                                >
                                    Clear Search
                                </button>
                                <Link
                                    to="/prescriptions"
                                    className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 cursor-pointer"
                                >
                                    Upload Prescription
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {searchResults.map(med => (
                                <MedicineCard key={med._id} medicine={med} />
                            ))}
                        </div>
                    )}
                </section>
            ) : (
                /* Dynamic Sections from Categories */
                sections.map((section) => (
                    <section key={section.category._id} className="space-y-5">
                        <div className="flex justify-between items-center border-b border-slate-200/80 pb-3">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                    {section.category.name}
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Verified pharmaceutical products in this category
                                </p>
                            </div>
                            <Link
                                to={`/medicines?category=${section.category._id}`}
                                className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3.5 py-1.5 rounded-xl transition-colors"
                            >
                                View All <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {section.medicines.map(med => (
                                <MedicineCard key={med._id} medicine={med} />
                            ))}
                        </div>
                    </section>
                ))
            )}

            {/* 6. HOW IT WORKS: 3-Step Simple Patient Journey */}
            <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs">
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
                        Simple, Safe & Transparent
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        How PharmaPlus Works
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-2">
                        Get your medications delivered in 3 simple verified steps
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center text-center space-y-3 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center font-black text-xl shadow-xs">
                            01
                        </div>
                        <h3 className="font-bold text-base text-slate-900">Select or Upload Rx</h3>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                            Search from 5,000+ medicines or simply take a photo of your doctor's prescription slip.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center text-center space-y-3 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-black text-xl shadow-xs">
                            02
                        </div>
                        <h3 className="font-bold text-base text-slate-900">Pharmacist Verification</h3>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                            Licensed healthcare experts review your prescription for dosage, expiry, and patient safety.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center text-center space-y-3 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-black text-xl shadow-xs">
                            03
                        </div>
                        <h3 className="font-bold text-base text-slate-900">Sterile Doorstep Delivery</h3>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                            Packed in tamper-proof, temperature-controlled boxes and delivered directly to your home.
                        </p>
                    </div>
                </div>
            </section>

            {/* 7. SAFETY & QUALITY STANDARDS GUARANTEE */}
            <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-slate-900/10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-5 space-y-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                            <ShieldCheck className="w-4 h-4" /> Safety Guaranteed
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                            Strict Healthcare Safety Standards
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                            Your health is our sacred priority. We partner exclusively with certified manufacturers with rigorous quality control.
                        </p>
                    </div>

                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                            <Award className="w-6 h-6 text-brand-400" />
                            <h4 className="text-sm font-bold text-white">WHO-GMP Certified</h4>
                            <p className="text-xs text-slate-400">All medications sourced from compliant pharmaceutical facilities.</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                            <ThermometerSnowflake className="w-6 h-6 text-cyan-400" />
                            <h4 className="text-sm font-bold text-white">Cold-Chain Storage</h4>
                            <p className="text-xs text-slate-400">Insulin, vaccines, and biologics maintained at optimal 2°C–8°C.</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                            <Lock className="w-6 h-6 text-amber-400" />
                            <h4 className="text-sm font-bold text-white">Tamper-Evident Seals</h4>
                            <p className="text-xs text-slate-400">Secure packaging ensures zero contamination during transit.</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                            <PhoneCall className="w-6 h-6 text-emerald-400" />
                            <h4 className="text-sm font-bold text-white">24/7 Pharmacist Help</h4>
                            <p className="text-xs text-slate-400">Dedicated helpline for queries about dosage and administration.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. PATIENT FAQ ACCORDION */}
            <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-6">
                <div className="text-center max-w-xl mx-auto mb-8">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
                        Frequently Asked Questions
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Everything You Need to Know
                    </h2>
                </div>

                <div className="max-w-3xl mx-auto divide-y divide-slate-100">
                    {faqs.map((faq, idx) => {
                        const isOpen = openFaqIndex === idx;
                        return (
                            <div key={idx} className="py-4">
                                <button
                                    type="button"
                                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                                    className="w-full flex items-center justify-between text-left gap-4 text-sm font-bold text-slate-800 hover:text-brand-600 cursor-pointer"
                                >
                                    <span>{faq.q}</span>
                                    {isOpen ? (
                                        <ChevronUp className="w-4 h-4 text-brand-600 shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                                    )}
                                </button>
                                {isOpen && (
                                    <p className="mt-3 text-xs sm:text-sm text-slate-500 leading-relaxed animate-in fade-in duration-200">
                                        {faq.a}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

        </div>
    );
};

export default Home;