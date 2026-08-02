import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

const MedicineCard = ({ medicine }) => {
  return (
    <Link 
      to={`/medicines/${medicine._id}`} 
      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
    >
      <div className="aspect-square bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
        {medicine.image ? (
          <img 
            src={medicine.image} 
            alt={medicine.name} 
            // Updated classes to fill the container properly
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" 
          />
        ) : (
          <Package className="w-16 h-16 text-gray-300" />
        )}
      </div>
      <div className="p-4 grow flex flex-col">
        <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1 truncate">
          {medicine.name}
        </h3>
        <p className="text-xs text-gray-500 mb-2">by {medicine.manufacturer}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-brand-600">
            ₹{medicine.price.toFixed(2)}
          </span>
          {medicine.stock > 0 ? (
            <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
              In Stock
            </span>
          ) : (
            <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>
        
        {medicine.requiresPrescription && (
          <div className="mt-3 text-xs text-orange-700 bg-orange-50 border border-orange-200 px-2 py-1 rounded text-center">
            Prescription Required
          </div>
        )}
      </div>
    </Link>
  );
};

export default MedicineCard;