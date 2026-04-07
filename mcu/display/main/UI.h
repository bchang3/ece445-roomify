#ifndef UI_H
#define UI_h

#include "Models.h"
#include "AppState.h"
#include "Remotes.h"
#include "Navbar.h"
#include "Colors.h"

extern AppState currentState;
extern int selectedRemoteIndex;

void handleGlobalTouch(int tx, int ty);
void refreshScreen();

#endif