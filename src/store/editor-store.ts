import { create } from 'zustand';
import { Node, Edge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from '@xyflow/react';
import { DEMO_LEGACY_GRAPH, DEMO_FUTURE_GRAPH } from '@/lib/demo-data';
export type ViewMode = 'legacy' | 'future';
interface EditorState {
  mode: ViewMode;
  nodes: Node[];
  edges: Edge[];
  setMode: (mode: ViewMode) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
}
export const useEditorStore = create<EditorState>((set, get) => ({
  mode: 'legacy',
  nodes: DEMO_LEGACY_GRAPH.nodes,
  edges: DEMO_LEGACY_GRAPH.edges,
  setMode: (mode) => {
    const data = mode === 'legacy' ? DEMO_LEGACY_GRAPH : DEMO_FUTURE_GRAPH;
    set({ mode, nodes: data.nodes, edges: data.edges });
  },
  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },
  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },
}));