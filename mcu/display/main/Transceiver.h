#ifndef TRANSCEIVER_H
#define TRANSCEIVER_H

#include <IRremote.hpp>

#define IR_TRANSMIT_PIN A1
#define IR_RECEIVE_PIN A0


void initTransceiver();
void receiveSignal();

#endif