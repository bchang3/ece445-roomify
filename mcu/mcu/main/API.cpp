#include "API.h"


const int port = 80;
const char* server = "roomify.overunderdev.com";

char ssid[] = SECRET_SSID;    
char pass[] = SECRET_PASS;
int wifi_status = WL_IDLE_STATUS;

void pollCommands(String boardSerial) {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;

  String url = "http://roomify.overunderdev.com/commands/" + boardSerial;
  http.begin(url);
  int httpResponseCode = http.GET();

  if (httpResponseCode == 200) {
    String payload = http.getString();
    DynamicJsonDocument doc(4096); 
    DeserializationError error = deserializeJson(doc, payload);

    http.end();

    if (!error) {
      JsonArray commands = doc.as<JsonArray>();

      for (JsonObject cmd : commands) {
        String cmdId = cmd["id"].as<String>();
        String hexString = cmd["command"].as<String>();
        String deviceHeader = cmd["device_header"].as<String>();


        uint16_t code = strtoul(hexString.c_str(), NULL, 0);
        uint16_t header = strtoul(deviceHeader.c_str(), NULL, 0);


        Serial.printf("Executing Command: %s, %s\n", deviceHeader.c_str(), hexString.c_str());

        sendNEC(header, code);

        String completeUrl = "http://roomify.overunderdev.com/commands/" + cmdId + "/complete";
        HTTPClient httpPost;
        httpPost.begin(completeUrl);
        int postCode = httpPost.POST(""); 
        
        if (postCode == 200) {
          Serial.printf("Command %s marked 'done'.\n", cmdId.c_str());
        }
        httpPost.end();

        delay(100); 
      }
    }
  } else {
    Serial.printf("Error occurred: %s\n", http.errorToString(httpResponseCode).c_str());
    http.end();
  }

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
  // Serial.println("\nStarting connection to server...");

  // if (client.connect(server, port)) {
  //   Serial.println("Connected to server.");
  // } else {
  //   Serial.println("Connection to server failed.");
  // }
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
