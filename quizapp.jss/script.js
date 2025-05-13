const questions = [
  { q: "In JavaScript, which keyword is used to declare a variable?", opts: ["var","let","const","all of the above"], ans: 3 },
  { q: "What is the output of: console.log(typeof NaN)?", opts: ["number","NaN","undefined","object"], ans: 0 },
  { q: "Which method is used to add an item to the end of an array?", opts: ["push()","pop()","shift()","unshift()"], ans: 0 },
  { q: "How do you write a function in JavaScript?", opts: ["function myFunc() {}","var myFunc = function() {}","const myFunc = () => {}","All of the above"], ans: 3 },
  { q: "What will 1 + '2' return?", opts: ["3","12","TypeError","NaN"], ans: 1 },
  { q: "Which operator is used for strict equality comparison?", opts: ["==","=","===","!=="], ans: 2 },
  { q: "What does DOM stand for?", opts: ["Document Object Model","Data Object Model","Document Oriented Model","Data Oriented Manipulation"], ans: 0 },
  { q: "Which event fires when the DOM has fully loaded?", opts: ["DOMContentLoaded","load","ready","onload"], ans: 0 },
  { q: "How do you comment a block of code in JavaScript?", opts: ["/* comment */","// comment","# comment","<!-- comment -->"], ans: 0 },
  { q: "Which Array method creates a new array with the results of calling a function on every element?", opts: ["forEach()","map()","filter()","reduce()"], ans: 1 }
];

let current = 0, timeLeft = 120, timerInterval, score = 0;
const timerEl = document.getElementById('timer');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');
const quizEl = document.getElementById('quiz');
const resultEl = document.getElementById('result');
const scoreEl = document.getElementById('score');

// Ask name
let userName = prompt("اپنا نام درج کریں:");

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 120;
  updateTimer();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) nextQuestion();
  }, 1000);
}

function updateTimer() {
  const m = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const s = String(timeLeft % 60).padStart(2, '0');
  timerEl.textContent = `Time Left: ${m}:${s}`;
}

function loadQuestion() {
  if (current >= questions.length) {
    clearInterval(timerInterval);
    quizEl.style.display = 'none';
    scoreEl.textContent = `آپ نے ${questions.length} سوالات میں سے ${score} درست جواب دیے۔`;
    resultEl.style.display = 'block';

    // Save result to Firebase
    const resultRef = firebase.database().ref("quizResults");
    resultRef.push({
      name: userName,
      score: score,
      total: questions.length,
      timestamp: new Date().toISOString()
    });

    return;
  }

  const { q, opts } = questions[current];
  questionEl.textContent = `Q${current + 1}. ${q}`;
  optionsEl.innerHTML = '';
  opts.forEach((opt, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<label><input type='radio' name='option' value='${i}'> ${opt}</label>`;
    optionsEl.appendChild(li);
  });

  startTimer();
}

function nextQuestion() {
  clearInterval(timerInterval);
  const selected = document.querySelector('input[name="option"]:checked');
  if (selected && Number(selected.value) === questions[current].ans) score++;
  current++;
  loadQuestion();
}

nextBtn.addEventListener('click', nextQuestion);
loadQuestion();
