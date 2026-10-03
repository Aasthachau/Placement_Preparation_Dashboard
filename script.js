const addBtn = document.getElementById('add-btn');
const newTaskInput = document.getElementById('new-task');
const categorySelect = document.getElementById('task-category');
const pendingList = document.getElementById('pending-tasks');
const completedList = document.getElementById('completed-tasks');
const revisionText = document.getElementById('revision-text');
const badgesDiv = document.getElementById('badges');

let tasks = []; // {name, category, status}

function updateUI() {
  pendingList.innerHTML = '';
  completedList.innerHTML = '';

  let counts = {DSA: {done:0,total:0}, Aptitude:{done:0,total:0}, Verbal:{done:0,total:0}};
  
  tasks.forEach((t, i) => {
    counts[t.category].total++;
    if (t.status === 'done') counts[t.category].done++;

    const li = document.createElement('li');
    li.textContent = `${t.name} (${t.category})`;

    if (t.status === 'pending') {
      const completeBtn = document.createElement('button');
      completeBtn.innerHTML = '✔️';
      completeBtn.className = 'task-btn';
      completeBtn.onclick = () => { t.status = 'done'; updateUI(); };
      const delBtn = document.createElement('button');
      delBtn.innerHTML = '🗑️';
      delBtn.className = 'task-btn';
      delBtn.onclick = () => { tasks.splice(i,1); updateUI(); };
      li.appendChild(completeBtn);
      li.appendChild(delBtn);
      pendingList.appendChild(li);
    } else {
      li.style.textDecoration = 'line-through';
      li.style.opacity = '0.7';
      completedList.appendChild(li);
    }
  });

  // Update progress bars
  ['DSA','Aptitude','Verbal'].forEach(cat=>{
    const percent = counts[cat].total ? Math.round((counts[cat].done/counts[cat].total)*100) : 0;
    document.getElementById(cat.toLowerCase()+'-bar').value = percent;
    document.getElementById(cat.toLowerCase()+'-percent').textContent = percent+'%';
  });

  // Pie Chart update
  pieChart.data.datasets[0].data = [
    counts['DSA'].total, counts['Aptitude'].total, counts['Verbal'].total
  ];
  pieChart.update();

  // Revision reminder (pick random completed task)
  let completed = tasks.filter(t=>t.status==='done');
  if(completed.length>0){
    let random = completed[Math.floor(Math.random()*completed.length)];
    revisionText.textContent = `Revise: ${random.name} (${random.category})`;
  } else {
    revisionText.textContent = "Complete some tasks to get reminders!";
  }

  // Badges
  let completedCount = completed.length;
  badgesDiv.innerHTML = '';
  if(completedCount>=10) badgesDiv.innerHTML += '<img src="https://img.icons8.com/color/96/medal.png" title="Bronze Badge">';
  if(completedCount>=25) badgesDiv.innerHTML += '<img src="https://img.icons8.com/color/96/medal2.png" title="Silver Badge">';
  if(completedCount>=50) badgesDiv.innerHTML += '<img src="https://img.icons8.com/color/96/medal3.png" title="Gold Badge">';
}

// Add Task
addBtn.addEventListener('click', ()=>{
  let taskName = newTaskInput.value.trim();
  if(!taskName) return;
  tasks.push({name: taskName, category: categorySelect.value, status:'pending'});
  newTaskInput.value = '';
  updateUI();
});

// Motivational Quotes
const quotes = [
  "Keep pushing, you're closer than you think!",
  "Every small step counts 🌸",
  "Consistency beats intensity 💪",
  "Believe in yourself ✨",
  "Hard work always pays off 🚀"
];
document.getElementById('quote').textContent = quotes[Math.floor(Math.random()*quotes.length)];

// Chart.js Pie Chart
const ctx = document.getElementById('pieChart');
const pieChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['DSA','Aptitude','Verbal'],
    datasets: [{
      data: [0,0,0],
      backgroundColor: ['#fbc2eb','#fda085','#8fd3f4']
    }]
  },
  options: { responsive: true }
});

updateUI();

// -------- Dynamic Calendar --------
function generateCalendar() {
  const header = document.getElementById("calendar-header");
  const grid = document.getElementById("calendar-grid");

  const now = new Date();
  const month = now.toLocaleString("default", { month: "long" });
  const year = now.getFullYear();

  header.textContent = `${month} ${year}`;
  grid.innerHTML = "";

  const firstDay = new Date(year, now.getMonth(), 1).getDay();
  const lastDate = new Date(year, now.getMonth() + 1, 0).getDate();

  // Fill empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    grid.innerHTML += "<div></div>";
  }

  // Fill days
  for (let d = 1; d <= lastDate; d++) {
    const dayDiv = document.createElement("div");
    dayDiv.textContent = d;
    if (d === now.getDate()) {
      dayDiv.classList.add("today");
    }
    grid.appendChild(dayDiv);
  }
}
generateCalendar();

//////////////////////////////////
// -------- Page Navigation --------
function showPage(page) {
  document.getElementById("dashboard-page").style.display = (page === "dashboard") ? "block" : "none";
  document.getElementById("aptitude-page").style.display = (page === "aptitude") ? "block" : "none";
}

// -------- Add Aptitude Topic to Dashboard --------
function addTaskFromAptitude(name, category) {
  tasks.push({name, category, status:'pending'});
  updateUI();
  alert(`${name} added to Dashboard!`);
}

// --- Page Navigation ---
function showPage(page) {
  document.getElementById("dashboard-page").style.display = (page === "dashboard") ? "block" : "none";
  document.getElementById("aptitude-page").style.display = (page === "aptitude") ? "block" : "none";
  document.getElementById("dsa-page").style.display = (page === "dsa") ? "block" : "none";
  document.getElementById("core-page").style.display = (page === "core") ? "block" : "none";
}

// Add from DSA/Core lists to Dashboard
function addTaskFromList(name, category) {
  tasks.push({name, category, status: 'pending'});
  updateUI();
  alert(`${name} added to Dashboard!`);
}
