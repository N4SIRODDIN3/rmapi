export interface Document {
  id: string;
  name: string;
  type: 'DocumentType' | 'CollectionType';
  parent: string;
  version: number;
  modifiedClient: string;
  currentPage?: number;
  size?: number;
}

export interface User {
  email: string;
  syncVersion: string;
}

export interface AuthTokens {
  deviceToken: string;
  userToken: string;
}

export interface FileSystemNode {
  document: Document;
  children: FileSystemNode[];
  parent?: FileSystemNode;
}

export type SyncStatus = 'syncing' | 'synced' | 'error' | 'offline';

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}