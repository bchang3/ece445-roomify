#ifndef APPSTATE_H
#define APPSTATE_H

enum AppState {
    STATE_HOME,
    STATE_REMOTE_DETAILS,
    STATE_ADD_REMOTE
};

extern AppState currentState;
extern int selectedRemoteIndex;

#endif