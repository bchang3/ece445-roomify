#ifndef REMOTEDETAILS_H
#define REMOTEDETAILS_H

#include <Arduino.h>
#include <Arduino_GFX_Library.h>
#include <Fonts/FreeSansBold12pt7b.h>
#include "Transceiver.h"
#include "Models.h"
#include "AppState.h"
#include "API.h"
#include "UI.h"
#include "Remotes.h"
#include "Icons.h"
#include "Colors.h"



class IRsend;

extern Arduino_GFX *gfx; 
extern IRsend IrSender;

extern RemoteButton activeButtons[24]; 
extern int activeButtonCount;

void drawRemoteDetails(int index);
void drawRemoteButtons(int btnStartY);
void handleDetailsTouch(int tx, int ty);

#endif