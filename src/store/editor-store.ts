import { create } from 'zustand';
import { Node, Edge, applyNodeChanges, applyEdgeChanges, addEdge, NodeChange, EdgeChange, Connection } from '@xyflow/react';
import { DEMO_LEGACY_GRAPH } from '@/lib/demo-data';
import { api } from '@/lib/api-client';
import type { Project } from '@shared/types';
export type ViewMode = 'legacy' | 'future';
export interface EdgeAnimationTiming {
  delay: number;
  duration: number;
  totalPathDuration: number;
}
interface EditorState {
  projectId: string | null;
  projectTitle: string;
  mode: ViewMode;
  nodes: Node[];
  edges: Edge[];
  edgeAnimations: Record<string, EdgeAnimationTiming[]>;
  legacyBackup: { nodes: Node[]; edges: Edge[] } | null;
  projects: Project[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  hoveredNodeId: string | null;
  activePathNodeIds: string[];
  activePathEdgeIds: string[];
  simulationSpeed: number;
  isAnimating: boolean;
  isLoading: boolean;
  latency: number;
  hops: number;
  latencyDelta: number;
  hopsDelta: number;
  setMode: (mode: ViewMode) => void;
  setProjectTitle: (title: string) => void;
  toggleAnimation: () => void;
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
function findShortestPath(nodes: Node[], edges: Edge[], startNodeId: string, endNodeIds: string[]) {
  if (!startNodeId || endNodeIds.length === 0) return null;
  if (endNodeIds.includes(startNodeId)) {
    return { latency: 0, hops: 0, nodeIds: [startNodeId], edgeIds: [] };
  }
  const distances: Record<string, number> = { [startNodeId]: 0 };
  const previous: Record<string, { nodeId: string; edgeId: string } | null> = { [startNodeId]: null };
  const visited = new Set<string>();
  const pq: [string, number][] = [[startNodeId, 0]];
  while (pq.length > 0) {
    pq.sort((a, b) => a[1] - b[1]);
    const nextItem = pq.shift();
    if (!nextItem) break;
    const [u, d] = nextItem;
    if (visited.has(u)) continue;
    visited.add(u);
    if (endNodeIds.includes(u)) {
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
      return { latency: d, hops: nodePath.length - 1, nodeIds: nodePath, edgeIds: edgePath };
    }
    const outgoingEdges = edges.filter(e => e.source === u);
    for (const edge of outgoingEdges) {
      const weight = Number(edge.data?.weight) || 15;
      const to = edge.target;
      const newDist = d + weight;
      if (distances[to] === undefined || newDist < distances[to]) {
        distances[to] = newDist;
        previous[to] = { nodeId: u, edgeId: edge.id };
        pq.push([to, newDist]);
      }
    }
  }
  return null;
}
export const useEditorStore = create<EditorState>((set, get) => ({
  projectId: null,
  projectTitle: "New Connectivity Canvas",
  mode: 'legacy',
  nodes: DEMO_LEGACY_GRAPH.nodes,
  edges: DEMO_LEGACY_GRAPH.edges,
  edgeAnimations: {},
  legacyBackup: null,
  projects: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  hoveredNodeId: null,
  activePathNodeIds: [],
  activePathEdgeIds: [],
  simulationSpeed: 1.0,
  isAnimating: true,
  isLoading: false,
  latency: 240,
  hops: 4,
  latencyDelta: 0,
  hopsDelta: 0,
  calculateMetrics: () => {
    const { nodes, edges, mode, hoveredNodeId } = get();
    if (nodes.length === 0) {
      set({ 
        latency: 0, hops: 0, latencyDelta: 0, hopsDelta: 0, 
        activePathNodeIds: [], activePathEdgeIds: [], edgeAnimations: {} 
      });
      return;
    }
    const endNodeIds = nodes.filter(n => !!n.data?.isTrafficEnd).map(n => n.id);
    const trafficStartNodes = nodes.filter(n => !!n.data?.isTrafficStart);
    const staticPaths = trafficStartNodes
      .map(u => findShortestPath(nodes, edges, u.id, endNodeIds))
      .filter(Boolean) as any[];
    let hoverPath = null;
    if (hoveredNodeId && !trafficStartNodes.some(n => n.id === hoveredNodeId)) {
      hoverPath = findShortestPath(nodes, edges, hoveredNodeId, endNodeIds);
    }
    const combinedPathsForMetrics = [...staticPaths];
    if (hoverPath) combinedPathsForMetrics.push(hoverPath);
    if (combinedPathsForMetrics.length === 0) {
      set({
        latency: mode === 'future' ? 12 : 240,
        hops: mode === 'future' ? 1 : 4,
        latencyDelta: 0,
        hopsDelta: 0,
        activePathNodeIds: [],
        activePathEdgeIds: [],
        edgeAnimations: {}
      });
      return;
    }
    const allNodeIds = new Set<string>();
    const allEdgeIds = new Set<string>();
    const edgeAnimations: Record<string, EdgeAnimationTiming[]> = {};
    staticPaths.forEach((p, pIdx) => {
      p.nodeIds.forEach((id: string) => allNodeIds.add(id));
      p.edgeIds.forEach((id: string) => allEdgeIds.add(id));
      let cumulativeDuration = 0;
      const pathDurations = p.edgeIds.map((edgeId: string) => {
        const edge = edges.find(e => e.id === edgeId);
        const weight = Number(edge?.data?.weight) || 15;
        return 0.8 + (0.006 * weight);
      });
      const totalPathDuration = pathDurations.reduce((a: number, b: number) => a + b, 0);
      p.edgeIds.forEach((edgeId: string, idx: number) => {
        const duration = pathDurations[idx];
        if (!edgeAnimations[edgeId]) edgeAnimations[edgeId] = [];
        edgeAnimations[edgeId].push({
          delay: cumulativeDuration + (pIdx * 0.1),
          duration: duration,
          totalPathDuration: totalPathDuration
        });
        cumulativeDuration += duration;
      });
    });
    let totalLatency = 0;
    let totalHops = 0;
    combinedPathsForMetrics.forEach(p => {
      totalLatency += p.latency;
      totalHops += p.hops;
    });
    const avgLatency = totalLatency / combinedPathsForMetrics.length;
    const avgHops = totalHops / combinedPathsForMetrics.length;
    const legacyBaselineLatency = 240;
    const lDelta = Math.max(-99, Math.round(((legacyBaselineLatency - avgLatency) / legacyBaselineLatency) * 100));
    const hDelta = Math.round((4 / Math.max(1, avgHops)) * 10) / 10;
    set({
      latency: avgLatency,
      hops: Math.round(avgHops),
      latencyDelta: lDelta,
      hopsDelta: hDelta,
      activePathNodeIds: Array.from(allNodeIds),
      activePathEdgeIds: Array.from(allEdgeIds),
      edgeAnimations
    });
  },
  setMode: (mode) => {
    const state = get();
    if (mode === state.mode) return;
    if (mode === 'future') {
      set({ legacyBackup: { nodes: [...state.nodes], edges: [...state.edges] } });
      const userNodes = state.nodes.filter(n => n.data?.isTrafficStart);
      const originNodes = state.nodes.filter(n => n.data?.iconType === 'database' || n.data?.iconType === 'server' || n.data?.isTrafficEnd);
      const avgX = state.nodes.length > 0 
        ? state.nodes.reduce((acc, n) => acc + n.position.x, 0) / state.nodes.length 
        : 450;
      const avgY = state.nodes.length > 0 
        ? state.nodes.reduce((acc, n) => acc + n.position.y, 0) / state.nodes.length 
        : 250;
      const cfNode: Node = {
        id: 'cf-edge-auto',
        type: 'sketchy',
        position: { x: avgX, y: avgY },
        data: {
          label: 'Cloudflare Connectivity Cloud',
          iconType: 'cloud',
          isPrimary: true,
          isTrafficEnd: false
        }
      };
      const newNodes = [
        ...userNodes.map(n => ({ ...n, data: { ...n.data, isTrafficStart: true } })),
        cfNode,
        ...originNodes.map(n => ({ ...n, data: { ...n.data, isTrafficEnd: true } }))
      ];
      const newEdges: Edge[] = [];
      userNodes.forEach(u => {
        newEdges.push({
          id: `edge-${u.id}-cf`,
          source: u.id,
          target: cfNode.id,
          type: 'sketchy',
          animated: true,
          data: { weight: 12, label: 'Global Edge' },
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
          data: { weight: 5, label: 'Direct Origin' },
          style: { stroke: '#F48120', strokeWidth: 3 }
        });
      });
      set({ mode, nodes: newNodes, edges: newEdges });
    } else {
      if (state.legacyBackup) {
        set({ mode, nodes: state.legacyBackup.nodes, edges: state.legacyBackup.edges, legacyBackup: null });
      } else {
        set({ mode, nodes: DEMO_LEGACY_GRAPH.nodes, edges: DEMO_LEGACY_GRAPH.edges });
      }
    }
    get().calculateMetrics();
  },
  setProjectTitle: (projectTitle) => set({ projectTitle }),
  toggleAnimation: () => set(s => ({ isAnimating: !s.isAnimating })),
  setSelectedNodeId: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  setSelectedEdgeId: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),
  setHoveredNodeId: (id) => {
    if (get().hoveredNodeId === id) return;
    set({ hoveredNodeId: id });
    get().calculateMetrics();
  },
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
      data: { weight: 15, label: '' }
    };
    set({ edges: addEdge(edge, get().edges) });
    get().calculateMetrics();
  },
  updateNodeData: (id, data) => {
    set({
      nodes: get().nodes.map(n => n.id === id ? { ...n, data: { ...n.data, ...data } } : n)
    });
    get().calculateMetrics();
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
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
      hoveredNodeId: get().hoveredNodeId === id ? null : get().hoveredNodeId
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
      console.error("[FETCH PROJECTS FAILED]", err);
      set({ projects: [] });
    }
  },
  saveProject: async () => {
    const { projectId, projectTitle, nodes, edges, latency, hops, mode } = get();
    set({ isLoading: true });
    try {
      const result = await api<Project>('/api/projects', {
        method: 'POST',
        body: JSON.stringify({
          id: projectId,
          title: projectTitle,
          nodes,
          edges,
          metadata: { latency, hops, mode, updatedAt: Date.now() }
        })
      });
      set({ projectId: result.id, isLoading: false });
      await get().fetchProjects();
    } catch (err) {
      console.error("[SAVE PROJECT FAILED]", err);
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
        latency: project.metadata?.latency || 0,
        hops: project.metadata?.hops || 0,
        mode: project.metadata?.mode || 'legacy',
        isLoading: false,
        legacyBackup: null
      });
      get().calculateMetrics();
    } catch (err) {
      console.error("[LOAD PROJECT FAILED]", err);
      set({ isLoading: false });
      throw err;
    }
  },
  deleteProject: async (id: string) => {
    try {
      await api(`/api/projects/${id}`, { method: 'DELETE' });
      set({ projects: get().projects.filter(p => p.id !== id) });
    } catch (err) {
      console.error("[DELETE PROJECT FAILED]", err);
    }
  },
  createNewProject: () => {
    set({
      projectId: null,
      projectTitle: "New Connectivity Canvas",
      mode: 'legacy',
      nodes: DEMO_LEGACY_GRAPH.nodes,
      edges: DEMO_LEGACY_GRAPH.edges,
      edgeAnimations: {},
      legacyBackup: null,
      selectedNodeId: null,
      selectedEdgeId: null,
      hoveredNodeId: null,
      latency: 240,
      hops: 4,
      latencyDelta: 0,
      hopsDelta: 0,
      activePathNodeIds: [],
      activePathEdgeIds: [],
      isAnimating: true
    });
    get().calculateMetrics();
  }
}));