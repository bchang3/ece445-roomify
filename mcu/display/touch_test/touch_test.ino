#include <Arduino_GFX_Library.h>
#include <Adafruit_FT6206.h>
#include <Adafruit_CST8XX.h>

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

Arduino_RGB_Display *gfx = new Arduino_RGB_Display(
   720, 720, rgbpanel, 0, true,
   expander, GFX_NOT_DEFINED, NULL, 0
);

#define I2C_TOUCH_ADDR 0x48

Adafruit_FT6206 focal_ctp = Adafruit_FT6206();
Adafruit_CST8XX cst_ctp = Adafruit_CST8XX();
bool touchOK = false;
bool isFocalTouch = false;

// Button struct
struct Button {
  int x, y, w, h;
  const char* label;
  bool pressed;
};

// Define multiple buttons
Button buttons[] = {
  {100, 200, 200, 100, "BUTTON 1", false},
  {420, 200, 200, 100, "BUTTON 2", false},
  {100, 400, 200, 100, "BUTTON 3", false},
  {420, 400, 200, 100, "BUTTON 4", false},
};
const int numButtons = sizeof(buttons) / sizeof(buttons[0]);

void setup() {
  Serial.begin(115200);
  Wire.setClock(1000000);

  // Init display
  if (!gfx->begin()) {
    Serial.println("gfx->begin() failed!");
    while(1);
  }

  expander->pinMode(PCA_TFT_BACKLIGHT, OUTPUT);
  expander->digitalWrite(PCA_TFT_BACKLIGHT, HIGH);

  // Clear background
  gfx->fillScreen(RGB565_BLACK);

  // Draw all buttons
  for (int i = 0; i < numButtons; i++) {
    drawButton(buttons[i]);
  }

  // Init touch
  if (focal_ctp.begin(0, &Wire, I2C_TOUCH_ADDR)) {
    touchOK = true;
    isFocalTouch = true;
    Serial.println("Focal Touchscreen found");
  } else if (cst_ctp.begin(&Wire, I2C_TOUCH_ADDR)) {
    touchOK = true;
    isFocalTouch = false;
    Serial.println("CST826 Touchscreen found");
  } else {
    Serial.print("No touchscreen found at 0x");
    Serial.println(I2C_TOUCH_ADDR, HEX);
    touchOK = false;
  }
}

void loop() {
  if (!touchOK) return;

  if (isFocalTouch && focal_ctp.touched()) {
    TS_Point p = focal_ctp.getPoint(0);
    handleTouch(p.x, p.y);
  } else if (!isFocalTouch && cst_ctp.touched()) {
    CST_TS_Point p = cst_ctp.getPoint(0);
    handleTouch(p.x, p.y);
  }
}

// Handle touch input
void handleTouch(int x, int y) {
  Serial.printf("(%d, %d)\n", x, y);
  for (int i = 0; i < numButtons; i++) {
    bool currentlyPressed = isButtonPressed(x, y, buttons[i]);
    if (currentlyPressed != buttons[i].pressed) {
      buttons[i].pressed = currentlyPressed;
      drawButton(buttons[i]);
      if (currentlyPressed) {
        Serial.printf("%s pressed\n", buttons[i].label);
      }
    }
  }
  delay(50);
}

// Draw a single button
void drawButton(Button &b) {
  uint16_t fillColor = b.pressed ? RGB565_WHITE : RGB565_DARKGREY;
  uint16_t outlineColor = RGB565_WHITE;
  uint16_t textColor = b.pressed ? RGB565_BLACK : RGB565_WHITE;

  gfx->fillRoundRect(b.x, b.y, b.w, b.h, 20, fillColor);
  gfx->drawRoundRect(b.x, b.y, b.w, b.h, 20, outlineColor);

  gfx->setTextColor(textColor);
  gfx->setTextSize(3);

  int16_t x1, y1;
  uint16_t w, h;
  gfx->getTextBounds(b.label, 0, 0, &x1, &y1, &w, &h);

  gfx->setCursor(b.x + (b.w - w)/2, b.y + (b.h - h)/2);
  gfx->print(b.label);
}

// Check if a point is inside a button
bool isButtonPressed(int x, int y, Button &b) {
  return (x >= b.x && x <= b.x + b.w &&
          y >= b.y && y <= b.y + b.h);
}