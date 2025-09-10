import React, { useState } from 'react';
import { ChevronDown, Upload, FileText } from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({
    clientName: '',
    clientContact: '',
    caseType: '',
    involvedParties: '',
    caseDescription: '',
    filingDeadline: '',
    courtDate: '',
    seniorLawyer: '',
    juniorLawyer: ''
  });

  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setSuccess(false);

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    uploadedFiles.forEach(file => {
      data.append('documents', file);
    });

    try {
      const token = 'YOUR_JWT_TOKEN_HERE'; // Replace with a dynamic token from a user's session
      const response = await fetch('http://localhost:5000/api/cases/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data,
      });

      // Check if the response is ok
      if (!response.ok) {
        let errorMsg = `HTTP Error: ${response.status} ${response.statusText}`;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          // If the server sent a JSON error, parse it
          const err = await response.json();
          errorMsg = err.message || errorMsg;
        } else {
          // If the server sent a non-JSON response (like HTML), read it as text
          errorMsg = await response.text();
          errorMsg = `Server returned a non-JSON response: ${errorMsg.substring(0, 50)}...`; // Truncate for display
        }
        throw new Error(errorMsg);
      }

      // If the response is OK, process the JSON
      const result = await response.json();
      console.log('Form submission success:', result);
      setSuccess(true);
      setMessage('Case created successfully!');
      
      setFormData({
        clientName: '',
        clientContact: '',
        caseType: '',
        involvedParties: '',
        caseDescription: '',
        filingDeadline: '',
        courtDate: '',
        seniorLawyer: '',
        juniorLawyer: ''
      });
      setUploadedFiles([]);

    } catch (err) {
      console.error('Form submission error:', err);
      setSuccess(false);
      setMessage(`Error: ${err.message || 'Network error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">New Case</h1>
            <p className="text-sm text-gray-600">Enter the details for the new case</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                placeholder="Enter client's full name"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            {/* Client Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Contact
              </label>
              <input
                type="text"
                name="clientContact"
                value={formData.clientContact}
                onChange={handleInputChange}
                placeholder="Enter client's contact information"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            {/* Case Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Case Type
              </label>
              <div className="relative">
                <select
                  name="caseType"
                  value={formData.caseType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select case type</option>
                  <option value="civil">Civil Law</option>
                  <option value="criminal">Criminal Law</option>
                  <option value="corporate">Corporate Law</option>
                  <option value="family">Family Law</option>
                  <option value="immigration">Immigration Law</option>
                  <option value="personal-injury">Personal Injury</option>
                  <option value="real-estate">Real Estate Law</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Involved Parties */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Involved Parties
              </label>
              <input
                type="text"
                name="involvedParties"
                value={formData.involvedParties}
                onChange={handleInputChange}
                placeholder="List all involved parties"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            {/* Case Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Case Description
              </label>
              <textarea
                name="caseDescription"
                value={formData.caseDescription}
                onChange={handleInputChange}
                placeholder="Provide a detailed description of the case"
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                required
              />
            </div>

            {/* Filing Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filing Deadline
              </label>
              <input
                type="date"
                name="filingDeadline"
                value={formData.filingDeadline}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            {/* Court Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Court Date
              </label>
              <input
                type="date"
                name="courtDate"
                value={formData.courtDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            {/* Assigned Lawyer (Senior) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned Lawyer (Senior)
              </label>
              <div className="relative">
                <select
                  name="seniorLawyer"
                  value={formData.seniorLawyer}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select senior lawyer</option>
                  <option value="john-smith">John Smith</option>
                  <option value="sarah-johnson">Sarah Johnson</option>
                  <option value="michael-brown">Michael Brown</option>
                  <option value="emily-davis">Emily Davis</option>
                  <option value="robert-wilson">Robert Wilson</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Assigned Lawyer (Junior) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned Lawyer (Junior)
              </label>
              <div className="relative">
                <select
                  name="juniorLawyer"
                  value={formData.juniorLawyer}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Select junior lawyer</option>
                  <option value="alex-thompson">Alex Thompson</option>
                  <option value="jessica-martinez">Jessica Martinez</option>
                  <option value="david-anderson">David Anderson</option>
                  <option value="lisa-taylor">Lisa Taylor</option>
                  <option value="james-white">James White</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Upload Documents */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Upload Documents
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Drag and drop files here, or browse to upload
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => document.querySelector('input[type="file"]').click()}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  Browse Files
                </button>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <FileText className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-700 flex-1">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form status and submit button */}
            {loading && <p className="text-center text-blue-600">Creating case...</p>}
            {message && (
                <div className={`p-3 rounded-lg text-center font-medium ${success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Case'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
