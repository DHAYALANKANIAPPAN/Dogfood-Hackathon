# Building Dogfood 2026: Offline-First Hackathon Judging

*This is a template for the "Write Up Quest" bonus prize (₹40,000 pool). You can publish this on Dev.to, Medium, or your personal blog, and submit the link!*

## The Challenge
Hackathon Raptors tasked us with building a complete hackathon judging platform that runs entirely offline with a single `docker compose up` command. No cloud auth, no hosted databases, and no external APIs. 

## How We Architected the Solution
Our team (Dhaya, Santo, Bhava, Ling) chose **FastAPI (Python)** for the backend and **React/Vite** for the frontend.
*   **Why FastAPI?** Because Python natively handles the complex mathematical normalization algorithms we needed for the judging engine, and it automatically generated our OpenAPI specifications to fulfill the T4 stretch goals.

## Defeating Judge Bias Mathematically
The hardest part of any hackathon is the fact that "Judge A" might average a 3/10 while "Judge B" averages a 9/10. 
To solve this, we implemented **Cross-Judge Z-Score Normalization**. We calculate the mean and standard deviation for each individual judge, apply the Z-score formula, and map it back to a standard 0-100 scale. We even wrote a mathematical proof script in our repo to demonstrate that our algorithm eliminates human bias!

## Security & Anti-Abuse
To fulfill the T3 threat model constraints without a cloud WAF, we implemented:
1.  **Strict RBAC:** Role isolation enforced at the FastAPI dependency layer.
2.  **IP Rate Limiting:** Using `slowapi` in memory to prevent Sybil attacks and ballot stuffing during community voting.
3.  **Cryptographic Signatures:** Generating HMAC-SHA256 signatures for Judge Participation Records offline.

## Conclusion
Building for strict offline constraints forced us to write cleaner, more resilient code. It proved that you don't always need massive cloud infrastructure to run a secure, mathematically sound event platform.
