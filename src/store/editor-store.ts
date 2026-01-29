import { create } from 'zustand';
import { Node, Edge, applyNodeChanges, applyEdgeChanges, addEdge, NodeChange, EdgeChange, Connection } from '@xyflow/react';
import { DEMO_LEGACY_GRAPH, DEMO_FUTURE_GRAPH } from '@/lib/demo-data';
import { api } from '@/lib/api-client';
import type { Project } from '@shared/types';
export type ViewMode = 'legacy' | 'future';
interface EditorState {
  projectId: string | null;
  projectTitle: string;
  mode: ViewMode;
  nodes: Node[];
  edges: Edge[];
  simulationSpeed: number;
  isLoading: boolean;
  setMode: (mode: ViewMode) => void;
  setSimulationSpeed: (speed: number) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: Node) => void;
  saveProject: () => Promise<void>;
  loadProject: (id: string) => Promise<void>;
}
export const useEditorStore = create<EditorState>((set, get) => ({
  projectId: null,
  projectTitle: "New Connectivity Canvas",
  mode: 'legacy',
  nodes: DEMO_LEGACY_GRAPH.nodes,
  edges: DEMO_LEGACY_GRAPH.edges,
  simulationSpeed: 1.0,
  isLoading: false,
  setMode: (mode) => {
    const currentNodes = get().nodes;
    const currentEdges = get().edges;
    if (mode === 'future') {
      // Transformation Logic: Map legacy nodes to Cloudflare consolidated edge
      const originNodes = currentNodes.filter(n => n.data.iconType === 'database' || n.data.iconType === 'server');
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
      set({ mode, nodes: newNodes, edges: newEdges });
    } else {
      // Revert to demo legacy for now, or we could track previous legacy state
      set({ mode, nodes: DEMO_LEGACY_GRAPH.nodes, edges: DEMO_LEGACY_GRAPH.edges });
    }
  },
  setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),
  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },
  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },
  onConnect: (connection) => {
    set({ edges: addEdge({ ...connection, type: 'sketchy', animated: true }, get().edges) });
  },
  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
  },
  saveProject: async () => {
    const { projectId, projectTitle, nodes, edges } = get();
    set({ isLoading: true });
    try {
      const result = await api<Project>('/api/projects', {
        method: 'POST',
        body: JSON.stringify({
          id: projectId || undefined,
          title: projectTitle,
          nodes,
          edges,
          metadata: { latency: get().mode === 'legacy' ? 240 : 12, hops: get().mode === 'legacy' ? 8 : 1 }
        })
      });
      set({ projectId: result.id, isLoading: false });
    } catch (err) {
      console.error("Failed to save project", err);
      set({ isLoading: false });
      throw err;
    }
  },
  loadProject: async (id: string) => {
    set({ isLoading: true });
    try {
      const project = await api<Project>(`/api/projects/${id}`);
      set({
        projectId: project.id,
        projectTitle: project.title,
        nodes: project.nodes,
        edges: project.edges,
        isLoading: false
      });
    } catch (err) {
      console.error("Failed to load project", err);
      set({ isLoading: false });
    }
  }
}));