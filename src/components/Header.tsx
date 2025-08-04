import React from 'react';
import { Upload, RefreshCw, LogOut, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onUpload: () => void;
  onRefresh: () => void;
}

export function Header({ user, onLogout, onUpload, onRefresh }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-remarkable-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">rM</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              reMarkable Cloud Manager
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onUpload}
            className="btn-primary flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </button>

          <button
            onClick={onRefresh}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>

          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="flex items-center space-x-2">
              <UserIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{user?.email}</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                v{user?.syncVersion}
              </span>
            </div>
            
            <button
              onClick={onLogout}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}