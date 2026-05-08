#include "Transceiver.h"
#include <IRremote.hpp>


void initTransceiver() {
  IrSender.begin(7);
}

void sendNEC(uint16_t device_header, uint16_t command) {
  IrSender.sendNEC(device_header, command, 0);
}