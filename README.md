# AR Lap Tracker

Tracks lap times for FPV drone racing events by recognizing barcode markers in the VTX video feed.

In action it looks like this:

![Demo video here](demo.gif)

Fully web-based. Latest release available at: https://dmitrymurashenkov.github.io/arlaptracker/

You'll need to connect USB OTG 5.8Ghz FPV video receiver to PC (it acts as an ordinary webcam), 
print barcode marker on A4 sheet and place it near the finish line. When drone passes near it - 
lap time will be recorded.

See Help section in the app for details.

This tool was inspired by [TinyViewPlus](https://github.com/t-asano/tinyviewplus) which works with 
similar accuracy, but requires installation. However AR lap tracker is planned to be more feature-rich - 
stay tuned for the updates!

AR Lap timer uses [AR.js](https://github.com/AR-js-org/AR.js) for marker recognition.

**Roadmap:**

- Fix distance calculation to marker (depends on https://github.com/AR-js-org/AR.js/issues/36)
- Check marker rotation to be able to point it to gates center and avoid registering lap if drone passed 
  outside the gates (possible bad idea - may lower recognition accuracy)
- Remove mouse cursor from the recording (not possible in Chrome currently)
- Test with mobile devices

**Contact:**

If you have questions, want to discuss or share experience - create an issue in this project 
or mail me: dmitry.murashenkov@gmail.com