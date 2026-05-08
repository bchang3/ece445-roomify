#include "Transceiver.h"
#include <IRremote.hpp>

void initTransceiver() {
  IrSender.begin(IR_TRANSMIT_PIN);
  IrReceiver.begin(IR_RECEIVE_PIN, true);
}

void receiveSignal() {
  if (IrReceiver.decode()) {
    IrReceiver.resume(); 
    if (IrReceiver.decodedIRData.protocol == UNKNOWN) {
        // // unknown protocol
        return;
    } else {
        IrReceiver.resume();
        Serial.println();
        IrReceiver.printIRSendUsage(&Serial);
    }
  }
}

void sendNEC(uint32_t command) {
  IrSender.sendNEC(0x00, command, 1);
}