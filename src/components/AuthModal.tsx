import React, { useState } from 'react';
import { ExternalLink, Smartphone } from 'lucide-react';

interface AuthModalProps {
  onLogin: (deviceCode: string) => Promise<void>;
}

export function AuthModal({ onLogin }: AuthModalProps) {
  const [deviceCode, setDeviceCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceCode.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await onLogin(deviceCode.trim());
    } catch (err) {
      setError('Authentication failed. Please check your device code and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-remarkable-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">rM</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Connect to reMarkable Cloud
            </h1>
            <p className="text-gray-600">
              Sign in to access your documents and notebooks
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Smartphone className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-1">
                    Get your device code:
                  </p>
                  <ol className="text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Visit my.remarkable.com on your device</li>
                    <li>Go to "Connect desktop app"</li>
                    <li>Copy the 8-character code</li>
                  </ol>
                  <a
                    href="https://my.remarkable.com/device/browser/connect"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium mt-2"
                  >
                    <span>Open reMarkable Connect</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="deviceCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Device Code
                </label>
                <input
                  id="deviceCode"
                  type="text"
                  value={deviceCode}
                  onChange={(e) => setDeviceCode(e.target.value.toUpperCase())}
                  placeholder="Enter 8-character code"
                  className="input-field text-center text-lg font-mono tracking-wider"
                  maxLength={8}
                  pattern="[A-Z0-9]{8}"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || deviceCode.length !== 8}
                className="btn-primary w-full"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Connecting...</span>
                  </div>
                ) : (
                  'Connect'
                )}
              </button>
            </form>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              This app uses the reMarkable Cloud API to sync your documents.
              Your credentials are stored locally and never shared.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}