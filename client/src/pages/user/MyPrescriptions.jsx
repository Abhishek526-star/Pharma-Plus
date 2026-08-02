import { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, XCircle, Clock, Download, Eye ,Trash2} from 'lucide-react';
import toast from 'react-hot-toast';
import { prescriptionService } from '../../services/prescription.service';

const MyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await prescriptionService.getMy();
      setPrescriptions(res.data.data);
    } catch (error) {
      toast.error('Failed to load prescriptions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file first');
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await prescriptionService.upload(formData);
      toast.success('Prescription uploaded successfully');
      setFile(null);
      e.target.reset();
      fetchPrescriptions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (prescription) => {
    setDownloadingId(prescription._id);
    try {
      // Fetch with no-referrer to bypass Cloudinary localhost block
      const response = await fetch(prescription.file, { referrerPolicy: 'no-referrer' });
      const blob = await response.blob();
      
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      
      const fileExtension = prescription.file.split('.').pop().split('?')[0];
      link.download = `prescription-${prescription._id}.${fileExtension}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
      toast.success('Download started');
    } catch (error) {
      toast.error('Download failed. Try opening it instead.');
      window.open(prescription.file, '_blank');
    } finally {
      setDownloadingId(null);
    }
  };

   const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      try {
        await prescriptionService.delete(id);
        toast.success('Prescription deleted');
        setPrescriptions(prescriptions.filter(p => p._id !== id));
      } catch (error) {
        toast.error('Failed to delete prescription');
      }
    }
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    const Icons = {
      pending: Clock,
      verified: CheckCircle,
      rejected: XCircle,
    };
    const Icon = Icons[status];
    return (
      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${styles[status]} capitalize`}>
        <Icon className="w-3 h-3" /> {status}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Prescriptions</h1>
      
      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload New Prescription</h2>
        <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-4">
          <div className="grow">
            <input 
              type="file" 
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
            />
          </div>
          <button 
            type="submit" 
            disabled={isUploading}
            className="bg-brand-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-brand-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" /> {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>

      {/* List Section */}
      {isLoading ? (
        <div className="text-center py-10">Loading...</div>
      ) : prescriptions.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg border border-gray-100">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">You haven't uploaded any prescriptions yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((p) => (
            <div key={p._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <FileText className="w-8 h-8 text-brand-600" />
                <div>
                  <p className="font-medium text-gray-800 text-sm">
                    Uploaded on {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                  {p.remarks && <p className="text-xs text-red-600 mt-1">Remarks: {p.remarks}</p>}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <a 
                  href={p.file} 
                  target="_blank" 
                  rel="noreferrer" 
                  referrerPolicy="no-referrer"
                  className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-brand-600"
                >
                  <Eye className="w-4 h-4" /> View
                </a>
                <button 
                  onClick={() => handleDownload(p)}
                  disabled={downloadingId === p._id}
                  className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" /> {downloadingId === p._id ? 'Downloading...' : 'Download'}
                </button>
                 <button 
                  onClick={() => handleDelete(p._id)}
                  className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
                <StatusBadge status={p.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPrescriptions;