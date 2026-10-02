// State Management
let paperData = {
  schoolName: "ST. XAVIER HIGHER SECONDARY SCHOOL",
  className: "Class 12th",
  subjectName: "Chemistry",
  timeAllowed: "3 Hours",
  maxMarks: 70,
  instructions: [
    "All questions are compulsory.",
    "Section A carries 1 mark each.",
    "Section B carries 2 marks each.",
    "Section C carries 3 marks each.",
    "Section D carries 5 marks each."
  ],
  questions: []
};

// Default Preset Questions
const chemistryPreset = [
  { id: 1, type: "mcq", text: "Which of the following is an alkali metal?", options: ["Calcium", "Sodium", "Aluminum", "Iron"], answer: "Sodium", marks: 1 },
  { id: 2, type: "mcq", text: "What is the pH value of pure water at 25°C?", options: ["0", "14", "7", "5.5"], answer: "7", marks: 1 },
  { id: 3, type: "truefalse", text: "Oxidation involves the loss of electrons.", answer: "True", marks: 1 },
  { id: 4, type: "fillblanks", text: "The functional group present in alcohols is ________.", answer: "-OH", marks: 1 },
  { id: 5, type: "short", text: "Define Electronegativity. How does it vary across a period?", answer: "Electronegativity is the tendency of an atom to attract shared electrons. It increases across a period.", marks: 2 },
  { id: 6, type: "long", text: "Describe the extraction of Aluminum from Bauxite ore using the Hall-Héroult process with chemical equations.", answer: "Detailed process involving alumina dissolved in molten cryolite...", marks: 5 }
];

const primaryPreset = [
  { id: 1, type: "mcq", text: "Which organ pumps blood in the human body?", options: ["Brain", "Heart", "Lungs", "Stomach"], answer: "Heart", marks: 1 },
  { id: 2, type: "truefalse", text: "Plants make their food using sunlight.", answer: "True", marks: 1 },
  { id: 3, type: "fillblanks", text: "Water boils at ________ degrees Celsius.", answer: "100", marks: 1 },
  { id: 4, type: "short", text: "Name two sources of Vitamin C.", answer: "Oranges and Lemons", marks: 2 }
];

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  setupEventListeners();
  loadPreset('chemistry12');
  updateHistoryBadge();
});

// Setup Mobile Tabs and Input Events
function setupEventListeners() {
  // Field binding
  document.getElementById('school-name').addEventListener('input', (e) => { paperData.schoolName = e.target.value; renderPreview(); });
  document.getElementById('class-name').addEventListener('input', (e) => { paperData.className = e.target.value; renderPreview(); });
  document.getElementById('subject-name').addEventListener('input', (e) => { paperData.subjectName = e.target.value; renderPreview(); });
  document.getElementById('time-allowed').addEventListener('input', (e) => { paperData.timeAllowed = e.target.value; renderPreview(); });
  document.getElementById('max-marks').addEventListener('input', (e) => { paperData.maxMarks = e.target.value; renderPreview(); });
  document.getElementById('instructions').addEventListener('input', (e) => {
    paperData.instructions = e.target.value.split('\n').filter(i => i.trim() !== '');
    renderPreview();
  });

  // Mobile Tabs Logic
  const tabEditor = document.getElementById('tab-editor');
  const tabPreview = document.getElementById('tab-preview');
  const editorContainer = document.getElementById('editor-container');
  const previewContainer = document.getElementById('preview-container');

  tabEditor.addEventListener('click', () => {
    editorContainer.classList.remove('hidden');
    previewContainer.classList.add('hidden');
    tabEditor.className = "flex-1 py-2.5 text-center text-indigo-600 border-b-2 border-indigo-600 font-semibold flex items-center justify-center space-x-1";
    tabPreview.className = "flex-1 py-2.5 text-center text-slate-500 hover:text-indigo-600 flex items-center justify-center space-x-1";
  });

  tabPreview.addEventListener('click', () => {
    previewContainer.classList.remove('hidden');
    editorContainer.classList.add('hidden');
    tabPreview.className = "flex-1 py-2.5 text-center text-indigo-600 border-b-2 border-indigo-600 font-semibold flex items-center justify-center space-x-1";
    tabEditor.className = "flex-1 py-2.5 text-center text-slate-500 hover:text-indigo-600 flex items-center justify-center space-x-1";
  });

  document.getElementById('export-pdf-btn').addEventListener('click', exportToPDF);
  document.getElementById('history-btn').addEventListener('click', openHistoryModal);
}

// Preset Loader
function loadPreset(type) {
  if (type === 'chemistry12') {
    paperData.schoolName = "ST. XAVIER HIGHER SECONDARY SCHOOL";
    paperData.className = "Class 12th";
    paperData.subjectName = "Chemistry";
    paperData.maxMarks = 70;
    paperData.questions = JSON.parse(JSON.stringify(chemistryPreset));
  } else if (type === 'primaryScience') {
    paperData.schoolName = "GREEN VALLEY PUBLIC SCHOOL";
    paperData.className = "Class 5th";
    paperData.subjectName = "General Science";
    paperData.maxMarks = 20;
    paperData.questions = JSON.parse(JSON.stringify(primaryPreset));
  }
  syncInputs();
  renderQuestionsList();
  renderPreview();
}

function syncInputs() {
  document.getElementById('school-name').value = paperData.schoolName;
  document.getElementById('class-name').value = paperData.className;
  document.getElementById('subject-name').value = paperData.subjectName;
  document.getElementById('max-marks').value = paperData.maxMarks;
  document.getElementById('time-allowed').value = paperData.timeAllowed;
  document.getElementById('instructions').value = paperData.instructions.join('\n');
}

// Question Management
function addQuestion() {
  const type = document.getElementById('add-q-type').value;
  const newQ = {
    id: Date.now(),
    type: type,
    text: "New Question Title",
    marks: type === 'long' ? 5 : (type === 'short' ? 2 : 1),
    answer: ""
  };

  if (type === 'mcq') {
    newQ.options = ["Option A", "Option B", "Option C", "Option D"];
  }

  paperData.questions.push(newQ);
  renderQuestionsList();
  renderPreview();
}

function deleteQuestion(id) {
  paperData.questions = paperData.questions.filter(q => q.id !== id);
  renderQuestionsList();
  renderPreview();
}

function clearAllQuestions() {
  if (confirm("Are you sure you want to clear all questions?")) {
    paperData.questions = [];
    renderQuestionsList();
    renderPreview();
  }
}

// Render Left Panel Question Editors
function renderQuestionsList() {
  const container = document.getElementById('questions-container');
  container.innerHTML = '';

  let totalCalculated = 0;

  paperData.questions.forEach((q, index) => {
    totalCalculated += Number(q.marks || 0);

    const qCard = document.createElement('div');
    qCard.className = "p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2 relative group";

    let optionsHTML = '';
    if (q.type === 'mcq') {
      optionsHTML = `
        <div class="grid grid-cols-2 gap-2 pt-1">
          ${q.options.map((opt, i) => `
            <input type="text" value="${opt}" onchange="updateOption(${q.id},${i}, this.value)" 
              class="border border-slate-300 rounded p-1 text-[11px]" placeholder="Option ${i+1}">
          `).join('')}
        </div>
      `;
    }

    qCard.innerHTML = `
      <div class="flex items-center justify-between font-bold text-slate-700">
        <span>Q${index + 1}. (${q.type.toUpperCase()})</span>
        <div class="flex items-center space-x-2">
          <label>Marks:</label>
          <input type="number" value="${q.marks}" min="1" onchange="updateQuestionMarks(${q.id}, this.value)" class="w-12 border rounded p-0.5 text-center">
          <button onclick="deleteQuestion(${q.id})" class="text-rose-500 hover:text-rose-700 p-1">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>

      <textarea onchange="updateQuestionText(${q.id}, this.value)" rows="2" class="w-full border border-slate-300 rounded p-1.5 outline-none">${q.text}</textarea>
      ${optionsHTML}
      <input type="text" value="${q.answer || ''}" onchange="updateQuestionAnswer(${q.id}, this.value)" placeholder="Correct Answer (Optional)" class="w-full border border-slate-200 rounded p-1 text-emerald-700 font-medium">
    `;

    container.appendChild(qCard);
  });

  document.getElementById('calculated-total').innerText = `Total: ${totalCalculated} / ${paperData.maxMarks} Marks`;
  lucide.createIcons();
}

function updateQuestionText(id, text) {
  const q = paperData.questions.find(item => item.id === id);
  if (q) { q.text = text; renderPreview(); }
}

function updateQuestionAnswer(id, ans) {
  const q = paperData.questions.find(item => item.id === id);
  if (q) { q.answer = ans; renderPreview(); }
}

function updateQuestionMarks(id, marks) {
  const q = paperData.questions.find(item => item.id === id);
  if (q) { q.marks = Number(marks); renderQuestionsList(); renderPreview(); }
}

function updateOption(qId, optIdx, val) {
  const q = paperData.questions.find(item => item.id === qId);
  if (q && q.options) { q.options[optIdx] = val; renderPreview(); }
}

// Render Right A4 Printable Sheet
function renderPreview() {
  const preview = document.getElementById('paper-preview');
  const showAnswers = document.getElementById('toggle-answers').checked;

  let html = `
    <div class="text-center border-b-2 border-slate-900 pb-3 mb-4">
      <h1 class="text-xl font-bold uppercase tracking-wide text-slate-900">${paperData.schoolName || 'SCHOOL NAME'}</h1>
      <div class="flex justify-between items-center text-sm font-bold mt-2 px-2">
        <span>Subject: ${paperData.subjectName}</span>
        <span>${paperData.className}</span>
      </div>
      <div class="flex justify-between items-center text-xs mt-1 px-2 font-semibold">
        <span>Time Allowed: ${paperData.timeAllowed}</span>
        <span>Max Marks: ${paperData.maxMarks}</span>
      </div>
    </div>
  `;

  if (paperData.instructions.length > 0) {
    html += `
      <div class="mb-4 text-xs">
        <span class="font-bold underline block mb-1">General Instructions:</span>
        <ol class="list-decimal list-inside space-y-0.5 text-slate-800">
          ${paperData.instructions.map(ins => `<li>${ins}</li>`).join('')}
        </ol>
      </div>
    `;
  }

  // Group Questions by Type
  const groups = {
    mcq: { title: "Multiple Choice Questions", items: [] },
    truefalse: { title: "State True or False", items: [] },
    fillblanks: { title: "Fill in the Blanks", items: [] },
    short: { title: "Short Answer Questions", items: [] },
    long: { title: "Long Answer Questions", items: [] }
  };

  paperData.questions.forEach(q => {
    if (groups[q.type]) groups[q.type].items.push(q);
  });

  let globalCounter = 1;

  Object.keys(groups).forEach(key => {
    const group = groups[key];
    if (group.items.length > 0) {
      html += `<div class="mb-5">
        <h3 class="font-bold text-sm uppercase underline mb-2">${group.title}</h3>
        <div class="space-y-3">`;

      group.items.forEach(q => {
        html += `
          <div class="text-xs leading-relaxed">
            <div class="flex justify-between items-start">
              <span class="font-semibold">${globalCounter++}. ${q.text}</span>
              <span class="font-bold ml-2">[${q.marks}]</span>
            </div>
        `;

        if (q.type === 'mcq' && q.options) {
          html += `
            <div class="mcq-option-grid mt-1 ml-4 text-slate-800">
              ${q.options.map((opt, i) => `<div>(${String.fromCharCode(97 + i)})${opt}</div>`).join('')}
            </div>
          `;
        }

        if (showAnswers && q.answer) {
          html += `<div class="mt-1 ml-4 text-emerald-700 font-bold">Ans: ${q.answer}</div>`;
        }

        html += `</div>`;
      });

      html += `</div></div>`;
    }
  });

  preview.innerHTML = html;
}

// PDF Export Function using html2pdf.js
function exportToPDF() {
  const preview = document.getElementById('paper-preview');
  
  // Clone element to avoid breaking live preview during export styling
  const opt = {
    margin:       10,
    filename:     `${paperData.subjectName}_${paperData.className}_ExamPaper.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(preview).save();
}

// LocalStorage (Max 5 Papers)
function savePaperToLocalStorage() {
  let history = JSON.parse(localStorage.getItem('exam_papers_history') || '[]');
  
  const currentPaper = {
    id: Date.now(),
    timestamp: new Date().toLocaleString(),
    data: JSON.parse(JSON.stringify(paperData))
  };

  // Add to start & keep max 5
  history.unshift(currentPaper);
  if (history.length > 5) history = history.slice(0, 5);

  localStorage.setItem('exam_papers_history', JSON.stringify(history));
  updateHistoryBadge();
  alert("Paper draft successfully saved locally!");
}

function updateHistoryBadge() {
  const history = JSON.parse(localStorage.getItem('exam_papers_history') || '[]');
  document.getElementById('history-count').innerText = history.length;
}

function openHistoryModal() {
  const modal = document.getElementById('history-modal');
  const container = document.getElementById('history-list');
  const history = JSON.parse(localStorage.getItem('exam_papers_history') || '[]');

  if (history.length === 0) {
    container.innerHTML = `<div class="text-center text-xs text-slate-400 py-6">No saved papers found in local history.</div>`;
  } else {
    container.innerHTML = history.map((item, idx) => `
      <div class="flex items-center justify-between p-3 bg-slate-50 hover:bg-indigo-50 border rounded-lg transition text-xs">
        <div>
          <div class="font-bold text-slate-800">${item.data.subjectName} (${item.data.className})</div>
          <div class="text-[10px] text-slate-400">${item.timestamp}</div>
        </div>
        <button onclick="restorePaper(${item.id})" class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-[11px] font-semibold">
          Load
        </button>
      </div>
    `).join('');
  }

  modal.classList.remove('hidden');
}

function closeHistoryModal() {
  document.getElementById('history-modal').classList.add('hidden');
}

function restorePaper(id) {
  const history = JSON.parse(localStorage.getItem('exam_papers_history') || '[]');
  const item = history.find(h => h.id === id);
  if (item) {
    paperData = JSON.parse(JSON.stringify(item.data));
    syncInputs();
    renderQuestionsList();
    renderPreview();
    closeHistoryModal();
  }
}