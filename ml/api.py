"""
Minimal local HTTP API wrapping predict.py's real trained model, so the
Next.js Control Center can call the actual model on live sensor readings
instead of only cycling through precomputed demo scenarios.

Deliberately stdlib-only (no Flask/FastAPI) so there's nothing new to
install beyond scikit-learn, which predict.py already needs.

Run:
    python ml/api.py

Then:
    GET http://localhost:8000/predict?ph=7.4&temperature=21&turbidity=4.5

CORS is wide open (Access-Control-Allow-Origin: *) since this is meant to
be called directly from a browser tab on the same machine/network during
testing, not exposed publicly.
"""

import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs

import predict

PORT = 8000


class Handler(BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")

    def _send_json(self, status: int, payload: dict):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self._cors()
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path != "/predict":
            self._send_json(404, {"error": "Unknown route. Use /predict?ph=&temperature=&turbidity="})
            return

        params = parse_qs(parsed.query)
        try:
            ph = float(params["ph"][0])
            temperature = float(params["temperature"][0])
            turbidity = float(params["turbidity"][0])
        except (KeyError, IndexError, ValueError):
            self._send_json(400, {"error": "Provide numeric ph, temperature, turbidity query params"})
            return

        result = predict.predict(ph, temperature, turbidity)
        self._send_json(200, result)

    def log_message(self, format, *args):
        pass  # keep the console quiet; comment out this override to debug


if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", PORT), Handler)
    print(f"JalSaafi model API running — try:")
    print(f"  http://localhost:{PORT}/predict?ph=7.4&temperature=21&turbidity=4.5")
    server.serve_forever()
