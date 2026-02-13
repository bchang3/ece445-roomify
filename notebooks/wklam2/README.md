# Warren's Log

## 2026-02-05 - System Level Definitions
<img width="650" height="400" alt="IMG_0731" src="https://github.com/user-attachments/assets/8f52a39a-519d-4e4e-9d9c-dd46d14ea540" />

## 2026-02-06 - Component Selection (Repeater)
IR LED: SFH 4546 (950nm)\
IR Receiver: TSOP38238 (950nm)\
MCU: ATTiny85\
Fet Switches: SI2342DS-T1-GE3 (8 VDS and 6 Id)\
Gate Driver: DGD0211CWT-7 (Low Side Gate Driver)\
Battery: 9V at 3Wh


### Expected Power
SFH 4546 emits 130mW/sr at 38kHz. Expected dBm output will be $10 \cdot \log_{10}(130) = 21.1$. With the receiver having a minimum power of -5dbm, we have a margin of around 26 dBm. Our targeted distance of a 20 foot radius will be satisfied by our link margin.

### Current Schematic
<img width="1041" height="682" alt="image" src="https://github.com/user-attachments/assets/2fb8163f-50e0-4a81-977d-19dc36fd26de" />
To be changed:
- Pi filter to tune for the 38kHz signal

## 2026-02-11 
### Repeater Link Budgeting
From previous calculations, we expected 130mW/sr, but the solid angle of our IR led has a size of around $20mm^2$ which will allow us to find that the solid angle $\Omega = \frac{A}{d^2}$. For our expected distance of around 10 meters, we get a solid angle of $\Omega = \frac{20 \cdot 10^{-6}}{10^2}$. From here, we get an expected output of $130 \cdot 2 \cdot 10^{-7}$. This gives us a power of -45 dBm. However, for our receiver, it has a receive power of 15mW/sr. Given that the diameter of the IR receive led is similar, following the same calculations, we get that the expected receive power is -55 dBm. This gives us a link budget of around 10 dB. With an insertion loss of around 0.5 dB for PLA (the material we will 3D print our repeater in), we have a budget of around 9.5 dB for traveling throughout the air. This will give us a large amount of margin for our device.

### Isolation for Offline
Examined the difference between full wave bridge rectifier or center tap transformer for rectification. The efficiency of a center tap XFMR would be higher than the full wave and also include less voltage drops across the diodes, but it is more expensive. It would bypass the need for a flyback transformer, but at 60 Hz, the transformer would be rather large. It would be a trade off and something to look into for a smaller transformer that is rated for higher frequencies (which allows us to use our FB converter) and reduce footprint while maintaining isolation between our high and low voltage circuits.
<img width="800" height="400" alt="image" src="https://github.com/user-attachments/assets/ee3f0e6b-1b49-41b5-917f-88ce246008c2" />\
Diagram to help show the current flow diagram.\
<img width="800" height="470" alt="image" src="https://github.com/user-attachments/assets/ec2dc364-b7a9-4a05-8828-8f6f30def498" />\
Diagram of full hardware level diagram.

## 2026-02-11 
### Power Budgeting
On our main logic board inside the box, we are using an LT1170 as a DC-DC converter. This IC allows us to have a wide input voltage and an output of 3v3. Because Roomify will have two MCUs (one “main” MCU and one special MCU for controlling the touchscreen display, we will need around 2.4A to power both (assuming a peak current draw of 1.2A for an ESP32-S3). Roomify will drive at most three infrared LEDs at a time at 200mA pulses, requiring peak draw of 600mA. 

Combining the current requirements for the MCUs and the IR LEDs gives a total budget of 3A. The rating for the LT1170 is 5A at 3v3. For our 12V system that powers our 3v3 system, it is required to output around 10 Watts. Our flyback converter can deliver up to 40 Watts of power, so we will have an ample amount of power for our system. Below is a simulation of our LT1170 component that delivers enough voltage and current.

### Repeater
I was able to add a reverse protection NMOS circuit to our input of our battery. This helps us protect us from shorting out our LDO and any DC-DC power converters of our board.
<img width="1232" height="382" alt="image" src="https://github.com/user-attachments/assets/899f6893-f4bc-4f0a-a6c9-c995f54366d7" />

### Major Revision
Revised the 12V line to be a 24V line. We realized that for a flyback transformer, the the ratios determined the sizing of our voltage step up and down. We want a 4:1:1 transformer, so that requires a 24V line. Since the LT1170 can handle input of up to 60V, a 24V input will not affect it.

## 2026-02-12
### DC-DC 24V-3V3 Converter
Simulation completed and component selection
<img width="1324" height="356" alt="image" src="https://github.com/user-attachments/assets/5fa92049-1d99-4825-844d-e3f8bed1bdf0" />\
Tested with a load of varying current to mirror a MCU with a varying load and current draw. Peaking at around 3V6 which is the rated maximum of our MCU. Might look into ways to reduce Q factor of our system as well as set a 3V3 limit with possible zener diode or others. Average steady state voltage of around 3V2.
