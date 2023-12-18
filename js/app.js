const newTodoInput = document.getElementById("newTodo");
const todoMainLayout = document.getElementsByClassName("todo__list")[0];
const todoItemLength = document.getElementById("todo__length");
const todoFooter = document.getElementsByClassName("footer")[0];
const todoToggleBtn = document.getElementById("todoToggleAll");
const todoFilterBtn = document.getElementsByClassName("todo__filter")[0];

let todoList = JSON.parse(window.localStorage.getItem("todo-list") || "[]");

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

    countItemLeft();
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
  todoList.forEach((todo) => {
    createTodoItem(todo.title, todo.id);
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
  }
});

todoToggleBtn.addEventListener("click", function (e) {
  todoList.forEach((todo) => {
    todo.completed = !todo.completed;
  });
  window.localStorage.setItem("todo-list", JSON.stringify(todoList));

  const todoMainLayoutItem = todoMainLayout.querySelectorAll("li");

  todoMainLayoutItem.forEach((item) => {
    let itemCheckBtn = item.children[0].children[0];
    let itemTitle = item.children[0].children[1];
    itemCheckBtn.checked = !itemCheckBtn.checked;
    if (itemCheckBtn.checked === true) {
      e.target.labels[0].style.color = "#4d4d4d";

      itemTitle.style.textDecoration = "line-through";
      itemTitle.style.color = "#cccccc";
      itemTitle.style.animation = "fadeIn 1s ease";
    } else {
      e.target.labels[0].style.color = "#e6e6e6";

      itemTitle.style.textDecoration = "";
      itemTitle.style.color = "#000";
      itemTitle.style.animation = "";
    }
  });

  countItemLeft();
});

todoFilterBtn.addEventListener("click", function (e) {
  console.log(e);

  if (e.target.tagName === "A") {
    e.target.parentNode.parentNode.childNodes.forEach((child) => {
      child.className = "";
    });
    e.target.parentNode.classList.add("todo__filter__selected");

    switch (e.target.textContent) {
      case "Active":
        console.log("active");
        filterTodoList(true);
        break;
      case "Completed":
        filterTodoList(false);
        break;
      default:
        const todoMainLayoutItem = todoMainLayout.querySelectorAll("li");
        todoMainLayoutItem.forEach((item) => (item.style.display = "flex"));
    }
  }
});

function filterTodoList(completed) {
  const todoMainLayoutItem = todoMainLayout.querySelectorAll("li");
  todoList
    .filter((todo) => todo.completed === completed)
    .forEach((todo) => {
      todoMainLayoutItem.forEach((item) => {
        if (item.dataset.id === todo.id.toString()) {
          item.style.display = "none";
        } else {
          item.style.display = "flex";
        }
      });
    });
}
