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
<img width="551" height="603" alt="Screenshot 2026-05-07 at 6 04 01 PM" src="https://github.com/user-attachments/assets/88b073d9-1b48-4088-804a-77fed2ecdf4a" />

## Feburary 20, 2026
### Summary
Wrote Team Contract, laid out project goals, and set general work plan.
### Documents
<img width="448" height="566" alt="Screenshot 2026-05-07 at 6 04 49 PM" src="https://github.com/user-attachments/assets/3b7fce5e-4e31-4583-b87c-6134a913f0d6" />

## Feburary 23, 2026
### Summary
Worked with Warren on safety and physical housing for AC/DC offline power supply. Decided to use an alumnium box with screws as a Faraday cage for isolation and drilled holes for USB/outlet connection and elevate the PCB inside with spacers. 
### Documents
N/a

## February 24, 2026
### Summary
Worked on physical design for *Roomify* box in Fusion360 (3D print). Modified [online build](https://www.patreon.com/posts/spotify-record-127390794) from ConceptBytes for our 4" touchscreen display and to have more holes for the infrared LEDs. 
### Documents
<img width="642" height="645" alt="Screenshot 2026-05-07 at 6 10 49 PM" src="https://github.com/user-attachments/assets/113cc326-d231-4280-a38d-627a1233f446" />

## February 26, 2026
### Summary
Finalized *Roomify* design and worked on materials and writing for Design Document. Finalized concrete requirements and verifications for each subsystem, performed budget analysis, and created lab safety manual for working on the custom AC/DC power supply.
### Documents
(Design Document)[https://courses.grainger.illinois.edu/ece445/getfile.asp?id=25512]

## March 4, 2026
### Summary
Finalized parts list and ordered parts.
### Documents
[Parts List](https://docs.google.com/spreadsheets/d/1-fnsKsyJnyMvIRFSJjLwY7wGSIy1z5_c-u9sJiDKEsk/edit?usp=sharing)

## March 9, 2026
### Summary
Worked on breadboard demo. Used an Arduino Uno R4 in place of our ESP32. Added a button for cycling through four LED light colors, open YouTube on the mini projector, and playing
 Spotify playlists. After pressing the button, the LED light strip color infrared remote code is transmitted (at around ~20mA), and an HTTP POST request is made to start Spotify playback.

### Documents
<img width="330" height="179" alt="Screenshot 2026-05-07 at 7 17 07 PM" src="https://github.com/user-attachments/assets/474d5f6e-8216-4ec1-9607-3b11aec01433" />

```c
if (lastState == HIGH && currentState == LOW) {
   preset++;
   if (preset >= numPresets) preset = 0;
   Serial.print("Switched to preset: ");
   Serial.println(preset);


   uint16_t codeToSend = presets[preset].code;
   Serial.print("Sending LED " + String(presets[preset].name) + " " + "code: 0x");
   Serial.println(codeToSend, HEX);


   // LED lights
   IrSender.sendNEC(0x00, codeToSend, 3);


   delay(500);
   // mini projector
  
   IrSender.sendNEC(0x88, 0x55, 3);


   delay(500);
   sent = 1;
 }


 lastState = currentState;
 delay(50);

```
]
## March 29, 2026
### Summary
Began board bring-up with team. Soldered ESP32 and USB-C programming connectors using heat gun, solder paste, and soldering iron. 
### Documents
<img width="315" height="300" alt="Screenshot 2026-05-07 at 7 25 42 PM" src="https://github.com/user-attachments/assets/16646924-fbcd-444c-b5a2-c70874f0547e" />
<img width="301" height="323" alt="Screenshot 2026-05-07 at 7 25 22 PM" src="https://github.com/user-attachments/assets/14bd603c-050e-4388-b54a-241a7a6b1d57" />
<img width="312" height="212" alt="Screenshot 2026-05-07 at 7 26 18 PM" src="https://github.com/user-attachments/assets/cb00621f-8ce5-4762-a94d-1c7e425f0236" />


## April 6, 2026
### Summary
Worked on programming touchscreen display and developing *Roomify* user interface. Used Adafruit graphics library to drive the touchscreen display. Maintained display state and pages through global variables, and handled user input with a touch handler. Added the ability to transmit individual infrared remote codes via the touchscreen display. 
### Documents
<img width="547" height="531" alt="Screenshot 2026-05-07 at 7 31 27 PM" src="https://github.com/user-attachments/assets/2c320496-fa80-4377-a4cd-40b08403c02f" />

## April 14, 2026
### Summary
Finalized CAD for physical box and 3D printed box parts at the CUC Fab Lab. 
### Documents
<img width="691" height="602" alt="Screenshot 2026-05-07 at 7 48 57 PM" src="https://github.com/user-attachments/assets/cc400f42-c2c4-43a2-a3fa-01acffb7322a" />
<img width="272" height="277" alt="Screenshot 2026-05-07 at 7 48 37 PM" src="https://github.com/user-attachments/assets/8e6a7780-95d6-4000-8bad-448e4fff5757" />

## April 22, 2026
### Summary
Worked on integrating all of *Roomify*'s subsystems and debugged infrared transmission (did not iniitalize SEND pin, but infrared LEDs were still picking up on signal from other pin, giving very low range). Added omnidirectional transmission (transmit across all IR LEDs in series), packaged everything inside of *Roomify* box, assembled repeater (capybara), simplified touchscreen display UI, and finished the mobile web app (add remote/pair button, create preset, view preset, trigger preset). 
### Documents
<img width="40%" alt="Screenshot 2026-05-07 at 7 52 22 PM" src="https://github.com/user-attachments/assets/0bc5549c-ab6d-4bbb-a167-51bde5d5e08b" /> 
<img width="40%" alt="Screenshot 2026-05-07 at 7 51 32 PM" src="https://github.com/user-attachments/assets/f4623aab-07f8-46c5-a784-3cb0a6759d6a" />
<img width="40%" alt="Screenshot 2026-05-07 at 7 51 13 PM" src="https://github.com/user-attachments/assets/1aa8f896-3aa1-471b-ab61-67f8804df280" />
<img width="40%" alt="Screenshot 2026-05-07 at 7 50 46 PM" src="https://github.com/user-attachments/assets/f04fce6b-b041-49bb-b6ae-ad1235e20270" />
<img width="40%" alt="Screenshot 2026-05-07 at 7 50 13 PM" src="https://github.com/user-attachments/assets/eede2656-138f-4ece-821c-80fb107bf729" />
<img width="40%" alt="Screenshot 2026-05-07 at 7 50 03 PM" src="https://github.com/user-attachments/assets/cbeb7d27-b617-441d-98df-d3fdbeb891f3" />


