const api = 'https://taskmanager-ruz2.onrender.com/tasks';

function getSelectedCategory() {
    const select = document.getElementById('categorySelect');
    return select ? select.value : 'Work';
}

function getUserId() {
    let userId = localStorage.getItem('taskUserId');
    if (!userId) {
        userId = prompt('Enter your user ID', 'user-1') || 'user-1';
        localStorage.setItem('taskUserId', userId);
    }
    return userId;
}

function getAuthHeaders() {
    return { 'x-user-id': getUserId() };
}

function renderTask(task) {
    const list = document.getElementById('taskList');
    const li = document.createElement('li');
    const category = task.category || 'Work';

    li.className = `task-item ${task.completed ? 'is-complete' : ''}`;
    li.innerHTML = `
        <div class="task-main">
            <div class="task-text">
                <span class="task-title">${task.title}</span>
                <span class="task-category">${category}</span>
            </div>
            <div class="task-actions">
                <button class="action-btn action-btn--primary" onclick="toggleTask('${task._id}', ${task.completed})">
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="action-btn" onclick="editTask('${task._id}', '${task.title}')">Edit</button>
                <button class="action-btn action-btn--danger" onclick="deleteTask('${task._id}')">Delete</button>
            </div>
        </div>`;

    list.appendChild(li);
}

//load tasks from the server
async function loadTasks() {
    const res = await axios.get(api, { headers: getAuthHeaders() });
    const tasks = res.data;
    const list = document.getElementById('taskList');
    list.innerHTML = '';

    if (!tasks.length) {
        list.innerHTML = '<li class="empty-state">No tasks yet. Add your first one to get started.</li>';
        return;
    }

    tasks.forEach(renderTask);
}

//add new task
async function addTask() {
    const input = document.getElementById('taskInput');
    const category = getSelectedCategory();
    const title = input.value.trim();

    if (!title) return;

    await axios.post(api, { title, category, userId: getUserId() });
    input.value = '';
    loadTasks();
}

//toggle task completion
async function toggleTask(id, completed) {
    await axios.put(`${api}/${id}`, { completed: !completed }, { headers: getAuthHeaders() });
    loadTasks();
}

//edit task
async function editTask(id, currentTitle) {
    const newTitle = prompt('Edit task title:', currentTitle);
    if (newTitle && newTitle.trim()) {
        await axios.put(`${api}/${id}`, { title: newTitle.trim() }, { headers: getAuthHeaders() });
        loadTasks();
    }
}

//delete task
async function deleteTask(id) {
    await axios.delete(`${api}/${id}`, { headers: getAuthHeaders() });
    loadTasks();
}

//initial load
loadTasks();