def calculate_elo(rating_a: float, rating_b: float, winner: str, k_factor: float = 32) -> tuple:
    """
    Implements an Elo rating system (a simplified, sequential Bradley-Terry estimator)
    for Pairwise Project Comparisons (+5 Bonus Points).
    
    Instead of absolute rubric scores, judges simply vote: "Is Project A better than Project B?"
    
    rating_a: Current Elo rating of Project A (default typically 1200)
    rating_b: Current Elo rating of Project B (default typically 1200)
    winner: 'A' or 'B'
    k_factor: The maximum possible adjustment per comparison.
    
    Returns the new (rating_a, rating_b) tuple.
    """
    # Calculate Expected Probabilities using the logistic curve (Bradley-Terry model)
    # P(A wins) = 1 / (1 + 10^((R_b - R_a) / 400))
    expected_a = 1.0 / (1.0 + 10 ** ((rating_b - rating_a) / 400.0))
    expected_b = 1.0 / (1.0 + 10 ** ((rating_a - rating_b) / 400.0))
    
    # Actual Outcomes
    actual_a = 1.0 if winner == 'A' else 0.0
    actual_b = 1.0 if winner == 'B' else 0.0
    
    # Update Ratings mathematically
    new_rating_a = rating_a + k_factor * (actual_a - expected_a)
    new_rating_b = rating_b + k_factor * (actual_b - expected_b)
    
    return round(new_rating_a, 2), round(new_rating_b, 2)
    
if __name__ == "__main__":
    print("\n--- DOGFOOD 2026: PAIRWISE ELO (BRADLEY-TERRY) DEMONSTRATION ---")
    rA, rB = 1200.0, 1200.0
    print(f"Initial: Project A = {rA} | Project B = {rB}")
    
    print("\n[Match 1] Project A wins the pairwise comparison!")
    rA, rB = calculate_elo(rA, rB, winner='A')
    print(f"New Ratings: Project A = {rA} | Project B = {rB}")
    
    print("\n[Match 2] Project A wins again against B!")
    rA, rB = calculate_elo(rA, rB, winner='A')
    print(f"New Ratings: Project A = {rA} | Project B = {rB}")
    print("----------------------------------------------------------------\n")
