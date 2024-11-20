import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const UrlAnalyzer: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/analysis/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze URL');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">URL Analysis</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            Enter URL to analyze
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="https://example.com"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze URL'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 bg-gray-50 border rounded-md">
          <h3 className="text-lg font-medium text-gray-900">Analysis Results</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center">
              <span className="font-medium text-gray-700">Threat Level:</span>
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                result.threat_level === 'safe' 
                  ? 'bg-green-100 text-green-800'
                  : result.threat_level === 'suspicious'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {result.threat_level}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">URL:</span>
              <span className="ml-2 text-gray-600">{result.url}</span>
            </div>
            {result.details && (
              <div>
                <span className="font-medium text-gray-700">Details:</span>
                <ul className="list-disc list-inside mt-2 text-gray-600">
                  <li><strong>Domain:</strong> {result.details.domain}</li>
                  <li><strong>Protocol:</strong> {result.details.protocol}</li>
                  <li><strong>Threat Score:</strong> {result.details.threatScore}</li>
                  {result.details.checks.map((check: any, index: number) => (
                    <li key={index}>
                      <strong>{check.name}:</strong> {check.result} (Risk: {check.risk})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlAnalyzer;