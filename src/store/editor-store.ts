import { create } from 'zustand';
import { Node, Edge, applyNodeChanges, applyEdgeChanges, addEdge, NodeChange, EdgeChange, Connection } from '@xyflow/react';
import { DEMO_LEGACY_GRAPH } from '@/lib/demo-data';
import { api } from '@/lib/api-client';
import type { Project } from '@shared/types';
export type ViewMode = 'legacy' | 'future';
interface PreviewMetrics {
  latency: number;
  hops: number;
  nodeIds: string[];
  edgeIds: string[];
}
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
  hoveredNodeId: string | null;
  hoveredPathNodeIds: string[];
  hoveredPathEdgeIds: string[];
  simulationSpeed: number;
  isLoading: boolean;
  latency: number;
  hops: number;
  latencyDelta: number;
  hopsDelta: number;
  previewMetrics: PreviewMetrics | null;
  setMode: (mode: ViewMode) => void;
  setProjectTitle: (title: string) => void;
  setSimulationSpeed: (speed: number) => void;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedEdgeId: (id: string | null) => void;
  setHoveredNodeId: (id: string | null) => void;
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
function findShortestPath(nodes: Node[], edges: Edge[], startNodeId: string, targetIconTypes: string[]): PreviewMetrics | null {
  if (!nodes || !edges || !startNodeId) return null;
  const adjacency: Record<string, { to: string; weight: number; edgeId: string }[]> = {};
  edges.forEach(edge => {
    if (!edge.source || !edge.target) return;
    if (!adjacency[edge.source]) adjacency[edge.source] = [];
    const weight = Number(edge.data?.weight) || 1;
    adjacency[edge.source].push({ to: edge.target, weight, edgeId: edge.id });
  });
  const distances: Record<string, number> = { [startNodeId]: 0 };
  const previous: Record<string, { nodeId: string; edgeId: string } | null> = { [startNodeId]: null };
  const visited = new Set<string>();
  const pq: [string, number][] = [[startNodeId, 0]];
  while (pq.length > 0) {
    pq.sort((a, b) => a[1] - b[1]);
    const [u, d] = pq.shift()!;
    if (visited.has(u)) continue;
    visited.add(u);
    const node = nodes.find(n => n.id === u);
    if (node && targetIconTypes.includes(String(node.data?.iconType)) && u !== startNodeId) {
      const nodePath: string[] = [];
      const edgePath: string[] = [];
      let curr: string | null = u;
      while (curr) {
        nodePath.unshift(curr);
        const prevData = previous[curr];
        if (prevData) {
          edgePath.unshift(prevData.edgeId);
          curr = prevData.nodeId;
        } else {
          curr = null;
        }
      }
      return {
        latency: d * 15 + 10,
        hops: nodePath.length - 1,
        nodeIds: nodePath,
        edgeIds: edgePath
      };
    }
    (adjacency[u] || []).forEach(({ to, weight, edgeId }) => {
      const newDist = d + weight;
      if (distances[to] === undefined || newDist < distances[to]) {
        distances[to] = newDist;
        previous[to] = { nodeId: u, edgeId };
        pq.push([to, newDist]);
      }
    });
  }
  return null;
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
  hoveredNodeId: null,
  hoveredPathNodeIds: [],
  hoveredPathEdgeIds: [],
  simulationSpeed: 1.0,
  isLoading: false,
  latency: 240,
  hops: 8,
  latencyDelta: 0,
  hopsDelta: 0,
  previewMetrics: null,
  calculateMetrics: () => {
    const { nodes, edges, mode, hoveredNodeId } = get();
    const targetIcons = ['database', 'server', 'harddrive'];
    const userNodes = nodes.filter(n => n.data?.iconType === 'users');
    const paths = userNodes
      .map(u => findShortestPath(nodes, edges, u.id, targetIcons))
      .filter(Boolean) as PreviewMetrics[];
    const avgLatency = paths.length > 0
      ? paths.reduce((acc, p) => acc + p.latency, 0) / paths.length
      : (mode === 'future' ? 12 : 240);
    const avgHops = paths.length > 0
      ? paths.reduce((acc, p) => acc + p.hops, 0) / paths.length
      : (mode === 'future' ? 1 : 8);
    let preview: PreviewMetrics | null = null;
    let pathNodeIds: string[] = [];
    let pathEdgeIds: string[] = [];
    if (hoveredNodeId) {
      const node = nodes.find(n => n.id === hoveredNodeId);
      if (node?.data?.iconType === 'users') {
        preview = findShortestPath(nodes, edges, hoveredNodeId, targetIcons);
        if (preview) {
          pathNodeIds = preview.nodeIds;
          pathEdgeIds = preview.edgeIds;
        }
      } else if (node && targetIcons.includes(String(node.data?.iconType))) {
        for (const u of userNodes) {
          const p = findShortestPath(nodes, edges, u.id, [String(node.data?.iconType)]);
          if (p && p.nodeIds.includes(node.id)) {
             pathNodeIds = p.nodeIds;
             pathEdgeIds = p.edgeIds;
             preview = p;
             break;
          }
        }
      }
    }
    const legacyBaselineLatency = 240;
    const lDelta = Math.round(((legacyBaselineLatency - avgLatency) / Math.max(1, legacyBaselineLatency)) * 100);
    const hDelta = Math.round((8 / Math.max(1, avgHops)) * 10) / 10;
    set({
      latency: avgLatency,
      hops: Math.round(avgHops),
      latencyDelta: lDelta,
      hopsDelta: hDelta,
      previewMetrics: preview,
      hoveredPathNodeIds: pathNodeIds,
      hoveredPathEdgeIds: pathEdgeIds
    });
  },
  setHoveredNodeId: (id) => {
    set({ hoveredNodeId: id });
    get().calculateMetrics();
  },
  setMode: (mode) => {
    const state = get();
    if (mode === state.mode) return;
    if (mode === 'future') {
      set({ legacyBackup: { nodes: [...state.nodes], edges: [...state.edges] } });
      const originNodes = state.nodes.filter(n => ['database', 'server', 'harddrive'].includes(String(n.data?.iconType)));
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
      id: `e-${Date.now()}`,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
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
  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
    get().calculateMetrics();
  },
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
        mode: project.metadata.hops > 2 ? 'legacy' : 'future',
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
      hopsDelta: 0,
      hoveredPathNodeIds: [],
      hoveredPathEdgeIds: [],
      previewMetrics: null
    });
  }
}));