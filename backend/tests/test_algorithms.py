import sys
import os
from pathlib import Path

# Add backend directory to sys.path for importing algorithms
sys.path.append(str(Path(__file__).resolve().parent.parent))

from algorithms.scoring import calculate_weighted_score
from algorithms.normalization import calculate_z_score
from algorithms.pairwise import calculate_elo

def test_calculate_weighted_score():
    raw_scores = {"design": 8, "technical": 9}
    weights = {"design": 0.5, "technical": 0.5}
    score = calculate_weighted_score(raw_scores, weights)
    assert score == 8.5
    
    # Test normalization when weights don't equal 1
    raw_scores_2 = {"a": 10, "b": 10}
    weights_2 = {"a": 1.0, "b": 1.0}
    score_2 = calculate_weighted_score(raw_scores_2, weights_2)
    assert score_2 == 10.0 # 20 / 2.0

def test_calculate_z_score():
    # Z = (X - Mean) / StDev
    z = calculate_z_score(score=10, mean=5, stdev=2)
    assert z == 2.5
    
    # Avoid division by zero
    z_zero_stdev = calculate_z_score(score=5, mean=5, stdev=0)
    assert z_zero_stdev == 0.0

def test_calculate_elo():
    # Test Bradley-Terry Expected Probabilities
    rating_a = 1200.0
    rating_b = 1200.0
    
    # If A wins, A's score should increase, B's should decrease
    new_a, new_b = calculate_elo(rating_a, rating_b, winner='A')
    
    assert new_a > 1200.0
    assert new_b < 1200.0
    
    # In symmetric Elo, the gain for A should equal the loss for B
    assert round(new_a - 1200.0, 2) == round(1200.0 - new_b, 2)
