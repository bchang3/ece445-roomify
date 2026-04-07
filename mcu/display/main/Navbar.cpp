#include "Navbar.h"

// Initialize the buttons
Button navHome = {10, 0, 80, 80, "", false}; 
Button navAdd  = {720 - 90, 0, 80, 80, "", false};

void drawNavbar() {
  gfx->fillRect(0, 0, 720, 80, COLOR_NAV_BG);
  gfx->drawFastHLine(0, 79, 720, COLOR_NAV_BORDER);

  gfx->setFont(&FreeSansBold12pt7b);
  gfx->setTextSize(1);
  gfx->setTextColor(COLOR_NAV_TEXT);

  int iconX = 35;
  int iconY = 20;
  int iconW = 40;
  
  // Home Icon
  gfx->drawBitmap(iconX, iconY, epd_bitmap_house, iconW, iconW, COLOR_NAV_TEXT);
  

  // "Roomify"
  gfx->setFont(&FreeSansBold12pt7b);
  gfx->setTextSize(1);
  gfx->setTextColor(COLOR_NAV_TEXT);

  // X: Start after the icon (75) + 15 pixels of breathing room = 90
  int textX = iconX + iconW + 15;

  // Y: Center text vertically in an 80px bar using a baseline font:
  int16_t x1, y1;
  uint16_t tw, th;
  gfx->getTextBounds("Roomify", 0, 0, &x1, &y1, &tw, &th);
  
  // Vertical center is (NavbarHeight / 2) + (TextHeight / 2)
  int textY = (80 / 2) + (th / 2);

  gfx->setCursor(textX, textY);
  gfx->print("Roomify");
}

void handleNavbarTouch(int tx, int ty) {
  if (navHome.contains(tx, ty)) {
    Serial.println("Home Clicked");
  }
}