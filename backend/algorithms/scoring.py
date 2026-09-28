def calculate_weighted_score(raw_scores: dict, weights: dict) -> float:
    """
    Calculates the base score based on a weighted rubric.
    
    Example: 
    raw_scores = {"design": 8, "technical": 9, "pitch": 5}
    weights = {"design": 0.2, "technical": 0.5, "pitch": 0.3}
    Returns: (8*0.2) + (9*0.5) + (5*0.3) = 1.6 + 4.5 + 1.5 = 7.6 base score.
    """
    total_score = 0.0
    weight_sum = 0.0
    
    for criteria, score in raw_scores.items():
        if criteria in weights:
            weight = weights[criteria]
            total_score += score * float(weight)
            weight_sum += float(weight)
    
    # Normalize mathematically if weights don't perfectly equal 1.0 (100%)
    if weight_sum > 0:
        return total_score / weight_sum
    
    return 0.0
