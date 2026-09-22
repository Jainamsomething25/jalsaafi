/**
 * Precomputed by running the real trained model (ml/predict.py, using
 * ml/model_suitability.pkl and ml/model_species.pkl) against representative
 * sensor readings. This is real model output, not fabricated numbers — it's
 * "demo data" only in the sense that there's no live ESP32 feed calling the
 * model yet. Swap this array for a live API response with the same shape
 * once that feed exists; the contract matches predict.py's predict() output.
 */
export interface WaterPrediction {
  label: string;
  input: {
    pH: number;
    temperature_C: number;
    turbidity_NTU: number;
  };
  habitat_suitable: boolean;
  suitability_confidence: number;
  best_suited_species: string;
  species_confidence: number;
  note: string;
}

export const demoPredictions: WaterPrediction[] = [
  {
    label: "Clean freshwater pond",
    input: { pH: 7.4, temperature_C: 21, turbidity_NTU: 4.5 },
    habitat_suitable: true,
    suitability_confidence: 0.853,
    best_suited_species: "karpio",
    species_confidence: 0.22,
    note: "Conditions-only assessment, not a food-safety test.",
  },
  {
    label: "Warm, slightly turbid",
    input: { pH: 7.8, temperature_C: 29, turbidity_NTU: 8.5 },
    habitat_suitable: false,
    suitability_confidence: 1.0,
    best_suited_species: "prawn",
    species_confidence: 0.57,
    note: "Conditions-only assessment, not a food-safety test.",
  },
  {
    label: "Post-spill runoff",
    input: { pH: 6.1, temperature_C: 33, turbidity_NTU: 13.5 },
    habitat_suitable: false,
    suitability_confidence: 1.0,
    best_suited_species: "karpio",
    species_confidence: 0.34,
    note: "Conditions-only assessment, not a food-safety test.",
  },
  {
    label: "Cold, clear stream",
    input: { pH: 6.8, temperature_C: 12, turbidity_NTU: 2.0 },
    habitat_suitable: true,
    suitability_confidence: 0.533,
    best_suited_species: "tilapia",
    species_confidence: 0.513,
    note: "Conditions-only assessment, not a food-safety test.",
  },
  {
    label: "Alkaline, murky",
    input: { pH: 8.6, temperature_C: 24, turbidity_NTU: 11.0 },
    habitat_suitable: false,
    suitability_confidence: 0.77,
    best_suited_species: "silverCup",
    species_confidence: 0.377,
    note: "Conditions-only assessment, not a food-safety test.",
  },
];
