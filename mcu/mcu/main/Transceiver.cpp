#include "Transceiver.h"
#include <IRremote.hpp>

// Your pin array
int pins[] = {1, 2, 45, 11, 14, 13, 10, 9};
int pinCount = sizeof(pins) / sizeof(pins[0]);

void initTransceiver() {
  IrSender.begin(pins[0]);
}

void sendNEC(uint16_t device_header, uint16_t command) {
  for (int i = 0; i < pinCount; i++) {
    IrSender.setSendPin(pins[i]);
    IrSender.sendNEC(device_header, command, 0);
    delay(50); 
  }
}