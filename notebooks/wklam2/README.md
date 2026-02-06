# Warren's Log

## 2026-02-05 - System Level Definitions
<img width="650" height="400" alt="IMG_0731" src="https://github.com/user-attachments/assets/8f52a39a-519d-4e4e-9d9c-dd46d14ea540" />

## 2026-02-06 - Component Selection (Repeater)
IR LED: SFH 4546 (950nm)\
IR Receiver: TSOP38238 (950nm)\
MCU: EPS32-S3\
Fet Switches: SI2342DS-T1-GE3 (8 VDS and 6 Id)\
Gate Driver: DGD0211CWT-7 (Low Side Gate Driver)\
Battery: 9V at 3Wh


### Expected Power
SFH 4546 emits 130mW/sr at 38kHz. Expected dBm output will be $10 \cdot \log_{10}(130) = 21.1$. With the receiver having a minimum power of -5dbm, we have a margin of around 26 dBm. Our targeted distance of a 20 foot radius will be satisfied by our link margin.

### Current Schematic
<img width="1041" height="682" alt="image" src="https://github.com/user-attachments/assets/2fb8163f-50e0-4a81-977d-19dc36fd26de" />
To be changed:\ 
- Pi filter to tune for the 38kHz signal
