"use client";

import "@/lib/polyfills";
// Widget styles are imported in globals.css inside layer(components) so the
// widget's unscoped preflight can't override page utilities.

import { useMemo } from "react";
import {
  useWalletAccountMessageSigner,
  useWalletAccountTransactionSendingSigner,
  useWalletAccountTransactionSigner,
} from "@solana/react";
import type { UiWalletAccount } from "@wallet-standard/react";
import { UmbraWidgetInline, type WidgetSigner } from "@umbra-privacy/widget";

import { CHAIN, NETWORK, RPC_URL, ZINC_UI } from "@/lib/zinc";

/**
 * Adapts a connected Wallet Standard account into a `WidgetSigner`
 * (the widget needs sign-and-return, not sign-and-send — see the
 * widget README "Signer" section) and mounts the inline widget.
 */
export default function UmbraVault({ account }: { account: UiWalletAccount }) {
  const signTx = useWalletAccountTransactionSigner(account, CHAIN);
  const sending = useWalletAccountTransactionSendingSigner(account, CHAIN);
  const msg = useWalletAccountMessageSigner(account);

  const signer = useMemo<WidgetSigner>(
    () => ({
      address: signTx.address,
      modifyAndSignTransactions: signTx.modifyAndSignTransactions,
      signAndSendTransactions: sending.signAndSendTransactions, // optional fast path
      signMessages: async (messages) => {
        const signed = await msg.modifyAndSignMessages(messages);
        return signed.map((m) => m.signatures);
      },
    }),
    [signTx, sending, msg],
  );

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
