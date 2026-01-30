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
  // FORMULA: 1.0s base + (0.005 * weight)
  // 1ms -> 1.005s
  // 200ms -> 2.0s
  // 1000ms -> 6.0s
  const duration = useMemo(() => {
    return 1.0 + (0.005 * weight);
  }, [weight]);
  const strokeWidth = mode === 'future' ? 4 : 2;
  const isHighlighted = isSelected || isActivePath;
  const activeColor = mode === 'future' ? '#F38020' : '#2D2D2D';
  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: isHighlighted ? strokeWidth + 2 : strokeWidth,
          stroke: isHighlighted ? '#F38020' : activeColor,
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
              zIndex: 50
            }}
            className="px-2 py-1 bg-white border-2 border-[#2D2D2D] rounded text-[9px] font-black shadow-[2px_2px_0px_#2D2D2D] backdrop-blur-sm uppercase italic"
          >
            {label && <span className="block border-b border-[#2D2D2D]/10 mb-0.5">{label}</span>}
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
          {/* Robust Arrow Head Path with high-contrast outline */}
          <path
            d="M -10 -7 L 10 0 L -10 7 Z"
            fill="#F38020"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            className="packet-glow"
            style={{ filter: 'drop-shadow(0 0 8px rgba(243, 128, 32, 0.9))' }}
          />
        </motion.g>
      )}
    </>
  );
});
SketchyEdge.displayName = 'SketchyEdge';