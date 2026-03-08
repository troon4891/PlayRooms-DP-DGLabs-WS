/**
 * PlayRooms DG-LAB WebSocket Device Provider
 *
 * Controls DG-LAB Coyote e-stim devices via WebSocket through the DG-LAB mobile app.
 * The app acts as a Bluetooth bridge — it connects to the Coyote via BLE and exposes
 * control via a WebSocket relay server.
 *
 * ⚠️  SAFETY-CRITICAL: This provider controls electrical stimulation hardware.
 * Read SAFETY.md before modifying any code in this provider.
 *
 * Full ProviderInterface implementation happens in Milestone 5.
 */

export const PROVIDER_NAME = "dglab-ws";
export const PROVIDER_VERSION = "1.0.0";
export const PROVIDER_API_VERSION = 1;

// TODO: Implement ProviderInterface (Milestone 5)
// Key implementation tasks:
// - WebSocket connection to DG-LAB relay server
// - QR code pairing flow (generate clientId, user scans in DG-LAB app)
// - Channel intensity control (0-200 per channel, A and B independent)
// - Waveform pattern data (4 samples per 100ms)
// - Emergency stop (zero both channels + clear waveform queues)
// - Strength feedback from device physical controls (read-only)
