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
  const isAnimating = useEditorStore(s => s.isAnimating);
  const selectedEdgeId = useEditorStore(s => s.selectedEdgeId);
  const activePathEdgeIds = useEditorStore(useShallow(s => s.activePathEdgeIds));
  const isSelected = selectedEdgeId === id;
  const isActivePath = activePathEdgeIds.includes(id);
  const weight = Number(data?.weight) || 15;
  const label = data?.label as string;
  // Arrow duration based on latency weight and distance
  // Higher latency = Slower animation
  const duration = useMemo(() => {
    return Math.max(1, weight / 10);
  }, [weight]);
  const strokeWidth = mode === 'future' ? 3 : 2;
  const isHighlighted = isSelected || isActivePath;
  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: isHighlighted ? strokeWidth + 2 : strokeWidth,
          stroke: isHighlighted ? '#F38020' : (mode === 'future' ? '#F38020' : '#2D2D2D'),
          opacity: isHighlighted ? 1 : 0.4,
        }}
        className="wobbly-line transition-all duration-300"
      />
      <EdgeLabelRenderer>
        {(label || weight > 0) && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'none',
            }}
            className="px-2 py-1 bg-white/90 border-2 border-[#2D2D2D] rounded text-[9px] font-black shadow-sm backdrop-blur-sm z-10 uppercase italic"
          >
            {label && <span className="block border-b border-[#2D2D2D]/20 mb-0.5">{label}</span>}
            <span className="text-[#F38020]">{weight}ms</span>
          </div>
        )}
      </EdgeLabelRenderer>
      {isAnimating && isActivePath && (
        <motion.g
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
        >
          {/* Thick Path-based Arrow Head */}
          <path
            d="M -8 -6 L 8 0 L -8 6 Z"
            fill="#F38020"
            className="packet-glow"
          />
        </motion.g>
      )}
    </>
  );
});
SketchyEdge.displayName = 'SketchyEdge';