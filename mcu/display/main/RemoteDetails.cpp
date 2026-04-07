#include "RemoteDetails.h"

RemoteButton activeButtons[24];
int activeButtonCount = 0;

void drawRemoteDetails(int index) {
    int headerY = 80; 
    int padding = 20;

    int backBtnX = 20;
    int backBtnY = headerY + 10; 
    gfx->drawBitmap(backBtnX, backBtnY, epd_bitmap_arrow_left, 40, 40, COLOR_NAV_BG);
    

    gfx->setFont(&FreeSansBold12pt7b);
    gfx->setTextColor(COLOR_NAV_TEXT);
    gfx->setCursor(80, headerY + 42); 
    gfx->print("Controls"); 

    int btnStartY = 160;
    drawRemoteButtons(btnStartY); 
}

void drawRemoteButtons(int btnStartY) {
    int startX = 5;     
    int spacingX = 143; 
    int spacingY = 90;  
    
    int btnW = 130;     
    int btnH = 70;     
    int iconSize = 24;

    for (int i = 0; i < activeButtonCount; i++) {
        int col = i % 5; 
        int row = i / 5;
        int x = startX + (col * spacingX);
        int y = btnStartY + (row * spacingY);

        int btnX = x + (spacingX - btnW) / 2;

        gfx->fillRoundRect(btnX, y, btnW, btnH, 8, COLOR_REMOTE_CARD);
        gfx->drawRoundRect(btnX, y, btnW, btnH, 8, COLOR_NAV_BORDER);

        int iconX = btnX + (btnW / 2) - (iconSize / 2);
        gfx->drawBitmap(iconX, y + 10, epd_bitmap_mouse_pointer_click, 24, 24, COLOR_NAV_TEXT);

        gfx->setFont(&FreeSans9pt7b);
        gfx->setTextColor(COLOR_NAV_TEXT);
        
        int16_t x1, y1; uint16_t tw, th;
        gfx->getTextBounds(activeButtons[i].name.c_str(), 0, 0, &x1, &y1, &tw, &th);
        gfx->setCursor(btnX + (btnW / 2) - (tw / 2), y + btnH - 10);
        gfx->print(activeButtons[i].name);
    }


    if (activeButtonCount < 24) { 
        int col = activeButtonCount % 5;
        int row = activeButtonCount / 5;
        int btnX = startX + (col * spacingX) + (spacingX - btnW) / 2;
        int y = btnStartY + (row * spacingY);

        gfx->drawRoundRect(btnX, y, btnW, btnH, 8, COLOR_NAV_BORDER);
        gfx->drawBitmap(btnX + (btnW/2) - (iconSize/2), y + 10, epd_bitmap_circle_plus_24, 24, 24, COLOR_NAV_BORDER);
        
        // "Add" text
        gfx->setTextColor(COLOR_NAV_BORDER);
        gfx->setCursor(btnX + (btnW/2) - 15, y + btnH - 10);
        gfx->print("Add");
    }
}

void handleDetailsTouch(int tx, int ty) { 
    int navbarHeight = 80;
    int backBtnAreaHeight = 70;
    int btnStartY = 160; 

    if (tx >= 0 && tx <= 100 && ty >= navbarHeight && ty <= (navbarHeight + backBtnAreaHeight)) {
        currentState = STATE_HOME;
        refreshScreen();
        return; 
    }
    if (ty >= btnStartY) {
        int startX = 5;
        int spacingX = 143;
        int spacingY = 90;
        int btnW = 130;
        int btnH = 70;

        for (int i = 0; i < activeButtonCount; i++) {
            int col = i % 5;
            int row = i / 5;
            int x = startX + (col * spacingX);
            int y = btnStartY + (row * spacingY);
            int btnX = x + (spacingX - btnW) / 2;

            if (tx >= btnX && tx <= (btnX + btnW) && ty >= y && ty <= (y + btnH)) {
                uint32_t codeToSend = strtoul(activeButtons[i].command.c_str(), NULL, 0);
                IrSender.sendNEC(0x00, codeToSend, 3);
                Serial.printf("Sent NEC: 0x%02X\n", codeToSend);
                return;
            }
        }

        if (activeButtonCount < 25) {
            int col = activeButtonCount % 5;
            int row = activeButtonCount / 5;
            int x = startX + (col * spacingX);
            int y = btnStartY + (row * spacingY);
            int btnX = x + (spacingX - btnW) / 2;

            if (tx >= btnX && tx <= (btnX + btnW) && ty >= y && ty <= (y + btnH)) {
                Serial.println("Action: Triggering Add Button sequence");
                // currentState = STATE_ADD_BUTTON;
                // refreshScreen();
                return;
            }
        }
    }
}