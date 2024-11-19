import React from 'react';
import { AnalysisResult as AnalysisResultType } from '../../types';

interface Props {
  result: AnalysisResultType;
}

const AnalysisResult: React.FC<Props> = ({ result }) => {
  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'safe':
        return 'bg-green-100 text-green-800';
      case 'suspicious':
        return 'bg-yellow-100 text-yellow-800';
      case 'dangerous':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow rounded-lg">
      <div className="space-y-4">
        {/* URL and Threat Level */}
        <div>
          <h3 className="text-lg font-medium text-gray-900">Analysis Result</h3>
          <p className="mt-1 text-sm text-gray-500 break-all">{result.url}</p>
          <span className={`inline-flex mt-2 items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getThreatLevelColor(result.threatLevel)}`}>
            {result.threatLevel.charAt(0).toUpperCase() + result.threatLevel.slice(1)}
          </span>
        </div>

        {/* Details */}
        <div className="border-t border-gray-200 pt-4">
          <dl className="divide-y divide-gray-200">
            <div className="py-2 grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500">HTTPS</dt>
              <dd className="text-sm text-gray-900 col-span-2">
                {result.details.hasHttps ? (
                  <span className="text-green-600">Secure connection</span>
                ) : (
                  <span className="text-red-600">Insecure connection</span>
                )}
              </dd>
            </div>

            <div className="py-2 grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500">Domain Age</dt>
              <dd className="text-sm text-gray-900 col-span-2">
                {result.details.domainAge 
                  ? `${result.details.domainAge} days`
                  : 'Unknown'
                }
              </dd>
            </div>

            <div className="py-2 grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500">Redirects</dt>
              <dd className="text-sm text-gray-900 col-span-2">
                {result.details.redirectCount} redirect(s)
              </dd>
            </div>

            <div className="py-2 grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500">Suspicious TLD</dt>
              <dd className="text-sm text-gray-900 col-span-2">
                {result.details.hasSuspiciousTLD ? (
                  <span className="text-red-600">Yes</span>
                ) : (
                  <span className="text-green-600">No</span>
                )}
              </dd>
            </div>

            {result.details.suspiciousKeywords.length > 0 && (
              <div className="py-2 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Suspicious Keywords</dt>
                <dd className="text-sm text-gray-900 col-span-2">
                  <div className="flex flex-wrap gap-1">
                    {result.details.suspiciousKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </dd>
              </div>
            )}

            <div className="py-2 grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500">Threat Score</dt>
              <dd className="text-sm text-gray-900 col-span-2">
                {result.details.threatScore}/10
              </dd>
            </div>
          </dl>
        </div>

        {/* Analysis Time */}
        <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
          Analyzed at: {new Date(result.analyzedAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;