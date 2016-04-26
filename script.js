/**
 *    .             .                   .
 *  ,-| ,-. ,-. ,-. |-. ,-. ,-. . ,   ,-| . ,
 *  | | |   ,-| `-. | | |-' |   |/ ,. | | |/
 *  `-' '   `-^ `-' `-' `-' `-' |\ `´ `-' |\  (cc by-sa) 2015
 *                              ' `       ' `
 */

/**
 * TODO fjern unødvendig kode - hvor? bruger jeg f.eks. unixSecondsDiff?
 * TODO UX (evt. find anden måde at tage imod input (evt. -1+ -5+ knapper)).
 * TODO buzzwordery: lav siden responsiv.
 * TODO et tandhjul med indstillinger.
 * TODO LYD
 * TODO  - Volumen-knap under indstillinger.
 * TODO  - Flere alarm-muligheder - drop down eller synlig liste.
 * TODO  - Lydfilen afspilles ikke på iOS, der er vist ikke så meget at gøre. =(
 * TODO    - Filen skal afspilles aktivt, hvilket nok ikke er muligt ifm en timer.
 * TODO Det er ikke alle browsere der er enige om hvordan <button> og <select> skal se ud.
 * TODO Skal vi ikke have et mørkt og et lyst tema?
 */

var hotels, mikes, sierras;
var timerEnd = 0;
var timerAmountBar, timerSeconds, unixSeconds, unixSecondsOld, unixSecondsDiff, timerPaused;
var timerSet = false;
var timerTicking = false;
var soundAlarm = false;
var time;
var audio = new Audio("alert.mp3");
var timerHasRun = false;
var unixSecondsDiffSet;

document.bgColor = "#272822";
document.getElementById("header").style.backgroundImage = "url('../img/portfolio/headerTimer.jpg')";

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
        var hours = Math.floor((timerSeconds / 3600));
        var minutes = Math.floor(((timerSeconds - (hours * 3600)) / 60));
        var seconds = Math.floor((timerSeconds - (hours * 3600) - (minutes * 60)));
        var minutesLead, secondsLead;
        var barProgress = timerEnd - unixSecondsNoFloor;

        // Pad minutes and seconds with leading zeros, if need be
        minutesLead = (minutes < 10 ? "0" : "") + minutes;
        secondsLead = (seconds < 10 ? "0" : "") + seconds;

        // Calculating time to show in progressBar
        // Remove remaining hours and minutes, when these reach zero
        if (timerTicking) {
            if (timerEnd - unixSeconds > 0) {
                // Decrease timerSeconds every second
                if (unixSeconds > unixSecondsOld) {
                    timerSeconds = timerEnd - unixSeconds;
                }
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


            unixSecondsOld = unixSecondsNoFloor;

            // Draw progress bar progress
            if (timerEnd - unixSecondsNoFloor + unixSecondsDiff >= 0 && timerSet) {
                drawSlider(timerAmountBar + unixSecondsDiff, barProgress);
            } else {
                drawSlider(1, 0);
            }

            // Draw time left
            document.getElementById("progressFont").innerHTML = time;
        }


    } else {
        if (timerHasRun) {
            document.title = "Time!";
        }
    }
}

function stopTimerButton() {
    if (timerTicking == true && soundAlarm == false) {
        // If clicked when timer is ticking
        document.getElementById("stopTimer").value = "Resume timer";
        timerPaused = timerEnd - new Date().getTime() / 1000;
        timerTicking = false;
    } else if (timerTicking == false && soundAlarm == false) {
        // If clicked when timer set but paused
        document.getElementById("stopTimer").value = "Pause timer";
        timerEnd = timerPaused + new Date().getTime() / 1000;
        timerTicking = true;
    } else {
        // If clicked while alarm is going off
        document.getElementById("stopTimer").disabled = true;
        soundAlarm = false;
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

// Getting amount of seconds from timer data when timer is set
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
    barProgress = timerSeconds;
    timerEnd = timerSeconds + new Date().getTime() / 1000;
    timerSet = true;
    timerTicking = true;
    unixSecondsDiffSet = false;
}
