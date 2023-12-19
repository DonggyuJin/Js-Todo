const FILTER_ACTIVE = "Active";
const FILTER_COMPLETED = "Completed";

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
  calculateToggleAllStatus() === todoList.length ? true : false;

function createTodoItem(title, id, completed) {
  let todoItem = document.createElement("li");
  let todoItemBox = document.createElement("div");
  let todoTitle = document.createElement("label");
  let todoCheckBox = document.createElement("input");
  let todoDestroyBtn = document.createElement("button");

  initializeTodoItem(
    title,
    completed,
    todoTitle,
    todoCheckBox,
    todoDestroyBtn,
    todoItemBox
  );

  styleTodoTitle(todoCheckBox.checked, todoTitle);

  todoCheckBox.addEventListener("change", () => {
    handleCheckBoxChange(id, todoCheckBox.checked, todoTitle);
  });

  todoItem.addEventListener("mouseover", () =>
    handleMouseOverTodoDestroy(todoDestroyBtn)
  );
  todoItem.addEventListener("mouseout", () =>
    handleMouseOutTodoDestroy(todoDestroyBtn)
  );
  todoDestroyBtn.addEventListener("click", (e) => handleDestroyButtonClick(e));

  todoItemBox.appendChild(todoCheckBox);
  todoItemBox.appendChild(todoTitle);
  todoItem.appendChild(todoItemBox);
  todoItem.appendChild(todoDestroyBtn);

  todoItem.classList.add("todo__item");
  todoItem.dataset.id = id;
  todoMainLayout.appendChild(todoItem);

  hideOrShowFooter();
}

function initializeTodoItem(
  title,
  completed,
  todoTitle,
  todoCheckBox,
  todoDestroyBtn,
  todoItemBox
) {
  todoTitle.innerHTML = title;
  todoCheckBox.type = "CheckBox";
  todoCheckBox.checked = completed;
  todoCheckBox.classList.add("todo__toggle");
  todoDestroyBtn.classList.add("todo__destroy");
  todoItemBox.classList.add("todo__item__box");
}

function handleMouseOverTodoDestroy(todoDestroyBtn) {
  todoDestroyBtn.innerHTML = "X";
}

function handleMouseOutTodoDestroy(todoDestroyBtn) {
  todoDestroyBtn.innerHTML = "";
}

function handleDestroyButtonClick(e) {
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

  hideOrShowFooter();
  checkOrUncheckAllTodoList();
}

function handleCheckBoxChange(id, todoCheckBox, todoTitle) {
  const targetTodoItem = todoList.find((todo) => todo.id === id);
  targetTodoItem.completed = !targetTodoItem.completed;
  window.localStorage.setItem("todo-list", JSON.stringify(todoList));

  styleTodoTitle(todoCheckBox, todoTitle);
  updateTodoItemCount();
  showClearBtn();
  checkOrUncheckAllTodoList();
}

function readTodoList() {
  hideOrShowFooter();
  showClearBtn();
  todoList.forEach((todo) => {
    createTodoItem(todo.title, todo.id, todo.completed);
  });
}

readTodoList();

function hideOrShowFooter() {
  if (todoList.length === 0) {
    todoFooter.style.display = "none";
  } else {
    todoFooter.style.display = "flex";
    updateTodoItemCount();
  }
}

function updateTodoItemCount() {
  todoItemLength.textContent = todoList.filter(
    (todo) => todo.completed === false
  ).length;
}

function styleTodoTitle(check, title) {
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
  if (e.key === "Enter" && e.target.value !== "") {
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
    styleTodoTitle(todoToggleAll, itemTitle);
  });

  updateTodoItemCount();
  showClearBtn();
});

todoFilterBtn.addEventListener("click", function (e) {
  if (e.target.tagName === "A") {
    e.target.parentNode.parentNode.childNodes.forEach((child) => {
      child.className = "";
    });
    e.target.parentNode.classList.add("todo__filter__selected");

    switch (e.target.textContent) {
      case FILTER_ACTIVE:
        filterTodoList(false);
        break;
      case FILTER_COMPLETED:
        filterTodoList(true);
        break;
      default:
        const todoMainLayoutItem = todoMainLayout.querySelectorAll("li");
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

function calculateToggleAllStatus() {
  return todoList.filter((todo) => todo.completed === true).length;
}

function checkOrUncheckAllTodoList() {
  const completedTodoListLength = calculateToggleAllStatus();

  if (todoList.length === 0 || todoList.length > completedTodoListLength) {
    todoToggleAll = false;
  } else if (todoList.length === completedTodoListLength) {
    todoToggleAll = true;
  }
  showToggleBtn();
}

function showClearBtn() {
  if (calculateToggleAllStatus() > 0) {
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

  hideOrShowFooter();
  showClearBtn();
  checkOrUncheckAllTodoList();
});
