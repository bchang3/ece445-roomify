#include "WiFiS3.h"
#include "arduino_secrets.h" 
#include "Arduino_LED_Matrix.h"
#include <IRremote.hpp>
#define DECODE_NEC

#define IR_TRANSMIT_PIN 3
#define IR_RECEIVE_PIN 7
#define BUTTON_PIN 2

ArduinoLEDMatrix matrix;

char ssid[] = SECRET_SSID;    
char pass[] = SECRET_PASS;
char serverAddress[] = "100.27.128.63:3333"; 


int status = WL_IDLE_STATUS;
int preset = 0;

IPAddress server(100,27,128,63); 

WiFiClient client;


const uint32_t happy[] = {
    0x19819,
    0x80000001,
    0x81f8000
  };



struct Preset {
  const char* name;
  uint32_t code;
};

Preset presets[] = {
  {"blue", 0x45},
  {"white", 0x44},
  {"yellow", 0x50},
  {"green", 0x59},
  {"flashing", 0x05},
};

// mini projector address: 0x88
// right 0x51
// left 0x4F
// up e8
// down 0x16
// back 0x18
// home 0x19
// netflix 0x58
// youtube 0x55
const int numPresets = sizeof(presets) / sizeof(presets[0]);

const uint32_t heart[] = {
      0x3184a444,
      0x44042081,
      0x100a0040
  };


/* -------------------------------------------------------------------------- */
void read_response() {
/* -------------------------------------------------------------------------- */  
  uint32_t received_data_num = 0;
  while (client.available()) {
    char c = client.read();
    Serial.print(c);
    received_data_num++;
    if(received_data_num % 80 == 0) { 
      Serial.println();
    }
  }  
}

/**
 * Map protocol enum to human-readable string
 */
const char* protocolToString(decode_type_t protocol) {
    switch (protocol) {
        case NEC: return "NEC";
        case SONY: return "SONY";
        case RC5: return "RC5";
        case RC6: return "RC6";
        case PANASONIC: return "PANASONIC";
        case JVC: return "JVC";
        case SAMSUNG: return "SAMSUNG";
        case WHYNTER: return "WHYNTER";
        case LEGO_PF: return "LEGO_PF";
        case UNKNOWN: return "UNKNOWN";
        default: return "OTHER";
    }
}

uint32_t getNECCode(const IRData &irData) {
    if (irData.protocol != NEC) {
        // Serial.print(F("Warning: Protocol "));
        // Serial.print(protocolToString(irData.protocol));
        // Serial.println(F(" is not NEC; cannot reconstruct 32-bit code"));
        return 0;
    }


    uint32_t code = 0;

    code |= ((uint32_t)(irData.address & 0xFF)) << 24;        // address
    code |= ((uint32_t)(~irData.address & 0xFF)) << 16;       // inverted address
    code |= ((uint32_t)(irData.command & 0xFF)) << 8;         // command
    code |= ((uint32_t)(~irData.command & 0xFF));             // inverted command

    return code;
}

/* -------------------------------------------------------------------------- */
void setup() {
/* -------------------------------------------------------------------------- */  
  Serial.begin(9600);
  matrix.begin();
  pinMode(BUTTON_PIN, INPUT_PULLUP); 

  
  matrix.loadFrame(happy);
  delay(500);

  IrSender.begin(IR_TRANSMIT_PIN);
  IrReceiver.begin(IR_RECEIVE_PIN, true);
  
  Serial.print(F("Ready to receive IR signals of protocols: "));
  printActiveIRProtocols(&Serial);
  Serial.println("at pin " + String(IR_RECEIVE_PIN));

  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  
  // check for the WiFi module:
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    // don't continue
    while (true);
  }
  
  String fv = WiFi.firmwareVersion();
  if (fv < WIFI_FIRMWARE_LATEST_VERSION) {
    Serial.println("Please upgrade the firmware");
  }
  
  // attempt to connect to WiFi network:
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(ssid);

    status = WiFi.begin(ssid, pass);
     
    // wait 10 seconds for connection:
    delay(10000);
  }
  
  printWifiStatus();

  matrix.loadFrame(heart);

 
  Serial.println("\nStarting connection to server...");

  if (client.connect(server, 3333)) {
    Serial.println("connected to server");
  }
}


/* -------------------------------------------------------------------------- */
void loop() {
/* -------------------------------------------------------------------------- */  
  // debug server response
  // read_response();

  // check for button click
  static int lastState = HIGH;
  int currentState = digitalRead(BUTTON_PIN);
  int sent = 0;
  // detect button press (HIGH -> LOW)
  if (lastState == HIGH && currentState == LOW) {
    preset++;
    if (preset >= numPresets) preset = 0;
    Serial.print("Switched to preset: ");
    Serial.println(preset);

    uint16_t codeToSend = presets[preset].code;
    Serial.print("Sending LED " + String(presets[preset].name) + " " + "code: 0x");
    Serial.println(codeToSend, HEX);

    // LED lights
    IrSender.sendNEC(0x00, codeToSend, 3);

    delay(500);
    // mini projector
    
    IrSender.sendNEC(0x88, 0x55, 3);

    delay(500);
    sent = 1;
  }

  lastState = currentState;
  delay(50); // simple debounce

  if (sent == 1) {
    return;
  }

  if (IrReceiver.decode()) {

        /*
         * Print a summary of received data
         */
        if (IrReceiver.decodedIRData.protocol == UNKNOWN) {
            // Serial.println(F("Received noise or an unknown (or not yet enabled) protocol"));

            // // unknown protocol
            // IrReceiver.printIRResultRawFormatted(&Serial, true);
            IrReceiver.resume(); 
            return;
        } else {
            IrReceiver.resume(); // Early enable receiving of the next IR frame
            // IrReceiver.printIRResultShort(&Serial);
            // IrReceiver.printIRSendUsage(&Serial);
        }
        Serial.println();
        IrReceiver.printIRSendUsage(&Serial);
        

        if (client.connect(server, 3333)) {
          // Serial.println("connected to server");
          String payload;
          String irCode = "0x" + String(getNECCode(IrReceiver.decodedIRData), HEX);
          String hexString = "0x" + String(IrReceiver.decodedIRData.command, HEX);
          if (irCode != "0x0") {
            Serial.println("Received: " + irCode);
          }
          

          payload = String("{\"action\":\"play_music\",\"command\":\"") + String(hexString) +String("\"}");
          
          String httpRequest = String("POST /api/play_music HTTP/1.1\r\n") +
                              "Host: http://100.27.128.63:3333\r\n" +
                              "Content-Type: application/json\r\n" +
                              "Content-Length: " + String(payload.length()) + "\r\n" +
                              "Connection: close\r\n\r\n" +  // End of headers
                              payload;                      // JSON payload

          client.print(httpRequest);
          client.println("Connection: close");
        }
        
    }
}

/* -------------------------------------------------------------------------- */
void printWifiStatus() {
/* -------------------------------------------------------------------------- */  
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your board's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");
}