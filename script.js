const api = 'http://localhost:3000/tasks';

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

//load tasks from the server
async function loadTasks() {
    let res = await axios.get(api, { headers: getAuthHeaders() });
    let tasks = res.data;
    let list = document.getElementById('taskList');
    list.innerHTML = '';
    tasks.forEach(task => {
        let li = document.createElement('li');
        const category = task.category || 'Work';
        li.innerHTML = `
            <span class="${task.completed ? 'completed' : ''}">${task.title}</span>
            <span style="margin-left:8px; font-size:0.9em; color:#666;">[${category}]</span>
            <button onclick="toggleTask('${task._id}', ${task.completed})">
                ${task.completed ? 'Undo' : 'Complete'}
            </button>
            <button onclick="deleteTask('${task._id}')">Delete</button>
            <button onclick="editTask('${task._id}', '${task.title}')">Edit</button>`;

        list.appendChild(li);
    });
}

//add new task
async function addTask() {
    let input = document.getElementById('taskInput');
    const category = getSelectedCategory();
    await axios.post(api, { title: input.value, category, userId: getUserId() });
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
    let newTitle = prompt('Edit task title:', currentTitle);
    if (newTitle) {
        await axios.put(`${api}/${id}`, { title: newTitle }, { headers: getAuthHeaders() });
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