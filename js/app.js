const newTodoInput = document.getElementById("newTodo");
const todoMainLayout = document.getElementsByClassName("todo__list")[0];
const todoItemLength = document.getElementById("todo__length");
const todoFooter = document.getElementsByClassName("footer")[0];
const todoToggleBtn = document.getElementById("todoToggleAll");
const todoFilterBtn = document.getElementsByClassName("todo__filter")[0];
const todoClearBtn = document.getElementsByClassName(
  "todo__completed__clear"
)[0];

let todoList = JSON.parse(window.localStorage.getItem("todo-list") || "[]");
let todoToggleAll =
  todoList.filter((todo) => todo.completed === true).length === todoList.length
    ? true
    : false;

function createTodoItem(title, id, completed) {
  let todoItem = document.createElement("li");
  let todoItemBox = document.createElement("div");
  let todoTitle = document.createElement("label");
  let todoCheckBox = document.createElement("input");
  let todoDestoryBtn = document.createElement("button");

  todoTitle.innerHTML = title;
  todoCheckBox.type = "checkbox";
  todoCheckBox.checked = completed;
  todoCheckBox.classList.add("todo__toggle");
  todoDestoryBtn.classList.add("todo__destroy");
  todoItemBox.classList.add("todo__item__box");

  checkTodoTitle(todoCheckBox.checked, todoTitle);

  todoCheckBox.addEventListener("change", function () {
    const targetTodoItem = todoList.find((todo) => todo.id === id);
    targetTodoItem.completed = !targetTodoItem.completed;
    window.localStorage.setItem("todo-list", JSON.stringify(todoList));

    checkTodoTitle(this.checked, todoTitle);
    countItemLeft();
    showClearBtn();
    checkOrUncheckAllTodoList();
  });

  todoItem.addEventListener("mouseover", function () {
    todoDestoryBtn.innerHTML = "X";
  });
  todoItem.addEventListener("mouseout", function () {
    todoDestoryBtn.innerHTML = "";
  });
  todoDestoryBtn.addEventListener("click", function (e) {
    const filteredTodoList = todoList.filter(
      (todo) => todo.id.toString() !== e.target.parentNode.dataset.id
    );

    todoList = [...filteredTodoList];
    window.localStorage.setItem("todo-list", JSON.stringify(todoList));
    todoItemLength.textContent = todoList.length;

    const todoMainLayoutItem = todoMainLayout.querySelectorAll("li");
    todoMainLayoutItem.forEach((li) => {
      if (li.dataset.id === e.target.parentNode.dataset.id) {
        li.remove();
      }
    });

    hideFooter();
    checkAllOr();
  });

  todoItemBox.appendChild(todoCheckBox);
  todoItemBox.appendChild(todoTitle);
  todoItem.appendChild(todoItemBox);
  todoItem.appendChild(todoDestoryBtn);

  todoItem.classList.add("todo__item");
  todoItem.dataset.id = id;
  todoMainLayout.appendChild(todoItem);

  hideFooter();
}

function initReadTodoItem() {
  hideFooter();
  showClearBtn();
  todoList.forEach((todo) => {
    createTodoItem(todo.title, todo.id, todo.completed);
  });
}

initReadTodoItem();

function hideFooter() {
  if (todoList.length === 0) {
    todoFooter.style.display = "none";
  } else {
    todoFooter.style.display = "flex";
    countItemLeft();
  }
}

function countItemLeft() {
  todoItemLength.textContent = todoList.filter(
    (todo) => todo.completed === false
  ).length;
}

function checkTodoTitle(check, title) {
  if (check) {
    title.style.textDecoration = "line-through";
    title.style.color = "#cccccc";
    title.style.animation = "fadeIn 1s ease";
  } else {
    title.style.textDecoration = "";
    title.style.color = "#000";
    title.style.animation = "";
  }
}

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

const todoMainLayoutItem = todoMainLayout.querySelectorAll("li");

todoToggleBtn.addEventListener("click", function (e) {
  todoToggleAll = !todoToggleAll;

  todoList.forEach((todo) => {
    todo.completed = todoToggleAll;
  });
  window.localStorage.setItem("todo-list", JSON.stringify(todoList));

  const todoMainLayoutItem = todoMainLayout.querySelectorAll("li");

  todoMainLayoutItem.forEach((item) => {
    let itemCheckBtn = item.children[0].children[0];
    let itemTitle = item.children[0].children[1];
    itemCheckBtn.checked = todoToggleAll;

    showToggleBtn();
    checkTodoTitle(todoToggleAll, itemTitle);
  });

  countItemLeft();
  showClearBtn();
});

todoFilterBtn.addEventListener("click", function (e) {
  if (e.target.tagName === "A") {
    e.target.parentNode.parentNode.childNodes.forEach((child) => {
      child.className = "";
    });
    e.target.parentNode.classList.add("todo__filter__selected");

    switch (e.target.textContent) {
      case "Active":
        filterTodoList(false);
        break;
      case "Completed":
        filterTodoList(true);
        break;
      default:
        todoMainLayoutItem.forEach((item) => (item.style.display = "flex"));
    }
  }
});

function filterTodoList(completed) {
  const todoMainLayoutItem = todoMainLayout.querySelectorAll("li");
  const filteredTodoList = todoList
    .filter((todo) => todo.completed === completed)
    .map((todo) => todo.id.toString());

  todoMainLayoutItem.forEach((item) => {
    if (filteredTodoList.includes(item.dataset.id)) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

function checkOrUncheckAllTodoList() {
  const completedTodoListLength = todoList.filter(
    (todo) => todo.completed === true
  ).length;

  if (todoList.length === 0 || todoList.length > completedTodoListLength) {
    todoToggleAll = false;
  } else if (todoList.length === completedTodoListLength) {
    todoToggleAll = true;
  }
  showToggleBtn();
}

function showClearBtn() {
  if (todoList.filter((todo) => todo.completed === true).length > 0) {
    todoClearBtn.style.display = "block";
  } else {
    todoClearBtn.style.display = "none";
  }
}

function showToggleBtn() {
  if (todoToggleAll) {
    todoToggleBtn.nextElementSibling.style.color = "#4d4d4d";
  } else {
    todoToggleBtn.nextElementSibling.style.color = "#e6e6e6";
  }
}

todoClearBtn.addEventListener("click", function (e) {
  const clearedTodoList = todoList.filter((todo) => todo.completed === false);

  todoList = [...clearedTodoList];
  window.localStorage.setItem("todo-list", JSON.stringify(todoList));

  todoItemLength.textContent = todoList.length;

  const todoMainLayoutItem = todoMainLayout.querySelectorAll("li");
  const cleaeredTodoListId = clearedTodoList.map((todo) => todo.id.toString());

  todoMainLayoutItem.forEach((li) => {
    if (cleaeredTodoListId.includes(li.dataset.id) === false) {
      li.remove();
    }
  });

  hideFooter();
  showClearBtn();
  checkOrUncheckAllTodoList();
});
