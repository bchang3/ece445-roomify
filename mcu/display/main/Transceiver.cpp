#include "Transceiver.h"

void initTransceiver() {
  IrSender.begin(IR_TRANSMIT_PIN);
  IrReceiver.begin(IR_RECEIVE_PIN, true);
  IrReceiver.stop();
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
