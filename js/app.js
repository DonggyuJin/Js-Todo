let todoItemLength = window.localStorage.length;

const newTodoInput = document.getElementById("newTodo");
const todoMainLayout = document.getElementsByClassName("todo__list")[0];

const todoList = JSON.parse(window.localStorage.getItem("todo-list") || "[]");

function createTodoItem(title, id, completed) {
  let todoItem = document.createElement("li");
  let todoTitle = document.createElement("label");
  let todoCheckBox = document.createElement("input");

  todoTitle.innerHTML = title;
  todoCheckBox.type = "checkbox";
  todoCheckBox.classList.add("todo__toggle");
  todoCheckBox.addEventListener("change", function () {
    const targetTodoItem = todoList.find((todo) => todo.id === id);
    targetTodoItem.completed = !targetTodoItem.completed;
    window.localStorage.setItem("todo-list", JSON.stringify(todoList));

    if (this.checked) {
      todoTitle.style.textDecoration = "line-through";
      todoTitle.style.color = "#cccccc";
      todoTitle.style.animation = "fadeIn 1s ease";
    } else {
      todoTitle.style.textDecoration = "";
      todoTitle.style.color = "#000";
      todoTitle.style.animation = "";
    }
  });

  todoItem.appendChild(todoCheckBox);
  todoItem.appendChild(todoTitle);

  todoItem.classList.add("todo__item");
  todoItem.dataset.id = id;
  todoMainLayout.appendChild(todoItem);
}

function initReadTodoItem() {
  todoList.forEach((todo) => {
    createTodoItem(todo.title, todo.id, todo.completed);
  });
}

initReadTodoItem();

newTodoInput.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    const nowDateTime = new Date().getTime();
    const todoItem = {
      title: e.target.value,
      completed: false,
      id: nowDateTime,
    };

    todoList.push(todoItem);

    window.localStorage.setItem("todo-list", JSON.stringify(todoList));

    createTodoItem(e.target.value, nowDateTime, false);

    e.target.value = "";
  }
});

// todoMainLayout.addEventListener("click", function (e) {
//   const todoId = e.target.dataset.id;

//   const targetTodoItem = todoList.find((todo) => todo.id.toString() === todoId);

//   if (targetTodoItem) {
//     targetTodoItem.completed = !targetTodoItem.completed;

//     window.localStorage.setItem("todo-list", JSON.stringify(todoList));
//   }
// });
