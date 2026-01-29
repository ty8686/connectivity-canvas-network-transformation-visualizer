import React, { useMemo } from 'react';
import { BaseEdge, EdgeProps, getBezierPath } from '@xyflow/react';
import { motion } from 'framer-motion';
import { useEditorStore } from '@/store/editor-store';
export const SketchyEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const mode = useEditorStore(s => s.mode);
  const simulationSpeed = useEditorStore(s => s.simulationSpeed);
  const duration = useMemo(() => {
    const base = mode === 'legacy' ? 5 : 0.8;
    return base / Math.max(0.1, simulationSpeed);
  }, [mode, simulationSpeed]);
  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: mode === 'future' ? 3 : 2,
          stroke: mode === 'future' ? '#F38020' : '#2D2D2D',
          opacity: mode === 'future' ? 1 : 0.6,
        }}
        className="wobbly-line"
      />
      <motion.circle
        r={mode === 'future' ? "4" : "3"}
        fill={mode === 'future' ? '#F38020' : '#2D2D2D'}
        className="packet-glow"
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
};