# Warren's Log

## 2026-02-05 - System Level Definitions
<img width="650" height="400" alt="IMG_0731" src="https://github.com/user-attachments/assets/8f52a39a-519d-4e4e-9d9c-dd46d14ea540" />

## 2026-02-06 - Component Selection
IR LED: SFH 4546 (950nm)
IR Receiver: TSOP38238 (950nm)
MCU: EPS32-S3

### Expected Power
SFH 4546 emits 130mW/sr at 38kHz. Expected dBm output wille be $10 \cdot \log_{10}(130) = 21.1$. With the receiver having a minimum power of -5dbm, we have a margin of around 26 dBm. Our targeted distance of a 20 foot radius will be satisfied by our link margin.
