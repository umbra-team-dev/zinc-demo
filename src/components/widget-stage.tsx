"use client";

import dynamic from "next/dynamic";

// The Umbra widget touches browser-only APIs (Web Worker, WebCrypto,
// IndexedDB) at import time — everything below this boundary is client-only.
const ZincTerminal = dynamic(() => import("./zinc-terminal"), {
  ssr: false,
  loading: () => <StageSkeleton />,
});

export default function WidgetStage() {
  return <ZincTerminal />;
}

function StageSkeleton() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#070708]">
      <p className="animate-pulse font-mono text-[11px] uppercase tracking-[0.35em] text-[#5b5f66]">
        Initialising Umbra Protocol…
      </p>
    </div>
  );
}
