import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import MedicineCard from '../../components/medicine/MedicineCard';
import { medicineService } from '../../services/medicine.service';
import { categoryService } from '../../services/category.service';

const Shop = () => {
  const [searchParams] = useSearchParams(); // 2. Get URL params / 获取 URL 参数
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    category: searchParams.get('category') || '', // 3. Read initial category from URL / 从 URL 读取初始分类
    minPrice: '',
    maxPrice: '',
    availability: '',
    sort: 'createdAt',
  });

  const { register, handleSubmit } = useForm({
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 shrink-0`}>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
            <h2 className="font-semibold text-lg mb-4 text-gray-800">Filters</h2>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-brand-500 focus:border-brand-500"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
            </div>

            {/* Availability Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
              <select
                name="availability"
                value={filters.availability}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="">All Items</option>
                <option value="in-stock">In Stock Only</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Search and Sort Bar */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-4 items-center">
            <form onSubmit={handleSubmit(onSearchSubmit)} className="relative flex-1 w-full">
              <input
                type="text"
                {...register('search')}
                placeholder="Search medicines or manufacturers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-brand-500 focus:border-brand-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </form>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            <select
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
              className="w-full sm:w-auto border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-brand-500 focus:border-brand-500"
            >
              <option value="createdAt">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>

          {/* Medicines Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3 mt-2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : medicines.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {medicines.map(medicine => (
                <MedicineCard key={medicine._id} medicine={medicine} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-100">
              <p className="text-gray-500 text-lg">No medicines found matching your criteria.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;