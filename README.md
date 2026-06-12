# zinc-demo

Next.js app that mounts the [`@umbra-privacy/widget`](https://www.npmjs.com/package/@umbra-privacy/widget)
centered on screen, re-themed to the ZINC design language (near-black,
molten orange `#f97316`, Chakra Petch / IBM Plex Mono, tight radii, HUD
corner brackets).

## Run

```bash
npm install
npm run dev        # dev server on :3000
```

Set `NEXT_PUBLIC_RPC_URL` in `.env.local` — use a **Helius** endpoint
(`https://mainnet.helius-rpc.com/?api-key=...`): the widget resolves token
metadata via the Helius DAS API, and the public RPC 403s those calls.

- Connect a Wallet Standard wallet (Phantom, Solflare, …) to mount the widget.
- `http://localhost:3000/?demo=1` mounts it with an ephemeral keypair signer
  instead (no wallet needed; keys are discarded on reload).

## Structure

- [src/components/zinc-terminal.tsx](src/components/zinc-terminal.tsx) — page chrome + wallet connect (client-only via `dynamic ssr:false` in [widget-stage.tsx](src/components/widget-stage.tsx))
- [src/components/umbra-vault.tsx](src/components/umbra-vault.tsx) — Wallet Standard account → `WidgetSigner` adapter → `<UmbraWidgetInline>`
- [src/lib/zinc.ts](src/lib/zinc.ts) — ZINC theme mapped onto the widget `ui` prop
- [src/lib/polyfills.ts](src/lib/polyfills.ts) — Buffer/process/global shims (must evaluate before any `@umbra-privacy/*` import)

## Notes on `@umbra-privacy/widget` integration

- **`styles.css` ships an unscoped preflight** that resets the host page's
  buttons/inputs — imported via
  `@import "@umbra-privacy/widget/styles.css" layer(components)` in
  [globals.css](src/app/globals.css) so host utilities win.
- **`snarkjs`** is required at module scope by `@umbra-privacy/sdk`'s
  zk-prover chunk despite being an optional peer — installed explicitly.
- Widget **0.1.2+** spawns its ZK workers from inlined Blob URLs (no asset
  files to serve) and exposes the `ui.tabs` block used in
  [zinc.ts](src/lib/zinc.ts) for the flat ZINC-style tab bar.
