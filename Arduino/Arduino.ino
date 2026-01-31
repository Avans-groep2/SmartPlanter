#include <lmic.h>
#include <hal/hal.h>
#include <SPI.h>
#include <math.h>

#include "Waterflow.h"
#include "PHSensor.h"
#include "Temperatuur.h"
#include "LightSensor.h"
#include "ECSensor.h"

/* ================= RELAY CONFIG ================= */
#define RELAY_PIN 4             // Pin van het relais
#define RELAY_DURATION 30000     // Hoe lang het relais aan blijft in milliseconden (5000 = 5s)

bool relayState = false;        // huidige status relais
unsigned long relayOffTime = 0; // tijdstip waarop het relais weer uit moet
bool relayActive = false;       // geeft aan of relais momenteel aan staat
/* ================================================= */

PHSensor phSensor(A0);
TemperatuurSensor TemperatuurSensor(3);
ECSensor ecSensor(A1);
LightSensor LightSensor(A2);
WaterFlow WaterflowSensorBegin(A4, 7.5);
WaterFlow WaterflowSensorEind(A5, 7.5);

// variables
int roundFlowBegin, roundFlowEind;
volatile int pulseCountBegin, pulseCountEind;
bool stateBegin, stateEind;

// LoRaWAN keys
static const PROGMEM u1_t NWKSKEY[16] = { 0xE7,0x80,0x4E,0xFE,0xAE,0x2E,0x89,0xA4,0x9A,0x95,0x1E,0x14,0x3C,0xE2,0x1F,0x51 };
static const u1_t PROGMEM APPSKEY[16] = { 0x8D,0x08,0x04,0x95,0xF2,0x6C,0xEA,0x16,0x86,0x1A,0x24,0xF0,0xDE,0xCA,0x9A,0x61 };
static const u4_t DEVADDR = 0x260BE532;

void os_getArtEui(u1_t* buf) {}
void os_getDevEui(u1_t* buf) {}
void os_getDevKey(u1_t* buf) {}

static osjob_t sendjob, scanjob;

const unsigned TX_INTERVAL = 20;
const unsigned SCAN_INTERVAL = 1;

const lmic_pinmap lmic_pins = {
  .nss = 10,
  .rxtx = LMIC_UNUSED_PIN,
  .rst = 9,
  .dio = { 2, 6, 7 },
};

/* ================= LMIC EVENT ================= */
void onEvent(ev_t ev) {
  Serial.print(os_getTime());
  Serial.print(": ");
  if (ev == EV_TXCOMPLETE) {
    Serial.println(F("EV_TXCOMPLETE"));
    os_setTimedCallback(&sendjob, os_getTime() + sec2osticks(TX_INTERVAL), do_send);
  }
}
/* ============================================== */

/* ================= RELAY FUNCTIONS ============= */

// Zet relais aan voor RELAY_DURATION milliseconden
void relayOnFor(unsigned long durationMs) {
  relayState = true;
  relayActive = true;
  relayOffTime = millis() + durationMs;
  digitalWrite(RELAY_PIN, HIGH);
  Serial.println("Relais AAN");
}

// Controleer of relais moet worden uitgezet
void relayUpdate() {
  if (relayActive && millis() >= relayOffTime) {
    relayState = false;
    relayActive = false;
    digitalWrite(RELAY_PIN, LOW);
    Serial.println("Relais UIT");
  }
}

/* ============================================== */

void do_scan(osjob_t* j) {
  float flowRateBegin = pulseCountBegin / 7.5;
  float flowRateEind  = pulseCountEind  / 7.5;

  roundFlowBegin = (int)round(flowRateBegin);
  roundFlowEind  = (int)round(flowRateEind);

  pulseCountBegin = 0;
  pulseCountEind  = 0;

  os_setTimedCallback(&scanjob, os_getTime() + sec2osticks(SCAN_INTERVAL), do_scan);
}

void do_send(osjob_t* j) {
  float tempVal = TemperatuurSensor.readTemperatureC();
  float phVal   = phSensor.readPH(tempVal);
  uint16_t lightVal = LightSensor.readLight();
  float ecVal   = ecSensor.readEC();

  uint16_t phInt   = phVal * 100;
  uint16_t tempInt = tempVal * 100;
  uint16_t ecInt   = ecVal * 100;

  uint8_t payload[10];
  payload[0] = highByte(phInt);
  payload[1] = lowByte(phInt);
  payload[2] = highByte(tempInt);
  payload[3] = lowByte(tempInt);
  payload[4] = highByte(lightVal);
  payload[5] = lowByte(lightVal);
  payload[6] = roundFlowBegin;
  payload[7] = roundFlowEind;
  payload[8] = highByte(ecInt);
  payload[9] = lowByte(ecInt);

  if (!(LMIC.opmode & OP_TXRXPEND)) {
    LMIC_setTxData2(1, payload, sizeof(payload), 0);

    /* >>> RELAIS AAN VOOR INGESTELDE TIJD <<< */
    if (!relayActive) relayOnFor(RELAY_DURATION);
  }
}

ISR(PCINT1_vect) {
  bool r1 = digitalRead(A4);
  if (r1 && !stateBegin) { pulseCountBegin++; stateBegin = true; }
  if (!r1 && stateBegin) stateBegin = false;

  bool r2 = digitalRead(A5);
  if (r2 && !stateEind) { pulseCountEind++; stateEind = true; }
  if (!r2 && stateEind) stateEind = false;
}

void setup() {
  Serial.begin(115200);

  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);

  phSensor.begin();
  TemperatuurSensor.begin();
  WaterflowSensorBegin.begin();
  WaterflowSensorEind.begin();

  PCICR  |= B00000010;
  PCMSK1 |= B00110000;

  os_init();
  LMIC_reset();

  uint8_t appskey[16];
  uint8_t nwkskey[16];
  memcpy_P(appskey, APPSKEY, 16);
  memcpy_P(nwkskey, NWKSKEY, 16);
  LMIC_setSession(0x1, DEVADDR, nwkskey, appskey);

  LMIC_setLinkCheckMode(0);
  LMIC.dn2Dr = DR_SF9;
  LMIC_setDrTxpow(DR_SF7, 14);

  do_send(&sendjob);
  do_scan(&scanjob);
}

void loop() {
  os_runloop_once();

  // Update relais onafhankelijk van alles
  relayUpdate();
}
