import React, { useMemo, memo } from 'react';
import { BaseEdge, EdgeProps, getBezierPath, EdgeLabelRenderer } from '@xyflow/react';
import { motion } from 'framer-motion';
import { useEditorStore } from '@/store/editor-store';
import { useShallow } from 'zustand/react/shallow';
export const SketchyEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const mode = useEditorStore(s => s.mode);
  const simulationSpeed = useEditorStore(s => s.simulationSpeed);
  const selectedEdgeId = useEditorStore(s => s.selectedEdgeId);
  const hoveredPathEdgeIds = useEditorStore(useShallow(s => s.hoveredPathEdgeIds));
  const isSelected = selectedEdgeId === id;
  const isInPath = hoveredPathEdgeIds.includes(id);
  const weight = Number(data?.weight) || 1;
  const label = data?.label as string;
  const duration = useMemo(() => {
    const base = mode === 'legacy' ? (2 + weight) : 0.8;
    return base / Math.max(0.1, simulationSpeed);
  }, [mode, simulationSpeed, weight]);
  const strokeWidth = mode === 'future' ? 3 : (1 + weight);
  const isHighlighted = isSelected || isInPath;
  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: isHighlighted ? strokeWidth + 2 : strokeWidth,
          stroke: isHighlighted ? '#F38020' : (mode === 'future' ? '#F38020' : '#2D2D2D'),
          opacity: isHighlighted ? 1 : (mode === 'future' ? 0.8 : 0.6),
        }}
        className="wobbly-line transition-all duration-300"
      />
      <EdgeLabelRenderer>
        {(label || weight > 1) && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'none',
            }}
            className="px-2 py-1 bg-white/80 border border-border rounded text-[10px] font-bold shadow-sm backdrop-blur-sm z-10"
          >
            {label && <span className="block">{label}</span>}
            <span className="text-muted-foreground uppercase">{weight * 15}ms</span>
          </div>
        )}
      </EdgeLabelRenderer>
      <motion.circle
        key={`packet-${id}-${edgePath}`}
        r={isHighlighted ? "5" : (mode === 'future' ? "4" : String(2 + (weight / 2)))}
        fill={isHighlighted ? '#F38020' : (mode === 'future' ? '#F38020' : '#2D2D2D')}
        className={isHighlighted ? "packet-glow animate-pulse" : "packet-glow"}
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: "100%" }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          offsetPath: `path('${edgePath}')`,
          offsetRotate: "auto",
        }}
      />
    </>
  );
});
SketchyEdge.displayName = 'SketchyEdge';