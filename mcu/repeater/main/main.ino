
#include "arduino_secrets.h" 
#include "API.h"
#include "Transceiver.h"

// REPEATER 
String boardSerial = SERIAL_NUMBER;

unsigned long lastPollTime = 0;
const unsigned long pollInterval = 250;

void setup() {
  Serial.begin(115200);
  connectToWifiAndServer();
  initTransceiver();
}

void loop() {
  if (millis() - lastPollTime > pollInterval) {
    pollCommands(boardSerial);
    lastPollTime = millis();
  }
}
