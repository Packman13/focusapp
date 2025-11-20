// Grayscale overlay component with adjustable strength

interface GrayscaleOverlayProps {
  strength: number; // 0 to 1
}

export function GrayscaleOverlay({ strength }: GrayscaleOverlayProps) {
  if (strength === 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50"
      style={{
        backgroundColor: `rgba(128, 128, 128, ${strength * 0.3})`,
        backdropFilter: `grayscale(${strength * 100}%)`,
        WebkitBackdropFilter: `grayscale(${strength * 100}%)`
      }}
      aria-hidden="true"
    />
  );
}
