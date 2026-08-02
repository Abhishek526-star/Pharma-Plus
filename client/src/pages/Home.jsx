import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { categoryService } from '../services/category.service';
import { medicineService } from '../services/medicine.service';
import MedicineCard from '../components/medicine/MedicineCard';

const Home = () => {
    const [sections, setSections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Search states
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const catRes = await categoryService.getAllCategories();
                const categories = catRes.data.data;

                const medPromises = categories.map(cat =>
                    medicineService.getAllMedicines({ category: cat._id })
                );

                const medResults = await Promise.all(medPromises);

                const combinedData = categories.map((cat, idx) => ({
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
        e.preventDefault();
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

    const clearSearch = () => {
        setSearchTerm('');
        setSearchResults([]);
        setIsSearching(false);
    };

    if (isLoading) {
        return (
            <div className="space-y-8">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, j) => (
                                <div key={j} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-64"></div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Hero Banner with Search Bar */}
            <div className="bg-linear-to-r from-brand-600 to-brand-700 text-white p-8 md:p-12 rounded-lg shadow-sm text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome to PharmaPlus</h1>
                <p className="text-brand-100 mb-8">Your trusted online pharmacy for health and wellness.</p>

                {/* Premium Pill-shaped Search Bar */}
                <div className="max-w-2xl mx-auto">
                    <form onSubmit={handleSearch} className="bg-white rounded-full p-2 shadow-lg flex items-center gap-2">
                        <div className="relative grow">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search for medicines, products..."
                                className="w-full pl-12 pr-4 py-3 border-none focus:outline-none focus:ring-0 rounded-full text-gray-900"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                        <button
                            type="submit"
                            className="bg-brand-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            <Search className="w-5 h-5" />
                            <span className="hidden sm:inline">Search</span> {/* Hide text on very small mobile screens */}
                        </button>
                    </form>
                </div>
            </div>

            {/* Conditional Rendering: Search Results vs Default Categories */}
            {isSearching ? (
                <div>
                    <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Search Results for "{searchTerm}"
                        </h2>
                        <button onClick={clearSearch} className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline">
                            <ArrowLeft className="w-4 h-4" /> Back to Home
                        </button>
                    </div>

                    {searchResults.length === 0 ? (
                        <div className="text-center py-10">
                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500">No medicines found matching your search.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {searchResults.map(med => (
                                <MedicineCard key={med._id} medicine={med} />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                sections.length === 0 ? (
                    <div className="text-center py-10">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">No medicines available right now. Please check back later.</p>
                    </div>
                ) : (
                    sections.map((section) => (
                        <div key={section.category._id}>
                            <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                                <h2 className="text-2xl font-bold text-gray-800">{section.category.name}</h2>
                                <Link to={`/medicines?category=${section.category._id}`} className="text-sm font-medium text-brand-600 hover:underline">
                                    View All
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {section.medicines.map(med => (
                                    <MedicineCard key={med._id} medicine={med} />
                                ))}
                            </div>
                        </div>
                    ))
                )
            )}
        </div>
    );
};

export default Home;