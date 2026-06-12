import type { WidgetUiConfig } from "@umbra-privacy/widget";

export const RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL ?? "https://api.mainnet-beta.solana.com";

export const NETWORK: "mainnet" | "devnet" = RPC_URL.includes("devnet")
  ? "devnet"
  : "mainnet";

export const CHAIN: `solana:${string}` = `solana:${NETWORK}`;

/**
 * ZINC design language mapped onto the widget's scoped CSS variables:
 * near-black pit, molten-orange primary, steel surfaces, tight radii.
 */
export const ZINC_UI: WidgetUiConfig = {
  colors: {
    bg: "#0c0d10",
    surface: "#15161b",
    surfaceAlt: "#1b1c22",
    border: "#26272d",
    text: "#ededee",
    textSecondary: "#9b9fa6",
    textTertiary: "#686c74",
    primary: "#f97316",
    primaryFg: "#ffffff",
    danger: "#f4524d",
    success: "#2ebd85",
    tabActive: "#232429",
  },
  font: {
    primary: "var(--font-chakra), 'Chakra Petch', sans-serif",
    secondary: "var(--font-plex-mono), 'IBM Plex Mono', monospace",
  },
  // Tab row (0.1.2+): flat industrial segmented bar, not rounded pills —
  // recessed steel row, hairline borders, tight corners.
  tabs: {
    rowBg: "#0f1013",
    rowPadding: "3px",
    bg: "transparent",
    activeBg: "#232429",
    border: "#26272d",
    radius: "4px",
  },
  rounding: { sm: "4px", md: "8px", lg: "12px" },
};
