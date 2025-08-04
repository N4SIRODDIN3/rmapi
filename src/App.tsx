import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { FileExplorer } from './components/FileExplorer';
import { AuthModal } from './components/AuthModal';
import { UploadModal } from './components/UploadModal';
import { StatusBar } from './components/StatusBar';
import { useAuth } from './hooks/useAuth';
import { useFileSystem } from './hooks/useFileSystem';
import { Document } from './types';

function App() {
  const { isAuthenticated, user, login, logout } = useAuth();
  const { 
    documents, 
    currentPath, 
    loading, 
    error,
    navigateToPath,
    uploadDocument,
    deleteDocument,
    createFolder,
    refreshDocuments
  } = useFileSystem();

  const [showAuthModal, setShowAuthModal] = useState(!isAuthenticated);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  useEffect(() => {
    setShowAuthModal(!isAuthenticated);
  }, [isAuthenticated]);

  const handleLogin = async (deviceCode: string) => {
    try {
      await login(deviceCode);
      setShowAuthModal(false);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleUpload = async (files: FileList, targetPath: string) => {
    try {
      for (const file of Array.from(files)) {
        await uploadDocument(file, targetPath);
      }
      setShowUploadModal(false);
      await refreshDocuments();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleDelete = async (documentIds: string[]) => {
    try {
      for (const id of documentIds) {
        await deleteDocument(id);
      }
      setSelectedDocuments([]);
      await refreshDocuments();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleCreateFolder = async (name: string, parentPath: string) => {
    try {
      await createFolder(name, parentPath);
      await refreshDocuments();
    } catch (error) {
      console.error('Create folder failed:', error);
    }
  };

  if (showAuthModal) {
    return <AuthModal onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        user={user}
        onLogout={logout}
        onUpload={() => setShowUploadModal(true)}
        onRefresh={refreshDocuments}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          currentPath={currentPath}
          onNavigate={navigateToPath}
          onCreateFolder={handleCreateFolder}
        />
        
        <main className="flex-1 overflow-hidden">
          <FileExplorer
            documents={documents}
            currentPath={currentPath}
            loading={loading}
            error={error}
            selectedDocuments={selectedDocuments}
            onSelectionChange={setSelectedDocuments}
            onNavigate={navigateToPath}
            onDelete={handleDelete}
            onCreateFolder={handleCreateFolder}
          />
        </main>
      </div>

      <StatusBar 
        documentsCount={documents.length}
        selectedCount={selectedDocuments.length}
        syncStatus="synced"
      />

      {showUploadModal && (
        <UploadModal
          currentPath={currentPath}
          onUpload={handleUpload}
          onClose={() => setShowUploadModal(false)}
        />
      )}
    </div>
  );
}

export default App;