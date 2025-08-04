import { useState, useEffect } from 'react';
import { Document } from '../types';

export function useFileSystem() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentPath, setCurrentPath] = useState('/');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration
  const mockDocuments: Document[] = [
    {
      id: '1',
      name: 'My Notebooks',
      type: 'CollectionType',
      parent: '',
      version: 1,
      modifiedClient: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Research Notes',
      type: 'DocumentType',
      parent: '1',
      version: 1,
      modifiedClient: new Date(Date.now() - 86400000).toISOString(),
      currentPage: 5,
      size: 2048000
    },
    {
      id: '3',
      name: 'Meeting Minutes',
      type: 'DocumentType',
      parent: '1',
      version: 2,
      modifiedClient: new Date(Date.now() - 172800000).toISOString(),
      currentPage: 12,
      size: 1536000
    },
    {
      id: '4',
      name: 'PDFs',
      type: 'CollectionType',
      parent: '',
      version: 1,
      modifiedClient: new Date(Date.now() - 259200000).toISOString()
    },
    {
      id: '5',
      name: 'Technical Manual.pdf',
      type: 'DocumentType',
      parent: '4',
      version: 1,
      modifiedClient: new Date(Date.now() - 345600000).toISOString(),
      currentPage: 1,
      size: 5242880
    }
  ];

  useEffect(() => {
    loadDocuments();
  }, [currentPath]);

  const loadDocuments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter documents based on current path
      const filteredDocs = mockDocuments.filter(doc => {
        if (currentPath === '/') {
          return doc.parent === '';
        }
        // In a real implementation, you'd resolve the path to parent ID
        return doc.parent === '1' || doc.parent === '4';
      });
      
      setDocuments(filteredDocs);
    } catch (err) {
      setError('Failed to load documents');
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const navigateToPath = (path: string) => {
    setCurrentPath(path);
  };

  const uploadDocument = async (file: File, targetPath: string): Promise<void> => {
    setLoading(true);
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newDoc: Document = {
        id: Date.now().toString(),
        name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        type: 'DocumentType',
        parent: targetPath === '/' ? '' : '1',
        version: 1,
        modifiedClient: new Date().toISOString(),
        currentPage: 1,
        size: file.size
      };
      
      setDocuments(prev => [...prev, newDoc]);
    } catch (err) {
      setError('Failed to upload document');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (documentId: string): Promise<void> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    } catch (err) {
      setError('Failed to delete document');
      throw err;
    }
  };

  const createFolder = async (name: string, parentPath: string): Promise<void> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newFolder: Document = {
        id: Date.now().toString(),
        name,
        type: 'CollectionType',
        parent: parentPath === '/' ? '' : '1',
        version: 1,
        modifiedClient: new Date().toISOString()
      };
      
      setDocuments(prev => [...prev, newFolder]);
    } catch (err) {
      setError('Failed to create folder');
      throw err;
    }
  };

  const refreshDocuments = async (): Promise<void> => {
    await loadDocuments();
  };

  return {
    documents,
    currentPath,
    loading,
    error,
    navigateToPath,
    uploadDocument,
    deleteDocument,
    createFolder,
    refreshDocuments
  };
}