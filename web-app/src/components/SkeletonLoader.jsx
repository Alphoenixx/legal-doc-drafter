/**
 * Skeleton loader with shimmer animation.
 * Usage: <SkeletonLoader width="100%" height="200px" borderRadius="12px" />
 */
export default function SkeletonLoader({
  width = '100%',
  height = '20px',
  borderRadius = 'var(--radius-sm)',
  className = '',
  style,
}) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
    />
  );
}
