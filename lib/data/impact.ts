export interface ImpactStat {
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
}

export const impactStats: ImpactStat[] = [
  {
    value: 3,
    suffix: "B+",
    label: "People rely on fish for protein",
    sublabel: "Scale of the problem JalSaafi targets",
  },
  {
    value: 84.5,
    suffix: "%",
    label: "Water-quality model accuracy",
    sublabel: "Random Forest, trained on real pond-sensor data",
  },
  {
    value: 5,
    suffix: "",
    label: "Stage AI pipeline",
    sublabel: "Perceive, Predict, Decide, Act, Advise",
  },
  {
    value: 2,
    suffix: "",
    label: "Detection modes",
    sublabel: "Satellite SAR + ship-mounted bots",
  },
];
