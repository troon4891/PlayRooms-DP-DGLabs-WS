# PlayRooms-DP-DGLabs-WS

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

**PlayRooms Device Provider — DG-LAB Coyote (WebSocket)**

Controls [DG-LAB Coyote](https://www.dungeon-lab.com/) e-stim devices via WebSocket through the DG-LAB mobile app.

---

> ⚠️ **SAFETY WARNING — ELECTRICAL STIMULATION HARDWARE**
>
> This plugin controls a device that delivers electrical current to the body. Improper use can cause burns, muscle injury, or cardiac events. **Read [SAFETY.md](SAFETY.md) completely before using this plugin.**
>
> Do not use if you have a pacemaker or other electronic cardiac implant. Do not use during pregnancy. Never place electrodes above the waist.

---

## What This Provider Does

This provider connects PlayRooms to DG-LAB Coyote e-stim devices using the **WebSocket transport** — the easiest setup option. The DG-LAB mobile app handles the Bluetooth connection to the Coyote; this provider talks to the app via a WebSocket relay server.

**Connection chain:**

```
PlayRooms  ──WebSocket──►  DG-LAB Relay Server  ──WebSocket──►  DG-LAB App  ──BLE──►  Coyote
```

This means:
- **No Bluetooth hardware required on the PlayRooms host** — the app handles BLE
- The phone running the DG-LAB app must stay running and connected
- Latency is higher than direct BLE (two WebSocket hops vs. one BLE hop)
- If the relay server or the app becomes unreachable, the device will continue its last output for up to ~10 seconds before the app's internal timeout stops it

If you need lower latency or don't want to run the DG-LAB app, see the sister provider: [PlayRooms-DP-DGLabs-BLE](https://github.com/troon4891/PlayRooms-DP-DGLabs-BLE).

---

## Prerequisites

- **DG-LAB mobile app** installed on a phone and running in the foreground
  - [Android](https://play.google.com/store/apps/details?id=com.dungeon_lab.coyote) / [iOS](https://apps.apple.com/app/dungeon-lab/id1596973710)
- **DG-LAB Coyote** device paired to the app via Bluetooth
- **DG-LAB WebSocket relay server** — either:
  - The public relay server (URL provided in the DG-LAB app — check the app's WebSocket settings)
  - A self-hosted relay server (see the [DG-LAB open source repository](https://github.com/DG-LAB-OPENSOURCE/DG-LAB-OPENSOURCE))
- The PlayRooms host must be able to reach the relay server URL

---

## Setup

### 1. Configure the Provider

In the PlayRooms admin UI, add the **DG-LAB Coyote (WebSocket)** provider and configure:

| Setting | Description |
|---------|-------------|
| **WebSocket Server URL** | The relay server WebSocket URL — e.g., `ws://192.168.1.100:4567` |
| **Log Level** | Verbosity for provider logs (default: `info`) |

### 2. Start the DG-LAB App

Open the DG-LAB app on your phone. Ensure:
- The Coyote device is powered on and paired in the app
- The app shows the Coyote as connected

### 3. Pair via QR Code

When the provider connects to the relay server, it generates a `clientId`. The DG-LAB app scans a QR code containing this ID to bind to the provider session.

In the PlayRooms panel:
1. Click **Connect** on the DG-LAB Coyote provider
2. A QR code will appear
3. Open the DG-LAB app and use the app's QR scan feature to scan the code
4. The panel status will update to "Connected" once the app binds

### 4. Verify Before Use

After connecting:
- Check the battery indicator — ensure the Coyote has sufficient charge
- Set both channels to a low intensity (5–10) and verify the device responds
- Test the **Emergency Stop** button — both channels should go to 0 immediately
- Increase intensity only after confirming everything works as expected

---

## Controls

See [CONTROLS.md](CONTROLS.md) for the full panel reference.

**At a glance:**
- **Channel A & B intensity** — independent ramp sliders, 0–200 each
- **Channel A & B waveform** — pattern pickers with preset waveforms (Breath, Pulse, Climb, etc.)
- **Channel link** — optionally mirror both channels together
- **Emergency stop** — zeros both channels and clears waveform queues
- **Status indicators** — battery, channel active state, physical dial position (read-only)

---

## Safety

**Read [SAFETY.md](SAFETY.md).** Key points:

- Never place electrodes above the waist
- Never use with a pacemaker or cardiac device
- Start at zero and increase slowly — never jump to high values
- Keep the physical power button reachable at all times
- Software emergency stop is best-effort over the network — physical power-off is the guaranteed fallback
- If the relay connection drops, the device may continue output for up to ~10 seconds

---

## AI Interaction

This provider ships with AI control **disabled by default**. To allow an AI participant to control this provider, the host must explicitly enable AI interaction in the PlayRooms room settings.

When enabled:
- The AI intensity cap defaults to 50% of the human guest's configured maximum
- The cap is enforced at the protocol level — the AI cannot command values above it

---

## Architecture Notes

This provider implements the PlayRooms `ProviderInterface` contract. It speaks JSON over WebSocket using the [DG-LAB open-source protocol](https://github.com/DG-LAB-OPENSOURCE/DG-LAB-OPENSOURCE/tree/main/socket).

Key protocol details:
- Client connects to relay server → receives `clientId`
- DG-LAB app scans QR code containing `clientId` → device binds
- Commands: `strength-N` (intensity), `pulse-N` (waveform), `clear-N` (flush queue)
- Feedback: `feedback-N` (physical scroll wheel position, read-only)

---

## License

Apache 2.0 — see [LICENSE](LICENSE).

This project uses third-party libraries documented in [NOTICE.md](NOTICE.md).
