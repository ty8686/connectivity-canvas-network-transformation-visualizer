import React, { useCallback, useRef, useMemo } from 'react';
import { ReactFlow, Controls, NodeTypes, EdgeTypes, useReactFlow, DefaultEdgeOptions } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useEditorStore } from '@/store/editor-store';
import { SketchyNode } from './node-types';
import { SketchyEdge } from './edge-types';
import { useShallow } from 'zustand/react/shallow';
export function FlowCanvas() {
  const nodes = useEditorStore(useShallow(s => s.nodes));
  const edges = useEditorStore(useShallow(s => s.edges));
  const onNodesChange = useEditorStore(s => s.onNodesChange);
  const onEdgesChange = useEditorStore(s => s.onEdgesChange);
  const onConnect = useEditorStore(s => s.onConnect);
  const addNode = useEditorStore(s => s.addNode);
  const setSelectedNodeId = useEditorStore(s => s.setSelectedNodeId);
  const setSelectedEdgeId = useEditorStore(s => s.setSelectedEdgeId);
  const setHoveredNodeId = useEditorStore(s => s.setHoveredNodeId);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  /**
   * MEMOIZATION: We wrap configuration objects in useMemo to prevent 
   * React Flow from re-initializing and throwing runtime warnings.
   */
  const nodeTypes = useMemo<NodeTypes>(() => ({
    sketchy: SketchyNode,
  }), []);
  const edgeTypes = useMemo<EdgeTypes>(() => ({
    sketchy: SketchyEdge,
  }), []);
  const defaultEdgeOptions = useMemo<DefaultEdgeOptions>(() => ({
    type: 'sketchy',
    animated: true,
    data: { weight: 1, label: '' }
  }), []);
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const dataStr = event.dataTransfer.getData('application/reactflow');
      if (!dataStr) return;
      const { nodeType, iconType, label } = JSON.parse(dataStr);
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: `${iconType}-${Date.now()}`,
        type: nodeType,
        position,
        data: { label, iconType },
      };
      addNode(newNode);
    },
    [screenToFlowPosition, addNode]
  );
  const onNodeClick = useCallback((_: React.MouseEvent, node: any) => {
    setSelectedNodeId(node.id);
  }, [setSelectedNodeId]);
  const onEdgeClick = useCallback((_: React.MouseEvent, edge: any) => {
    setSelectedEdgeId(edge.id);
  }, [setSelectedEdgeId]);
  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, [setSelectedNodeId, setSelectedEdgeId]);
  const onNodeMouseEnter = useCallback((_: React.MouseEvent, node: any) => {
    setHoveredNodeId(node.id);
  }, [setHoveredNodeId]);
  const onNodeMouseLeave = useCallback(() => {
    setHoveredNodeId(null);
  }, [setHoveredNodeId]);
  return (
    <div className="w-full h-full bg-[#fdfdfd]" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        deleteKeyCode={['Backspace', 'Delete']}
        defaultEdgeOptions={defaultEdgeOptions}
        snapToGrid={false}
      >
        <Controls showInteractive={false} className="custom-controls" />
      </ReactFlow>
    </div>
  );
}