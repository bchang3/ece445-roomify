#include "API.h"


const int port = 80;
const char* server = "roomify.overunderdev.com";

char ssid[] = SECRET_SSID;    
char pass[] = SECRET_PASS;
int wifi_status = WL_IDLE_STATUS;
WiFiClient wifiClient;

String commandHistory[MAX_HISTORY];
int historyIndex = 0;

// Helper to check if we've seen this ID before
bool isDuplicate(String cmdId) {
  for (int i = 0; i < MAX_HISTORY; i++) {
    if (commandHistory[i] == cmdId) {
      return true;
    }
  }
  return false;
}

// Helper to add a new ID to the circular buffer
void addToHistory(String cmdId) {
  commandHistory[historyIndex] = cmdId;
  historyIndex = (historyIndex + 1) % MAX_HISTORY; // Loop back to 0 after 31
}

void pollCommands(String boardSerial) {
  if (WiFi.status() != WL_CONNECTED) return;

  HttpClient http(wifiClient, server, port);
  String path = "/commands/" + boardSerial;
  http.get(path);

  int statusCode = http.responseStatusCode();
  
  if (statusCode == 200) {
    String payload = http.responseBody();
    DynamicJsonDocument doc(4096); 
    DeserializationError error = deserializeJson(doc, payload);

    if (!error) {
      JsonArray commands = doc.as<JsonArray>();

      for (JsonObject cmd : commands) {
        String cmdId = cmd["id"].as<String>(); // Ensure your JSON has an "id" field

        // --- DUPLICATE CHECK ---
        if (isDuplicate(cmdId)) {
          continue; // Skip this command, it's already been fired
        }

        String hexString = cmd["command"].as<String>();
        String deviceHeader = cmd["device_header"].as<String>();

        uint16_t code = (uint16_t)strtoul(hexString.c_str(), NULL, 0);
        uint16_t header = (uint16_t)strtoul(deviceHeader.c_str(), NULL, 0);

        Serial.print("Executing New Command: ");
        Serial.println(cmdId);

        sendNEC(header, code);
        
        // --- ADD TO HISTORY ---
        addToHistory(cmdId);
        
        delay(100); 
      }
    }
  } else {
    Serial.print("Error: ");
    Serial.println(statusCode);
  }
  http.stop();
}


void connectToWifiAndServer() {
  Serial.println("Connecting to WiFi");
  WiFi.begin(ssid, pass);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected!");
  
  printWifiStatus();
  delay(1000);
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
