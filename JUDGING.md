# Judging Engine Methodology

This document outlines the mathematical and architectural decisions behind the Dogfood 2026 Hackathon judging engine. Our goal was to build a system that is fair, load-balanced, and mathematically resilient to judge bias.

## 1. Judge Assignment Strategy
We utilize an **Algorithmic Round-Robin** assignment strategy.
*   **The Problem:** In many hackathons, some projects get 10 reviews while others get 1, skewing the results.
*   **Our Solution:** Our `assign_judges_to_submissions` algorithm guarantees that every finalized project receives exactly `N` (default 3) reviews. It pulls a list of available judges and assigns them randomly, ensuring no judge reviews the same project twice, creating a perfectly balanced workload.

## 2. Configurable Weighted Rubrics
*   **The Problem:** Different hackathon tracks require different grading focuses (e.g., a UI track cares about design, a backend track cares about technical complexity).
*   **Our Solution:** We store raw scores as a dynamic JSON object (`criteria_scores`). Our scoring algorithm multiplies these raw inputs against a configurable weights dictionary (e.g., Design=0.3, Technical=0.7) to generate a precise mathematical base score.

## 3. Score Normalization (Mitigating Bias)
*   **The Problem:** "Judge A" gives an average score of 3/10. "Judge B" gives an average score of 9/10. A project assigned to Judge A is unfairly penalized simply by luck of the draw.
*   **Our Solution:** We implement **Cross-Judge Z-Score Normalization**. 
    *   We calculate the Mean (μ) and Standard Deviation (σ) of every individual judge.
    *   We apply the Z-Score formula: `Z = (X - μ) / σ`.
    *   This converts all scores into a standardized relative performance metric. A 4/10 from a harsh judge becomes mathematically identical to a 10/10 from a lenient judge. We then map this back to a readable 0-100 scale. *(See `algorithms/normalization_proof.py` for mathematical proof).*

## 4. Pairwise Ranking System (+5 Bonus Challenge)
*   **The Problem:** Absolute rubric scoring is cognitively heavy for judges.
*   **Our Solution:** We implemented an alternative **Pairwise Mode** using an Elo rating system based on the Bradley-Terry logistic curve estimator.
    *   Judges are presented with two projects and simply choose a winner.
    *   The backend calculates the expected probability of victory based on their current ratings and updates their Elo scores mathematically. This completely bypasses rubric bias and naturally recovers the true top-ranked projects through the wisdom of the crowd.
