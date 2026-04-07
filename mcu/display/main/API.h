#ifndef API_H
#define API_H

#include <Arduino.h>
#include <HTTPClient.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include "Remotes.h"
#include "RemoteDetails.h"

extern WiFiClientSecure client;

extern Remote stored_remotes[12];
extern int remoteCount;

extern RemoteButton activeButtons[24];
extern int activeButtonCount;

void fetchRemotes(String boardSerial);
void fetchButtons(String remoteID);
#endif