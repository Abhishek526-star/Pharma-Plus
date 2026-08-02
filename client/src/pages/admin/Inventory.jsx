import { useState, useEffect } from 'react';
import { Package, Upload, Trash2, X, PlusCircle, Download } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { medicineService } from '../../services/medicine.service';
import { categoryService } from '../../services/category.service';
import { downloadCSV } from '../../utils/exportToCsv';

const Inventory = () => {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [medRes, catRes] = await Promise.all([
        medicineService.getAllMedicines(),
        categoryService.getAllCategories()
      ]);
      setMedicines(medRes.data.data);
      setCategories(catRes.data.data);
    } catch (error) {
      toast.error('Failed to load inventory data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await medicineService.createMedicine(formData);
      toast.success('Medicine added successfully!');
      reset();
      setImageFile(null);
      setIsModalOpen(false);
      fetchData(); // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add medicine');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await medicineService.deleteMedicine(id);
        toast.success('Medicine deleted');
        setMedicines(medicines.filter(m => m._id !== id));
      } catch (error) {
        toast.error('Failed to delete medicine');
      }
    }
  };

  const handleRestock = async (med) => {
    const input = prompt(`Enter additional stock for "${med.name}":`);
    if (input === null) return; // User cancelled

    const additionalStock = Number(input);
    if (isNaN(additionalStock) || additionalStock <= 0) {
      toast.error('Please enter a valid positive number');
      return;
    }

    try {
      await medicineService.restockMedicine(med._id, additionalStock);
      toast.success('Stock updated successfully!');
      fetchData(); // Refresh table
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to restock');
    }
  };

  const handleExportInventory = () => {
    // Map data to have clean column names and format
    const exportData = medicines.map(m => ({
      Name: m.name,
      Category: m.category?.name || 'N/A',
      Manufacturer: m.manufacturer,
      Price: m.price,
      Stock: m.stock,
      ExpiryDate: new Date(m.expiryDate).toLocaleDateString(),
      PrescriptionRequired: m.requiresPrescription ? 'Yes' : 'No'
    }));

    downloadCSV(exportData, `inventory_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success('Inventory exported successfully');
  };

  if (isLoading) return <div className="text-center py-20">Loading inventory...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <div className="flex gap-2">
          <button
            onClick={handleExportInventory}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-300 flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-brand-700 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" /> Add Medicine
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (₹)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restock</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {medicines.map(med => (
              <tr key={med._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                    {med.image ? <img src={med.image} alt={med.name} className="w-full h-full object-cover" /> : <Package className="w-5 h-5 text-gray-400" />}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{med.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{med.category?.name || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{med.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${med.stock < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {med.stock}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleDelete(med._id)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-3">
                  <button onClick={() => handleRestock(med)} className="text-blue-600 hover:text-blue-800" title="Restock">
                    <PlusCircle className="w-5 h-5" />
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Medicine Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Add New Medicine</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" {...register('name', { required: true })} className="w-full border border-gray-300 rounded-md py-2 px-3" />
                {errors.name && <p className="text-red-500 text-xs mt-1">Name is required</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea {...register('description', { required: true })} rows="3" className="w-full border border-gray-300 rounded-md py-2 px-3"></textarea>
                {errors.description && <p className="text-red-500 text-xs mt-1">Description is required</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input type="number" step="0.01" {...register('price', { required: true })} className="w-full border border-gray-300 rounded-md py-2 px-3" />
                  {errors.price && <p className="text-red-500 text-xs mt-1">Price is required</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input type="number" {...register('stock', { required: true })} className="w-full border border-gray-300 rounded-md py-2 px-3" />
                  {errors.stock && <p className="text-red-500 text-xs mt-1">Stock is required</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                <input type="text" {...register('manufacturer', { required: true })} className="w-full border border-gray-300 rounded-md py-2 px-3" />
                {errors.manufacturer && <p className="text-red-500 text-xs mt-1">Manufacturer is required</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select {...register('category', { required: true })} className="w-full border border-gray-300 rounded-md py-2 px-3">
                    <option value="">Select...</option>
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                  </select>
                  {errors.category && <p className="text-red-500 text-xs mt-1">Category is required</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input type="date" {...register('expiryDate', { required: true })} className="w-full border border-gray-300 rounded-md py-2 px-3" />
                  {errors.expiryDate && <p className="text-red-500 text-xs mt-1">Expiry date is required</p>}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input type="checkbox" {...register('requiresPrescription')} className="rounded text-brand-600" />
                  Requires Prescription?
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100" />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-brand-600 text-white py-2 rounded-md font-medium hover:bg-brand-700 disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : 'Save Medicine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;