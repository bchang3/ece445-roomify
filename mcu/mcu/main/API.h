#ifndef API_H
#define API_H

#include "arduino_secrets.h" 
#include <Arduino.h>
#include <HTTPClient.h>
#include <WiFi.h>
#include <ArduinoJson.h>
#include "Transceiver.h"

extern const int port;
extern WiFiClient client;
extern const char* server;

extern char ssid[];    
extern char pass[];
extern int wifi_status;

void pollCommands(String boardSerial);
void connectToWifiAndServer();
void printWifiStatus();

#endif