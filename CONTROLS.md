# CONTROLS.md — DG-LAB Coyote Panel Controls

This document describes the controls exposed by the DG-LAB WebSocket provider in the PlayRooms panel. All DG-LAB Coyote devices have identical hardware capabilities, so this provider uses a **static panel schema** — the same controls appear for every connected device.

---

## Panel Overview

The Coyote panel has two independent channels (A and B), each with an intensity slider and a waveform pattern picker. The channels can be controlled independently or linked to mirror each other. An emergency stop button is always visible and always active.

```
┌─────────────────────────────────────────────┐
│  DG-LAB Coyote (WebSocket)         ● Connected │
│  Battery: ████░░  75%                          │
├─────────────────────────────────────────────┤
│  Channel A                    [Active ●]        │
│  Intensity  [══════════░░░░░░░░░]  85 / 200     │
│  Waveform   [Breath         ▾]                  │
│  Device dial: 85 (read-only)                    │
├─────────────────────────────────────────────┤
│  [🔗 Link channels]                             │
├─────────────────────────────────────────────┤
│  Channel B                    [Inactive ○]      │
│  Intensity  [══░░░░░░░░░░░░░░░]  20 / 200       │
│  Waveform   [Pulse          ▾]                  │
│  Device dial: 20 (read-only)                    │
├─────────────────────────────────────────────┤
│  [■ EMERGENCY STOP]                             │
└─────────────────────────────────────────────┘
```

---

## Controls Reference

### Channel A — Intensity

| Property | Value |
|----------|-------|
| Control type | `rampSlider` |
| Range | 0–200 |
| Default | 0 |
| Guest ramp | Mandatory — value changes over configured ramp duration |
| Host ramp | Optional — host can bypass ramp for immediate changes |
| Protocol command | `strength-A` |

Sets the output intensity for Channel A. The value maps directly to the `strength-A` WebSocket command sent to the DG-LAB app.

**Physical meaning:** 0 = off, 200 = maximum output. Sensation is highly dependent on electrode placement, skin condition, and individual sensitivity. See SAFETY.md for intensity guidance.

The `rampSlider` type ensures intensity changes are gradual rather than instantaneous — jumping from 0 to 150 immediately would be unsafe and unpleasant. Guests always have ramping enforced. Hosts may choose to bypass ramping if needed.

---

### Channel A — Waveform

| Property | Value |
|----------|-------|
| Control type | `patternPicker` |
| Protocol command | `pulse-A` (pattern data), `clear-A` (clear queue) |

Selects the waveform pattern sent to Channel A. Waveforms define the pulse shape — frequency and relative intensity of each pulse — which shapes the character of the sensation (smooth, rhythmic, climbing, etc.).

**Preset patterns:**

| Pattern name | Character | Description |
|---|---|---|
| Breath | Smooth, rhythmic | Slow sine-like rise and fall. Gentle and relaxing. |
| Pulse | Sharp, rhythmic | Regular strong pulses with rest between. More pronounced than Breath. |
| Climb | Escalating | Gradually increasing intensity over a cycle, then resets. |
| Wave | Rolling | Medium-frequency variation with a rolling quality. |
| Sting | Sharp spikes | Quick, sharp pulses. Intense at higher intensities. |
| Throb | Low-frequency | Slow deep pulses with a throbbing quality. |

> Waveform data format: 4 samples per 100ms, each sample has a frequency component (0–1000 Hz) and an intensity component (0–100, relative to the current channel output level). The waveform intensity is multiplicative — a waveform sample at intensity 100 at channel output 200 produces full device output for that sample.

---

### Channel B — Intensity

| Property | Value |
|----------|-------|
| Control type | `rampSlider` |
| Range | 0–200 |
| Default | 0 |
| Guest ramp | Mandatory |
| Host ramp | Optional |
| Protocol command | `strength-B` |

Identical to Channel A intensity, but controls Channel B independently.

---

### Channel B — Waveform

| Property | Value |
|----------|-------|
| Control type | `patternPicker` |
| Protocol command | `pulse-B` (pattern data), `clear-B` (clear queue) |

Identical to Channel A waveform picker, but controls Channel B independently. Channels A and B can run different patterns simultaneously.

---

### Channel Link / Unlink Toggle

| Property | Value |
|----------|-------|
| Control type | Toggle (link group wrapper) |
| Default | Unlinked |

When **linked**, adjusting Channel A intensity or waveform mirrors the change to Channel B simultaneously. The link applies bidirectionally — changing either channel affects both.

When **unlinked** (default), Channels A and B are fully independent.

The link state is a UI convenience — it does not change protocol behavior. Linked channels send separate `strength-A` and `strength-B` commands with identical values.

---

### Emergency Stop

| Property | Value |
|----------|-------|
| Control type | `emergencyStop` button |
| Behavior | Zeros both channels + clears waveform queues |
| Always visible | Yes |
| Protocol commands | `strength-A:0`, `strength-B:0`, `clear-A`, `clear-B` |

The emergency stop button is always displayed and always active, regardless of connection state or other UI state.

When pressed:
1. Sends `strength-A` with value `0`
2. Sends `strength-B` with value `0`
3. Sends `clear-A` to flush the Channel A waveform queue
4. Sends `clear-B` to flush the Channel B waveform queue

See SAFETY.md for the full behavior specification, including network-failure scenarios where the software stop may not reach the device.

---

## Status Indicators

These are read-only displays. They cannot be adjusted through the panel.

### Battery Level

Displays the device's current battery level as reported by the DG-LAB app. Shown as a percentage and a visual bar.

### Channel A Active / Channel B Active

Indicates whether each channel is currently producing output (intensity > 0 and waveform queue active). Channels at intensity 0 show as inactive.

### Device Dial A (read-only)

Displays the current intensity reported by the Coyote's physical scroll wheel for Channel A. This is the `feedback-A` value from the DG-LAB protocol.

The physical scroll wheel on the device is independent of software control — the user can manually adjust it. The dial display reflects the actual device state, which may differ from the software-commanded value if the user has physically adjusted it.

**This value is read-only.** The panel displays it for awareness but cannot set it — physical scroll wheel position is hardware-only.

### Device Dial B (read-only)

Same as Device Dial A, but for Channel B.

---

## Intensity Ranges Summary

| Value | State |
|-------|-------|
| 0 | Off — no output |
| 1–30 | Mild |
| 31–80 | Moderate |
| 81–120 | Strong |
| 121–200 | Very strong to maximum |

See SAFETY.md for full safety guidance on intensity selection.

---

*This document must be updated when controls change, ranges change, or new waveform patterns are added.*
