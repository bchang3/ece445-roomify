#ifndef TRANSCEIVER_H
#define TRANSCEIVER_H

#include <Arduino.h>

void initTransceiver();
void sendNEC(uint16_t device_header, uint16_t command);
#endif