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

## 2026-02-11 - Repeater Link Budgeting
From previous calculations, we expected 130mW/sr, but the solid angle of our IR led has a size of around $20mm^2$ which will allow us to find that the solid angle $\Omega = \frac{A}{d^2}$. For our expected distance of around 10 meters, we get a solid angle of $\Omega = \frac{20 \cdot 10^{-6}}{10^2}$. From here, we get an expected output of $130 \cdot 2 \cdot 10^{-7}$. This gives us a power of -45 dBm. However, for our receiver, it has a receive power of 15mW/sr. Given that the diameter of the IR receive led is similar, following the same calculations, we get that the expected receive power is -55 dBm. This gives us a link budget of around 10 dBm. With an insertion loss of around 0.5 dB for PLA (the material we will 3D print our repeater in), we have a budget of around 9.5 dB for traveling throughout the air. This will give us a large amount of margin for our device.
