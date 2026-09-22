"""
JalSaafi water-quality prediction module.
Takes the three sensor readings the bot measures (pH, temperature, turbidity)
and returns:
  1. Whether the water is within a healthy range for aquatic life (with confidence)
  2. Which fish species the conditions best suit (with confidence)

Trained on the real-world pond-water dataset (pH, temperature, turbidity ->
fish), collected via IoT sensors across five ponds. Habitat suitability uses
the established reference ranges pH 6.5-8.5, temperature 16-24 C, turbidity
< 10 NTU.

Honest scope: this predicts whether water CONDITIONS can support healthy fish
life. It is NOT a food-safety certification (that requires lab toxin testing).
"""

import pickle
import os

_here = os.path.dirname(__file__)
_species = pickle.load(open(os.path.join(_here, "model_species.pkl"), "rb"))
_suit = pickle.load(open(os.path.join(_here, "model_suitability.pkl"), "rb"))


def predict(ph, temperature, turbidity):
    """Return a dict describing water suitability and best-suited species."""
    x = [[ph, temperature, turbidity]]

    # Suitability (binary) + confidence
    suit_model = _suit["model"]
    suit_pred = int(suit_model.predict(x)[0])
    suit_conf = float(suit_model.predict_proba(x)[0].max())

    # Species + confidence
    sp_model = _species["model"]
    labels = _species["labels"]
    sp_idx = int(sp_model.predict(x)[0])
    sp_conf = float(sp_model.predict_proba(x)[0].max())

    return {
        "input": {"pH": ph, "temperature_C": temperature, "turbidity_NTU": turbidity},
        "habitat_suitable": bool(suit_pred),
        "suitability_confidence": round(suit_conf, 3),
        "best_suited_species": labels[sp_idx],
        "species_confidence": round(sp_conf, 3),
        "note": "Conditions-only assessment, not a food-safety test.",
    }


if __name__ == "__main__":
    # Quick demo with a few sample readings
    samples = [
        (7.5, 22, 4),    # good conditions
        (5.8, 33, 15),   # bad: acidic, hot, cloudy
        (8.2, 20, 3),    # good, slightly alkaline
    ]
    for ph, t, tur in samples:
        r = predict(ph, t, tur)
        print(f"\npH={ph}, temp={t}C, turbidity={tur} NTU")
        print(f"  Healthy for fish? {'YES' if r['habitat_suitable'] else 'NO'} "
              f"(confidence {r['suitability_confidence']:.0%})")
        print(f"  Best-suited species: {r['best_suited_species']} "
              f"(confidence {r['species_confidence']:.0%})")
