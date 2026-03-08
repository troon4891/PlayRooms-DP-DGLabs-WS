# SAFETY.md — DG-LAB Coyote WebSocket Provider

> ⚠️ **This provider controls electrical stimulation hardware.** Read this document completely before using or modifying this software. E-stim is not a toy — it can cause burns, muscle injury, or cardiac events if misused.

---

## What This Device Does

The DG-LAB Coyote is an electrical stimulation (e-stim) device. It delivers low-voltage electrical current through electrode pads placed on the skin. This current stimulates muscles and nerves, producing sensations ranging from mild tingling to intense muscle contractions depending on intensity and placement.

This provider controls the Coyote via WebSocket through the DG-LAB mobile app. The app connects to the Coyote via Bluetooth and acts as a relay bridge. Commands flow: PlayRooms → WebSocket → DG-LAB App → BLE → Coyote.

---

## Electrical Stimulation Hazards

### Absolute Contraindications — Do Not Use If:

- You have a **pacemaker, cardiac defibrillator, or any electronic medical implant** — e-stim can interfere with or disable these devices, which may be life-threatening
- You are **pregnant** — electrical current through the body is contraindicated during pregnancy
- You have **epilepsy** or a known sensitivity to electrical stimulation
- You have a **heart condition** or have been advised to avoid physical exertion
- You have **poor circulation, deep vein thrombosis, or blood clotting disorders**
- You are under the influence of **alcohol, sedatives, or substances** that impair sensation or judgment

### Electrode Placement Rules

- **NEVER place electrodes above the waist** — current paths through the chest can interfere with cardiac function
- **NEVER place electrodes across the chest** — any path from left to right across the torso includes the heart
- **NEVER place electrodes near the head, neck, or spine**
- **NEVER use on broken skin, open wounds, irritated or inflamed skin, or skin with rashes**
- **NEVER use over metal implants** (pins, plates, joint replacements) in the electrode area
- Electrodes must have full, even contact with clean, dry skin — partial contact concentrates current and can cause burns
- Always remove electrodes before moving to a significantly different intensity — do not adjust placement while stimulation is active

### Intensity Guidance

Channels A and B are independent. Each ranges from 0 (off) to 200 (maximum output).

| Range | Description |
|-------|-------------|
| 0 | Off — no stimulation |
| 1–30 | Mild — suitable starting range for new users. Tingling or light sensation. |
| 30–80 | Moderate — comfortable working range for most users. Noticeable muscle response. |
| 80–120 | Strong — significant muscle contractions. Do not start here. Approach gradually. |
| 120–200 | Very strong to maximum — intense stimulation. Only for experienced users with well-placed electrodes and full consent. |

**Always start at zero and increase slowly.** Sensation depends heavily on electrode placement, contact quality, skin condition, and individual sensitivity — the same numerical value can feel very different on different days or in different locations.

---

## Emergency Stop Behavior

### What Happens When Emergency Stop Is Triggered

When `stopAll()` is called (emergency stop button pressed):

1. The provider sends intensity `0` to both Channel A and Channel B via the WebSocket relay
2. The provider sends `clear-A` and `clear-B` to flush the device's waveform queues
3. The device transitions to 0 output on both channels

**Expected result:** Stimulation stops within the WebSocket round-trip time — typically under 100ms on a local network.

### When Emergency Stop May Not Work

Emergency stop sends a network command. If the network path is broken, the command cannot reach the device.

**The emergency stop command will NOT reach the device if:**

- The WebSocket connection between PlayRooms and the relay server has dropped
- The DG-LAB app is not running or has been closed
- The phone running the DG-LAB app has lost its relay server connection
- The relay server itself is unreachable

**In these cases, the only reliable stop is physical:**

- Turn off the Coyote device using its physical power button
- Remove the electrode connections from the device
- Remove the electrodes from skin

### Hardware-Level Manual Override

> **The physical controls on the Coyote device must always be accessible during any session.**

The Coyote has physical scroll wheels that control output intensity, and a physical power button. These operate independently of all software. If software control fails for any reason, the user can:

1. Use the scroll wheels to manually reduce output to zero
2. Press the power button to cut all output immediately
3. Physically disconnect the electrode cables

**Session design requirement:** The person connected to the device must always be able to reach the power button or remove electrodes, or a trusted person within arm's reach must be able to do so. Software emergency stop is a convenience — physical access is the ultimate fallback.

---

## Connection Loss Behavior

This provider depends on a multi-hop connection chain. Each hop can fail independently.

### Scenario 1: PlayRooms loses WebSocket connection to relay

**What happens:** PlayRooms can no longer send commands. The DG-LAB app continues driving the Coyote at the last commanded intensity and waveform.

**How long does it continue?** Until one of:
- The DG-LAB app's internal timeout fires (approximately 10 seconds after relay connection loss)
- The user physically intervenes (power button, electrode removal)
- The relay reconnects and a stop command is sent

**Safe design implication:** If a session is running and the provider loses connection, the device will run at the last intensity for up to 10 seconds before the app's own timeout cuts it. This is a documented limitation of the WebSocket transport.

### Scenario 2: DG-LAB app loses BLE connection to Coyote

**What happens:** The Coyote stops immediately. Bluetooth disconnect = device stops.

This is the safest failure mode — if the BLE link breaks, the Coyote goes to zero output.

### Scenario 3: Phone running DG-LAB app is backgrounded or screen locks

**What happens:** Varies by phone OS and app version.

- **Android:** The DG-LAB app may keep its WebSocket connection alive briefly, but aggressive battery optimization can terminate background apps. Behavior is not guaranteed.
- **iOS:** Background WebSocket connections are typically suspended by the OS after a short period. The relay may appear connected (the socket is not immediately closed) but commands stop being processed.

**Recommendation:** The phone running the DG-LAB app should not be locked or put to sleep during active sessions. Consider disabling screen timeout on the device used as the BLE bridge.

### Scenario 4: Relay server becomes unreachable

**What happens:** Both the PlayRooms connection and the DG-LAB app connection to the relay are severed. The DG-LAB app's own timeout (~10 seconds) will fire and stop the device.

---

## AI Interaction Safety

This provider ships with `aiInteraction.allowed: true, defaultEnabled: false`.

- AI control of e-stim is **disabled by default** and requires explicit opt-in by the host
- When enabled, the AI intensity cap defaults to **50% of the human guest's configured maximum** — not 50% of device maximum
- AI control must not bypass intensity clamping — the clamp applies before transmission regardless of command source
- If the AI interaction feature is enabled, the host is solely responsible for ensuring appropriate use

---

## Waveform Safety

Waveform patterns are sent as raw pulse data: 4 samples per 100ms, each sample defining frequency (0–1000 Hz) and intensity (0–100, relative to current channel output level).

- Malformed waveform data could produce unexpected sensations — the device applies the waveform as given
- Waveform intensity is **multiplicative** with channel output level — a high waveform intensity sample at a high channel output level produces maximum stimulation for that sample
- The preset waveform patterns shipped with this provider are designed to be smooth and gradual. Avoid constructing raw waveforms that jump between extremes rapidly.

---

## Summary of Safety Rules (Quick Reference)

1. No electrodes above the waist
2. No use with pacemakers or cardiac devices
3. No use during pregnancy
4. Start at zero, increase gradually
5. Physical device controls must always be reachable
6. Software emergency stop is best-effort — physical power-off is the guaranteed fallback
7. If the relay connection drops, expect up to 10 seconds of continued output before the app's timeout fires
8. Keep the DG-LAB app in the foreground on the bridge phone during active sessions
9. Do not use on broken or irritated skin
10. One trusted person must always be able to stop the device physically

---

*This document must be updated whenever stop behavior, intensity handling, or connection lifecycle changes. See CLAUDE.md — Documentation Maintenance.*
