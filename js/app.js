// Application Core Logic for Thanawiya Amma Results 2026

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCountdown();
  initSearchEvents();
  initPreRegForm();
  initModeSwitcher();
  initFAQ();
});

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem('site_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('site_theme', next);
      updateThemeIcon(next);
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

// Mode Switcher (Pre-launch vs Live Results)
let currentMode = 'live'; // 'prelaunch' or 'live'

function initModeSwitcher() {
  const modeBtn = document.getElementById('modeToggleBtn');
  if (!modeBtn) return;

  modeBtn.addEventListener('click', () => {
    currentMode = currentMode === 'live' ? 'prelaunch' : 'live';
    renderModeView();
  });
}

function renderModeView() {
  const prelaunchView = document.getElementById('prelaunchSection');
  const liveView = document.getElementById('liveSection');
  const modeLabel = document.getElementById('modeToggleLabel');

  if (currentMode === 'prelaunch') {
    prelaunchView.style.display = 'block';
    liveView.style.display = 'none';
    if (modeLabel) modeLabel.textContent = 'معاينة وضع الاستعلام الفوري';
  } else {
    prelaunchView.style.display = 'none';
    liveView.style.display = 'block';
    if (modeLabel) modeLabel.textContent = 'معاينة وضع ما قبل ظهور النتيجة';
  }
}

// Countdown Timer
function initCountdown() {
  // Expected Result Date
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 3);

  function updateTimer() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) return;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    const dEl = document.getElementById('timerDays');
    const hEl = document.getElementById('timerHours');
    const mEl = document.getElementById('timerMins');
    const sEl = document.getElementById('timerSecs');

    if (dEl) dEl.textContent = String(days).padStart(2, '0');
    if (hEl) hEl.textContent = String(hours).padStart(2, '0');
    if (mEl) mEl.textContent = String(mins).padStart(2, '0');
    if (sEl) sEl.textContent = String(secs).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// Pre-registration Form
function initPreRegForm() {
  const form = document.getElementById('preRegForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const roll = document.getElementById('regRoll').value.trim();
    const phone = document.getElementById('regPhone').value.trim();

    if (!roll) {
      alert('برجاء إدخال رقم الجلوس');
      return;
    }

    const subscribers = JSON.parse(localStorage.getItem('registered_subscribers') || '[]');
    subscribers.push({ name, roll, phone, date: new Date().toISOString() });
    localStorage.setItem('registered_subscribers', JSON.stringify(subscribers));

    alert('✅ تم تسجيل بياناتك بنجاح! ستصلك رسالة إشعار بالنتيجة فور اعتمادها رسمياً.');
    form.reset();
  });
}

// Search Logic & Auto-complete
let searchType = 'roll'; // 'roll' or 'name'

function initSearchEvents() {
  const tabRoll = document.getElementById('tabRoll');
  const tabName = document.getElementById('tabName');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const autocompleteList = document.getElementById('autocompleteList');

  if (tabRoll && tabName) {
    tabRoll.addEventListener('click', () => {
      searchType = 'roll';
      tabRoll.classList.add('active');
      tabName.classList.remove('active');
      searchInput.placeholder = 'أدخل رقم الجلوس المكون من 7 أرقام (مثال: 1001660)';
      searchInput.value = '';
      hideAutocomplete();
    });

    tabName.addEventListener('click', () => {
      searchType = 'name';
      tabName.classList.add('active');
      tabRoll.classList.remove('active');
      searchInput.placeholder = 'أدخل اسم الطالب رباعي (مثال: محمد احمد)';
      searchInput.value = '';
      hideAutocomplete();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      if (query.length < 2) {
        hideAutocomplete();
        return;
      }
      showSuggestions(query);
    });

    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        performSearch(searchInput.value.trim());
      }
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      performSearch(searchInput.value.trim());
    });
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-input-wrapper')) {
      hideAutocomplete();
    }
  });
}

function normalizeArabicText(text) {
  return text
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .toLowerCase();
}

function showSuggestions(query) {
  const list = document.getElementById('autocompleteList');
  if (!list || typeof STUDENT_DATA === 'undefined') return;

  const normQuery = normalizeArabicText(query);
  let matches = [];

  if (searchType === 'roll') {
    matches = STUDENT_DATA.filter(s => s.roll.startsWith(query)).slice(0, 6);
  } else {
    matches = STUDENT_DATA.filter(s => normalizeArabicText(s.name).includes(normQuery)).slice(0, 6);
  }

  if (matches.length === 0) {
    hideAutocomplete();
    return;
  }

  list.innerHTML = matches.map(s => `
    <div class="autocomplete-item" onclick="selectStudent('${s.roll}')">
      <div>
        <strong>${s.name}</strong>
        <span style="font-size:0.8rem; color:var(--text-muted); margin-right:8px;">رقم الجلوس: ${s.roll}</span>
      </div>
      <span class="tag tag-track">${s.track}</span>
    </div>
  `).join('');

  list.style.display = 'block';
}

function hideAutocomplete() {
  const list = document.getElementById('autocompleteList');
  if (list) list.style.display = 'none';
}

window.selectStudent = function(roll) {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = roll;
  hideAutocomplete();
  performSearch(roll);
};

function performSearch(query) {
  if (!query) {
    alert('برجاء كتابة رقم الجلوس أو الاسم للبحث');
    return;
  }

  if (typeof STUDENT_DATA === 'undefined') {
    alert('قاعدة البيانات غير جاهزة بعد');
    return;
  }

  hideAutocomplete();
  const normQuery = normalizeArabicText(query);

  let student = STUDENT_DATA.find(s => s.roll === query);
  if (!student && searchType === 'name') {
    student = STUDENT_DATA.find(s => normalizeArabicText(s.name).includes(normQuery));
  }

  if (!student) {
    alert('⚠️ عذراً، لم يتم العثور على طالب بهذا الرقم أو الاسم في نتائج العينة الحالية.');
    return;
  }

  renderResultCard(student);
}

// Render Result Card
function renderResultCard(student) {
  const card = document.getElementById('resultCard');
  if (!card) return;

  // Student Meta Header
  document.getElementById('resStudentName').textContent = student.name;
  document.getElementById('resRollNumber').textContent = `رقم الجلوس: ${student.roll}`;
  document.getElementById('resTrack').textContent = student.track;

  const statusBadge = document.getElementById('resStatusBadge');
  statusBadge.textContent = student.status;
  statusBadge.className = 'tag ' + (
    student.status === 'ناجح' ? 'tag-status-pass' :
    student.status === 'له دور ثان' ? 'tag-status-resit' : 'tag-status-fail'
  );

  // Score Badge Circle
  document.getElementById('resPercentage').textContent = `${student.percentage}%`;
  document.getElementById('resTotalMarks').textContent = `${student.total} / ${student.maxTotal}`;

  // Build Added Subjects Table
  const tableBody = document.getElementById('resGradeTableBody');
  let tableHTML = '';

  for (const [key, subj] of Object.entries(student.subjects)) {
    if (subj.score > 0 || subj.name === 'اللغة العربية' || subj.name === 'اللغة الأجنبية الأولى') {
      const pct = Math.round((subj.score / subj.max) * 100);
      tableHTML += `
        <tr>
          <td><strong>${subj.name}</strong></td>
          <td>${subj.score} / ${subj.max}</td>
          <td>${pct}%</td>
          <td style="width:140px;">
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${pct}%;"></div>
            </div>
          </td>
        </tr>
      `;
    }
  }

  tableBody.innerHTML = tableHTML;

  // Non Added Subjects Table
  const nonAddedBody = document.getElementById('resNonAddedTableBody');
  let nonAddedHTML = '';

  for (const [key, subj] of Object.entries(student.nonAdded)) {
    const isPass = subj.score >= (subj.max / 2);
    nonAddedHTML += `
      <tr>
        <td>${subj.name}</td>
        <td>${subj.score} / ${subj.max}</td>
        <td><span class="tag ${isPass ? 'tag-status-pass' : 'tag-status-fail'}">${isPass ? 'ناجح' : 'راسب'}</span></td>
      </tr>
    `;
  }
  nonAddedBody.innerHTML = nonAddedHTML;

  // Tanseeq College Admission Calculator
  renderTanseeqSection(student);

  // Show Result Card & Scroll smoothly
  card.style.display = 'block';
  card.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Tanseeq Calculator Section
function renderTanseeqSection(student) {
  const tanseeqContainer = document.getElementById('tanseeqGrid');
  if (!tanseeqContainer || typeof TANSEEQ_DATA === 'undefined') return;

  const trackFaculties = TANSEEQ_DATA[student.track] || [];
  if (trackFaculties.length === 0) {
    tanseeqContainer.innerHTML = '<p class="text-muted">لا تتوفر توقعات تنسيق لهذه الشعبة.</p>';
    return;
  }

  let html = '';
  trackFaculties.forEach(fac => {
    const diff = student.percentage - fac.minPercent;
    const isEligible = diff >= 0;
    const isBorderline = diff < 0 && diff >= -2.0;

    const statusClass = isEligible ? 'eligible' : (isBorderline ? 'borderline' : '');
    const statusLabel = isEligible ? 'متاح وفق التنسيق المتوقع' : (isBorderline ? 'مرحلة ثانية / تقليل اغتراب' : 'فرصة ضعيفة');
    const statusColor = isEligible ? 'var(--success)' : (isBorderline ? 'var(--warning)' : 'var(--danger)');

    html += `
      <div class="faculty-card ${statusClass}">
        <div class="faculty-icon" style="color: ${statusColor};">🎓</div>
        <div class="faculty-info">
          <h4>${fac.name}</h4>
          <p>الحد الأدنى المتوقع: <strong>${fac.minPercent}%</strong> (${fac.minScore} درجة)</p>
          <span style="font-size:0.78rem; font-weight:bold; color: ${statusColor};">${statusLabel}</span>
        </div>
      </div>
    `;
  });

  tanseeqContainer.innerHTML = html;
}

// Print Handler
window.printResultCard = function() {
  window.print();
};

// WhatsApp Share Handler
window.shareOnWhatsApp = function() {
  const name = document.getElementById('resStudentName').textContent;
  const roll = document.getElementById('resRollNumber').textContent;
  const percent = document.getElementById('resPercentage').textContent;
  const total = document.getElementById('resTotalMarks').textContent;

  const text = `🎉 الحمد لله! نتيجتي في الثانوية العامة 2026:\n\n👤 الطالب: ${name}\n🆔 ${roll}\n📊 النسبة المئوية: ${percent}\n🏆 المجموع: ${total}\n\nشوف نتيجتك دلوقتي عبر الرابط: ${window.location.href}`;
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};

// FAQ Accordion
function initFAQ() {
  const questions = document.querySelectorAll('.faq-question');
  questions.forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      item.classList.toggle('open');
    });
  });
}
