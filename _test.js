
const chOverlay = document.getElementById('chOverlay');
const CH_LABELS = {
  1: 'DEFINE THE SPACE',
  2: 'THE RULEBOOK',
  3: 'COMMITMENT',
  4: 'LOCK IT IN',
  5: 'CHALLENGE SECURED'
};
const chState = { spaceType:'', name:'', whatsapp:'', location:'', address:'' };
let chStep = 1;

function openChallenge(e) {
  if (e) e.preventDefault();
  chOverlay.classList.add('open');
  setTimeout(function(){ chOverlay.classList.add('visible'); }, 10);
  document.body.style.overflow = 'hidden';
  chGoStep(1);
}

function closeChallenge() {
  chOverlay.classList.remove('visible');
  setTimeout(function(){
    chOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }, 260);
}

function updateTrack(n) {
  var lbl = document.getElementById('chStepLabel');
  if (lbl) lbl.textContent = CH_LABELS[n] || '';
  for (var i = 1; i <= 4; i++) {
    var dot = document.getElementById('chD' + i);
    if (dot) {
      if (i <= n) dot.classList.add('active');
      else dot.classList.remove('active');
    }
    if (i < 4) {
      var line = document.getElementById('chL' + i);
      if (line) {
        if (i < n) line.classList.add('done');
        else line.classList.remove('done');
      }
    }
  }
}

function chGoStep(n) {
  var current = document.getElementById('ch-s' + chStep);
  if (current) current.classList.remove('active');
  chStep = n;
  var next = document.getElementById('ch-s' + n);
  if (next) next.classList.add('active');
  updateTrack(n);
  chOverlay.scrollTo({ top: 0, behavior: 'smooth' });
}

function chPickSpace(btn, type) {
  document.querySelectorAll('.ch-opt').forEach(function(el) {
    el.classList.remove('selected');
    el.querySelector('.ch-opt-num').textContent = el.getAttribute('data-num');
  });
  btn.classList.add('selected');
  chState.spaceType = type;
  var prm = document.getElementById('ch-prm-space');
  if (prm) prm.textContent = type;
  var s1btn = document.getElementById('ch-btn-s1');
  if (s1btn) s1btn.disabled = false;
  setTimeout(function(){ chGoStep(2); }, 250);
}

function chValidate() {
  var ok = document.getElementById('ch-f-agree').checked;
  var proceedBtn = document.getElementById('ch-proceedBtn');
  if (proceedBtn) proceedBtn.disabled = !ok;
}

['ch-f-name','ch-f-wa','ch-f-loc','ch-f-addr'].forEach(function(id) {
  var el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', function() {
      var map = { 'ch-f-name':'name', 'ch-f-wa':'whatsapp', 'ch-f-loc':'location', 'ch-f-addr':'address' };
      chState[map[id]] = this.value.trim();
      chValidate();
    });
  }
});

var agreeCb = document.getElementById('ch-f-agree');
if (agreeCb) agreeCb.addEventListener('change', chValidate);

function chConfirm() {
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

  var msg = 'Hi TAAS! I just confirmed the ₹1.45 Lakh Interior Challenge.\n\nMy Reference: ' + refCode + '\nName: ' + chState.name + '\nSpace: ' + chState.spaceType + '\nLocation: ' + chState.location + '\n\nI am claiming the Early Bird Gift! Please confirm if I made it into the first 5 slots.\n\nDetailed address:\n' + chState.address + '\n\nI am ready to share my space photos!';

  var waLink = document.getElementById('ch-wa-link');
  if (waLink) waLink.href = 'https://wa.me/917400162509?text=' + encodeURIComponent(msg);
  chGoStep(5);
}

// Store data-num on each opt for reset
document.querySelectorAll('.ch-opt').forEach(function(el) {
  var numEl = el.querySelector('.ch-opt-num');
  if (numEl) el.setAttribute('data-num', numEl.textContent);
});
