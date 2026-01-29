import { create } from 'zustand';
import { Node, Edge, applyNodeChanges, applyEdgeChanges, addEdge, NodeChange, EdgeChange, Connection } from '@xyflow/react';
import { DEMO_LEGACY_GRAPH } from '@/lib/demo-data';
import { api } from '@/lib/api-client';
import type { Project, ProjectMetadata } from '@shared/types';
export type ViewMode = 'legacy' | 'future';
interface EditorState {
  projectId: string | null;
  projectTitle: string;
  mode: ViewMode;
  nodes: Node[];
  edges: Edge[];
  projects: Project[];
  selectedNodeId: string | null;
  simulationSpeed: number;
  isLoading: boolean;
  comparisonStats: { latencyDelta: number; hopsDelta: number };
  setMode: (mode: ViewMode) => void;
  setProjectTitle: (title: string) => void;
  setSimulationSpeed: (speed: number) => void;
  setSelectedNodeId: (id: string | null) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  updateNodeData: (id: string, data: any) => void;
  addNode: (node: Node) => void;
  deleteNode: (id: string) => void;
  fetchProjects: () => Promise<void>;
  saveProject: () => Promise<void>;
  loadProject: (id: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  createNewProject: () => void;
}
export const useEditorStore = create<EditorState>((set, get) => ({
  projectId: null,
  projectTitle: "New Connectivity Canvas",
  mode: 'legacy',
  nodes: DEMO_LEGACY_GRAPH.nodes,
  edges: DEMO_LEGACY_GRAPH.edges,
  projects: [],
  selectedNodeId: null,
  simulationSpeed: 1.0,
  isLoading: false,
  comparisonStats: { latencyDelta: 95, hopsDelta: 7 },
  setMode: (mode) => {
    const currentNodes = get().nodes;
    if (mode === 'future') {
      const originNodes = currentNodes.filter(n => n.data.iconType === 'database' || n.data.iconType === 'server' || n.data.iconType === 'harddrive');
      const userNodes = currentNodes.filter(n => n.data.iconType === 'users');
      const cfNode: Node = {
        id: 'cf-edge-auto',
        type: 'sketchy',
        position: { x: 400, y: 150 },
        data: { label: 'Cloudflare Connectivity Cloud', iconType: 'cloud', isPrimary: true }
      };
      const newNodes = [...userNodes, cfNode, ...originNodes];
      const newEdges: Edge[] = [];
      userNodes.forEach(u => {
        newEdges.push({
          id: `edge-${u.id}-cf`,
          source: u.id,
          target: cfNode.id,
          type: 'sketchy',
          animated: true,
          style: { stroke: '#F48120', strokeWidth: 3 }
        });
      });
      originNodes.forEach(o => {
        newEdges.push({
          id: `edge-cf-${o.id}`,
          source: cfNode.id,
          target: o.id,
          type: 'sketchy',
          animated: true,
          style: { stroke: '#F48120', strokeWidth: 3 }
        });
      });
      set({ mode, nodes: newNodes, edges: newEdges, comparisonStats: { latencyDelta: 95, hopsDelta: 7 } });
    } else {
      set({ mode, nodes: DEMO_LEGACY_GRAPH.nodes, edges: DEMO_LEGACY_GRAPH.edges });
    }
  },
  setProjectTitle: (projectTitle) => set({ projectTitle }),
  setSimulationSpeed: (simulationSpeed) => set({ simulationSpeed }),
  setSelectedNodeId: (selectedNodeId) => set({ selectedNodeId }),
  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },
  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },
  onConnect: (connection) => {
    set({ edges: addEdge({ ...connection, type: 'sketchy', animated: true }, get().edges) });
  },
  updateNodeData: (id, data) => {
    set({
      nodes: get().nodes.map(n => n.id === id ? { ...n, data: { ...n.data, ...data } } : n)
    });
  },
  addNode: (node) => set({ nodes: [...get().nodes, node] }),
  deleteNode: (id) => set({ 
    nodes: get().nodes.filter(n => n.id !== id),
    edges: get().edges.filter(e => e.source !== id && e.target !== id),
    selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId
  }),
  fetchProjects: async () => {
    try {
      const response = await api<{ items: Project[] }>('/api/projects');
      set({ projects: response.items });
    } catch (err) {
      console.error("Fetch projects failed", err);
    }
  },
  saveProject: async () => {
    const { projectId, projectTitle, nodes, edges, mode } = get();
    set({ isLoading: true });
    try {
      const result = await api<Project>('/api/projects', {
        method: 'POST',
        body: JSON.stringify({
          id: projectId,
          title: projectTitle,
          nodes,
          edges,
          metadata: { 
            latency: mode === 'legacy' ? 240 : 12, 
            hops: mode === 'legacy' ? 8 : 1,
            updatedAt: Date.now()
          }
        })
      });
      set({ projectId: result.id, isLoading: false });
      get().fetchProjects();
    } catch (err) {
      console.error("Save failed", err);
      set({ isLoading: false });
    }
  },
  loadProject: async (id: string) => {
    set({ isLoading: true, projectId: id });
    try {
      const project = await api<Project>(`/api/projects/${id}`);
      set({
        projectTitle: project.title,
        nodes: project.nodes,
        edges: project.edges,
        mode: project.metadata.hops > 1 ? 'legacy' : 'future',
        isLoading: false
      });
    } catch (err) {
      console.error("Load failed", err);
      set({ isLoading: false });
    }
  },
  deleteProject: async (id: string) => {
    try {
      await api(`/api/projects/${id}`, { method: 'DELETE' });
      set({ projects: get().projects.filter(p => p.id !== id) });
    } catch (err) {
      console.error("Delete failed", err);
    }
  },
  createNewProject: () => {
    set({
      projectId: null,
      projectTitle: "New Connectivity Canvas",
      mode: 'legacy',
      nodes: DEMO_LEGACY_GRAPH.nodes,
      edges: DEMO_LEGACY_GRAPH.edges,
      selectedNodeId: null
    });
  }
}));