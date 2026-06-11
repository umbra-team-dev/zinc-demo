"use client";

import "@/lib/polyfills";

import { useState } from "react";
import {
  useConnect,
  useDisconnect,
  useWallets,
  type UiWallet,
  type UiWalletAccount,
} from "@wallet-standard/react";

import DemoVault from "./demo-vault";
import UmbraVault from "./umbra-vault";
import { NETWORK } from "@/lib/zinc";

type Session = { wallet: UiWallet; account: UiWalletAccount };

const short = (address: string) => `${address.slice(0, 4)}…${address.slice(-4)}`;

export default function ZincTerminal() {
  const [session, setSession] = useState<Session | null>(null);
  // ?demo=1 mounts the widget with an ephemeral keypair (no wallet needed).
  const demoMode = new URLSearchParams(window.location.search).has("demo");

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-bg text-ink">
      <Backdrop />

      <header className="rise relative z-10 flex items-center justify-between border-b border-line-soft px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-7 w-7 place-items-center rounded-[4px] bg-ember font-display text-sm font-bold text-black">
            Z
          </span>
          <span className="font-display text-base font-semibold uppercase tracking-[0.22em]">
            Zinc<span className="mx-1 text-ember">//</span>Umbra
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 rounded-[4px] border border-line bg-surface px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-muted sm:flex">
            <span className="blink inline-block h-1.5 w-1.5 rounded-full bg-ember" />
            {NETWORK}
          </span>
          {session ? (
            <DisconnectChip
              session={session}
              onDisconnect={() => setSession(null)}
            />
          ) : (
            <span className="rounded-[4px] border border-line bg-surface px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-faint">
              No wallet
            </span>
          )}
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div
            className="rise mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-muted"
            style={{ animationDelay: "90ms" }}
          >
            <span>
              Umbra <span className="text-ember">//</span> Private vault
            </span>
            <span className="flex items-center gap-2">
              <span className="blink inline-block h-1.5 w-1.5 rounded-full bg-mint" />
              ZK ready
            </span>
          </div>

          <div className="rise relative" style={{ animationDelay: "180ms" }}>
            <Brackets />
            <div className="p-2.5">
              {session ? (
                <UmbraVault account={session.account} />
              ) : demoMode ? (
                <DemoVault />
              ) : (
                <ConnectPanel onSession={setSession} />
              )}
            </div>
          </div>
        </div>
      </main>

      <footer
        className="rise relative z-10 flex items-center justify-between border-t border-line-soft px-5 py-4 font-mono text-[10px] uppercase tracking-[0.25em] text-faint sm:px-8"
        style={{ animationDelay: "260ms" }}
      >
        <span>Powered by Umbra</span>
        <span>ZK privacy · Solana {NETWORK}</span>
      </footer>
    </div>
  );
}

/* ── Chrome ──────────────────────────────────────────────────────── */

function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <div className="zinc-grid absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 42%, rgba(249,115,22,0.13), transparent 65%)",
        }}
      />
      <div className="zinc-noise absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.55))",
        }}
      />
    </div>
  );
}

function Brackets() {
  const base = "pointer-events-none absolute h-5 w-5 border-ember/80";
  return (
    <>
      <span className={`${base} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${base} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${base} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${base} bottom-0 right-0 border-b-2 border-r-2`} />
    </>
  );
}

function DisconnectChip({
  session,
  onDisconnect,
}: {
  session: Session;
  onDisconnect: () => void;
}) {
  const [isDisconnecting, disconnect] = useDisconnect(session.wallet);
  return (
    <button
      disabled={isDisconnecting}
      onClick={async () => {
        try {
          await disconnect();
        } catch {
          // Some wallets don't implement standard:disconnect — drop the session anyway.
        } finally {
          onDisconnect();
        }
      }}
      className="flex items-center gap-2 rounded-[4px] bg-ember px-3.5 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-ember-hot disabled:opacity-60"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- wallet icons are data: URIs */}
      <img src={session.wallet.icon} alt="" className="h-4 w-4 rounded-sm" />
      <span className="font-mono text-xs font-medium">
        {short(session.account.address)}
      </span>
      <span aria-hidden className="text-white/70">
        ✕
      </span>
    </button>
  );
}

/* ── Connect flow ────────────────────────────────────────────────── */

function ConnectPanel({ onSession }: { onSession: (s: Session) => void }) {
  const wallets = useWallets();
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const solanaWallets = wallets.filter(
    (w) =>
      w.chains.some((c) => c.startsWith("solana:")) &&
      w.features.includes("standard:connect"),
  );

  return (
    <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-faint">
        No miner connected
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold uppercase leading-none tracking-wide">
        Go private
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Shield, send and unshield tokens through the Umbra stealth pool —
        without leaving a trace on the public ledger.
      </p>

      <div className="mt-7">
        {!picking ? (
          <button
            onClick={() => setPicking(true)}
            className="w-full rounded-[6px] bg-ember px-4 py-3.5 font-display text-sm font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-ember-hot"
          >
            Connect a wallet to go private
          </button>
        ) : solanaWallets.length === 0 ? (
          <div className="rounded-[6px] border border-dashed border-line p-5 text-center font-mono text-xs leading-loose text-muted">
            NO SOLANA WALLET DETECTED
            <br />
            <a
              href="https://phantom.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ember underline-offset-4 hover:underline"
            >
              install Phantom →
            </a>
          </div>
        ) : (
          <div className="space-y-2">
            {solanaWallets.map((wallet) => (
              <WalletRow
                key={wallet.name}
                wallet={wallet}
                onSession={onSession}
                onError={setError}
              />
            ))}
          </div>
        )}
        {error ? (
          <p className="mt-3 font-mono text-xs text-[#f4524d]">{error}</p>
        ) : null}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3 border-t border-line pt-5 font-mono text-[10px] uppercase tracking-[0.2em]">
        <Stat label="Pool" value="Stealth UTXO" />
        <Stat label="Proofs" value="Groth16" />
        <Stat label="Claims" value="Relayer-paid" />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-faint">{label}</p>
      <p className="mt-1.5 text-[11px] text-ink">{value}</p>
    </div>
  );
}

function WalletRow({
  wallet,
  onSession,
  onError,
}: {
  wallet: UiWallet;
  onSession: (s: Session) => void;
  onError: (message: string | null) => void;
}) {
  const [isConnecting, connect] = useConnect(wallet);
  return (
    <button
      disabled={isConnecting}
      onClick={async () => {
        onError(null);
        try {
          const accounts = await connect();
          const account =
            accounts.find((a) => a.chains.some((c) => c.startsWith("solana:"))) ??
            accounts[0];
          if (!account) throw new Error("Wallet returned no accounts.");
          onSession({ wallet, account });
        } catch (e) {
          onError(e instanceof Error ? e.message : "Failed to connect wallet.");
        }
      }}
      className="group flex w-full items-center justify-between rounded-[6px] border border-line bg-surface-2 px-4 py-3 transition-colors hover:border-ember/60 disabled:opacity-50"
    >
      <span className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- wallet icons are data: URIs */}
        <img src={wallet.icon} alt="" className="h-5 w-5 rounded-sm" />
        <span className="font-display text-sm font-medium uppercase tracking-wide">
          {wallet.name}
        </span>
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-faint transition-colors group-hover:text-ember">
        {isConnecting ? "Connecting…" : "Connect →"}
      </span>
    </button>
  );
}
