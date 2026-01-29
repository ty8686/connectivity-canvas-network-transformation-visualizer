import React, { useMemo } from 'react';
import { ReactFlow, Background, Controls, NodeTypes, EdgeTypes } from '@xyflow/react';
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
  return (
    <div className="w-full h-full bg-white dot-grid">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        snapToGrid
        snapGrid={[20, 20]}
      >
        <Background color="#ccc" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}