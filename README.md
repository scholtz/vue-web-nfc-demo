# Web NFC Example Using Vue 3

This is an example project showing off Chrome's new NFC capabilities.

## DEMO

https://vue-web-nfc-demo.vercel.app

![QR](public/demo-link.png)

### Device Requirements
NFC only works on ***Chrome 89 and above*** on ***Android phones with NFC***. The code detects whether the browser supports NFC, but not if your phone has NFC capabilities.

I tested this code with NTAG215 cards but any standard card that supported NDEF should work.

Additional reading of the WebNFC standard can be found [here](https://w3c.github.io/web-nfc/).

### How To Debug

Because the code ***only*** works on phones, follow [these steps](https://developer.chrome.com/docs/devtools/remote-debugging/) to get set up with remote debugging on Android.

### Project Setup
Install Dependencies
```
npm ci
```
Run Local Server
```
npm run dev
```
Then connect to the server IP on your phone. HTTPS must be enabled for NFC to work.
