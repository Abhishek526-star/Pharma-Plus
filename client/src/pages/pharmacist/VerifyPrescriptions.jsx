import { useState, useEffect } from 'react';
import { FileText, Eye, Check, X } from 'lucide-react';
import { prescriptionService } from '../../services/prescription.service';
import toast from 'react-hot-toast';

const VerifyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await prescriptionService.getAll();
      setPrescriptions(res.data.data);
    } catch (error) {
      toast.error('Failed to load prescriptions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    const remarks = status === 'rejected' ? prompt('Enter reason for rejection (optional):') || '' : '';
    try {
      await prescriptionService.updateStatus(id, { status, remarks });
      toast.success(`Prescription ${status}`);
      fetchPrescriptions();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  

  if (isLoading) return <div className="text-center py-20">Loading prescriptions...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Verify Prescriptions</h1>
      
      {prescriptions.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg border border-gray-100">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">No prescriptions to verify.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((p) => (
            <div key={p._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <FileText className="w-8 h-8 text-brand-600" />
                <div>
                  <p className="font-medium text-gray-800 text-sm">{p.userId?.name || 'Unknown User'}</p>
                  <p className="text-xs text-gray-500">{p.userId?.email}</p>
                  <p className="text-xs text-gray-400 mt-1">Uploaded: {new Date(p.createdAt).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <a href={p.file} target="_blank" rel="noreferrer" referrerPolicy="no-referrer" className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline">
                  <Eye className="w-4 h-4" /> View
                </a>
                
                {p.status === 'pending' ? (
                  <>
                    <button onClick={() => handleUpdateStatus(p._id, 'verified')} className="flex items-center gap-1 text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-md hover:bg-green-100">
                      <Check className="w-4 h-4" /> Verify
                    </button>
                    <button onClick={() => handleUpdateStatus(p._id, 'rejected')} className="flex items-center gap-1 text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-md hover:bg-red-100">
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${p.status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {p.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerifyPrescriptions;