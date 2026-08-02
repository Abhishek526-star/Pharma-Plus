import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, AlertCircle, Star, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { medicineService } from '../../services/medicine.service';
import { reviewService } from '../../services/review.service';
import { addItem } from '../../redux/slices/cartSlice';

const MedicineDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [medicine, setMedicine] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const medRes = await medicineService.getMedicineById(id);
        setMedicine(medRes.data.data);
        
        const revRes = await reviewService.getReviews(id);
        setReviews(revRes.data.data.reviews);
        setAvgRating(revRes.data.data.avgRating);
        setReviewCount(revRes.data.data.count);
      } catch (error) {
        toast.error('Failed to fetch details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    setIsAdding(true);
    try {
      await dispatch(addItem({ medicineId: medicine._id, quantity: 1 })).unwrap();
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error || 'Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  const onReviewSubmit = async (data) => {
    try {
      const res = await reviewService.addReview({ medicineId: id, ...data });
      setReviews([res.data.data, ...reviews]);
      setReviewCount(prev => prev + 1);
      // Recalculate avg rating roughly
      setAvgRating(((avgRating * (reviewCount)) + Number(data.rating)) / (reviewCount + 1));
      reset();
      toast.success('Review added!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await reviewService.deleteReview(reviewId);
      setReviews(reviews.filter(r => r._id !== reviewId));
      toast.success('Review deleted');
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-10 bg-gray-200 rounded w-1/4 mt-4"></div>
            <div className="h-24 bg-gray-200 rounded mt-4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!medicine) return <div className="text-center py-20">Medicine not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link to="/medicines" className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-600 mb-6 font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 flex items-center justify-center aspect-square">
          {medicine.image ? (
            <img src={medicine.image} alt={medicine.name} className="max-h-full max-w-full object-contain" />
          ) : (
            <Package className="w-24 h-24 text-gray-300" />
          )}
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{medicine.name}</h1>
          <p className="text-gray-500 mb-4">by {medicine.manufacturer}</p>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`w-5 h-5 ${avgRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-sm text-gray-500">({reviewCount} reviews)</span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-brand-600">₹{medicine.price.toFixed(2)}</span>
            {medicine.stock > 0 ? (
              <span className="text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">In Stock</span>
            ) : (
              <span className="text-sm font-medium text-red-700 bg-red-100 px-3 py-1 rounded-full">Out of Stock</span>
            )}
          </div>

          {medicine.requiresPrescription && (
            <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-lg mb-6">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Prescription Required</p>
                <p className="text-xs">You will need to upload a valid prescription during checkout to purchase this item.</p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-600 leading-relaxed">{medicine.description}</p>
          </div>

          <button onClick={handleAddToCart} disabled={medicine.stock === 0 || isAdding} className="mt-8 w-full md:w-auto bg-brand-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-brand-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
        
        {isAuthenticated && (
          <form onSubmit={handleSubmit(onReviewSubmit)} className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Write a Review</h3>
            <div className="flex items-center gap-2 mb-3">
              <label className="text-sm text-gray-600">Rating:</label>
              <select {...register('rating', { required: true })} className="border border-gray-300 rounded-md py-1 px-2 text-sm">
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <textarea {...register('comment')} rows="3" placeholder="Share your thoughts..." className="w-full border border-gray-300 rounded-md p-2 text-sm mb-2"></textarea>
            <button type="submit" className="bg-brand-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-700">Submit Review</button>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <p className="font-semibold text-gray-800">{review.userId?.name || 'Anonymous'}</p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-4 h-4 ${review.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  {user?._id === review.userId?._id && (
                    <button onClick={() => handleDeleteReview(review._id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-1">{review.comment}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineDetails;