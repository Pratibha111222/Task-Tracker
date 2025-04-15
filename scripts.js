
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filter button');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks(filter = 'all') {
  taskList.innerHTML = '';
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const taskEl = document.createElement('div');
    taskEl.className = `task ${task.completed ? 'completed' : ''}`;

    taskEl.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleComplete(${index})" />
      <span>${task.text}</span>
      <div class="actions">
        <button class="edit" onclick="editTask(${index})">Edit</button>
        <button class="delete" onclick="deleteTask(${index})">Delete</button>
      </div>
    `;

    taskList.appendChild(taskEl);
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask(e) {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    taskInput.value = '';
    renderTasks();
  }
}

function editTask(index) {
  const newText = prompt('Edit your task:', tasks[index].text);
  if (newText !== null) {
    tasks[index].text = newText.trim();
    renderTasks();
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('.filter .active').classList.remove('active');
    button.classList.add('active');
    renderTasks(button.dataset.filter);
  });
});

taskForm.addEventListener('submit', addTask);

renderTasks();
