#include <Arduino.h>
#include <Arduino_GFX_Library.h>
#include <Adafruit_GFX.h>    // Core graphics library
#include <Adafruit_FT6206.h>
#include <Adafruit_CST8XX.h>
#include <WiFi.h>
#include "API.h"
#include "Models.h"
#include "arduino_secrets.h"
#include <IRremote.hpp>
#include "icons.h"

#define I2C_TOUCH_ADDR 0x48
#define IR_RECEIVE_PIN A1

// ================= DISPLAY SETUP =================

Arduino_XCA9554SWSPI *expander = new Arduino_XCA9554SWSPI(
    PCA_TFT_RESET, PCA_TFT_CS, PCA_TFT_SCK, PCA_TFT_MOSI,
    &Wire, 0x3F);

Arduino_ESP32RGBPanel *rgbpanel = new Arduino_ESP32RGBPanel(
    TFT_DE, TFT_VSYNC, TFT_HSYNC, TFT_PCLK,
    TFT_R1, TFT_R2, TFT_R3, TFT_R4, TFT_R5,
    TFT_G0, TFT_G1, TFT_G2, TFT_G3, TFT_G4, TFT_G5,
    TFT_B1, TFT_B2, TFT_B3, TFT_B4, TFT_B5,
    1, 50, 2, 44, 1, 16, 2, 18
);

Arduino_GFX *gfx = new Arduino_RGB_Display(
    720, 720, rgbpanel, 0, true,
    expander, GFX_NOT_DEFINED, NULL, 0
);

// ================= WIFI =================

unsigned long lastPollTime = 0;
const unsigned long pollInterval = 1000;
const char* ssid = SECRET_SSID;
const char* password = SECRET_PASS;
const char* boardSerial = SERIAL_NUMBER;

// ================= UI CONFIG =================

const int SCREEN_W = 720;
const int SCREEN_H = 720;
const int CENTER_X = SCREEN_W / 2;
const int CENTER_Y = SCREEN_H / 2;

const int GRID_SIZE = 4;
const int SPACING = 140;
const int OFFSET = SPACING * (GRID_SIZE - 1) / 2;

int TOUCH_RADIUS = 55;

bool touchOK = false;
bool isFocalTouch = false;
Adafruit_FT6206 focal_ctp = Adafruit_FT6206();
Adafruit_CST8XX cst_ctp = Adafruit_CST8XX();

struct Point {
  int x;
  int y;
};

Point positions[8];

bool receiving = false;

// ================= SETUP =================

void setup() {
  Serial.begin(115200);

  IrReceiver.begin(IR_RECEIVE_PIN, true);

  gfx->begin();
  gfx->fillScreen(0x0000);

  initTouch();
  generateButtonPositions();

  drawUI();

  connectToWifi();
  fetchPresets(boardSerial);
  
  drawUI(); // redraw after data loads
}

// ================= LOOP =================

void loop() {
  if (!touchOK) return;

  if (isFocalTouch && focal_ctp.touched()) {
    TS_Point p = focal_ctp.getPoint(0);

    handleTouch(p.x, p.y);
  }
  else if (!isFocalTouch && cst_ctp.touched()) {
    CST_TS_Point p = cst_ctp.getPoint(0);

    handleTouch(p.x, p.y);
  }

  if (IrReceiver.decode() && receiving) {
    if (IrReceiver.decodedIRData.protocol == UNKNOWN) {
      // Serial.println(F("Received noise or an unknown (or not yet enabled) protocol"));
      IrReceiver.resume(); 
      return;
    } else {
      Serial.println();
      IrReceiver.printIRResultShort(&Serial);
      IrReceiver.printIRSendUsage(&Serial);

      // Extract values
      uint16_t address = IrReceiver.decodedIRData.address;
      uint16_t command = IrReceiver.decodedIRData.command;

      // Convert to hex strings
      String headerHex = "0x" + String(address, HEX);
      String commandHex = "0x" + String(command, HEX);

      headerHex.toUpperCase();
      commandHex.toUpperCase();

      Serial.printf("Posting capture: %s %s\n", headerHex.c_str(), commandHex.c_str());
      postCapture(boardSerial, headerHex, commandHex);

      IrReceiver.resume();
    }
    
}

  if (millis() - lastPollTime > pollInterval) {
    receiving = getPollingState(boardSerial);
    lastPollTime = millis();
  }
}

void initTouch() {
  Wire.begin();

  if (focal_ctp.begin(0, &Wire, I2C_TOUCH_ADDR)) {
    touchOK = true;
    isFocalTouch = true;
    Serial.println("Focal Touchscreen found");
  }
  else if (cst_ctp.begin(&Wire, I2C_TOUCH_ADDR)) {
    touchOK = true;
    isFocalTouch = false;
    Serial.println("CST826 Touchscreen found");
  }
  else {
    Serial.print("No touchscreen found at 0x");
    Serial.println(I2C_TOUCH_ADDR, HEX);
    touchOK = false;
  }
}

void handleTouch(int x, int y) {
  int idx = getPressedButton(x, y);

  if (idx != -1 && idx < presetCount) {
    Serial.print("Selected preset: ");
    Serial.println(remotePresets[idx].name);

    triggerPreset(boardSerial, remotePresets[idx].id);

    // optional debounce
    delay(200);
  }
}

// ================= UI =================

int getPressedButton(int tx, int ty) {
  for (int i = 0; i < 8; i++) {
    int dx = tx - positions[i].x;
    int dy = ty - positions[i].y;

    int distSq = dx * dx + dy * dy;

    if (distSq <= TOUCH_RADIUS * TOUCH_RADIUS) {
      return i;
    }
  }
  return -1;
}

void drawUI() {
  gfx->fillScreen(0x0000);

  drawCenterText();
  drawButtons();
}

// ---------- CENTER TEXT ----------

void drawCenterText() {
  String text = "Roomify";

  gfx->setTextSize(6);
  gfx->setTextColor(0xFFFF);

  int16_t x1, y1;
  uint16_t w, h;

  gfx->getTextBounds(text, 0, 0, &x1, &y1, &w, &h);

  int x = CENTER_X - (w / 2);
  int y = CENTER_Y + (h / 2);

  gfx->setCursor(x, y);
  gfx->print(text);
}


void generateButtonPositions() {
  int spacingX = 140;
  int startX = CENTER_X - (spacingX * 3 / 2);

  int topY = CENTER_Y - 180;
  int bottomY = CENTER_Y + 180;

  int idx = 0;

  // Top row (4)
  for (int i = 0; i < 4; i++) {
    positions[idx++] = {
      startX + i * spacingX,
      topY
    };
  }

  // Bottom row (4)
  for (int i = 0; i < 4; i++) {
    positions[idx++] = {
      startX + i * spacingX,
      bottomY
    };
  }
}


void drawLabel(String text, int cx, int y) {
  gfx->setTextSize(2);        
  gfx->setTextColor(0xDEFB); 

  if (text.length() > 12) {
    text = text.substring(0, 10) + "..";
  }

  int16_t x1, y1;
  uint16_t w, h;

  gfx->getTextBounds(text, 0, 0, &x1, &y1, &w, &h);

  int x = cx - (w / 2);

  gfx->setCursor(x, y);
  gfx->print(text);
}

void drawButtons() {
  int radius = 55;

  for (int i = 0; i < presetCount && i < 8; i++) {
    int x = positions[i].x;
    int y = positions[i].y;

    // Button
    gfx->fillCircle(x, y, radius, 0x2104);
    gfx->drawCircle(x, y, radius, 0x4208);
    gfx->drawCircle(x, y, radius - 3, 0x3186);

    drawIcon(i, x, y);

    // Bigger label
    drawLabel(remotePresets[i].name, x, y + radius + 26);
  }
}


void drawIcon(int i, int cx, int cy) {
  const unsigned char* icon = epd_bitmap_allArray[i % epd_bitmap_allArray_LEN];

  const int ICON_W = 48;
  const int ICON_H = 48;

  gfx->drawBitmap(
    cx - ICON_W / 2,
    cy - ICON_H / 2,
    icon,
    ICON_W,
    ICON_H,
    0xFFFF   // white icons on dark background
  );
}

// ================= WIFI =================

void connectToWifi() {
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi Connected!");
}