import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Check, 
  Loader2, 
  FileText, 
  Zap, 
  Plus
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addItem } from '../../redux/slices/cartSlice';

const MedicineCard = ({ medicine }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Compute realistic MRP and discount percentage for pharmacy-style display
  const price = medicine.price || 0;
  const mrp = +(price * 1.2).toFixed(2);
  const savings = +(mrp - price).toFixed(2);
  const discountPercent = Math.round(((mrp - price) / mrp) * 100);

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to add medicines to cart');
      navigate('/login');
      return;
    }

    if (medicine.requiresPrescription) {
      toast('Prescription required for this item', { icon: '📋' });
      navigate(`/medicines/${medicine._id}`);
      return;
    }

    if (medicine.stock <= 0) {
      toast.error('This medicine is currently out of stock');
      return;
    }

    setIsAdding(true);
    try {
      await dispatch(addItem({ medicineId: medicine._id, quantity: 1 })).unwrap();
      toast.success(`${medicine.name} added to cart!`);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Link 
      to={`/medicines/${medicine._id}`} 
      className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden hover:shadow-xl hover:border-slate-300/90 transition-all duration-300 hover:-translate-y-1.5 group flex flex-col justify-between"
    >
      <div>
        {/* Dedicated Card Header Badges (Above Image - Zero Overlap on Product) */}
        <div className="px-4 pt-3.5 pb-2 flex items-center justify-between bg-white border-b border-slate-50">
          {medicine.stock > 0 ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-2xs">
              {discountPercent}% OFF
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
              Out of Stock
            </span>
          )}

          {medicine.stock > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-full">
              <Zap className="w-3 h-3 text-amber-500 fill-amber-500" /> 2hr Delivery
            </span>
          )}
        </div>

        {/* Product Image Frame: Clean, Unobscured Showcase */}
        <div className="h-48 sm:h-52 w-full bg-white flex items-center justify-center p-4 overflow-hidden">
          {medicine.image ? (
            <img 
              src={medicine.image} 
              alt={medicine.name} 
              loading="lazy"
              className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-300 ease-out" 
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 group-hover:text-brand-500 transition-colors">
              <Package className="w-10 h-10" />
            </div>
          )}
        </div>
      </div>

      {/* Card Body / Clinical Content */}
      <div className="p-4 sm:p-5 grow flex flex-col justify-between border-t border-slate-100/90 bg-white">
        <div className="space-y-1.5">
          {/* Category Tag & Rx Badge Relocated Off Image */}
          <div className="flex items-center justify-between gap-2 flex-wrap text-[11px]">
            <span className="font-bold uppercase tracking-wider text-brand-600">
              {medicine.category?.name || 'Healthcare'}
            </span>

            {medicine.requiresPrescription ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full">
                <FileText className="w-3 h-3 text-amber-600" /> Rx Required
              </span>
            ) : medicine.stock > 0 ? (
              <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> In Stock
              </span>
            ) : null}
          </div>

          {/* Medicine Name (2 Lines, No Truncation) */}
          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 min-h-[2.6rem] group-hover:text-brand-600 transition-colors">
            {medicine.name}
          </h3>

          {/* Manufacturer */}
          <p className="text-xs text-slate-500 truncate">
            by <span className="font-semibold text-slate-700">{medicine.manufacturer}</span>
          </p>

          {/* Packaging Note */}
          <p className="text-[11px] text-slate-400">
            Standard Unit Pack
          </p>
        </div>

        {/* Pricing & Interactive Action Area */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Prices */}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 line-through">
                ₹{mrp.toFixed(2)}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">
                Save ₹{savings.toFixed(2)}
              </span>
            </div>
            <div className="text-xl font-black text-slate-900 leading-tight mt-0.5">
              ₹{price.toFixed(2)}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleQuickAdd}
            disabled={isAdding || medicine.stock <= 0}
            aria-label={medicine.requiresPrescription ? "View Prescription Instructions" : "Add to Cart"}
            className={`cursor-pointer px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 shadow-xs active:scale-95 shrink-0 ${
              medicine.stock <= 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-600 text-white'
                : medicine.requiresPrescription
                ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/20'
            }`}
          >
            {isAdding ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added
              </>
            ) : medicine.requiresPrescription ? (
              <>
                <FileText className="w-3.5 h-3.5 text-amber-700" /> Rx Details
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" /> ADD
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default MedicineCard;