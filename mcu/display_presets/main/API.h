#ifndef API_H
#define API_H

#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "Models.h"

extern Preset remotePresets[8];
extern int presetCount;

void fetchPresets(String serial);
void triggerPreset(String serial, String presetId);
bool getPollingState(String boardSerial);
void postCapture(String serial, String deviceHeader, String command);


#endif