import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, RotateCcw, Package, FileUp, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import MedicineCard from '../../components/medicine/MedicineCard';
import { medicineService } from '../../services/medicine.service';
import { categoryService } from '../../services/category.service';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    availability: '',
    sort: 'createdAt',
  });

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { search: '' }
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchMedicines();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAllCategories();
      setCategories(res.data.data);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const fetchMedicines = async () => {
    setIsLoading(true);
    try {
      const res = await medicineService.getAllMedicines(filters);
      setMedicines(res.data.data);
    } catch (error) {
      toast.error('Failed to load medicines');
    } finally {
      setIsLoading(false);
    }
  };

  const onSearchSubmit = (data) => {
    setFilters(prev => ({ ...prev, search: data.search }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetAllFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      availability: '',
      sort: 'createdAt',
    });
    reset({ search: '' });
    setSearchParams({});
  };

  const removeSingleFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: '' }));
    if (key === 'category') setSearchParams({});
    if (key === 'search') reset({ search: '' });
  };

  const activeCategory = categories.find(c => c._id === filters.category);
  const hasActiveFilters = Boolean(
    filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.availability
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Pharmacy Catalog
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Browse All Medicines
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Order genuine pharmaceuticals, vitamins, and healthcare supplies online.
          </p>
        </div>

        {/* Quick Prescription Upload Pill */}
        <Link
          to="/prescriptions"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold hover:bg-amber-100 transition-colors shadow-2xs"
        >
          <FileUp className="w-4 h-4 text-amber-600" />
          Upload Prescription
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-72 shrink-0`}>
          <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-200/80 sticky top-24 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-600" /> Filter Catalog
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-hidden"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
                Price Range (₹)
              </label>
              <div className="flex items-center gap-2">
                <div className="relative grow">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">₹</span>
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-7 pr-2 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-hidden"
                  />
                </div>
                <span className="text-slate-300 font-medium">—</span>
                <div className="relative grow">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">₹</span>
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-7 pr-2 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
                Stock Status
              </label>
              <select
                name="availability"
                value={filters.availability}
                onChange={handleFilterChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-hidden"
              >
                <option value="">All Items</option>
                <option value="in-stock">In Stock Only</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="grow space-y-6">
          {/* Search, Mobile Toggle & Sort Bar */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <form onSubmit={handleSubmit(onSearchSubmit)} className="relative w-full sm:grow">
              <input
                type="text"
                {...register('search')}
                placeholder="Search by name, composition, brand..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-hidden"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </form>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center justify-center gap-1.5 px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 grow sm:grow-0"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-brand-600" />
                Filters
              </button>

              <select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-hidden"
              >
                <option value="createdAt">✨ Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex items-center flex-wrap gap-2 text-xs">
              <span className="text-slate-400 font-medium">Applied Filters:</span>
              
              {filters.search && (
                <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 border border-brand-200 px-2.5 py-1 rounded-lg font-medium">
                  Search: "{filters.search}"
                  <button onClick={() => removeSingleFilter('search')} className="hover:text-brand-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {activeCategory && (
                <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 border border-brand-200 px-2.5 py-1 rounded-lg font-medium">
                  Category: {activeCategory.name}
                  <button onClick={() => removeSingleFilter('category')} className="hover:text-brand-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {(filters.minPrice || filters.maxPrice) && (
                <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 border border-brand-200 px-2.5 py-1 rounded-lg font-medium">
                  Price: ₹{filters.minPrice || '0'} - ₹{filters.maxPrice || '∞'}
                  <button onClick={() => { removeSingleFilter('minPrice'); removeSingleFilter('maxPrice'); }} className="hover:text-brand-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.availability && (
                <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 border border-brand-200 px-2.5 py-1 rounded-lg font-medium">
                  In Stock Only
                  <button onClick={() => removeSingleFilter('availability')} className="hover:text-brand-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={resetAllFilters}
                className="text-slate-500 hover:text-slate-700 font-semibold underline underline-offset-2 ml-1 cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results Counter */}
          {!isLoading && (
            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-800">{medicines.length}</span> {medicines.length === 1 ? 'medicine' : 'medicines'}
            </div>
          )}

          {/* Medicines Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl shadow-xs border border-slate-100 p-4 h-80 animate-pulse flex flex-col justify-between">
                  <div className="aspect-square bg-slate-100 rounded-2xl"></div>
                  <div className="space-y-2 mt-4">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                    <div className="h-5 bg-slate-200 rounded w-1/3 mt-2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : medicines.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-6">
              {medicines.map(medicine => (
                <MedicineCard key={medicine._id} medicine={medicine} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">No medicines found</h3>
              <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
                We couldn't find any products matching your filters. Try clearing some filters or searching for another term.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 cursor-pointer shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;