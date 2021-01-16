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

**Roadmap:**

- Support several markers - ability to place them on both sides of gates to increase recognition probability 
  in case camera is facing sideways
- Add best practices for setup to Help section
- Support using TinyViewPlus ArUco markers to be able to reuse tinyview gates
- Add and tune finish sounds
- Check marker rotation to be able to point it to gates center and avoid registering lap if drone passed 
  outside the gates
- Tune AR.js video buffer size to match camera frame size to increase performance  
- Save video records as mp4 - it is more widely supported
- Add button to remove pilot
- Save settings in local storage to prevent their reset on page refresh
- Remove mouse cursor from the recording
