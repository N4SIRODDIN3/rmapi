import React from 'react';
import { CheckCircle, AlertCircle, RefreshCw, WifiOff } from 'lucide-react';
import { SyncStatus } from '../types';

interface StatusBarProps {
  documentsCount: number;
  selectedCount: number;
  syncStatus: SyncStatus;
}

export function StatusBar({ documentsCount, selectedCount, syncStatus }: StatusBarProps) {
  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case 'synced':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'syncing':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'offline':
        return <WifiOff className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getSyncStatusText = () => {
    switch (syncStatus) {
      case 'synced':
        return 'Synced';
      case 'syncing':
        return 'Syncing...';
      case 'error':
        return 'Sync Error';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-2">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-6">
          <span>
            {documentsCount} item{documentsCount !== 1 ? 's' : ''}
          </span>
          {selectedCount > 0 && (
            <span>
              {selectedCount} selected
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {getSyncStatusIcon()}
          <span>{getSyncStatusText()}</span>
        </div>
      </div>
    </div>
  );
}