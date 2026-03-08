# Security Policy — PlayRooms-DP-DGLabs-WS

## Safety-Critical Notice

**This provider controls electrical stimulation (e-stim) hardware.** Security vulnerabilities in this codebase may have **direct physical safety implications** — including uncontrolled electrical output, failure of emergency stop mechanisms, or intensity values exceeding safe limits.

Because of this, we treat security reports with the highest priority and urgency. A vulnerability here is not just a software defect — it is a potential physical safety hazard.

## Scope

This policy covers the `PlayRooms-DP-DGLabs-WS` provider, which controls DG-LAB Coyote e-stim devices via WebSocket through the DG-LAB mobile app.

Security-sensitive areas include, but are not limited to:

- **Emergency stop reliability** — the kill command must always reach the device
- **Intensity clamping** — values sent to the device must never exceed configured maximums
- **WebSocket message integrity** — malformed or injected messages could cause unsafe device behavior
- **AI interaction controls** — the AI intensity cap must be enforced and cannot be bypassed
- **Connection lifecycle** — device behavior during disconnection, reconnection, or relay failure must be safe by default (fail-safe, not fail-open)
- **Authentication and binding** — the client-to-device binding flow must not be spoofable

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 1.x     | Yes                |
| < 1.0   | No                 |

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.** Given the physical safety implications of this provider, we ask that you report vulnerabilities privately.

### How to Report

1. **Email:** Send a detailed report to the repository owner via GitHub private contact (use the "Security" tab on the repository if GitHub Security Advisories are enabled, or contact the owner directly).
2. **Include:**
   - Description of the vulnerability
   - Steps to reproduce
   - Potential physical safety impact (if applicable)
   - Suggested fix (if you have one)

### What to Expect

- **Acknowledgment** within 48 hours of your report
- **Assessment and triage** within 7 days, with priority given to any issue that could affect device safety
- **Fix and disclosure** — safety-critical fixes will be released as soon as possible, with coordinated disclosure

### Safety-Critical Fast Track

If your report involves any of the following, it will be treated as **critical priority**:

- Emergency stop can be bypassed or fails to fire
- Intensity values can exceed the configured maximum
- Device continues stimulation after connection loss (fail-open behavior)
- AI control can bypass the intensity cap
- WebSocket messages can be injected to send arbitrary commands to the device

## Responsible Disclosure

We follow responsible disclosure practices. We ask that you:

- Give us reasonable time to investigate and fix the issue before public disclosure
- Do not exploit the vulnerability against real users or devices
- Do not test against hardware you do not own

## Security Best Practices for Users

- Keep the DG-LAB mobile app updated to the latest version
- Use the provider only on trusted local networks — the WebSocket relay is not encrypted by default
- Set conservative intensity maximums in the provider configuration
- Always verify emergency stop functionality before each session
- If using AI interaction, keep the AI intensity cap well below your comfort threshold
