const form = document.querySelector("#new-todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#list");
const template = document.querySelector("#list-item-template");
const TODO_KEY_PREFIX = "TODO_LIST";
const LOCAL_STORAGE_KEY = `${TODO_KEY_PREFIX}-todos`;
let todos = loadTodos();
todos.forEach((todo) => renderTodo(todo));

// complete todos

list.addEventListener("change", (e) => {
  if (!e.target.matches("[data-list-item-checkbox]")) return;

  const parent = e.target.closest(".list-item");
  const todoID = parent.dataset.todoID;
  const todo = todos.find((t) => t.id === todoID);
  todo.complete = e.target.checked;
  saveTodo();
});

//delete todos

list.addEventListener("click", (e) => {
  if (!e.target.matches("[data-button-delete]")) return;

  const parent = e.target.closest(".list-item");
  const todoID = parent.dataset.todoID;
  // remove from list
  parent.remove();
  //remove from storage
  todos = todos.filter((todo) => todo.id !== todoID);
  saveTodo();
});

//type todo in input
//add todos by submitting

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const todoName = input.value;
  if (todoName === "") return;
  const newTodo = {
    name: todoName,
    complete: false,
    id: new Date().valueOf().toString(),
  };
  todos.push(newTodo);
  renderTodo(newTodo);
  input.value = "";
  saveTodo();
});

//render todos in the list
function renderTodo(newTodo) {
  const templateClone = template.content.cloneNode(true);
  const listItem = templateClone.querySelector(".list-item");
  listItem.dataset.todoID = newTodo.id;
  const textElement = templateClone.querySelector("[data-list-item-text]");
  textElement.innerText = newTodo.name;
  const checkBox = templateClone.querySelector("[data-list-item-checkbox]");
  checkBox.checked = newTodo.complete;
  list.appendChild(templateClone);
}

//save todos
function saveTodo() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
}

//load todos
function loadTodos() {
  const todoString = localStorage.getItem(LOCAL_STORAGE_KEY);
  return JSON.parse(todoString) || [];
}
