#ifndef API_H
#define API_H

#include "arduino_secrets.h" 
#include <Arduino.h>
#include <ArduinoHttpClient.h>
#include <WiFiS3.h>
#include <ArduinoJson.h>
#include "Transceiver.h"

#define MAX_HISTORY 32

extern String commandHistory[MAX_HISTORY];
extern int historyIndex;


extern const int port;
extern WiFiClient client;
extern const char* server;

extern char ssid[];    
extern char pass[];
extern int wifi_status;

bool isDuplicate(String cmdId);
void addToHistory(String cmdId);
void pollCommands(String boardSerial);
void connectToWifiAndServer();
void printWifiStatus();

#endif