#include "API.h"

Preset remotePresets[8];
int presetCount = 0;
const char* serverUrl = "http://roomify.overunderdev.com";

void fetchPresets(String serial) {
    HTTPClient http;
    String url = String(serverUrl) + "/presets/" + serial;
    
    if (http.begin(url)) {
        int httpCode = http.GET();
        if (httpCode == HTTP_CODE_OK) {
            DynamicJsonDocument doc(2048);
            deserializeJson(doc, http.getString());
            JsonArray arr = doc["presets"];
            
            presetCount = 0;
            for (JsonObject v : arr) {
                if (presetCount < 8) {
                    remotePresets[presetCount].id = v["id"].as<String>();
                    remotePresets[presetCount].name = v["name"].as<String>();
                    presetCount++;
                }
            }
        }
        http.end();
    }
}

void triggerPreset(String serial, String presetId) {
    HTTPClient http;

    String url = String(serverUrl) + "/presets/play";

    if (http.begin(url)) {
        http.addHeader("Content-Type", "application/json");

        String jsonPayload = "{";
        jsonPayload += "\"board_serial\":\"" + serial + "\",";
        jsonPayload += "\"preset_id\":\"" + presetId + "\"";
        jsonPayload += "}";

        int httpCode = http.POST(jsonPayload);

        Serial.printf("Preset POST Response: %d\n", httpCode);

        if (httpCode > 0) {
            String response = http.getString();
            Serial.println(response);
        } else {
            Serial.printf("Request failed: %s\n", http.errorToString(httpCode).c_str());
        }

        http.end();
    } else {
        Serial.println("Failed to connect to server");
    }
}

void postCapture(String serial, String deviceHeader, String command) {
    HTTPClient http;

    String url = String(serverUrl) + "/captures";

    if (http.begin(url)) {
        http.addHeader("Content-Type", "application/json");

        String jsonPayload = "{";
        jsonPayload += "\"board_serial\":\"" + serial + "\",";
        jsonPayload += "\"device_header\":\"" + deviceHeader + "\",";
        jsonPayload += "\"command\":\"" + command + "\"";
        jsonPayload += "}";

        int httpCode = http.POST(jsonPayload);

        Serial.printf("Capture POST Response: %d\n", httpCode);

        if (httpCode > 0) {
            String response = http.getString();
            Serial.println(response);
        } else {
            Serial.printf("Request failed: %s\n", http.errorToString(httpCode).c_str());
        }

        http.end();
    } else {
        Serial.println("Failed to connect to server");
    }
}

bool getPollingState(String boardSerial) {

  HTTPClient http;

  String url = "http://roomify.overunderdev.com/board/" + boardSerial;
  http.begin(url);

  int httpResponseCode = http.GET();

  if (httpResponseCode == 200) {
    String payload = http.getString();
    http.end();

    DynamicJsonDocument doc(512);
    DeserializationError error = deserializeJson(doc, payload);

    if (error) {
      Serial.println("JSON parse failed");
      return false;
    }

    bool polling = doc["polling"] | false;

    Serial.printf("Polling state: %s\n", polling ? "true" : "false");

    return polling;
  } else {
    Serial.printf("Error getting polling state: %s\n",
      http.errorToString(httpResponseCode).c_str());
    http.end();
    return false;
  }
}