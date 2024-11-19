import React, { useState } from 'react';
import UrlAnalysisForm from '../Analysis/UrlAnalysisForm';
import AnalysisResult from '../Analysis/AnalysisResult';
import { AnalysisResult as AnalysisResultType } from '../../types';

const Dashboard: React.FC = () => {
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResultType | null>(null);

  const handleAnalysisComplete = (result: AnalysisResultType) => {
    setCurrentAnalysis(result);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">URL Security Analysis</h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter a URL to analyze its security and potential threats.
          </p>
        </div>
      </div>

      {/* Analysis Form */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <UrlAnalysisForm onAnalysisComplete={handleAnalysisComplete} />
        </div>
      </div>

      {/* Analysis Result */}
      {currentAnalysis && (
        <div className="mt-8">
          <AnalysisResult result={currentAnalysis} />
        </div>
      )}

      {/* Quick Tips */}
      <div className="bg-white shadow sm:rounded-lg mt-8">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">Security Tips</h3>
          <div className="mt-4 text-sm text-gray-500">
            <ul className="list-disc pl-5 space-y-2">
              <li>Always verify the URL before entering sensitive information</li>
              <li>Look for HTTPS in the URL - it indicates a secure connection</li>
              <li>Be cautious of URLs with misspellings or unusual domains</li>
              <li>Don't click on links from unknown or untrusted sources</li>
              <li>Check for suspicious keywords or unusual patterns in URLs</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">Threat Level Legend</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Safe
              </span>
              <span className="text-sm text-gray-500">Low risk URL</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Suspicious
              </span>
              <span className="text-sm text-gray-500">Potential risks detected</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Dangerous
              </span>
              <span className="text-sm text-gray-500">High risk - use caution</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;