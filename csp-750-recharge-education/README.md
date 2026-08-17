# ₹750 claim — installation-flow education

Spec for the education screen that reminds an opted-in CSP that this connection needs a
**3-month (90-day) ISP recharge** before he can claim **₹750**.

Open [`index.html`](./index.html) — or the [hosted page](https://saadbeg-pixel.github.io/prototype-wiom-csp/csp-750-recharge-education/).

## Context

Under Project Dominance the CSP opts into a payout structure where the install bonus is paid
only if he recharges the connection on his own ISP portal for a configured duration. Wiom has
no access to that portal, so the proof is a photo he submits from the app.

The screen sits immediately before **Create ISP Account** in the installation flow, because
choosing "खुद से, पोर्टल पर" opens the ISP portal straight away — anything shown after that
is too late to change what he recharges.

## Decisions captured in the spec

- Replaces the current brief, which says **30 दिन** — the exact duration that fails the claim
  for an opted-in CSP.
- Amount, duration and deadline date are **backend-configured**, never hard-coded, so policy
  changes don't wait on an app release.
- Duration is sent once as days; the app derives "3 महीने". The deadline is a server-computed
  date, not a duration the app calculates.
- Missing config fails closed — show the non-opted-in brief rather than a default number.

## Status

Draft for review. Open items are listed at the end of the spec.
