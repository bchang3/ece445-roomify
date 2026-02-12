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

### Repeater
I was able to add a reverse protection PMOS circuit to our input of our battery. This helps us protect us from shorting out our LDO and any DC-DC power converters of our board.
<img width="535" height="364" alt="image" src="https://github.com/user-attachments/assets/bc4af0da-dd49-403c-9005-81688fcaefaa" />

