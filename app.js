const $ = (selector) => document.querySelector(selector);
const alarmTime = $('#alarmTime');
const countdown = $('#countdown');
const startButton = $('#startButton');
const soundWave = $('#soundWave');
const micStatus = $('#micStatus');
const sleepInsight = $('#sleepInsight');
const timeDialog = $('#timeDialog');
const timeInput = $('#timeInput');
const windowInput = $('#windowInput');
let isMonitoring = false;
let wakeAt = getNextAlarm('07:00');

function getNextAlarm(value) {
  const [hours, minutes] = value.split(':').map(Number);
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);
  if (target <= new Date()) target.setDate(target.getDate() + 1);
  return target;
}
function updateCountdown() {
  const seconds = Math.max(0, Math.floor((wakeAt - new Date()) / 1000));
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor(seconds % 3600 / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  countdown.textContent = `${h}:${m}:${s}`;
}
async function startMonitoring() {
  try {
    if (navigator.mediaDevices?.getUserMedia) await navigator.mediaDevices.getUserMedia({ audio: true });
    isMonitoring = true;
    startButton.innerHTML = '<span>■</span><span>结束睡眠</span>';
    soundWave.classList.add('listening'); micStatus.textContent = '正在感知'; micStatus.classList.add('active');
    sleepInsight.textContent = '正在以低功耗模式分析环境声响和睡眠节律。';
  } catch {
    sleepInsight.textContent = '未取得麦克风权限。你仍可以使用普通闹钟和智能唤醒窗口。';
  }
}
startButton.addEventListener('click', () => { if (isMonitoring) { isMonitoring=false; startButton.innerHTML='<span class="play">▶</span><span>开始睡眠</span>'; soundWave.classList.remove('listening'); micStatus.textContent='未开启'; micStatus.classList.remove('active'); sleepInsight.textContent='开启麦克风后，circle 会在设备端分析环境声音。'; } else startMonitoring(); });
function openTimeDialog(){ timeDialog.showModal(); }
$('#editButton').addEventListener('click', openTimeDialog); $('#addButton').addEventListener('click', openTimeDialog); $('#settingsButton').addEventListener('click', openTimeDialog);
windowInput.addEventListener('input', () => $('#windowOutput').textContent = `${windowInput.value} 分钟`);
$('#saveTime').addEventListener('click', () => { const [h,m]=timeInput.value.split(':'); alarmTime.textContent=`${h}:${m}`; document.querySelector('.alarm-value').innerHTML=`${h}:${m} <small>${Number(h) < 12 ? 'AM' : 'PM'}</small>`; document.querySelector('.wake-window strong').textContent = `${windowInput.value} 分钟智能窗口`; wakeAt=getNextAlarm(timeInput.value); });
$('#alarmEnabled').addEventListener('change', (event)=> { $('#countdownStatus').textContent=event.target.checked ? '今晚好眠' : '闹钟已暂停'; });
updateCountdown(); setInterval(updateCountdown, 1000);
