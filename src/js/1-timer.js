import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

const datetimePicker = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('button[data-start]');
const datetimeDays = document.querySelector('.value[data-days]');
const datetimeHours = document.querySelector('.value[data-hours]');
const datetimeMinutes = document.querySelector('.value[data-minutes]');
const datetimeSecondes = document.querySelector('.value[data-seconds]');
startBtn.addEventListener('click', handleStart);

startBtn.disabled = true;

let userSelectedDate = null;
let intervalId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0].getTime();
    const currentDate = Date.now();
    if (userSelectedDate <= currentDate) {
      iziToast.show({
        message: 'Please choose a date in the future',
        backgroundColor: '#ef4040',
        messageColor: '#fff',
        position: 'topRight',
      });
      startBtn.disabled = true;
      return;
    }
    startBtn.disabled = false;
  },
};

flatpickr(datetimePicker, options);

function handleStart() {
  startBtn.disabled = true;
  datetimePicker.disabled = true;
  intervalId = setInterval(() => {
    const currentTime = Date.now();
    const deltaTime = userSelectedDate - currentTime;
    if (deltaTime <= 0) {
      clearInterval(intervalId);
      datetimePicker.disabled = false;
      datetimeDays.textContent = '0';
      datetimeHours.textContent = '0';
      datetimeMinutes.textContent = '0';
      datetimeSecondes.textContent = '0';
      iziToast.show({
        message: 'finish',
        backgroundColor: 'green',
        messageColor: '#fff',
        position: 'topRight',
      });
      return;
    }
    const ojbTime = convertMs(deltaTime);
    datetimeDays.textContent = addLeadingZero(ojbTime.days);
    datetimeHours.textContent = addLeadingZero(ojbTime.hours);
    datetimeMinutes.textContent = addLeadingZero(ojbTime.minutes);
    datetimeSecondes.textContent = addLeadingZero(ojbTime.seconds);
  }, 1000);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
