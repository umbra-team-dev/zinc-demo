"use client";

import "@/lib/polyfills";

import { useEffect, useState } from "react";
import { generateKeyPairSigner, type KeyPairSigner } from "@solana/kit";
import { UmbraWidgetInline } from "@umbra-privacy/widget";

import { NETWORK, RPC_URL, ZINC_UI } from "@/lib/zinc";

/**
 * Dev/preview mount (`?demo=1`): drives the widget with an ephemeral
 * KeyPairSigner — a KeyPairSigner already satisfies WidgetSigner — so the
 * widget can be exercised without a browser wallet. Keys are random and
 * discarded on reload; do not fund them.
 */
export default function DemoVault() {
  const [signer, setSigner] = useState<KeyPairSigner | null>(null);

  useEffect(() => {
    generateKeyPairSigner().then(setSigner);
  }, []);

  if (!signer) {
    return (
      <div className="grid h-64 w-full place-items-center rounded-xl border border-line bg-surface">
        <p className="animate-pulse font-mono text-[10px] uppercase tracking-[0.3em] text-faint">
          Generating demo keys…
        </p>
      </div>
    );
  }

  return (
    <UmbraWidgetInline
      signer={signer}
      rpcUrl={RPC_URL}
      network={NETWORK}
      ui={ZINC_UI}
      className="w-full"
    />
  );
}
