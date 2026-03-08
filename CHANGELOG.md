# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] — 2026-03-08 — Milestone 1: Project Scaffold

### Added

- `src/index.ts` — Placeholder module with provider identity constants (`PROVIDER_NAME`, `PROVIDER_VERSION`, `PROVIDER_API_VERSION`) and TODO map for Milestone 5 implementation
- `manifest.yaml` — Provider manifest with identity, network requirement, WebSocket URL and log level settings, AI interaction policy (allowed, defaultEnabled: false), and e-stim risk flags
- `SAFETY.md` — Comprehensive e-stim safety documentation covering: absolute contraindications, electrode placement rules, intensity ranges and physical meaning, emergency stop behavior and network-failure scenarios, connection loss behavior per failure scenario, AI interaction safety, waveform safety, and quick reference checklist
- `CONTROLS.md` — Full panel controls reference: dual-channel intensity ramp sliders (0–200), waveform pattern pickers with preset descriptions, channel link/unlink toggle, emergency stop behavior, and read-only status indicators (battery, active state, device dial)
- `README.md` — Project overview with connection chain diagram, prerequisites, setup guide (configure → start app → QR code pairing → verify), controls summary, safety summary, AI interaction policy, and architecture notes
- `package.json` — TypeScript project configuration with `ws` WebSocket dependency
- `tsconfig.json` — TypeScript compiler configuration targeting ES2020 with strict mode
- `CLAUDE.md` — Added Git Workflow section documenting the `claude/*` branch model and PR flow
- `qa/v1.0.0-dglab-ws-scaffold.md` — QA checklist for Milestone 1 scaffold

### Notes

- No functional code in this milestone — `src/index.ts` is a stub. Full ProviderInterface implementation is Milestone 5.
- `NOTICE.md` third-party section updated to reflect `ws` dependency added via `package.json`.

---

*Previous entries:*

## [0.0.1] — 2026-03-07 — Initial project structure

### Added

- `CLAUDE.md` — Coder operating manual
- `LICENSE` — Apache 2.0
- `SECURITY.md` — Security policy with e-stim safety-critical notice
- `NOTICE.md` — Third-party attribution file (no dependencies yet)
- `CHANGELOG.md` — This file
