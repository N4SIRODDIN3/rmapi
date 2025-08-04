import React, { useState } from 'react';
import { 
  File, 
  Folder, 
  MoreVertical, 
  Download, 
  Trash2, 
  Edit3,
  Calendar,
  HardDrive
} from 'lucide-react';
import { Document } from '../types';
import { formatFileSize, formatDate } from '../utils/format';

interface FileExplorerProps {
  documents: Document[];
  currentPath: string;
  loading: boolean;
  error: string | null;
  selectedDocuments: string[];
  onSelectionChange: (selected: string[]) => void;
  onNavigate: (path: string) => void;
  onDelete: (documentIds: string[]) => void;
  onCreateFolder: (name: string, parentPath: string) => void;
}

export function FileExplorer({
  documents,
  currentPath,
  loading,
  error,
  selectedDocuments,
  onSelectionChange,
  onNavigate,
  onDelete,
  onCreateFolder
}: FileExplorerProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState<'name' | 'modified' | 'size'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSelectDocument = (documentId: string, isSelected: boolean) => {
    if (isSelected) {
      onSelectionChange([...selectedDocuments, documentId]);
    } else {
      onSelectionChange(selectedDocuments.filter(id => id !== documentId));
    }
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      onSelectionChange(documents.map(doc => doc.id));
    } else {
      onSelectionChange([]);
    }
  };

  const sortedDocuments = [...documents].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'modified':
        comparison = new Date(a.modifiedClient).getTime() - new Date(b.modifiedClient).getTime();
        break;
      case 'size':
        comparison = (a.size || 0) - (b.size || 0);
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-remarkable-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading documents</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-medium text-gray-900">
              {currentPath === '/' ? 'Home' : currentPath}
            </h2>
            <span className="text-sm text-gray-500">
              {documents.length} items
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="name">Sort by Name</option>
              <option value="modified">Sort by Modified</option>
              <option value="size">Sort by Size</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>

            {selectedDocuments.length > 0 && (
              <button
                onClick={() => onDelete(selectedDocuments)}
                className="btn-danger text-sm flex items-center space-x-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete ({selectedDocuments.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-auto">
        {documents.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="text-center">
              <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">This folder is empty</p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="w-8 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedDocuments.length === documents.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">
                      Modified
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">
                      Size
                    </th>
                    <th className="w-8 px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedDocuments.map((document) => (
                    <DocumentRow
                      key={document.id}
                      document={document}
                      isSelected={selectedDocuments.includes(document.id)}
                      onSelect={(isSelected) => handleSelectDocument(document.id, isSelected)}
                      onNavigate={onNavigate}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface DocumentRowProps {
  document: Document;
  isSelected: boolean;
  onSelect: (isSelected: boolean) => void;
  onNavigate: (path: string) => void;
}

function DocumentRow({ document, isSelected, onSelect, onNavigate }: DocumentRowProps) {
  const isFolder = document.type === 'CollectionType';
  const Icon = isFolder ? Folder : File;

  const handleRowClick = () => {
    if (isFolder) {
      onNavigate(`/${document.name.toLowerCase().replace(/\s+/g, '-')}`);
    }
  };

  return (
    <tr 
      className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''} ${isFolder ? 'cursor-pointer' : ''}`}
      onClick={isFolder ? handleRowClick : undefined}
    >
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect(e.target.checked);
          }}
          className="rounded border-gray-300"
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center space-x-3">
          <Icon className={`w-5 h-5 ${isFolder ? 'text-blue-500' : 'text-gray-400'}`} />
          <div>
            <p className="font-medium text-gray-900">{document.name}</p>
            {document.currentPage && (
              <p className="text-sm text-gray-500">Page {document.currentPage}</p>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(document.modifiedClient)}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {document.size && (
          <div className="flex items-center space-x-1">
            <HardDrive className="w-4 h-4" />
            <span>{formatFileSize(document.size)}</span>
          </div>
        )}
      </td>
      <td className="px-4 py-3">
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}