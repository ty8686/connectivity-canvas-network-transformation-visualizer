export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number;
}
export interface ProjectMetadata {
  latency: number;
  hops: number;
  updatedAt: number;
  mode: 'legacy' | 'future';
}
export interface Project {
  id: string;
  title: string;
  nodes: any[];
  edges: any[];
  metadata: ProjectMetadata;
}