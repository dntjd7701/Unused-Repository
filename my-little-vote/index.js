const firebaseConfig = {
    apiKey: "AIzaSyDee-At0KacI_lZma2OJA1K-tt6z-ocVz8",
    authDomain: "joinlist-92bd9.firebaseapp.com",
    databaseURL: "https://joinlist-92bd9-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "joinlist-92bd9",
    storageBucket: "joinlist-92bd9.appspot.com",
    messagingSenderId: "533233413421",
    appId: "1:533233413421:web:7d65d07bc872da3c5c77a4"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const usersRef = database.ref('/');
let todos = [];
const taskInput = document.querySelector(".task-input input"),
    filters = document.querySelectorAll(".filters span"),
    clearAll = document.querySelector(".clear-btn"),
    taskBox = document.querySelector(".task-box");
let editId,
    isEditTask = false;


function getData(filterName = 'all') {
    // 한 번만 데이터를 가져오려면
    usersRef.once('value').then(function(snapshot) {
    const data = snapshot.val();
    todos = [...data]
    showTodo(filterName);
    });
};

function setData() {
    usersRef.set(todos);
}
getData();


filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

function showTodo(filter) {
    let liTag = ""
    if (todos) {
        todos.forEach((todo, id) => {
            let completed = todo.status == "completed" ? "checked" : "";
            if (filter == todo.status || filter == "all") {
                liTag += `<li class="task">
                    <label for="${id}">
                        <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                        <p class="${completed}">${todo.name}</p>
                    </label>
                    <div class="settings">
                        <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                        <ul class="task-menu">
                            <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                            <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                        </ul>
                    </div>
                </li>`;
            }
        });
    }
    taskBox.innerHTML = liTag || `<span>참가자 명단이 없습니다. 추가 ㄱㄱ</span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}

//i have added a task before tutorial so that shows here for test
// if you don't have any tasks no problem it isn't bug

function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", e => {
        if (e.target.tagName != "I" || e.target != selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}

function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    setData();
    // localStorage.setItem("todo-list", JSON.stringify(todos))
}

function editTask(taskId, textName) {
    editId = taskId;
    isEditTask = true;
    taskInput.value = textName;
    taskInput.focus();
    taskInput.classList.add("active");
}

function deleteTask(deleteId, filter) {
    isEditTask = false;
    todos.splice(deleteId, 1);
    setData();
    getData(filter);
    // localStorage.setItem("todo-list", JSON.stringify(todos));
    // showTodo(filter);
}

clearAll.addEventListener("click", () => {
    isEditTask = false;
    todos = [];
    setData();
    getData();
    // todos.splice(0, todos.length);
    // console.debug(JSON.stringify(todos.map((v) => ({...v, status: 'pending'}))))
    // localStorage.setItem("todo-list", JSON.stringify(todos));
});

taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    if (e.key == "Enter" && userTask) {
        if (!isEditTask) {
            todos = !todos ? [] : todos;
            let taskInfo = { name: userTask, status: "pending" };
            todos.push(taskInfo);
        } else {
            isEditTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        setData();
        getData(document.querySelector("span.active").id);
        
        // localStorage.setItem("todo-list", JSON.stringify(todos));
        // showTodo(document.querySelector("span.active").id);
    }
});