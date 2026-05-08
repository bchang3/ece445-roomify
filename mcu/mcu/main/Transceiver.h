#ifndef TRANSCEIVER_H
#define TRANSCEIVER_H

#define IR_TRANSMIT_PIN 5
#define IR_RECEIVE_PIN 3

#include <Arduino.h>

void initTransceiver();
void receiveSignal();
void sendNEC(uint16_t device_header, uint16_t command);
#endif