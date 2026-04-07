#ifndef MODELS_H
#define MODELS_H

#include <Arduino.h>

struct Remote {
  String id;
  String name;
  String deviceType;
};


struct RemoteButton {
  String id;
  String name;
  String command;
};

#endif