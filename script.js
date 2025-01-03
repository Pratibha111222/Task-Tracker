
document.addEventListener('DOMContentLoaded', loadTasks);
document.getElementById('task-input').addEventListener('keypress', function(event) {
  if (event.key === 'Enter' && event.target.value.trim() !== '') {
    addTask(event.target.value);
    event.target.value = ''; 
  }
});


function addTask(taskText) {
  const tasks = getTasksFromStorage();
  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false
  };
  tasks.push(newTask);
  saveTasksToStorage(tasks);
  renderTasks(tasks);
}


function renderTasks(tasks, filter = 'all') {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = ''; 
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.classList.add('task-item');
    if (task.completed) li.classList.add('completed');

    li.innerHTML = `
      <span onclick="toggleTaskCompletion(${task.id})">${task.text}</span>
      <button onclick="deleteTask(${task.id})">Delete</button>
    `;

    taskList.appendChild(li);
  });
}


function toggleTaskCompletion(taskId) {
  const tasks = getTasksFromStorage();
  const task = tasks.find(t => t.id === taskId);
  task.completed = !task.completed;
  saveTasksToStorage(tasks);
  renderTasks(tasks, getCurrentFilter());
}


function deleteTask(taskId) {
  let tasks = getTasksFromStorage();
  tasks = tasks.filter(t => t.id !== taskId);
  saveTasksToStorage(tasks);
  renderTasks(tasks, getCurrentFilter());
}


function getTasksFromStorage() {
  const tasks = localStorage.getItem('tasks');
  return tasks ? JSON.parse(tasks) : [];
}

/
function saveTasksToStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}


document.getElementById('all-btn').addEventListener('click', () => {
  setFilter('all');
});
document.getElementById('completed-btn').addEventListener('click', () => {
  setFilter('completed');
});
document.getElementById('pending-btn').addEventListener('click', () => {
  setFilter('pending');
});


function setFilter(filter) {
  const tasks = getTasksFromStorage();
  renderTasks(tasks, filter);
  document.querySelectorAll('.filters button').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById(`${filter}-btn`).classList.add('active');
}


function getCurrentFilter() {
  if (document.getElementById('completed-btn').classList.contains('active')) return 'completed';
  if (document.getElementById('pending-btn').classList.contains('active')) return 'pending';
  return 'all';
}


function loadTasks() {
  const tasks = getTasksFromStorage();
  renderTasks(tasks, 'all');
}

