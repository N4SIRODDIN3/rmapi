import React, { useState } from 'react';
import { Home, Folder, FolderPlus, ChevronRight, ChevronDown } from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onCreateFolder: (name: string, parentPath: string) => void;
}

export function Sidebar({ currentPath, onNavigate, onCreateFolder }: SidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/']));
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim(), currentPath);
      setNewFolderName('');
      setShowCreateFolder(false);
    }
  };

  const navigationItems = [
    { path: '/', name: 'Home', icon: Home },
    { path: '/notebooks', name: 'My Notebooks', icon: Folder },
    { path: '/pdfs', name: 'PDFs', icon: Folder },
    { path: '/trash', name: 'Trash', icon: Folder },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-gray-900">Navigation</h2>
          <button
            onClick={() => setShowCreateFolder(true)}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            title="Create Folder"
          >
            <FolderPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            const isExpanded = expandedFolders.has(item.path);

            return (
              <li key={item.path}>
                <div className="flex items-center">
                  {item.path !== '/' && (
                    <button
                      onClick={() => toggleFolder(item.path)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3 h-3 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-gray-400" />
                      )}
                    </button>
                  )}
                  
                  <button
                    onClick={() => onNavigate(item.path)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 ${
                      isActive
                        ? 'bg-remarkable-100 text-remarkable-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      {showCreateFolder && (
        <div className="p-4 border-t border-gray-200">
          <form onSubmit={handleCreateFolder} className="space-y-3">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="input-field text-sm"
              autoFocus
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                className="btn-primary text-sm py-1 px-3"
                disabled={!newFolderName.trim()}
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateFolder(false);
                  setNewFolderName('');
                }}
                className="btn-secondary text-sm py-1 px-3"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </aside>
  );
}