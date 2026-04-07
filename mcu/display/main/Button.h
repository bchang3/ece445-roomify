#ifndef BUTTON_H
#define BUTTON_H

struct Button {
  int x, y, w, h;
  const char* label;
  bool pressed;
  
  bool contains(int tx, int ty) {
    return (tx >= x && tx <= (x + w) && ty >= y && ty <= (y + h));
  }
};

#endif