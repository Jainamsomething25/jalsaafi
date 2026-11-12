# JalSaafi Command Center

Website and dashboard for **JalSaafi**, an autonomous oil-spill response concept
built for the HKU AI+ Challenge (AI + Smart City and Biodiversity track).

The pipeline the site explains is **Perceive → Predict → Decide → Act → Advise**.

## What is real, what is a demo, what is roadmap

| Stage | Status |
|---|---|
| Perceive: satellite SAR + ship-mounted bots | Proof of concept only. The SAR classifier lives in a separate repo, [jalsaafi-detection](https://github.com/Jainamsomething25/jalsaafi-detection). The detections shown on the dashboard are **demo data**, not a live feed. |
| Predict: water-quality / fish suitability | **Real trained model** (scikit-learn Random Forest, 84.5% accuracy vs 72.3% for a neural net) on a pond-sensor dataset (pH, temperature, turbidity). It predicts whether water *conditions* can support fish life. It is **not** a food-safety certification, which needs lab toxin testing. |
| Decide: route planning | Rule-based greedy planner (scores slicks by volume^1.3 / distance). **Not machine learning.** The simulator is an algorithm demo, not connected to the boat. |
| Act: cleanup boat | Physical prototype (ESP32, L298 driver, pH/TDS/turbidity/temperature/ultrasonic sensors, magnetic oleophilic sheets). Full autonomy runs in simulation only; manual controls drive real hardware. |
| Advise: "can I fish here?" | Plain-language output from the Predict model on sensor readings. |

Impact figures on the dashboard are simulated patrol totals, not real-world measurements.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS v4, GSAP + ScrollTrigger, Lenis,
React Three Fiber + Drei, Framer Motion. No browser storage is used.

## Run the site

```bash
npm install
npm run dev
```

Open http://localhost:3000. The Control Center is at `/control-center`.

Optional: copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_STAFF_KEY`
to put a prompt in front of the Control Center. This is a client-side soft
deterrent for demos, **not security**: the value is a public env var.

## Run the model API (optional)

```bash
pip install scikit-learn
python ml/api.py
# GET http://localhost:8000/predict?ph=7.4&temperature=21&turbidity=4.5
```

A local, stdlib-only HTTP server with open CORS, intended for testing on one
machine. Do not expose it publicly.

## Repo layout

- `app/`, `components/`, `lib/`: the Next.js site and dashboard
- `ml/`: water-quality model, local API and training data
- `sim/`: standalone HTML simulators (route planning, swarm)
- `existing-code/`: ESP32 firmware for the prototype

## Licence and credits

Code: MIT, see [LICENSE](LICENSE). `ml/realfishdataset.csv` is a third-party
pond-water sensor dataset and is not covered by that licence. Photos in
`public/photos/` show the project's own prototype. AI tools (Claude, Claude
Code) were used in building this project.
