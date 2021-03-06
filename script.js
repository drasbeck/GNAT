/**
*    .             .                   .
*  ,-| ,-. ,-. ,-. |-. ,-. ,-. . ,   ,-| . ,
*  | | |   ,-| `-. | | |-' |   |/ ,. | | |/
*  `-' '   `-^ `-' `-' `-' `-' |\ `´ `-' |\  (cc by-sa) 2015 - 2016
*                              ' `       ' `
*/

/**
* TODO UX
* TODO  - Evt. find anden måde at tage imod input (evt. -1+ -5+ knapper)).
* TODO  - Genvejstaster.
* TODO    - Hjælpeskærm, hvor tasterne kan slås op.
* TODO buzzwordery: lav siden responsiv.
* TODO et tandhjul med indstillinger og genvejstaster.
* TODO man skal kunne indstille tid via adressen: gnat/5m -> starter en timer på 5 minutter
* TODO LYD
* TODO  - Volumen-knap under indstillinger.
* TODO  - Flere alarm-muligheder - drop down eller synlig liste.
* TODO  - Lydfilen afspilles ikke på iOS, der er vist ikke så meget at gøre. =(
* TODO    - Filen skal afspilles aktivt, hvilket nok ikke er muligt ifm en timer.
* TODO UI
* TODO  - Det er ikke alle browsere der er enige om hvordan <button> og <select> skal se ud.
* TODO  - Eventuelt et lyst tema?
* TODO  - ...
* TODO BLANDET
* TODO  - Fjern unødvendig kode.
* TODO    - hvor?
* TODO  - GNAT bruger ret meget CPU på grund af animationen i progressBar
* TODO    - Animationerne er skruet ned, progressBar opdaterer kun én gang i sekundet
* TODO    - Find ud af animationer for at få buttery smoothness tilbage på menuen.
*/

var hotels, mikes, sierras;
var timerEnd = 0;
var timerAmountBar, timerSeconds, unixSeconds, unixSecondsDiff, timerPaused;
var timerSet = false;
var timerTicking = false;
var soundAlarm = false;
var time;
var audio = new Audio("alert.mp3");
var timerHasRun = false;
var unixSecondsDiffSet;
var keys = [];
var key = null;
var oldKey = null;

document.bgColor = "#272822";
document.getElementById("header").style.backgroundImage = "url('./bckgrnd.png')";

audio.volume = 0.8;

function timer() {
  // Update the timer display
  alarmLoop();

  if (timerSet) {
    // Never play sound if timer is running
    soundAlarm = false;

    // Set pause/resume/stop timer active when timer is set
    if (timerTicking) {
      document.getElementById("stopTimer").disabled = false;
      document.getElementById("stopTimer").value = "Pause timer";
    }

    // Change timerSeconds into hours, minutes and seconds
    var unixSecondsNoFloor = new Date().getTime() / 1000;
    unixSeconds = Math.floor(unixSecondsNoFloor);
    if (!unixSecondsDiffSet) {
      unixSecondsDiff = unixSecondsNoFloor - unixSeconds;
      unixSecondsDiffSet = true;
    }

    var minutesLead, secondsLead;
    timerSeconds = Math.floor(timerEnd - unixSecondsNoFloor + 1);
    var hours = Math.floor((timerSeconds / 3600));
    var minutes = Math.floor(((timerSeconds - (hours * 3600)) / 60));
    var seconds = Math.floor((timerSeconds - (hours * 3600) - (minutes * 60)));

    // Pad minutes and seconds with leading zeros, if need be
    minutesLead = (minutes < 10 ? "0" : "") + minutes;
    secondsLead = (seconds < 10 ? "0" : "") + seconds;

    // Calculating time to show in progressBar
    // Remove remaining hours and minutes, when these reach zero
    if (timerTicking) {
      if (timerEnd - unixSecondsNoFloor > 0) {
        if (hours < 1) {
          if (minutes < 1) {
            time = seconds + "s";
            document.title = time;
          } else {
            time = minutes + "m " + secondsLead + "s";
            document.title = time;
          }
        } else {
          time = hours + "h " + minutesLead + "m " + secondsLead + "s";
          document.title = time;
        }
      } else {

        // What happens when timer reaches zero
        time = "It's time";
        timerSet = false;
        timerTicking = false;
        timerHasRun = true;
        soundAlarm = true;
        document.getElementById("stopTimer").value = "Stop alarm";
        document.getElementById("stopTimer").disabled = false;
      }

      // Draw progress bar progress
      if (timerEnd - unixSeconds >= 0 && timerSet) {
        drawSlider(timerAmountBar, timerSeconds);
      } else {
        drawSlider(1, 0);
      }

      // Draw time left
      document.getElementById("progressText").innerHTML = time;
    }

  } else {
    if (timerHasRun) {
      document.title = "Time!";
    }
  }
}

// Start / Pause / Resume button
function pauseTimer() {
  document.getElementById("stopTimer").value = "Resume timer";
  timerPaused = timerEnd - new Date().getTime() / 1000;
  timerTicking = false;
}

function resumeTimer() {
  document.getElementById("stopTimer").value = "Pause timer";
  timerEnd = timerPaused + new Date().getTime() / 1000;
  timerTicking = true;
}

function stopAlarm() {
  document.getElementById("stopTimer").disabled = true;
  soundAlarm = false;
}

function stopTimerButton() {
  if (timerTicking == true && soundAlarm == false) {
    // fra aktiv til pauset timer
    pauseTimer();
  } else if (timerTicking == false && soundAlarm == false) {
    // fra pauset til aktiv timer
    resumeTimer();
  } else {
    // alarmen bimler, tryk for at stoppe det!
    stopAlarm();
  }
}

function alarmLoop() {
  if (soundAlarm == true) {
    audio.play();
  }
}

function drawSlider(timeTotal, timeLeft) {
  var progress = (timeLeft * 100) / timeTotal;
  document.getElementById("progressBarProgress").style.width = progress + '%';
}

// Getting amount of seconds from h, m, s timer data when timer is set manually
function setTimer(h, m, s) {
  if (h != null || m != null || s != null) {
    timerSeconds = h * 60 * 60 + m * 60 + s;
  } else {
    hotels = document.getElementById("hotels");
    mikes = document.getElementById("mikes");
    sierras = document.getElementById("sierras");
    timerSeconds = parseInt(hotels.options[hotels.selectedIndex].text) * 60 * 60 + parseInt(mikes.options[mikes.selectedIndex].text) * 60 + parseInt(sierras.options[sierras.selectedIndex].text);
  }
  timerAmountBar = timerSeconds;
  timerEnd = timerSeconds + new Date().getTime() / 1000;
  timerSet = true;
  timerTicking = true;
  unixSecondsDiffSet = false;
}

// Key events
document.body.addEventListener("keydown", function (e) {
  keys[e.keyCode] = true;
  console.log("keydown: " + e.keyCode);
  keyPress(e.keyCode);
});
document.body.addEventListener("keyup", function (e) {
  keys[e.keyCode] = false;
  if (e.keyCode == key) {
    oldKey = null;
  }
  key = null;
  console.log("keyup: " + e.keyCode);
});

function keyPress(k) {
  // Keyboard shortcuts
  var key = k;
    console.log("Any modifier keys pressed?")
    if (!keys[17] && !keys[18] && !keys[91] && !keys[93]) {
      console.log("Nope, no modifier key is currently pressed.")
      if (key == 74) { // J
        console.log("Cool! Then 'J' (keyCode: " + key + ") goes on to activate a 25m timer.")
        setTimer(0,25,0);
      } else if (key == 75) { // K
        console.log("Cool! Then 'K' (keyCode: " + key + ") goes on to activate a 5m timer.")
        setTimer(0,5,0);
      } else if (key == 76) { // L
        console.log("Cool! Then 'L' (keyCode: " + key + ") goes on to activate a 20m timer.")
        setTimer(0,20,0);
      } else if (key == 72) { // H
        console.log("Okay, well then 'H' (keyCode: " + key + ") toggles pause timer, resume timer, stop alarm.")
        stopTimerButton();
      }
      if (key != null) {
        oldKey = key;
      } else {
        key = null;
      }
    }
}
