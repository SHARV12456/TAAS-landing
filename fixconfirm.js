// fixconfirm.js — makes CONFIRM CHALLENGE button work correctly
// The button was stuck disabled because chValidate() wasn't re-running after chGoStep(4)
const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// 1. Remove disabled from confirmBtn so it's always clickable
h = h.replace('id="ch-confirmBtn" style="flex:1" onclick="chConfirm()" disabled', 'id="ch-confirmBtn" style="flex:1" onclick="chConfirm()"');

// 2. Replace chValidate to also re-enable confirmBtn without field check (let chConfirm guard it)
// and replace chConfirm to validate inline and alert if missing
const oldValidate = `function chValidate() {
  var ok = document.getElementById('ch-f-agree').checked;
  var proceedBtn = document.getElementById('ch-proceedBtn');
  if (proceedBtn) proceedBtn.disabled = !ok;

  var ok2 = chState.name && chState.whatsapp && chState.location && chState.address;
  var confirmBtn = document.getElementById('ch-confirmBtn');
  if (confirmBtn) confirmBtn.disabled = !ok2;
}`;

const newValidate = `function chValidate() {
  var ok = document.getElementById('ch-f-agree').checked;
  var proceedBtn = document.getElementById('ch-proceedBtn');
  if (proceedBtn) proceedBtn.disabled = !ok;
}`;

h = h.replace(oldValidate, newValidate);

// 3. Replace chConfirm to validate fields before proceeding
const oldConfirmStart = h.indexOf('function chConfirm() {');
const oldConfirmEnd = h.indexOf('\n}', oldConfirmStart) + 2;

const newConfirm = `function chConfirm() {
  // read field values fresh
  var n = document.getElementById('ch-f-name');
  var w = document.getElementById('ch-f-wa');
  var l = document.getElementById('ch-f-loc');
  var a = document.getElementById('ch-f-addr');
  if (n) chState.name = n.value.trim();
  if (w) chState.whatsapp = w.value.trim();
  if (l) chState.location = l.value.trim();
  if (a) chState.address = a.value.trim();

  if (!chState.name || !chState.whatsapp || !chState.location || !chState.address) {
    var btn = document.getElementById('ch-confirmBtn');
    if (btn) {
      btn.textContent = 'FILL ALL FIELDS FIRST →';
      setTimeout(function(){ btn.textContent = 'CONFIRM CHALLENGE →'; }, 2000);
    }
    return;
  }

  var d = new Date();
  var dateStr = ('0'+d.getDate()).slice(-2) + ('0'+(d.getMonth()+1)).slice(-2) + d.getFullYear().toString().slice(-2);
  var refCode = 'TAAS-' + dateStr + '-' + Math.floor(1000 + 9000 * Math.random());
  var refEl = document.getElementById('ch-sv-ref');
  if (refEl) refEl.textContent = refCode;

  var msg = 'Hi TAAS! I just confirmed the \u20b91.45 Lakh Interior Challenge.\\n\\nMy Reference: ' + refCode + '\\nName: ' + chState.name + '\\nSpace: ' + chState.spaceType + '\\nLocation: ' + chState.location + '\\n\\nI am claiming the Early Bird Gift! Please confirm if I made it into the first 5 slots.\\n\\nDetailed address:\\n' + chState.address + '\\n\\nI am ready to share my space photos!';

  var waLink = document.getElementById('ch-wa-link');
  if (waLink) waLink.href = 'https://wa.me/917400162509?text=' + encodeURIComponent(msg);
  chGoStep(5);
}`;

h = h.substring(0, oldConfirmStart) + newConfirm + h.substring(oldConfirmEnd);

fs.writeFileSync('index.html', h, 'utf8');
console.log('done, length:', h.length);
