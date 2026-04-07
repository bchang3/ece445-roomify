#include "API.h"

void fetchRemotes(String boardSerial) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClientSecure client;
    client.setInsecure(); // Skip SSL cert validation for dev
    
    HTTPClient http;
    
    // Construct the full URL
    String url = "https://roomify.overunderdev.com/remotes/" + boardSerial;
    
    Serial.print("Fetching remotes from: ");
    Serial.println(url);

    http.begin(client, url);
    int httpResponseCode = http.GET();

    if (httpResponseCode == 200) {
      String payload = http.getString();
      Serial.println("Data received:");
      Serial.println(payload);

      DynamicJsonDocument doc(4096); 
      DeserializationError error = deserializeJson(doc, payload);

      if (!error) {
        JsonArray remotes = doc["remotes"];

        for (JsonObject item : remotes) {
          if (remoteCount < 20) {
            stored_remotes[remoteCount].id = item["id"].as<String>();
            stored_remotes[remoteCount].name = item["name"].as<String>();
            stored_remotes[remoteCount].deviceType = item["device_type"].as<String>();
            remoteCount++;
          }
        }
        Serial.printf("Successfully loaded %d remotes.\n", remotes.size());
      } else {
        Serial.print("JSON Parsing failed: ");
        Serial.println(error.c_str());
      }
    } else {
      Serial.printf("Error code: %d\n", httpResponseCode);
    }
    
    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }
}


void fetchButtons(String remoteID) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi Disconnected");
    return;
  }

  WiFiClientSecure client;
  client.setInsecure();
  
  HTTPClient http;
  String url = "https://roomify.overunderdev.com/buttons/" + remoteID;
  
  Serial.printf("Fetching buttons for remote: %s\n", remoteID.c_str());

  http.begin(client, url);
  int httpResponseCode = http.GET();

  if (httpResponseCode == 200) {
    String payload = http.getString();
    
    // Buttons can be heavy if IR strings are long; 8KB is safer
    DynamicJsonDocument doc(8192); 
    DeserializationError error = deserializeJson(doc, payload);

    if (!error) {
      JsonArray buttons = doc["buttons"];
      activeButtonCount = 0; // Reset the count for the new remote

      for (JsonObject item : buttons) {
        if (activeButtonCount < 24) {
          activeButtons[activeButtonCount].id = item["id"].as<String>();
          activeButtons[activeButtonCount].name = item["name"].as<String>();
          activeButtons[activeButtonCount].command = item["command"].as<String>();
          activeButtonCount++;
        }
      }
      Serial.printf("Successfully loaded %d buttons.\n", activeButtonCount);
    } else {
      Serial.print("JSON Parsing failed: ");
      Serial.println(error.c_str());
    }
  } else {
    Serial.printf("HTTP Error: %d\n", httpResponseCode);
  }
  
  http.end();
}