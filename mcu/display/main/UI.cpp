#include "UI.h"


AppState currentState = STATE_HOME;
int selectedRemoteIndex = -1;

void refreshScreen() {
    gfx->fillScreen(WHITE); // Clear previous screen
    drawNavbar();
    switch (currentState) {
        case STATE_HOME:
            drawRemotes(); // Your grid function
            break;
        case STATE_REMOTE_DETAILS:
            drawRemoteDetails(selectedRemoteIndex);
            break;
    }
}

void handleGlobalTouch(int tx, int ty) {
    switch (currentState) {
        case STATE_HOME:
            handleRemoteTouch(tx, ty);
            break;
        case STATE_REMOTE_DETAILS:
            handleDetailsTouch(tx, ty);
            break;
    }
}