import { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download, 
  Eye, 
  Trash2, 
  FileUp, 
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { prescriptionService } from '../../services/prescription.service';

const MyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await prescriptionService.getMy();
      setPrescriptions(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load prescriptions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
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
      toast.error('Download failed. Opening in new tab instead.');
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
    const isVerified = status === 'verified';
    const isRejected = status === 'rejected';

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
        isVerified
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          : isRejected
          ? 'bg-rose-50 text-rose-700 border border-rose-200'
          : 'bg-amber-50 text-amber-700 border border-amber-200'
      }`}>
        {isVerified ? (
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
        ) : isRejected ? (
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
        ) : (
          <Clock className="w-3.5 h-3.5 text-amber-600" />
        )}
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <FileText className="w-7 h-7 text-brand-600" />
          My Prescriptions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Upload and manage your doctor's prescriptions. Our certified pharmacists verify them before fulfilling prescription-required medicines.
        </p>
      </div>

      {/* Modern Upload Dropzone Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <FileUp className="w-4 h-4 text-brand-600" /> Upload New Prescription
        </h2>

        <form onSubmit={handleUpload} className="space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
              isDragOver
                ? 'border-brand-500 bg-brand-50/50 scale-[0.99]'
                : 'border-slate-200 hover:border-brand-400 bg-slate-50/50 hover:bg-brand-50/20'
            }`}
            onClick={() => document.getElementById('prescription-file-input').click()}
          >
            <input
              id="prescription-file-input"
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-100 text-brand-600 flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6" />
            </div>

            <p className="text-sm font-bold text-slate-800 mb-1">
              Click to browse or drag and drop your file here
            </p>
            <p className="text-xs text-slate-400">
              Supports JPG, PNG, and PDF formats (up to 10MB)
            </p>
          </div>

          {/* Selected File Indicator */}
          {file && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-brand-50 border border-brand-200 text-xs text-brand-900 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-brand-600 shrink-0" />
                <span className="font-semibold truncate">{file.name}</span>
                <span className="text-brand-600 shrink-0">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="p-1 text-brand-600 hover:text-brand-900 hover:bg-brand-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isUploading || !file}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer transition-all"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Uploading to Secure Cloud...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" /> Submit for Verification
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* List Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Previous Prescriptions ({prescriptions.length})
        </h2>

        {isLoading ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-600" />
            Loading your prescriptions...
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">No prescriptions uploaded</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven't uploaded any medical prescriptions yet. Use the upload box above when buying Rx medicines.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {prescriptions.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                      Prescription #{p._id.substring(p._id.length - 6).toUpperCase()}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Uploaded on {new Date(p.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    {p.remarks && (
                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        Pharmacist note: {p.remarks}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
                  <StatusBadge status={p.status} />

                  <a
                    href={p.file}
                    target="_blank"
                    rel="noreferrer"
                    referrerPolicy="no-referrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </a>

                  <button
                    onClick={() => handleDownload(p)}
                    disabled={downloadingId === p._id}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors cursor-pointer"
                  >
                    {downloadingId === p._id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    Download
                  </button>

                  <button
                    onClick={() => handleDelete(p._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Prescription"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPrescriptions;