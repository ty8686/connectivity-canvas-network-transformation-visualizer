import { create } from 'zustand';
import { Node, Edge, applyNodeChanges, applyEdgeChanges, addEdge, NodeChange, EdgeChange, Connection } from '@xyflow/react';
import { DEMO_LEGACY_GRAPH } from '@/lib/demo-data';
import { api } from '@/lib/api-client';
import type { Project } from '@shared/types';
export type ViewMode = 'legacy' | 'future';
interface EditorState {
  projectId: string | null;
  projectTitle: string;
  mode: ViewMode;
  nodes: Node[];
  edges: Edge[];
  legacyBackup: { nodes: Node[]; edges: Edge[] } | null;
  projects: Project[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  simulationSpeed: number;
  isLoading: boolean;
  latency: number;
  hops: number;
  latencyDelta: number;
  hopsDelta: number;
  setMode: (mode: ViewMode) => void;
  setProjectTitle: (title: string) => void;
  setSimulationSpeed: (speed: number) => void;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedEdgeId: (id: string | null) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  updateNodeData: (id: string, data: Record<string, unknown>) => void;
  updateEdgeData: (id: string, data: Record<string, unknown>) => void;
  addNode: (node: Node) => void;
  deleteNode: (id: string) => void;
  deleteEdge: (id: string) => void;
  fetchProjects: () => Promise<void>;
  saveProject: () => Promise<void>;
  loadProject: (id: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  createNewProject: () => void;
  calculateMetrics: () => void;
}
export const useEditorStore = create<EditorState>((set, get) => ({
  projectId: null,
  projectTitle: "New Connectivity Canvas",
  mode: 'legacy',
  nodes: DEMO_LEGACY_GRAPH.nodes,
  edges: DEMO_LEGACY_GRAPH.edges,
  legacyBackup: null,
  projects: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  simulationSpeed: 1.0,
  isLoading: false,
  latency: 240,
  hops: 8,
  latencyDelta: 0,
  hopsDelta: 0,
  calculateMetrics: () => {
    const { nodes, edges, mode } = get();
    const legacyBaselineLatency = 240;
    const legacyBaselineHops = 8;
    if (mode === 'future') {
      const futureLatency = 12;
      const futureHops = 1;
      const lDelta = Math.round(((legacyBaselineLatency - futureLatency) / legacyBaselineLatency) * 100);
      const hDelta = legacyBaselineHops / futureHops;
      set({
        latency: futureLatency,
        hops: futureHops,
        latencyDelta: lDelta,
        hopsDelta: hDelta
      });
      return;
    }
    const totalWeight = edges.reduce((acc, edge) => acc + (Number(edge.data?.weight) || 1), 0);
    const calculatedLatency = Math.min(600, 40 + (totalWeight * 25));
    set({
      latency: calculatedLatency,
      hops: nodes.length,
      latencyDelta: 0,
      hopsDelta: 0
    });
  },
  setMode: (mode) => {
    const state = get();
    if (mode === state.mode) return;
    if (mode === 'future') {
      set({ legacyBackup: { nodes: state.nodes, edges: state.edges } });
      const originNodes = state.nodes.filter(n => ['database', 'server', 'harddrive'].includes(n.data?.iconType as string));
      const userNodes = state.nodes.filter(n => n.data?.iconType === 'users');
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
          data: { weight: 1 },
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
          data: { weight: 1 },
          style: { stroke: '#F48120', strokeWidth: 3 }
        });
      });
      set({ mode, nodes: newNodes, edges: newEdges });
    } else {
      if (state.legacyBackup) {
        set({ mode, nodes: state.legacyBackup.nodes, edges: state.legacyBackup.edges });
      } else {
        set({ mode, nodes: DEMO_LEGACY_GRAPH.nodes, edges: DEMO_LEGACY_GRAPH.edges });
      }
    }
    get().calculateMetrics();
  },
  setProjectTitle: (projectTitle) => set({ projectTitle }),
  setSimulationSpeed: (simulationSpeed) => set({ simulationSpeed }),
  setSelectedNodeId: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  setSelectedEdgeId: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),
  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
    get().calculateMetrics();
  },
  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
    get().calculateMetrics();
  },
  onConnect: (connection) => {
    const edge: Edge = { 
      ...connection, 
      id: `e-${Date.now()}`, 
      type: 'sketchy', 
      animated: true, 
      data: { weight: 1, label: '' } 
    };
    set({ edges: addEdge(edge, get().edges) });
    get().calculateMetrics();
  },
  updateNodeData: (id, data) => {
    set({
      nodes: get().nodes.map(n => n.id === id ? { ...n, data: { ...n.data, ...data } } : n)
    });
  },
  updateEdgeData: (id, data) => {
    set({
      edges: get().edges.map(e => e.id === id ? { ...e, data: { ...e.data, ...data } } : e)
    });
    get().calculateMetrics();
  },
  addNode: (node) => set({ nodes: [...get().nodes, node] }),
  deleteNode: (id) => {
    set({
      nodes: get().nodes.filter(n => n.id !== id),
      edges: get().edges.filter(e => e.source !== id && e.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId
    });
    get().calculateMetrics();
  },
  deleteEdge: (id) => {
    set({
      edges: get().edges.filter(e => e.id !== id),
      selectedEdgeId: get().selectedEdgeId === id ? null : get().selectedEdgeId
    });
    get().calculateMetrics();
  },
  fetchProjects: async () => {
    try {
      const response = await api<{ items: Project[] }>('/api/projects');
      set({ projects: response?.items ?? [] });
    } catch (err) {
      console.error("Fetch projects failed:", err);
      set({ projects: [] });
    }
  },
  saveProject: async () => {
    const { projectId, projectTitle, nodes, edges, latency, hops } = get();
    set({ isLoading: true });
    try {
      const result = await api<Project>('/api/projects', {
        method: 'POST',
        body: JSON.stringify({
          id: projectId,
          title: projectTitle,
          nodes,
          edges,
          metadata: { latency, hops, updatedAt: Date.now() }
        })
      });
      set({ projectId: result.id, isLoading: false });
      await get().fetchProjects();
    } catch (err) {
      console.error("Save failed:", err);
      set({ isLoading: false });
      throw err;
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
        latency: project.metadata.latency,
        hops: project.metadata.hops,
        mode: project.metadata.hops > 1 ? 'legacy' : 'future',
        isLoading: false,
        legacyBackup: null
      });
      get().calculateMetrics();
    } catch (err) {
      console.error("Load failed:", err);
      set({ isLoading: false });
    }
  },
  deleteProject: async (id: string) => {
    try {
      await api(`/api/projects/${id}`, { method: 'DELETE' });
      set({ projects: get().projects.filter(p => p.id !== id) });
    } catch (err) {
      console.error("Delete failed:", err);
    }
  },
  createNewProject: () => {
    set({
      projectId: null,
      projectTitle: "New Connectivity Canvas",
      mode: 'legacy',
      nodes: DEMO_LEGACY_GRAPH.nodes,
      edges: DEMO_LEGACY_GRAPH.edges,
      legacyBackup: null,
      selectedNodeId: null,
      selectedEdgeId: null,
      latency: 240,
      hops: 8,
      latencyDelta: 0,
      hopsDelta: 0
    });
  }
}));