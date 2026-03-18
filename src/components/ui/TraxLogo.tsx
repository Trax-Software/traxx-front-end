export function TraxLogo({
  color = "#FD8F06",
  size = "md",
  variant = "stacked",
}: {
  color?: string;
  size?: "sm" | "md" | "lg";
  variant?: "stacked" | "horizontal";
}) {
  const scale = size === "sm" ? 0.55 : size === "lg" ? 1.1 : 0.75;

  if (variant === "horizontal") {
    return (
      <svg
        width={280 * scale}
        height={80 * scale}
        viewBox="0 0 280 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="TRAX Soluções de Marketing"
      >
        {/* Dots — horizontal variant (left side, diagonal) */}
        <circle cx="8"  cy="40" r="7" fill={color} />
        <circle cx="8"  cy="22" r="5" fill={color} />
        <circle cx="22" cy="32" r="5" fill={color} />
        <circle cx="8"  cy="58" r="4" fill={color} />
        <circle cx="22" cy="48" r="4" fill={color} />

        {/* TRA — solid */}
        <text
          x="40"
          y="62"
          fontFamily="'Arial Black', 'Arial', sans-serif"
          fontSize="56"
          fontWeight="900"
          fill={color}
          letterSpacing="-1"
        >TRA</text>

        {/* X — outlined only */}
        <text
          x="157"
          y="62"
          fontFamily="'Arial Black', 'Arial', sans-serif"
          fontSize="56"
          fontWeight="900"
          fill="none"
          stroke={color}
          strokeWidth="3"
          letterSpacing="-1"
        >X</text>

        {/* Soluções de Marketing */}
        <text
          x="210"
          y="44"
          fontFamily="'Arial', sans-serif"
          fontSize="13"
          fill={color}
        >Soluções</text>
        <text
          x="210"
          y="60"
          fontFamily="'Arial', sans-serif"
          fontSize="13"
          fill={color}
        >de Marketing</text>
      </svg>
    );
  }

  // Vertical (stacked) variant
  return (
    <svg
      width={200 * scale}
      height={180 * scale}
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="TRAX Soluções de Marketing"
    >
      {/* Dots — top center, diagonal pattern */}
      <circle cx="80"  cy="12" r="12" fill={color} />
      <circle cx="108" cy="12" r="12" fill={color} />
      <circle cx="64"  cy="36" r="8"  fill={color} />
      <circle cx="94"  cy="36" r="8"  fill={color} />
      <circle cx="124" cy="36" r="8"  fill={color} />

      {/* TRA — solid */}
      <text
        x="4"
        y="130"
        fontFamily="'Arial Black', 'Arial', sans-serif"
        fontSize="76"
        fontWeight="900"
        fill={color}
        letterSpacing="-2"
      >TRA</text>

      {/* X — outlined */}
      <text
        x="130"
        y="130"
        fontFamily="'Arial Black', 'Arial', sans-serif"
        fontSize="76"
        fontWeight="900"
        fill="none"
        stroke={color}
        strokeWidth="4"
      >X</text>

      {/* Soluções de Marketing */}
      <text
        x="4"
        y="160"
        fontFamily="'Arial', sans-serif"
        fontSize="18"
        fontWeight="400"
        fill={color}
      >Soluções de Marketing</text>
    </svg>
  );
}
