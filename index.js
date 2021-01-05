const five = require("johnny-five");
var os = require("os");

const board = new five.Board({
  debug: true,
});

const pins = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const leds = [];

function calc() {
  const totalRam = os.totalmem();
  const freeRam = os.freemem();
  const usageRam = Math.floor(totalRam - freeRam);
  const steps = Math.floor(totalRam / pins.length);
  const count = Math.floor(usageRam / steps);

  return count;
}

board.on("connect", () => {
  console.log("Welcome!");
});

board.on("ready", () => {
  console.log("Board is ready!");

  //init leds
  pins.forEach((pin) => leds.push(new five.Led(pin)));
  //init leds

  const showProgress = (n) => {
    if (typeof n !== "number" || n > pins.length)
      throw Error("'n' parameter must be number and less than" + pins.length);

    for (let x = 0; x < n; x++) leds[x].on();
  };

  const ledsOff = () => leds.forEach((led) => led.off());

  let lastStatus = calc();
  setInterval(() => {
    if (calc() !== lastStatus) {
      ledsOff();
      lastStatus = calc();
    }
    showProgress(calc());
  }, 500);
});
