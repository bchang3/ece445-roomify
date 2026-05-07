# Benjamin's ECE445 Project Log (bchang)
## January 21, 2026
### Summary
Initial project brainstorming and ideation. Discussed various project ideas including tennis ball collection robot, paint color mixer, and room device control system. 
Tennis ball collection robot would function like a Roomba, scanning the tennis court for loose balls and suctioning them up into a collector. Paint color mixer would have base colors, take an input hex code, and mix precise amounts of paint to achieve the desired color (similar to a color printer with cyan, magenta, yellow, black).
Room device control system would transmit infrared signals (like a remote) around the room for synchronized control of multiple devices (e.g. LED lights, TV, and Spotify music). 

### Documents
N/a

## January 22, 2026
### Summary
Developed room device control system idea and wrote project idea post. *Roomify* will have a web-app and touchscreen display for operating room devices like Spotify, LED lights, or other remote-controlled decorations and displays. *Roomify* will control API-based devices (Spotify) over WiFi (ESP32), and operate remote-controlled room devices via infrared (IR) signals. Core features include an "add remote" flow to pair room devices and quick-start "preset" creation for synchronized and paired device control. *Roomify* may also include a custom AC-DC power supply for additional hardware complexity. 

### Documents
#### Roomify Post
##### Problem:
Room decor (LED lights, music, desk decorations, etc.) is hard to coordinate, leading to unsynchronized room vibes (e.g. slow music and flashing lights) and an excess of handheld remotes.

##### Solution:
Roomify is a centralized room control system where users use a web-app to operate devices in their room like Spotify, LED lights, or other remote-controlled decorations and displays. Roomify will appear like a vinyl player with a hinged wooden box, with a round RGB TTL TFT display driven by an ESP32-S3 board. The core functionality of the board will be controlling the round display, WI-FI communication (to make Spotify API calls), IR signal receiving and decoding (to store device remote codes), and omni-directional NEC protocol IR transmission (to transmit remote codes).

By "copying" and storing IR remote codes, users can map buttons in the Roomify web-app to IR signals that interact with devices in the room. The web-app will have an "Add Remote" flow where users can store device remote information within Roomify. For example, a user would add the "red" button on a LED string light remote by aiming the remote at the Roomify box. After Roomify decodes the signal, users can label and save the button code within the web-app. The user could then repeat the process for other buttons on the remote. Any device that uses a NEC protocol remote or has an API (like Spotify) will be usable with Roomify.

After adding all room device remotes to Roomify, users will be able to create quick-start presets (e.g. green lights with Christmas music and a Snoopy Gif display). When the user selects a preset, Roomify will transmit the necessary IR signals in all directions (14 IR LEDS, 6 to cover the three primary axes, and 8 pointed along the center of each octant) and make Spotify API calls. Aside from using presets, users can also change individual settings, avoiding the necessity of using multiple remotes or apps.

Notes:
Depending on required complexity, the Roomify project can also be extended in various ways like designing our own AC-DC power supply so Roomify can plug into outlets.

## January 28, 2026
### Summary
Continued to develop *Roomify* and wrote RFA with detailed subsystem descriptions. Main subsystems are power (AC/DC power supply), infrared transceiving, IR repeaters, mobile web application, and control box (physical design, touchscreen display).
### Documents
[Link to RFA](https://courses.grainger.illinois.edu/ece445/pace/view-topic.asp?id=79320)

## February 4, 2026
### Summary
Updated *Roomify* initial design to have more details on how transceiving unit works (NEC encoding and decoding, infrared LED and range). Added a sample demo plan and high-level overview of the project after receiving feedback from TAs. 
### Documents
[Link to RFA](https://courses.grainger.illinois.edu/ece445/pace/view-topic.asp?id=79320)
#### Sample Demo Plan

1. Presets
  - Demonstrate presets and synchronized controls by clicking one button for the following settings:
    - Turn decorative LED string lights green, play Christmas music, display a GIF of Snoopy in the snow on the display screen.
    - Turn decorative LED string lights yellow, play jazz, display an animation of a silhouette playing the saxophone on the display screen.
    - Add Remote + Preset Configuration

2. Demonstrate the ability to store new remote codes and add devices to Roomify:
  - Start the "Pair Remote" mode
  - Add the button for flashing LED lights by clicking the button on the remote that came with the LED string lights and pointing it at the Roomify box.
  - Show that the "flashing lights" button appears as a new setting, and create a new preset for "flashing lights" and party music.
Range

4. Demonstrate the omni-directional ability of Roomify.
  - Move the decorative LED string light receiver out of direct line of sight with the Roomify box.
  - Place one of our infrared repeaters at a central location between the Roomify box and decorative LED string light receiver.
  - Show that the signal from Roomify still reaches the LED string lights.
## February 10, 2026
### Summary
Worked on creating materials and writing for *Roomify* project proposal (Visual Aid, diagrams, etc.). Continued to develop the design for *Roomify* and specified subsystem requirements (range and accuracy for infrared transceiving and repeater, voltage and current requirements for power supply, low latency responses for touchscreen display and web application). Performed tolerance analysis for infrared signal transmission range. 

At a 7 meter distance (corner to corner in a 15 ft. x 15 ft. x 10 ft. room) using 200mA pulses, the received irradiance of the infrared signal can be calculated as follows:

<img width="166" height="132" alt="Screenshot 2026-05-07 at 5 52 03 PM" src="https://github.com/user-attachments/assets/5d490378-253b-4bb6-bcb5-eb3c49294403" />

The necessary irradiance for the [receiver[(https://cdn-shop.adafruit.com/datasheets/tsop382.pdf) we plan on using is 0.15mW/m^2, giving a link margin of 9.37dB. The maximum current rating for the infrared LED is 1A, so using 200mA should be more than enough to achieve our desired range requirements while also giving us a significant amount of buffer to increase current and range.
 
### Documents
<img width="675" height="364" alt="Screenshot 2026-05-07 at 5 50 29 PM" src="https://github.com/user-attachments/assets/e354666c-a21c-4034-80b6-c865e50bed47" />
