# Judging Engine Methodology

This document outlines the mathematical and architectural decisions behind our judging engine. Our goal was to build a system that is fair, load-balanced, and mathematically resilient to judge bias.

## 1. Judge Assignment Strategy
We utilize an **Algorithmic Round-Robin** assignment strategy.
*   **The Problem:** In many hackathons, some projects get 10 reviews while others get 1.
*   **Our Solution:** Our algorithm guarantees that every finalized project receives exactly 3 reviews. It randomly assigns available judges while ensuring no judge reviews the same project twice, creating a perfectly balanced workload.

## 2. Configurable Weighted Rubrics
We store raw scores as a dynamic JSON object (`criteria_scores`). Our scoring algorithm mathematically calculates base scores using configurable weight percentages (e.g., Design=0.3, Technical=0.7).

## 3. Score Normalization (Mitigating Bias)
*   **The Problem:** "Judge A" gives an average score of 3/10. "Judge B" gives an average score of 9/10. 
*   **Our Solution:** We implement **Cross-Judge Z-Score Normalization**. We calculate the Mean (μ) and Standard Deviation (σ) of every individual judge, and apply the Z-Score formula: `Z = (X - μ) / σ`. This converts all scores into a standardized relative metric, eliminating "harsh vs lenient" bias.

## 4. Pairwise Ranking System (+5 Bonus)
We also implemented an alternative **Pairwise Mode** using an Elo rating system based on the Bradley-Terry logistic curve. Judges simply choose a winner between two projects, and the backend mathematically updates their probabilities to recover the true top-ranked projects.
