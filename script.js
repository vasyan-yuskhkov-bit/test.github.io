const questions = [
  { q: "Где обычно можно встретить иксодового клеща — переносчика вируса?", options: ["Только в густом еловом лесу", "В траве, кустарниках, на лесных тропах и опушках, в парках", "Только в болотистой местности", "В сухой степи без растительности"], correct: 1 },
  { q: "В какое время года риск укуса клеща наиболее высок?", options: ["Декабрь–февраль", "Апрель–июнь и август–сентябрь", "Только июль", "Круглый год одинаков"], correct: 1 },
  { q: "Как чаще всего клещ попадает на человека?", options: ["Падает с дерева", "Прицепляется с травы или кустарника на одежду/обувь", "Прыгает с земли", "Заносится домашними животными при контакте"], correct: 1 },
  { q: "Что нужно сделать сразу после обнаружения присосавшегося клеща?", options: ["Залить его маслом и ждать, пока отпадет", "Аккуратно удалить (петлей или пинцетом) и поместить в контейнер", "Прижечь йодом и оставить в покое", "Срочно принять антибиотик"], correct: 1 },
  { q: "Куда лучше всего обращаться для исследования удаленного клеща?", options: ["В продуктовый магазин", "В лабораторию Роспотребнадзора или инфекционную больницу", "В аптеку", "В ветеринарную клинику"], correct: 1 },
  { q: "Какие симптомы могут указывать на начало клещевого энцефалита?", options: ["Только боль в месте укуса и покраснение", "Высокая температура, сильная головная боль, тошнота, слабость в мышцах шеи", "Зуд и сыпь по всему телу", "Кашель и насморк"], correct: 1 },
  { q: "Существует ли прививка против клещевого энцефалита?", options: ["Да, есть эффективные вакцины", "Нет, только антибиотики", "Есть, но она не помогает", "Только народные средства"], correct: 0 },
  { q: "Кому в первую очередь рекомендуется вакцинация?", options: ["Только детям до 7 лет", "Только пенсионерам", "Жителям эндемичных районов, лесникам, туристам, дачникам", "Никому, прививка не нужна"], correct: 2 },
  { q: "Какая защита в лесу снижает риск наиболее эффективно?", options: ["Короткие шорты и открытые сандалии", "Светлая одежда, закрывающая руки и ноги + репелленты", "Надевание нательного крестика", "Громкое пение"], correct: 1 },
  { q: "Что может назначить фельдшер для экстренной профилактики?", options: ["Греющий компресс", "Банки и горчичники", "Иммуноглобулин или противовирусные препараты", "Слабительные средства"], correct: 2 }
];

let currentQuestion = 0;
let score = 0;

function startTest() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('quiz').classList.add('active');
  currentQuestion = 0;
  score = 0;
  showQuestion();
}

function showQuestion() {
  const q = questions[currentQuestion];
  document.getElementById('current').textContent = currentQuestion + 1;
  document.getElementById('question').textContent = q.q;

  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = '';

  q.options.forEach((option, i) => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.onclick = () => selectAnswer(i, btn);
    optionsDiv.appendChild(btn);
  });

  document.getElementById('nextBtn').classList.add('hidden');
}

function selectAnswer(selected, btn) {
  const correct = questions[currentQuestion].correct;
  const buttons = document.getElementById('options').children;

  for (let b of buttons) {
    b.disabled = true;
    if (parseInt([...buttons].indexOf(b)) === correct) {
      b.classList.add('correct');
    }
  }

  if (selected === correct) {
    score++;
  } else {
    btn.classList.add('wrong');
  }

  document.getElementById('nextBtn').classList.remove('hidden');
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('result').classList.add('active');

  const percent = Math.round((score / 10) * 100);
  const circle = document.getElementById('scoreCircle');
  circle.textContent = percent + '%';
  circle.style.borderColor = percent >= 80 ? '#10b981' : percent >= 60 ? '#34d399' : '#ef4444';

  document.getElementById('resultText').textContent = percent >= 80 ? "Отличный результат! Вы хорошо подготовлены." : "Есть над чем поработать.";

  saveResult(percent);
}

function saveResult(percent) {
  let results = JSON.parse(localStorage.getItem('kleshResults') || '[]');
  results.unshift({
    date: new Date().toLocaleString('ru-RU'),
    score: percent,
    correct: score
  });
  localStorage.setItem('kleshResults', JSON.stringify(results.slice(0, 30)));
}

function showAdmin() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('admin').classList.add('active');
  document.getElementById('adminContent').classList.add('hidden');
  document.getElementById('adminPass').value = '';
}

function checkAdminPassword() {
  const pass = document.getElementById('adminPass').value;
  if (pass === "admin123") {
    document.getElementById('adminContent').classList.remove('hidden');
    loadAdminStats();
  } else {
    alert("Неверный пароль!");
  }
}

function loadAdminStats() {
  let results = JSON.parse(localStorage.getItem('kleshResults') || '[]');
  let html = '<p>Всего прохождений: ' + results.length + '</p>';

  results.forEach(r => {
    html += `<div class="result-item"><span>${r.date}</span> — <strong>${r.score}% (${r.correct}/10)</strong></div>`;
  });

  document.getElementById('adminStats').innerHTML = html || '<p>Пока нет результатов</p>';
}

function clearAllResults() {
  if (confirm("Очистить все результаты?")) {
    localStorage.removeItem('kleshResults');
    loadAdminStats();
  }
}

function hideAdmin() {
  document.getElementById('admin').classList.remove('active');
  document.getElementById('result').classList.add('active');
}

function restart() {
  document.getElementById('result').classList.remove('active');
  document.getElementById('start').classList.add('active');
}
