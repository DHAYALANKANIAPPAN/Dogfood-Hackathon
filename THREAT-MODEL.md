# Threat Model & Security Posture

As a self-hosted platform dealing with competitive hackathons and prize money, defending against abuse is paramount. This document outlines our threat model and the implemented mitigations.

## 1. Sybil Attacks & Ballot Stuffing
*   **Threat:** A single user creates hundreds of accounts or uses scripts to artificially inflate community votes (T3 Public Voting).
*   **Mitigation:** We implemented an **Offline IP-Based Rate Limiter** (`slowapi`). By tracking `get_remote_address` in memory, the system mathematically throttles rapid voting patterns. Because we don't rely on a Cloud WAF, this protection functions perfectly in the offline environment.

## 2. Submission Scraping (Data Theft)
*   **Threat:** A competitor scrapes the API to view other teams' `is_draft=True` submissions before the deadline.
*   **Mitigation:** Enforced via `RoleChecker`. The GET endpoint for submissions explicitly checks `current_user.team_id`. Unless the role is `JUDGE` or `ADMIN`, the API will return a 403 Forbidden for any submission belonging to a different team.

## 3. Judge Collusion & Bias
*   **Threat:** A judge intentionally gives incredibly low scores to competing teams, or disproportionately high scores to friends, skewing the absolute averages.
*   **Mitigation:** This is mitigated at the algorithmic layer. Instead of raw averages, the judging engine (written by BHAVA) applies cross-judge Z-Score Normalization. A heavily biased "harsh" score is mathematically normalized against the judge's baseline variance, neutralizing the attack.

## 4. Deadline Gaming
*   **Threat:** A participant manipulates their local client clock to bypass the submission deadline.
*   **Mitigation:** The FastAPI backend relies strictly on `datetime.now(timezone.utc)` retrieved from the Docker container's OS clock. The frontend timestamps are entirely ignored by the API for validation.

## 5. Webhook Spoofing
*   **Threat:** An attacker sends fake webhook payloads to internal microservices to trigger false states.
*   **Mitigation:** The internal webhooks carry HMAC-SHA256 signatures generated from the `JWT_SECRET_KEY`, allowing the receiver to cryptographically verify that the payload originated from the core platform.
