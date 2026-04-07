// Remote.h
#ifndef REMOTE_H
#define REMOTE_H

#include <Arduino.h>
#include <Arduino_GFX_Library.h>
#include <Fonts/FreeSansBold12pt7b.h>
#include <Fonts/FreeSans9pt7b.h>
#include "UI.h"
#include "API.h"
#include "Icons.h"
#include "Colors.h"

extern Arduino_GFX *gfx; 

extern Remote stored_remotes[12];
extern int remoteCount;

void drawRemotes();
void handleRemoteTouch(int tx, int ty);

#endif