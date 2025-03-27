// Recuperamos tareas de localStorage o iniciamos vacío
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all'; // Filtro actual: all, pending, completed
// Elementos del DOM
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const count = document.getElementById('task-count');
const filterBtns = document.querySelectorAll('[data-filter]');
// Al enviar el formulario
form.addEventListener('submit', e => {
e.preventDefault();
try {
if (!input.value.trim()) throw new Error("La tarea no puede estar vacía");
todos.push({
text: input.value.trim(),
completed: false,
createdAt: Date.now()
});
input.value = '';
saveAndRender();
} catch (error) {
alert(error.message);
} finally {
input.focus();
}
});
// Mostrar tareas
function render() {
list.innerHTML = '';
const filtered = todos.filter(todo => {
if (currentFilter === 'completed') return todo.completed;
if (currentFilter === 'pending') return !todo.completed;
return true;
});
for (let todo of filtered) {
const i = todos.indexOf(todo);
const li = document.createElement('li');
if (todo.completed) li.classList.add('completed');
li.innerHTML = `
${todo.text}
<span>
<button onclick="toggle(${i})">✔</button>
<button onclick="del(${i})">🗑</button>
</span>
`;
list.appendChild(li);
}
const pendientes = todos.reduce((acc, t) => acc + (!t.completed ? 1 : 0), 0);
count.textContent = `Tareas pendientes: ${pendientes}`;
}
// Guardar en localStorage y renderizar
function saveAndRender() {
localStorage.setItem('todos', JSON.stringify(todos));
render();
}
// Alternar completado
window.toggle = i => {
todos[i].completed = !todos[i].completed;
saveAndRender();
};
// Eliminar tarea
window.del = i => {
todos.splice(i, 1);
saveAndRender();
};
// Filtros
filterBtns.forEach(btn => {
btn.addEventListener('click', () => {
currentFilter = btn.dataset.filter;
render();
});
});
// Temporizador con mensaje automático
setTimeout(() => {
alert("⏰ ¡Revisa tus tareas!");
}, 10000);
// Mostrar la última tarea con reduce
function showLatestTask() {
try {
if (todos.length === 0) throw new Error("No hay tareas");
const last = todos.reduce((a, b) => a.createdAt > b.createdAt ? a : b);
console.log("Última tarea:", new Date(last.createdAt).toLocaleString());
} catch (e) {
console.warn(e.message);
}
}
showLatestTask();
render();