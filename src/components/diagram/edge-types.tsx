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
  data
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
  // Speed logic: legacy is slow, future is fast. Adjusted by global speed multiplier.
  const duration = useMemo(() => {
    const base = mode === 'legacy' ? 4 : 0.8;
    return base / simulationSpeed;
  }, [mode, simulationSpeed]);
  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: 2,
          stroke: style.stroke || '#2D2D2D',
        }}
        className="wobbly-line"
      />
      <motion.circle
        r="4"
        fill={mode === 'future' ? '#F48120' : '#2D2D2D'}
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