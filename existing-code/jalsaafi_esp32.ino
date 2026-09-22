#include <WiFi.h>
#include <WebServer.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <ArduinoJson.h>
#include <ESP32Servo.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

Servo servo1;

// ====== Configure your location for Open-Meteo (no API key needed) ======
double LATITUDE  = 19.0760;   // <-- now editable at runtime
double LONGITUDE = 72.8777;   // <-- now editable at runtime

// Wi-Fi Credentials
const char* ssid = "ssid";
const char* password = "pass";

// Web Server
WebServer server(80);

// Sensor Pins
#define PH_PIN 34
#define TURBIDITY_PIN 36
#define ONE_WIRE_BUS 23

#define TRIG_PIN 25
#define ECHO_PIN 33

// Motor Pins
#define IN1 5
#define IN2 18
#define IN3 19
#define IN4 21
#define SKIMMER_MOTOR 26
#define MSC_MOTOR 27

// Servo Pins (dedicated, non-conflicting)
#define SERVO1_PIN 12

// Temperature Sensor Setup
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

// Variables
float phValue = 0;
int turbidityValue = 0;
float temperatureC = 0;
bool oilDetected = false;

// Full autonomy (Decide/Act) only runs in the simulator for now — the real
// boat is staff-driven, and the oleophilic sheet conveyor is a manual
// start/stop rather than triggered automatically off oilDetected.
bool conveyorOn = false;

// ---- Open-Meteo variables ----
float windSpeed = 0.0f;       // m/s
float windDirection = 0.0f;   // degrees
unsigned long lastWindFetch = 0;
const unsigned long windInterval = 60000; // fetch every 60 s

#define MAX_RECORDS 50
struct DataRecord {
  float ph;
  float turb;
  float temp;
  unsigned long timestamp;
};

DataRecord csvData[MAX_RECORDS];
int csvIndex = 0;

const char index_html[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>JALSAAFI Dashboard</title>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/highcharts-more.js"></script>
  <script src="https://code.highcharts.com/modules/solid-gauge.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    /* ========== DARK NAVY BLUE BACKGROUND ========== */

    body {
      background:
        radial-gradient(circle at 10% 20%, rgba(0, 5, 20, 0.9) 0%, transparent 40%),
        radial-gradient(circle at 90% 80%, rgba(0, 10, 30, 0.9) 0%, transparent 40%),
        radial-gradient(circle at 50% 50%, rgba(0, 15, 40, 0.6) 0%, transparent 60%),
        linear-gradient(135deg, #000814 0%, #001126 50%, #000814 100%);
      background-size: cover, cover, cover, cover;
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-position: center;
      font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
      color: white;
      text-align: center;
      margin: 0;
      padding: 0;
      min-height: 100vh;
      overflow-x: hidden;
    }

    /* Animated Blue Gradient Overlay */
    body::after {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg,
        rgba(0, 41, 102, 0.08) 0%,
        rgba(0, 61, 153, 0.08) 25%,
        rgba(0, 82, 204, 0.08) 50%,
        rgba(51, 102, 204, 0.08) 75%,
        rgba(102, 153, 255, 0.08) 100%);
      background-size: 400% 400%;
      z-index: -3;
      animation: gradientShift 20s ease infinite;
    }

    @keyframes gradientShift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    /* ========== TINY FLOATING DOTS ========== */

    .floating-dots {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -2;
      pointer-events: none;
      overflow: hidden;
    }

    .tiny-dot {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      background-color: rgba(64, 156, 255, 0.6);
      box-shadow: 0 0 4px rgba(64, 156, 255, 0.8);
      animation: floatDot linear infinite;
    }

    /* Different dot sizes */
    .dot-tiny {
      width: 2px;
      height: 2px;
    }

    .dot-small {
      width: 3px;
      height: 3px;
    }

    .dot-medium {
      width: 4px;
      height: 4px;
    }

    @keyframes floatDot {
      0% {
        transform:
          translate(calc(var(--start-x) * 1vw), calc(var(--start-y) * 1vh))
          scale(0.8);
        opacity: 0;
      }
      10% {
        opacity: var(--opacity);
        transform:
          translate(calc(var(--start-x) * 1vw), calc(var(--start-y) * 1vh))
          scale(1);
      }
      90% {
        opacity: var(--opacity);
        transform:
          translate(calc(var(--end-x) * 1vw), calc(var(--end-y) * 1vh))
          scale(1);
      }
      100% {
        transform:
          translate(calc(var(--end-x) * 1vw), calc(var(--end-y) * 1vh))
          scale(0.8);
        opacity: 0;
      }
    }

    /* Subtle Glowing Orbs */
    .glow-orb {
      position: fixed;
      border-radius: 50%;
      filter: blur(60px);
      z-index: -1;
      opacity: 0.08;
      animation: floatOrb 40s infinite ease-in-out;
    }

    .orb-1 {
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(0, 82, 204, 0.3), transparent 70%);
      top: 15%;
      left: 5%;
    }

    .orb-2 {
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(0, 41, 102, 0.25), transparent 70%);
      bottom: 10%;
      right: 5%;
      animation-delay: -20s;
    }

    .orb-3 {
      width: 150px;
      height: 150px;
      background: radial-gradient(circle, rgba(0, 122, 255, 0.2), transparent 70%);
      top: 70%;
      left: 85%;
      animation-delay: -10s;
    }

    @keyframes floatOrb {
      0%, 100% { transform: translate(0, 0) scale(1); }
      25% { transform: translate(40px, -25px) scale(1.05); }
      50% { transform: translate(-25px, 35px) scale(0.95); }
      75% { transform: translate(-35px, -20px) scale(1.02); }
    }

    /* ========== DASHBOARD HEADER ========== */

    .dashboard-header {
      text-align: center;
      padding: 30px 20px 20px;
      position: relative;
      z-index: 1;
    }

    .logo-container {
      position: relative;
      display: inline-block;
      margin-bottom: 15px;
    }

    .logo-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 180px;
      height: 180px;
      background: radial-gradient(circle, rgba(64, 156, 255, 0.3), transparent 70%);
      filter: blur(30px);
      z-index: -1;
      animation: logoPulse 4s infinite alternate;
    }

    @keyframes logoPulse {
      0% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
      100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1.1); }
    }

    .logo {
      height: 150px;
      filter:
        drop-shadow(0 0 15px rgba(64, 156, 255, 0.5))
        drop-shadow(0 0 30px rgba(0, 122, 255, 0.3));
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      animation: logoFloat 6s infinite ease-in-out;
    }

    @keyframes logoFloat {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      33% { transform: translateY(-8px) rotate(1deg); }
      66% { transform: translateY(4px) rotate(-1deg); }
    }

    .logo:hover {
      transform: scale(1.08) rotate(5deg);
      filter:
        drop-shadow(0 0 25px rgba(64, 156, 255, 0.7))
        drop-shadow(0 0 50px rgba(0, 122, 255, 0.5));
    }

    /* ========== SINGLE COLOR HEADING ========== */

    .main-title {
      font-family: 'Arial Black', 'Segoe UI', sans-serif;
      font-size: 2.8rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 3px;
      margin: 10px 0 25px;
      padding: 20px 40px;
      display: inline-block;
      position: relative;
      background: linear-gradient(90deg,
        #4facfe, #2f8de8, #4facfe);
      background-size: 200% 100%;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      animation: titleShimmer 4s infinite linear;
      border-radius: 20px;
      border: 2px solid rgba(79, 172, 254, 0.2);
      backdrop-filter: blur(15px);
      box-shadow:
        inset 0 0 20px rgba(79, 172, 254, 0.1),
        0 10px 30px rgba(0, 0, 0, 0.4),
        0 0 50px rgba(79, 172, 254, 0.15);
    }

    @keyframes titleShimmer {
      0% { background-position: 0% 50%; }
      100% { background-position: 200% 50%; }
    }

    .main-title:hover {
      transform: translateY(-3px);
      box-shadow:
        inset 0 0 30px rgba(79, 172, 254, 0.15),
        0 15px 40px rgba(0, 0, 0, 0.5),
        0 0 70px rgba(79, 172, 254, 0.2);
      border-color: rgba(79, 172, 254, 0.3);
    }

    /* Water Quality Badge */
    .water-quality-badge {
      display: inline-block;
      padding: 12px 30px;
      margin: 15px auto 35px;
      border-radius: 50px;
      font-size: 1.2rem;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      background: linear-gradient(135deg,
        rgba(79, 172, 254, 0.9),
        rgba(47, 141, 232, 0.9));
      box-shadow:
        0 6px 20px rgba(79, 172, 254, 0.4),
        0 0 25px rgba(79, 172, 254, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      border: 2px solid rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(15px);
      position: relative;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      animation: badgeGlow 2s infinite alternate;
    }

    @keyframes badgeGlow {
      0% { box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4), 0 0 25px rgba(79, 172, 254, 0.3); }
      100% { box-shadow: 0 6px 25px rgba(79, 172, 254, 0.6), 0 0 35px rgba(79, 172, 254, 0.4); }
    }

    .water-quality-badge::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg,
        #4facfe, #2f8de8, #4facfe);
      background-size: 400%;
      border-radius: 50px;
      z-index: -1;
      filter: blur(10px);
      opacity: 0;
      transition: opacity 0.4s;
      animation: badgeBorderFlow 4s linear infinite;
    }

    @keyframes badgeBorderFlow {
      0% { background-position: 0 0; }
      50% { background-position: 400% 0; }
      100% { background-position: 0 0; }
    }

    .water-quality-badge:hover::before {
      opacity: 0.4;
    }

    .water-quality-badge:hover {
      transform: translateY(-4px) scale(1.03);
      box-shadow:
        0 10px 30px rgba(79, 172, 254, 0.5),
        0 0 40px rgba(79, 172, 254, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }

    /* ========== DASHBOARD CARDS ========== */

    .dashboard-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 25px;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      z-index: 1;
      position: relative;
    }

    .dashboard-card {
      flex: 1;
      min-width: 350px;
      max-width: 550px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 22px;
      padding: 25px;
      box-shadow:
        0 12px 30px rgba(0, 0, 0, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.06),
        0 0 0 1px rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(25px);
      border: 1px solid rgba(255, 255, 255, 0.06);
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
      overflow: hidden;
      opacity: 0;
      transform: translateY(30px);
      animation: cardAppear 0.8s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    /* Staggered entrance animations */
    .dashboard-card:nth-child(1) { animation-delay: 0.2s; }
    .dashboard-card:nth-child(2) { animation-delay: 0.4s; }

    @keyframes cardAppear {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .dashboard-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg,
        transparent,
        #4facfe,
        #2f8de8,
        #4facfe,
        transparent);
      background-size: 200% 100%;
      animation: borderFlow 3s infinite linear;
    }

    @keyframes borderFlow {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    .dashboard-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow:
        0 20px 45px rgba(0, 0, 0, 0.35),
        inset 0 1px 0 rgba(255, 255, 255, 0.1),
        0 0 25px rgba(79, 172, 254, 0.1);
      border-color: rgba(255, 255, 255, 0.12);
    }

    /* Card Headings */
    .card-title {
      font-size: 1.7rem;
      font-weight: 700;
      margin-bottom: 22px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }

    .card-title::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 25%;
      width: 50%;
      height: 2px;
      background: linear-gradient(90deg, transparent, #4facfe, transparent);
    }

    .card-title i {
      font-size: 1.5rem;
      animation: iconFloat 3s infinite ease-in-out;
    }

    @keyframes iconFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }

    .location-title {
      color: #4facfe;
      text-shadow: 0 0 8px rgba(79, 172, 254, 0.4);
    }

    .controls-title {
      color: #4facfe;
      text-shadow: 0 0 8px rgba(79, 172, 254, 0.4);
    }

    /* ========== ENHANCED FORM ELEMENTS ========== */

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 18px;
      margin-bottom: 25px;
    }

    .input-field {
      padding: 16px 22px;
      border-radius: 14px;
      border: 2px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.3);
      color: white;
      font-size: 1.05rem;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      backdrop-filter: blur(5px);
      text-align: center;
      letter-spacing: 1.5px;
    }

    .input-field:focus {
      outline: none;
      border-color: #4facfe;
      box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.2), 0 0 20px rgba(79, 172, 254, 0.3);
      background: rgba(0, 0, 0, 0.4);
      transform: translateY(-2px);
    }

    .input-field::placeholder {
      color: rgba(255, 255, 255, 0.4);
      letter-spacing: 1.5px;
    }

    /* ========== SINGLE COLOR BUTTONS ========== */

    .btn {
      padding: 16px 32px;
      border-radius: 14px;
      border: none;
      font-size: 1.15rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      position: relative;
      overflow: hidden;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    .btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
      transition: left 0.6s;
    }

    .btn:hover::before {
      left: 100%;
    }

    .btn-primary {
      background: linear-gradient(135deg, #4facfe, #2f8de8);
      color: white;
      box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
    }

    .btn-primary:hover {
      transform: translateY(-4px) scale(1.03);
      box-shadow: 0 12px 30px rgba(79, 172, 254, 0.6), 0 0 25px rgba(79, 172, 254, 0.4);
      background: linear-gradient(135deg, #2f8de8, #1a75d2);
    }

    .btn-success {
      background: linear-gradient(135deg, #4facfe, #2f8de8);
      color: white;
      box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
    }

    .btn-success:hover {
      transform: translateY(-4px) scale(1.03);
      box-shadow: 0 12px 30px rgba(79, 172, 254, 0.6), 0 0 25px rgba(79, 172, 254, 0.4);
      background: linear-gradient(135deg, #2f8de8, #1a75d2);
    }

    .btn-danger {
      background: linear-gradient(135deg, #4facfe, #2f8de8);
      color: white;
      box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
      animation: pulseGlow 2s infinite alternate;
    }

    @keyframes pulseGlow {
      0% {
        transform: scale(1);
        box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
      }
      100% {
        transform: scale(1.03);
        box-shadow: 0 6px 25px rgba(79, 172, 254, 0.6), 0 0 30px rgba(79, 172, 254, 0.5);
      }
    }

    .btn-danger:hover {
      animation: none;
      transform: translateY(-4px) scale(1.03);
      box-shadow: 0 12px 30px rgba(79, 172, 254, 0.6), 0 0 35px rgba(79, 172, 254, 0.5);
      background: linear-gradient(135deg, #2f8de8, #1a75d2);
    }

    /* ========== MOTOR CONTROLS GRID ========== */

    .controls-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      gap: 18px;
      margin: 25px 0;
      height: 300px;
    }

    .control-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 18px;
      background: rgba(0, 0, 0, 0.3);
      border: 2px solid rgba(255, 255, 255, 0.06);
      color: white;
      font-size: 1.05rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
      overflow: hidden;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    .control-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), transparent);
      opacity: 0;
      transition: opacity 0.3s;
    }

    .control-btn:hover::before {
      opacity: 1;
    }

    .control-btn i {
      font-size: 2.3rem;
      margin-bottom: 8px;
      transition: transform 0.3s;
      filter: drop-shadow(0 0 4px rgba(79, 172, 254, 0.6));
    }

    .control-btn:hover i {
      transform: scale(1.25);
    }

    .control-btn:hover {
      transform: translateY(-6px);
      border-color: rgba(79, 172, 254, 0.3);
      box-shadow: 0 12px 25px rgba(0, 0, 0, 0.4), 0 0 20px rgba(79, 172, 254, 0.2);
    }

    .btn-forward {
      grid-column: 2;
      grid-row: 1;
      background: linear-gradient(135deg, rgba(79, 172, 254, 0.3), rgba(47, 141, 232, 0.3));
    }

    .btn-backward {
      grid-column: 2;
      grid-row: 3;
      background: linear-gradient(135deg, rgba(79, 172, 254, 0.3), rgba(47, 141, 232, 0.3));
    }

    .btn-left {
      grid-column: 1;
      grid-row: 2;
      background: linear-gradient(135deg, rgba(79, 172, 254, 0.3), rgba(47, 141, 232, 0.3));
    }

    .btn-right {
      grid-column: 3;
      grid-row: 2;
      background: linear-gradient(135deg, rgba(79, 172, 254, 0.3), rgba(47, 141, 232, 0.3));
    }

    .btn-stop {
      grid-column: 2;
      grid-row: 2;
      background: linear-gradient(135deg, rgba(79, 172, 254, 0.4), rgba(47, 141, 232, 0.4));
      animation: centerPulse 2s infinite alternate;
    }

    @keyframes centerPulse {
      0% {
        transform: scale(1);
        box-shadow: 0 0 20px rgba(79, 172, 254, 0.3);
      }
      100% {
        transform: scale(1.03);
        box-shadow: 0 0 30px rgba(79, 172, 254, 0.5);
      }
    }

    .btn-stop:hover {
      animation: none;
    }

    /* ========== CHARTS CONTAINER ========== */

    .charts-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 22px;
      margin-top: 25px;
      padding: 0 20px 35px;
      max-width: 1400px;
      margin-left: auto;
      margin-right: auto;
    }

    .chart-card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 18px;
      padding: 22px;
      box-shadow:
        0 8px 25px rgba(0, 0, 0, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.06),
        0 0 0 1px rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.06);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
      overflow: hidden;
    }

    .chart-card:hover {
      transform: translateY(-4px);
      box-shadow:
        0 12px 35px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1),
        0 0 25px rgba(79, 172, 254, 0.08);
      border-color: rgba(255, 255, 255, 0.12);
    }

    .chart-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg,
        transparent,
        rgba(79, 172, 254, 0.6),
        transparent);
    }

    .chart-title {
      font-size: 1.4rem;
      font-weight: 700;
      margin-bottom: 18px;
      color: #4facfe;
      display: flex;
      align-items: center;
      gap: 10px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }

    .chart-title i {
      font-size: 1.3rem;
      animation: iconSpin 4s infinite linear;
    }

    @keyframes iconSpin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Chart containers */
    #turbChart,
    #phChart,
    #tempChart,
    #predictGauge,
    #ultraChart,
    #windChart {
      width: 100% !important;
      height: 280px !important;
      border-radius: 14px;
      overflow: hidden;
    }

    /* ========== RESPONSIVE DESIGN ========== */

    @media (max-width: 1200px) {
      .dashboard-card {
        min-width: 320px;
      }

      .charts-container {
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .main-title {
        font-size: 2.2rem;
        padding: 15px 25px;
        letter-spacing: 2px;
      }

      .water-quality-badge {
        padding: 10px 22px;
        font-size: 1.05rem;
      }

      .logo {
        height: 130px;
      }

      .dashboard-card {
        min-width: 100%;
        max-width: 100%;
      }

      .controls-grid {
        height: 260px;
        gap: 14px;
      }

      .charts-container {
        grid-template-columns: 1fr;
        padding: 0 15px 25px;
      }

      .btn {
        padding: 14px 28px;
        font-size: 1.05rem;
      }
    }

    @media (max-width: 480px) {
      .main-title {
        font-size: 1.8rem;
        padding: 12px 20px;
        letter-spacing: 1.5px;
      }

      .water-quality-badge {
        padding: 8px 18px;
        font-size: 0.95rem;
      }

      .logo {
        height: 110px;
      }

      .control-btn {
        font-size: 0.85rem;
      }

      .control-btn i {
        font-size: 1.8rem;
      }

      .card-title {
        font-size: 1.4rem;
      }

      .input-field {
        padding: 14px 18px;
        font-size: 1rem;
      }
    }

    /* ========== SCROLLBAR ========== */

    ::-webkit-scrollbar {
      width: 10px;
    }

    ::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 8px;
    }

    ::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #4facfe, #2f8de8);
      border-radius: 8px;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    }

    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #2f8de8, #1a75d2);
    }
  </style>
</head>
<body>
  <!-- Animated Background Elements -->
  <div class="floating-dots" id="floatingDots"></div>
  <div class="glow-orb orb-1"></div>
  <div class="glow-orb orb-2"></div>
  <div class="glow-orb orb-3"></div>

  <!-- Dashboard Header -->
  <div class="dashboard-header">
    <div class="logo-container">
      <div class="logo-glow"></div>
      <img src="https://i.ibb.co/4R2VWbPp/ICARUS-Robotics-Team-Logo-Version-4-removebg-preview.png"
           alt="ICARUS Robotics Logo"
           class="logo">
    </div>

    <h1 class="main-title" id="title">JALSAAFI DASHBOARD</h1>

    <div class="water-quality-badge" id="waterQuality">
      <i class="fas fa-check-circle"></i> Water Quality: Excellent
    </div>
  </div>

  <!-- Main Dashboard Cards -->
  <div class="dashboard-container">
    <!-- Location Settings Card -->
    <div class="dashboard-card">
      <h2 class="card-title location-title">
        <i class="fas fa-satellite"></i> Location Settings
      </h2>

      <div class="input-group">
        <input type="text" id="lat" placeholder="ENTER LATITUDE" class="input-field">
        <input type="text" id="lon" placeholder="ENTER LONGITUDE" class="input-field">
      </div>

      <button class="btn btn-primary" onclick="updateLocation(event)">
        <i class="fas fa-sync-alt fa-spin" style="animation: fa-spin 2s infinite linear;"></i> Update Location
      </button>
    </div>

    <!-- Motor Controls Card -->
    <div class="dashboard-card">
      <h2 class="card-title controls-title">
        <i class="fas fa-robot"></i> Motor Controls
      </h2>

      <div class="controls-grid">
        <div class="control-btn btn-forward" onclick="moveMotor('forward', event)">
          <i class="fas fa-arrow-up"></i>
          <span>FORWARD</span>
        </div>

        <div class="control-btn btn-left" onclick="moveMotor('left', event)">
          <i class="fas fa-arrow-left"></i>
          <span>LEFT</span>
        </div>

        <div class="control-btn btn-stop" onclick="moveMotor('stop', event)">
          <i class="fas fa-stop-circle"></i>
          <span>EMERGENCY STOP</span>
        </div>

        <div class="control-btn btn-right" onclick="moveMotor('right', event)">
          <i class="fas fa-arrow-right"></i>
          <span>RIGHT</span>
        </div>

        <div class="control-btn btn-backward" onclick="moveMotor('backward', event)">
          <i class="fas fa-arrow-down"></i>
          <span>BACKWARD</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Charts Section -->
  <div class="charts-container">
    <div class="chart-card">
      <h3 class="chart-title"><i class="fas fa-water"></i> Turbidity (NTU)</h3>
      <div id="turbChart"></div>
    </div>

    <div class="chart-card">
      <h3 class="chart-title"><i class="fas fa-flask"></i> pH Sensor Readings</h3>
      <div id="phChart"></div>
    </div>

    <div class="chart-card">
      <h3 class="chart-title"><i class="fas fa-thermometer-half"></i> Temperature</h3>
      <div id="tempChart"></div>
    </div>

    <div class="chart-card">
      <h3 class="chart-title"><i class="fas fa-ruler-vertical"></i> Ultrasonic Distance</h3>
      <div id="ultraChart"></div>
    </div>

    <div class="chart-card">
      <h3 class="chart-title"><i class="fas fa-wind"></i> Wind Speed & Direction</h3>
      <div id="windChart"></div>
    </div>

    <div class="chart-card">
      <h3 class="chart-title"><i class="fas fa-chart-pie"></i> Fishing Prediction Gauge</h3>
      <div id="predictGauge"></div>
    </div>
  </div>

<script>
  // ========== TINY FLOATING DOTS ==========

  function createFloatingDots() {
    const container = document.getElementById('floatingDots');
    const dotCount = 100; // More dots for better effect

    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement('div');

      // Random dot size
      const sizeType = Math.floor(Math.random() * 3);
      if (sizeType === 0) {
        dot.classList.add('tiny-dot', 'dot-tiny');
      } else if (sizeType === 1) {
        dot.classList.add('tiny-dot', 'dot-small');
      } else {
        dot.classList.add('tiny-dot', 'dot-medium');
      }

      // Random start position (off-screen to create flowing effect)
      const startX = Math.random() * 120 - 10; // -10% to 110%
      const startY = Math.random() * 120 - 10; // -10% to 110%

      // Random end position (slight movement)
      const endX = startX + (Math.random() * 40 - 20);
      const endY = startY + (Math.random() * 40 - 20);

      // Set CSS properties
      dot.style.setProperty('--start-x', startX);
      dot.style.setProperty('--start-y', startY);
      dot.style.setProperty('--end-x', endX);
      dot.style.setProperty('--end-y', endY);
      dot.style.setProperty('--opacity', 0.3 + Math.random() * 0.5);

      // Random animation duration and delay
      const duration = 15 + Math.random() * 25;
      const delay = Math.random() * 15;
      dot.style.animationDuration = `${duration}s`;
      dot.style.animationDelay = `${delay}s`;
      dot.style.animationTimingFunction = 'linear';

      container.appendChild(dot);
    }
  }

  // ========== MOTOR CONTROL FUNCTIONS ==========

  function moveMotor(dir, evt) {
    // Visual feedback
    const btn = evt.currentTarget;
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      btn.style.transform = '';
    }, 200);

    // Send command
    fetch("/motor?dir=" + encodeURIComponent(dir))
      .then(res => res.text())
      .then(data => console.log(data))
      .catch(console.error);
  }

  function updateLocation(evt) {
    const lat = document.getElementById("lat").value;
    const lon = document.getElementById("lon").value;

    if (!lat || !lon) {
      alert("Please enter both latitude and longitude!");
      return;
    }

    // Visual feedback
    const btn = evt.currentTarget;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
    btn.disabled = true;

    fetch(`/set_location?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`)
      .then(res => res.text())
      .then(msg => {
        alert(msg);
        btn.innerHTML = originalText;
        btn.disabled = false;
      })
      .catch(err => {
        console.error(err);
        btn.innerHTML = originalText;
        btn.disabled = false;
        alert("Failed to update location. Please try again.");
      });
  }

  // ========== HIGHCHARTS INITIALIZATION ==========

  let turbChart = Highcharts.chart('turbChart', {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      style: { fontFamily: 'inherit' }
    },
    title: { text: '' },
    xAxis: { type: 'datetime' },
    yAxis: {
      title: { text: 'NTU' },
      min: 0,
      max: 1000,
      gridLineColor: 'rgba(255,255,255,0.08)'
    },
    series: [{
      name: 'Turbidity',
      data: [],
      color: '#4facfe'
    }],
    plotOptions: {
      column: {
        borderRadius: 3
      }
    }
  });

  let phChart = Highcharts.chart('phChart', {
    chart: {
      type: 'spline',
      backgroundColor: 'transparent',
      style: { fontFamily: 'inherit' }
    },
    title: { text: '' },
    xAxis: { type: 'datetime' },
    yAxis: {
      title: { text: 'pH Value' },
      min: 0,
      max: 14,
      gridLineColor: 'rgba(255,255,255,0.08)'
    },
    series: [{
      name: 'pH',
      data: [],
      color: '#4facfe'
    }]
  });

  let tempChart = Highcharts.chart('tempChart', {
    chart: {
      type: 'spline',
      backgroundColor: 'transparent',
      style: { fontFamily: 'inherit' }
    },
    title: { text: '' },
    xAxis: { type: 'datetime' },
    yAxis: {
      title: { text: '°C' },
      min: 0,
      max: 60,
      gridLineColor: 'rgba(255,255,255,0.08)'
    },
    series: [{
      name: 'Temperature',
      data: [],
      color: '#4facfe'
    }]
  });

  let ultraChart = Highcharts.chart('ultraChart', {
    chart: {
      type: 'spline',
      backgroundColor: 'transparent',
      style: { fontFamily: 'inherit' }
    },
    title: { text: '' },
    xAxis: { type: 'datetime' },
    yAxis: {
      title: { text: 'Distance (cm)' },
      min: 0,
      max: 400,
      gridLineColor: 'rgba(255,255,255,0.08)'
    },
    series: [{
      name: 'Distance',
      data: [],
      color: '#4facfe'
    }]
  });

  let windChart = Highcharts.chart('windChart', {
    chart: {
      type: 'line',
      backgroundColor: 'transparent',
      style: { fontFamily: 'inherit' }
    },
    title: { text: '' },
    xAxis: { type: 'datetime' },
    yAxis: [{
      title: { text: 'Speed (m/s)' },
      min: 0,
      gridLineColor: 'rgba(255,255,255,0.08)'
    },{
      title: { text: 'Direction (°)' },
      min: 0,
      max: 360,
      opposite: true,
      gridLineColor: 'rgba(255,255,255,0.08)'
    }],
    series: [
      {
        name: 'Wind Speed',
        data: [],
        yAxis: 0,
        color: '#4facfe'
      },
      {
        name: 'Wind Direction',
        data: [],
        yAxis: 1,
        color: '#2f8de8'
      }
    ]
  });

  let gaugeOptions = {
    chart: {
      type: 'solidgauge',
      backgroundColor: 'transparent',
      style: { fontFamily: 'inherit' }
    },
    title: { text: '' },
    pane: {
      center: ['50%', '85%'],
      size: '140%',
      startAngle: -90,
      endAngle: 90,
      background: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        innerRadius: '60%',
        outerRadius: '100%',
        shape: 'arc'
      }
    },
    tooltip: { enabled: false },
    yAxis: {
      min: 0, max: 100,
      stops: [[0.4, '#DF5353'], [0.7, '#DDDF0D'], [0.9, '#55BF3B']],
      lineWidth: 0, tickWidth: 0, minorTickInterval: null, labels: { y: 16 }
    },
    plotOptions: {
      solidgauge: { dataLabels: { y: 5, borderWidth: 0, useHTML: true } }
    },
    series: [{
      name: 'Prediction',
      data: [0],
      dataLabels: {
        format: '<div style="text-align:center"><span style="font-size:25px">{y}%</span><br/><span style="font-size:12px;opacity:0.6">Readiness</span></div>'
      }
    }]
  };

  let predictGauge = Highcharts.chart('predictGauge', Highcharts.merge(gaugeOptions));

  // ========== SENSOR POLLING ==========

  setInterval(() => {
    const time = (new Date()).getTime();

    // Poll pH sensor
    fetch("/ph").then(r => r.json()).then(d => {
      phChart.series[0].addPoint([time, d.ph], true, phChart.series[0].data.length > 20);
    }).catch(console.error);

    // Poll turbidity sensor
    fetch("/turbidity").then(r => r.json()).then(d => {
      turbChart.series[0].addPoint([time, d.ntu], true, turbChart.series[0].data.length > 20);
    }).catch(console.error);

    // Poll temperature sensor
    fetch("/temp").then(r => r.json()).then(d => {
      tempChart.series[0].addPoint([time, d.temp], true, tempChart.series[0].data.length > 20);
    }).catch(console.error);

    // Poll prediction
    fetch("/predict").then(r => r.json()).then(d => {
      predictGauge.series[0].setData([d.score]);
    }).catch(console.error);

    // Poll ultrasonic sensor
    fetch("/ultrasonic").then(r => r.json()).then(d => {
      ultraChart.series[0].addPoint([time, d.distance], true, ultraChart.series[0].data.length > 20);
    }).catch(console.error);

    // Poll wind data
    fetch("/wind").then(r => r.json()).then(d => {
      windChart.series[0].addPoint([time, d.windspeed], true, windChart.series[0].data.length > 20);
      windChart.series[1].addPoint([time, d.winddirection], true, windChart.series[1].data.length > 20);
    }).catch(console.error);

  }, 3000);

  // ========== OIL STATUS MONITORING ==========

  setInterval(() => {
    fetch("/oil_detected").then(res => res.text()).then(data => {
      const isOil = (data.trim() === "true");
      const badge = document.getElementById("waterQuality");
      const title = document.getElementById("title");

      if (isOil) {
        badge.innerHTML = '<i class="fas fa-exclamation-triangle"></i> OIL DETECTED - CRITICAL';
        badge.style.background = 'linear-gradient(135deg, rgba(231, 76, 60, 0.9), rgba(192, 57, 43, 0.9))';
        badge.style.boxShadow = '0 6px 20px rgba(231, 76, 60, 0.6), 0 0 30px rgba(231, 76, 60, 0.5)';
        badge.style.animation = 'emergencyPulse 1s infinite alternate';
        title.innerHTML = '⚠️ JALSAAFI - OIL DETECTED ⚠️';
      } else {
        badge.innerHTML = '<i class="fas fa-check-circle"></i> Water Quality: Excellent';
        badge.style.background = 'linear-gradient(135deg, rgba(79, 172, 254, 0.9), rgba(47, 141, 232, 0.9))';
        badge.style.boxShadow = '0 6px 20px rgba(79, 172, 254, 0.4), 0 0 25px rgba(79, 172, 254, 0.3)';
        badge.style.animation = 'badgeGlow 2s infinite alternate';
        title.innerHTML = 'JALSAAFI DASHBOARD';
      }
    }).catch(console.error);
  }, 2000);

  // ========== CSV DOWNLOAD ==========

  function downloadCSV() {
    const link = document.createElement("a");
    link.href = "/csv";
    link.download = "jalsaafi_data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // ========== INITIALIZE ON LOAD ==========

  document.addEventListener('DOMContentLoaded', function() {
    createFloatingDots();

    // Create download button
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'btn btn-success';
    downloadBtn.style.margin = '25px auto';
    downloadBtn.style.display = 'block';
    downloadBtn.style.padding = '18px 45px';
    downloadBtn.style.fontSize = '1.2rem';
    downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download All Sensor Data (CSV)';
    downloadBtn.onclick = downloadCSV;

    // Add download button after charts
    const chartsContainer = document.querySelector('.charts-container');
    chartsContainer.parentNode.insertBefore(downloadBtn, chartsContainer.nextSibling);
  });
</script>
</body>
</html>
)rawliteral";

// ===== Open-Meteo fetcher =====
void fetchWindData() {
  if (WiFi.status() != WL_CONNECTED) return;

  WiFiClientSecure client;
  client.setInsecure(); // skip certificate validation on ESP32

  HTTPClient http;
  String url = "https://api.open-meteo.com/v1/forecast?latitude=" + String(LATITUDE, 6) +
               "&longitude=" + String(LONGITUDE, 6) + "&current_weather=true";

  if (!http.begin(client, url)) {
    Serial.println("[Open-Meteo] HTTP begin failed");
    return;
  }

  int httpCode = http.GET();
  if (httpCode == 200) {
    String payload = http.getString();
    StaticJsonDocument<2048> doc;
    DeserializationError err = deserializeJson(doc, payload);
    if (!err) {
      windSpeed = doc["current_weather"]["windspeed"] | 0.0f;         // m/s
      windDirection = doc["current_weather"]["winddirection"] | 0.0f; // degrees
      Serial.printf("[Open-Meteo] Wind: %.2f m/s, %.1f°\n", windSpeed, windDirection);
    } else {
      Serial.print("[Open-Meteo] JSON parse error: ");
      Serial.println(err.c_str());
    }
  } else {
    Serial.printf("[Open-Meteo] HTTP error: %d\n", httpCode);
  }
  http.end();
}

// ===== Periodic sensor sampling =====
// Reads pH, turbidity, and temperature together into the cached globals and
// appends one complete CSV row. Runs on a timer from loop() rather than being
// triggered piecemeal by each dashboard fetch, so a row is never a mix of
// readings taken moments apart, and csvIndex only advances once per sample.
unsigned long lastSampleTime = 0;
const unsigned long sampleInterval = 2000; // ms

// Turbidity sensor calibration is not done yet. Until a real voltage->NTU
// curve is measured for this board, say so honestly instead of presenting
// random numbers as sensor data.
bool turbidityCalibrated = false;

void sampleSensors() {
  // --- pH ---
  int phRaw = analogRead(PH_PIN);
  float phVoltage = phRaw * (3.3f / 4095.0f);
  float slope = 0.18f;
  float neutralVoltage = 2.5f;
  float ph = 7.0f + ((neutralVoltage - phVoltage) / slope);
  ph = constrain(ph, 0.0f, 14.0f);
  phValue = ph;

  // --- Turbidity ---
  // Reads the actual sensor pin. Without a calibration curve this raw-to-NTU
  // mapping is a placeholder linear estimate, not a validated conversion —
  // turbidityCalibrated stays false until one is measured, and that flag is
  // surfaced in the /turbidity JSON response so the dashboard can be honest
  // about it, per the project's "label demo data" rule.
  int turbRaw = analogRead(TURBIDITY_PIN);
  float turbNTU = turbRaw * (1000.0f / 4095.0f);
  turbidityValue = (int)turbNTU;

  // --- Temperature ---
  sensors.requestTemperatures();
  float adjustedTemp = 0.0f;
  if (sensors.getDeviceCount() > 0) {
    float rawTemp = sensors.getTempCByIndex(0);
    adjustedTemp = rawTemp;
    if (ph < 6.5f) adjustedTemp += 1.5f;
    else if (ph >= 7.0f && ph <= 9.3f) adjustedTemp -= 0.5f;
    adjustedTemp = constrain(adjustedTemp, 0.0f, 60.0f);
  }
  temperatureC = adjustedTemp;

  // --- One consistent CSV row per sample ---
  csvData[csvIndex].ph = ph;
  csvData[csvIndex].turb = turbNTU;
  csvData[csvIndex].temp = adjustedTemp;
  csvData[csvIndex].timestamp = millis();
  csvIndex = (csvIndex + 1) % MAX_RECORDS;
}

void setup() {
  Serial.begin(115200);

  // Pins
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
  pinMode(SKIMMER_MOTOR, OUTPUT); pinMode(MSC_MOTOR, OUTPUT);

  // Servos
  servo1.attach(SERVO1_PIN);

  sensors.begin();

  // WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println("\nWiFi connected. IP: " + WiFi.localIP().toString());

  // --- Routes ---
  // The Next.js Control Center dashboard fetches these endpoints from a
  // different origin (e.g. http://localhost:3000), so every response needs
  // an Access-Control-Allow-Origin header or the browser silently blocks it.
  // Plain GET requests with no custom headers aren't preflighted, so this
  // response header alone is enough — no OPTIONS handler needed.
  server.on("/", []() {
    server.send_P(200, "text/html", index_html);
  });

  server.on("/ultrasonic", []() {
    long duration;
    float distance;

    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);

    duration = pulseIn(ECHO_PIN, HIGH, 30000); // 30 ms timeout
    if (duration == 0) distance = 0;
    else distance = duration * 0.034f / 2.0f;

    String json = "{\"distance\":" + String(distance, 2) + "}";
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "application/json", json);
  });

  server.on("/ph", []() {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "application/json", "{\"ph\":" + String(phValue, 2) + "}");
  });

  server.on("/turbidity", []() {
    String json = "{\"ntu\":" + String(turbidityValue) +
                  ",\"calibrated\":" + String(turbidityCalibrated ? "true" : "false") + "}";
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "application/json", json);
  });

  server.on("/temp", []() {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    if (sensors.getDeviceCount() == 0) {
      server.send(200, "application/json", "{\"temp\":0.0, \"error\":\"No sensor detected\"}");
      return;
    }
    server.send(200, "application/json", "{\"temp\":" + String(temperatureC, 2) + "}");
  });

  // Servo control (always moves servo1, ignores id)
  server.on("/servo", []() {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    if (server.hasArg("angle")) {
      int angle = constrain(server.arg("angle").toInt(), 0, 180);
      servo1.write(angle);
      server.send(200, "text/plain", "Servo moved");
    } else {
      server.send(400, "text/plain", "Missing angle parameter");
    }
  });

  // Motor control
  server.on("/motor", []() {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    if (!server.hasArg("dir")) {
      server.send(400, "text/plain", "Missing direction");
      return;
    }

    String dir = server.arg("dir");
    if (dir == "forward") {
      digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
      digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);
    } else if (dir == "backward") {
      digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH);
      digitalWrite(IN3, LOW); digitalWrite(IN4, HIGH);
    } else if (dir == "left") {
      digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH);
      digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);
    } else if (dir == "right") {
      digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
      digitalWrite(IN3, LOW); digitalWrite(IN4, HIGH);
    } else if (dir == "stop") {
      digitalWrite(IN1, LOW); digitalWrite(IN2, LOW);
      digitalWrite(IN3, LOW); digitalWrite(IN4, LOW);
    } else {
      server.send(400, "text/plain", "Unknown direction");
      return;
    }
    server.send(200, "text/plain", "Motor command executed");
  });

  server.on("/predict", []() {
    int score = 0;
    if (phValue >= 6.5f && phValue <= 8.5f) score += 35;
    if (temperatureC >= 20.0f && temperatureC <= 30.0f) score += 35;
    if (turbidityValue < 500) score += 30;
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "application/json", "{\"score\":" + String(score) + "}");
  });

  // Manual conveyor control: GET /conveyor?state=on|off
  // Drives the same skimmer/oleophilic-sheet belt motors that used to be
  // tied to oilDetected — staff now start/stop the belt directly from the dashboard.
  server.on("/conveyor", []() {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    if (server.hasArg("state")) {
      conveyorOn = (server.arg("state") == "on");
    }
    server.send(200, "application/json", String("{\"conveyor\":") + (conveyorOn ? "true" : "false") + "}");
  });

  // Oil status: GET /oil_detected?value=true|false
  server.on("/oil_detected", []() {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    if (server.hasArg("value")) {
      oilDetected = (server.arg("value") == "true");
      server.send(200, "text/plain", "Oil detection status updated");
    } else {
      server.send(200, "text/plain", oilDetected ? "true" : "false");
    }
  });

  server.on("/csv", []() {
    String csv = "Timestamp(ms),pH,Turbidity,Temperature\n";
    for (int i = 0; i < MAX_RECORDS; i++) {
      int idx = (csvIndex + i) % MAX_RECORDS;
      if (csvData[idx].timestamp == 0) continue;
      csv += String(csvData[idx].timestamp) + "," +
             String(csvData[idx].ph, 2) + "," +
             String(csvData[idx].turb, 2) + "," +
             String(csvData[idx].temp, 2) + "\n";
    }
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "text/csv", csv);
  });

  // Wind endpoint
  server.on("/wind", []() {
    String json = "{\"windspeed\":" + String(windSpeed, 2) +
                  ",\"winddirection\":" + String(windDirection, 2) + "}";
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "application/json", json);
  });

  // Location update endpoint
  server.on("/set_location", HTTP_GET, []() {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    if (server.hasArg("lat") && server.hasArg("lon")) {
      LATITUDE  = server.arg("lat").toDouble();
      LONGITUDE = server.arg("lon").toDouble();

      Serial.printf("Location updated: LAT=%.6f, LON=%.6f\n", LATITUDE, LONGITUDE);

      server.send(200, "text/plain", "Location updated");

      fetchWindData();      // immediate refresh after new coords
      lastWindFetch = millis();
    } else {
      server.send(400, "text/plain", "Missing lat/lon parameters");
    }
  });

  server.begin();

  // Initial fetch so dashboard has data quickly
  fetchWindData();
  lastWindFetch = millis();
  sampleSensors();
  lastSampleTime = millis();
}

void loop() {
  server.handleClient();
  // Manual on/off — see the /conveyor endpoint and the comment by conveyorOn.
  digitalWrite(SKIMMER_MOTOR, conveyorOn ? HIGH : LOW);
  digitalWrite(MSC_MOTOR, conveyorOn ? HIGH : LOW);

  if (millis() - lastSampleTime > sampleInterval) {
    sampleSensors();
    lastSampleTime = millis();
  }

  if (millis() - lastWindFetch > windInterval) {
    fetchWindData();
    lastWindFetch = millis();
  }
}
