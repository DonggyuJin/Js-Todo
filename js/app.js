const newTodoInput = document.getElementById("newTodo");
const todoMainLayout = document.getElementsByClassName("todo__list")[0];

const todoList = JSON.parse(window.localStorage.getItem("todo-list") || "[]");

function createTodoItem(title, id) {
  let todoItem = document.createElement("li");
  let todoItemBox = document.createElement("div");
  let todoTitle = document.createElement("label");
  let todoCheckBox = document.createElement("input");
  let todoDestoryBtn = document.createElement("button");

  todoTitle.innerHTML = title;
  todoCheckBox.type = "checkbox";
  todoCheckBox.classList.add("todo__toggle");
  todoDestoryBtn.classList.add("todo__destroy");
  todoItemBox.classList.add("todo__item__box");

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

  todoItem.addEventListener("mouseover", function () {
    todoDestoryBtn.innerHTML = "X";
  });
  todoItem.addEventListener("mouseout", function () {
    todoDestoryBtn.innerHTML = "";
  });
  todoItem.addEventListener("click", function (e) {
    const filteredTodoList = todoList.filter(
      (todo) => todo.id.toString() !== e.target.parentNode.dataset.id
    );

    window.localStorage.setItem("todo-list", JSON.stringify(filteredTodoList));

    const todoMainLayoutItem = todoMainLayout.querySelectorAll("li");
    todoMainLayoutItem.forEach((li) => {
      if (li.dataset.id === e.target.parentNode.dataset.id) {
        li.remove();
      }
    });
  });

  todoItemBox.appendChild(todoCheckBox);
  todoItemBox.appendChild(todoTitle);
  todoItem.appendChild(todoItemBox);
  todoItem.appendChild(todoDestoryBtn);

  todoItem.classList.add("todo__item");
  todoItem.dataset.id = id;
  todoMainLayout.appendChild(todoItem);
}

function initReadTodoItem() {
  todoList.forEach((todo) => {
    createTodoItem(todo.title, todo.id);
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

    createTodoItem(e.target.value, nowDateTime);

    e.target.value = "";
    todoItem = {};
  }
});
