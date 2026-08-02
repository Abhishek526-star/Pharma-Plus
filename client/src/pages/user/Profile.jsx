import { useState, useEffect } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { authService } from '../../services/auth.service';
import { setCredentials } from '../../redux/slices/authSlice';

const Profile = () => {
  const { user, accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
  // Password visibility states
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Profile Info Form
  const { register: registerProfile, handleSubmit: handleProfileSubmit, reset: resetProfileForm, formState: { errors: profileErrors } } = useForm();

  // Password Change Form
  const { register: registerPwd, handleSubmit: handlePwdSubmit, reset: resetPwdForm, formState: { errors: pwdErrors } } = useForm();

  // Pre-fill profile form when user data is available in Redux
  useEffect(() => {
    if (user) {
      resetProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user, resetProfileForm]);

  const onProfileUpdate = async (data) => {
    setIsUpdatingProfile(true);
    try {
      const res = await authService.updateProfile(data);
      // Update Redux state with new user info so the header updates instantly
      dispatch(setCredentials({ user: res.data.data, accessToken }));
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onPasswordChange = async (data) => {
    setIsUpdatingPassword(true);
    try {
      await authService.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      });
      toast.success('Password changed successfully!');
      resetPwdForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Personal Info Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
          </div>
          
          <form onSubmit={handleProfileSubmit(onProfileUpdate)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                defaultValue={user?.email || ''} 
                disabled 
                className="w-full border border-gray-200 rounded-md py-2 px-3 bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                {...registerProfile('name', { required: 'Name is required' })}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-brand-500 focus:border-brand-500"
              />
              {profileErrors.name && <p className="text-red-500 text-xs mt-1">{profileErrors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                type="tel" 
                {...registerProfile('phone', { required: 'Phone is required' })}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-brand-500 focus:border-brand-500"
              />
              {profileErrors.phone && <p className="text-red-500 text-xs mt-1">{profileErrors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Delivery Address</label>
              <textarea 
                {...registerProfile('address')}
                rows="3"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-brand-500 focus:border-brand-500"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isUpdatingProfile}
              className="w-full bg-brand-600 text-white py-2 rounded-md font-semibold hover:bg-brand-700 disabled:opacity-50"
            >
              {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
          </div>
          
          <form onSubmit={handlePwdSubmit(onPasswordChange)} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <div className="relative">
                <input 
                  type={showOld ? "text" : "password"} 
                  {...registerPwd('oldPassword', { required: 'Current password is required' })}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 pr-10 focus:ring-brand-500 focus:border-brand-500"
                />
                <button 
                  type="button" 
                  onClick={() => setShowOld(!showOld)} 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  {showOld ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {pwdErrors.oldPassword && <p className="text-red-500 text-xs mt-1">{pwdErrors.oldPassword.message}</p>}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <input 
                  type={showNew ? "text" : "password"} 
                  {...registerPwd('newPassword', { required: 'New password is required', minLength: { value: 6, message: 'Must be at least 6 characters' } })}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 pr-10 focus:ring-brand-500 focus:border-brand-500"
                />
                <button 
                  type="button" 
                  onClick={() => setShowNew(!showNew)} 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {pwdErrors.newPassword && <p className="text-red-500 text-xs mt-1">{pwdErrors.newPassword.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <div className="relative">
                <input 
                  type={showConfirm ? "text" : "password"} 
                  {...registerPwd('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: (val, formValues) => val === formValues.newPassword || "Passwords do not match"
                  })}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 pr-10 focus:ring-brand-500 focus:border-brand-500"
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirm(!showConfirm)} 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {pwdErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{pwdErrors.confirmPassword.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isUpdatingPassword}
              className="w-full bg-gray-800 text-white py-2 rounded-md font-semibold hover:bg-gray-700 disabled:opacity-50"
            >
              {isUpdatingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;