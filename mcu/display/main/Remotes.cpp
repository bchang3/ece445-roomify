#include "Remotes.h"

Remote stored_remotes[12];
int remoteCount = 0;

void drawRemotes() {
  // --- Grid Dimensions ---
  int startX = 20;    // Small left margin
  int startY = 120;   // Below Navbar
  
  // 720px total width / 4 columns = 180px per slot.
  int spacingX = 175; 
  int spacingY = 220; // Vertical height for each "row"
  
  int cardW = 150;    // Smaller cards to fit 4 across
  int cardH = 150;    
  int iconSize = 52;  

  uint16_t gray = 0x7BEF;
  
  if (remoteCount == 0) {
    gfx->drawRoundRect(210, 250, 300, 200, 15, gray);
    gfx->drawBitmap(320, 280, epd_bitmap_folder_x, iconSize, iconSize, gray);
    

    gfx->setFont(&FreeSans9pt7b);
    gfx->setTextColor(gray);
    int16_t x1, y1; uint16_t tw, th;
    gfx->getTextBounds("No remotes found", 0, 0, &x1, &y1, &tw, &th);
    gfx->setCursor(360 - (tw / 2), 400); 
    gfx->print("No remotes found");
    
    return;
  }

  // --- GRID RENDERER ---
  for (int i = 0; i < remoteCount; i++) {
    // 1. Calculate Grid Position (Modulo 4 for 4 columns)
    int col = i % 4;
    int row = i / 4;
    
    int slotX = startX + (col * spacingX);
    int slotY = startY + (row * spacingY);

    // 2. Center the Card in the Slot
    int cardX = slotX + (spacingX - cardW) / 2;
    gfx->fillRoundRect(cardX, slotY, cardW, cardH, 12, COLOR_REMOTE_CARD);
    gfx->drawRoundRect(cardX, slotY, cardW, cardH, 12, COLOR_NAV_BORDER);

    // 3. Draw Icon (Centered in Card)
    int iconX = cardX + (cardW / 2) - (iconSize / 2);
    int iconY = slotY + 30; // 30px down from top of card
    gfx->drawBitmap(iconX, iconY, epd_bitmap_smartphone, iconSize, iconSize, COLOR_NAV_TEXT);

    // 4. Draw Label (Centered in Card)
    gfx->setFont(&FreeSans9pt7b);
    gfx->setTextColor(COLOR_NAV_TEXT);
    
    int16_t x1, y1; uint16_t tw, th;
    gfx->getTextBounds(stored_remotes[i].name.c_str(), 0, 0, &x1, &y1, &tw, &th);
    
    // Horizontal centering
    int textX = cardX + (cardW / 2) - (tw / 2);
    // Position text near the bottom of the card
    int textY = slotY + cardH - 30; 
    
    gfx->setCursor(textX, textY);
    gfx->print(stored_remotes[i].name);
  }

 if (remoteCount < 12) {
    int col = remoteCount % 4;
    int row = remoteCount / 4;
    int slotX = startX + (col * spacingX);
    int slotY = startY + (row * spacingY);
    int cardX = slotX + (spacingX - cardW) / 2;

    gfx->drawRoundRect(cardX, slotY, cardW, cardH, 12, COLOR_NAV_BORDER);

    // Draw Plus Icon (Dark Gray)
    int iconX = cardX + (cardW / 2) - (iconSize / 2);
    int iconY = slotY + 30;
    gfx->drawBitmap(iconX, iconY, epd_bitmap_circle_plus, iconSize, iconSize, COLOR_NAV_BORDER);

    // Draw "Add Remote" Text (Dark Gray)
    gfx->setFont(&FreeSans9pt7b);
    gfx->setTextColor(COLOR_NAV_BORDER);

    const char* addText = "Add Remote";
    int16_t x1, y1; uint16_t tw, th;
    gfx->getTextBounds(addText, 0, 0, &x1, &y1, &tw, &th);
    gfx->setCursor(cardX + (cardW / 2) - (tw / 2), slotY + cardH - 25);
    gfx->print(addText);
  }
}

void handleRemoteTouch(int tx, int ty) {
  int startX = 20;
  int startY = 120;
  int spacingX = 175; 
  int spacingY = 220;
  int cardW = 150;
  int cardH = 150;


  for (int i = 0; i < remoteCount; i++) {
    int col = i % 4;
    int row = i / 4;
    
    int slotX = startX + (col * spacingX);
    int slotY = startY + (row * spacingY);
    int cardX = slotX + (spacingX - cardW) / 2;

    if (tx >= cardX && tx <= (cardX + cardW) &&
        ty >= slotY && ty <= (slotY + cardH)) {
      
      Serial.printf("Clicked remote: %s\n", stored_remotes[i].name.c_str());
      fetchButtons(stored_remotes[i].id);
      
      selectedRemoteIndex = i;
      currentState = STATE_REMOTE_DETAILS;
      refreshScreen(); 
      return; 
    }
  }

  if (remoteCount < 12) {
    int col = remoteCount % 4;
    int row = remoteCount / 4;
    
    int slotX = startX + (col * spacingX);
    int slotY = startY + (row * spacingY);
    int cardX = slotX + (spacingX - cardW) / 2;

    if (tx >= cardX && tx <= (cardX + cardW) &&
        ty >= slotY && ty <= (slotY + cardH)) {
      
      Serial.println("Clicked Add Remote");
      
      // currentState = STATE_ADD_REMOTE;
      // refreshScreen();
      return;
    }
  }
}