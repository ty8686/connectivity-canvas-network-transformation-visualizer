import React, { useCallback, useRef } from 'react';
import { ReactFlow, Background, Controls, NodeTypes, EdgeTypes, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useEditorStore } from '@/store/editor-store';
import { SketchyNode } from './node-types';
import { SketchyEdge } from './edge-types';
const nodeTypes: NodeTypes = {
  sketchy: SketchyNode,
};
const edgeTypes: EdgeTypes = {
  sketchy: SketchyEdge,
};
export function FlowCanvas() {
  const nodes = useEditorStore(s => s.nodes);
  const edges = useEditorStore(s => s.edges);
  const onNodesChange = useEditorStore(s => s.onNodesChange);
  const onEdgesChange = useEditorStore(s => s.onEdgesChange);
  const onConnect = useEditorStore(s => s.onConnect);
  const addNode = useEditorStore(s => s.addNode);
  const setSelectedNodeId = useEditorStore(s => s.setSelectedNodeId);
  const setSelectedEdgeId = useEditorStore(s => s.setSelectedEdgeId);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
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
  return (
    <div className="w-full h-full bg-[#fbfbfb] dot-grid" ref={reactFlowWrapper}>
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
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        snapToGrid
        snapGrid={[20, 20]}
        deleteKeyCode={['Backspace', 'Delete']}
        defaultEdgeOptions={{
          type: 'sketchy',
          animated: true,
          data: { weight: 1, label: '' }
        }}
      >
        <Background color="#eee" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}