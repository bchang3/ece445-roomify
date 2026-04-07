#ifndef NAVBAR_H
#define NAVBAR_H

#include <Arduino_GFX_Library.h>
#include <Fonts/FreeSansBold12pt7b.h>
#include "Icons.h"
#include "Colors.h"
#include "Button.h"


extern Arduino_GFX *gfx; 

// Function prototypes so main.ino can see them
void drawNavbar();
void handleNavbarTouch(int tx, int ty);

#endif