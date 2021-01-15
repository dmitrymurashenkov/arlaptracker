# AR Lap Tracker

Tracks lap times for FPV drone racing events by recognizing barcode markers in the VTX video feed.

Checkout [demo video](demo.webm).

![Demo video preview here](demo.gif)

Fully web-based. Latest release available at: https://dmitrymurashenkov.github.io/arlaptracker/

You'll need ещ connect USB OTG 5.8Ghz FPV video receiver to PC (it acts as an ordinary webcam), 
print barcode marker on A4 sheet and place it near the finish line. When drone passes near it - 
lap time will be recorded.

See Help section in the app for details.

This tool was inspired by [TinyViewPlus](https://github.com/t-asano/tinyviewplus) which works with 
similar accuracy, but requires installation and is not crossplatform.

AR Lap timer uses [AR.js](https://github.com/AR-js-org/AR.js) for marker recognition. 