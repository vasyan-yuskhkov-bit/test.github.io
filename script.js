const questions = [
  { q: "Где обычно можно встретить иксодового клеща?", options: ["Только в густом еловом лесу", "В траве, кустарниках, на лесных тропах и опушках, в парках", "Только в болотистой местности", "В сухой степи без растительности"], correct: 1 },
  { q: "В какое время года риск укуса клеща наиболее высок?", options: ["Декабрь–февраль", "Апрель–июнь и август–сентябрь", "Только июль", "Круглый год одинаков"], correct: 1 },
  { q: "Как чаще всего клещ попадает на человека?", options: ["Падает с дерева", "Прицепляется с травы или кустарника на одежду/обувь", "Прыгает с земли", "Заносится домашними животными"], correct: 1 },
  { q: "Что нужно сделать сразу после обнаружения присосавшегося клеща?", options: ["Залить его маслом", "Аккуратно удалить и поместить в контейнер", "Прижечь йодом", "Срочно принять антибиотик"], correct: 1 },
  { q: "Куда лучше всего обращаться для исследования клеща?", options: ["В продуктовый магазин", "В лабораторию Роспотребнадзора или инфекционную больницу", "В аптеку", "В ветеринарную клинику"], correct: 1 },
  { q: "Какие симптомы указывают на начало клещевого энцефалита?", options: ["Только боль в месте укуса", "Высокая температура, головная боль, тошнота, слабость", "Зуд и сыпь по всему телу", "Кашель и насморк"], correct: 1 },
  { q: "Существует ли прививка против клещевого энцефалита?", options: ["Да, есть эффективные вакцины", "Нет, только антибиотики", "Есть, но она не помогает", "Только народные средства"], correct: 0 },
  { q: "Кому в первую очередь рекомендуется вакцинация?", options: ["Только детям до 7 лет", "Только пенсионерам", "Жителям эндемичных районов, лесникам, туристам, дачникам", "Никому"], correct: 2 },
  { q: "Какая защита в лесу наиболее эффективна?", options: ["Короткие шорты", "Светлая закрытая одежда + репелленты", "Нательный крестик", "Громкое пение"], correct: 1 },
  { q: "Что может назначить врач для экстренной профилактики?", options: ["Греющий компресс", "Банки и горчичники", "Иммуноглобулин или противовирусные препараты", "Слабительные"], correct: 2 }
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
    btn.onclick = () => selectAnswer(i);
    optionsDiv.appendChild(btn);
  });

  document.getElementById('nextBtn').classList.add('hidden');
}

function selectAnswer(selected) {
  if (selected === questions[currentQuestion].correct) score++;

  const buttons = document.getElementById('options').children;
  for (let btn of buttons) {
    btn.disabled = true;
    if (parseInt([...buttons].indexOf(btn)) === questions[currentQuestion].correct) {
      btn.style.borderColor = "#10b981";
      btn.style.backgroundColor = "#ecfdf5";
    }
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
  circle.style.borderColor = percent >= 80 ? '#10b981' : percent >= 60 ? '#34d399' : '#f59e0b';

  document.getElementById('resultText').textContent = percent >= 80 ? "Отличный результат!" : percent >= 60 ? "Хороший результат!" : "Стоит повторить материал";
  
  saveResult(percent);
}

function saveResult(percent) {
  let results = JSON.parse(localStorage.getItem('kleshResults') || '[]');
  results.unshift({ date: new Date().toLocaleString('ru-RU'), score: percent });
  localStorage.setItem('kleshResults', JSON.stringify(results.slice(0, 15)));
}

function showStatistics() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('stats').classList.add('active');

  let results = JSON.parse(localStorage.getItem('kleshResults') || '[]');
  let html = results.length ? '' : '<p>Пока нет прохождений</p>';

  results.forEach(r => {
    html += `<div class="result-item"><span>${r.date}</span><strong>${r.score}%</strong></div>`;
  });

  document.getElementById('statsContent').innerHTML = html;
}

function hideStatistics() {
  document.getElementById('stats').classList.remove('active');
  document.getElementById('result').classList.add('active');
}

function restart() {
  document.getElementById('result').classList.remove('active');
  document.getElementById('start').classList.add('active');
}