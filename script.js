/* =========================================
STUDENT PLANNER
Main JavaScript
========================================= */

/* =========================================
DATA
========================================= */

let tasks = JSON.parse(localStorage.getItem("studentTasks")) || [];

let schedule = JSON.parse(localStorage.getItem("studentSchedule")) || [
{
id: 1,
subject: "Computer Science",
date: getToday(),
time: "10:00",
duration: "1 hour"
},
{
id: 2,
subject: "Mathematics",
date: getToday(),
time: "14:00",
duration: "1.5 hours"
}
];

/* =========================================
ELEMENTS
========================================= */

const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll(".section");

const pageTitle = document.getElementById("pageTitle");
const currentDate = document.getElementById("currentDate");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");
const dueSoonTasks = document.getElementById("dueSoonTasks");

const upcomingTasks = document.getElementById("upcomingTasks");
const allTasks = document.getElementById("allTasks");
const todaySchedule = document.getElementById("todaySchedule");
const fullSchedule = document.getElementById("fullSchedule");

const taskModal = document.getElementById("taskModal");
const scheduleModal = document.getElementById("scheduleModal");

const taskForm = document.getElementById("taskForm");
const scheduleForm = document.getElementById("scheduleForm");

/* =========================================
INITIALIZATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {

displayCurrentDate();

renderTasks();

renderSchedule();

updateStatistics();

setupNavigation();

});

/* =========================================
DATE FUNCTIONS
========================================= */

function getToday() {

const date = new Date();

return date.toISOString().split("T")[0];

}

function displayCurrentDate() {

const today = new Date();

currentDate.textContent = today.toLocaleDateString(
    "en-US",
    {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    }
);

}

function formatDate(dateString) {

const date = new Date(dateString + "T00:00:00");

return date.toLocaleDateString(
    "en-US",
    {
        month: "short",
        day: "numeric",
        year: "numeric"
    }
);

}

/* =========================================
NAVIGATION
========================================= */

function setupNavigation() {
navItems.forEach(item => {

    item.addEventListener("click", () => {

        const sectionName = item.dataset.section;

        navItems.forEach(nav => {
            nav.classList.remove("active");
        });

        item.classList.add("active");

        sections.forEach(section => {
            section.classList.remove("active-section");
        });

        document
            .getElementById(sectionName)
            .classList.add("active-section");

        const titles = {
            dashboard: "Dashboard",
            tasks: "My Tasks",
            schedule: "Study Schedule"
        };

        pageTitle.textContent = titles[sectionName];

        if (sectionName === "dashboard") {
            renderTasks();
        }

    });

});


document.getElementById("viewAllTasks")
    .addEventListener("click", () => {

        document
            .querySelector('[data-section="tasks"]')
            .click();

    });


}

/* =========================================
TASK MODAL
========================================= */

document
.getElementById("openTaskModal")
.addEventListener("click", openTaskModal);

document
.getElementById("openTaskModal2")
.addEventListener("click", openTaskModal);

document
.getElementById("closeTaskModal")
.addEventListener("click", closeTaskModal);

document
.getElementById("cancelTask")
.addEventListener("click", closeTaskModal);

function openTaskModal() {
taskModal.classList.add("show");

document.getElementById("taskDate").value = getToday();

document.getElementById("taskName").focus();


}

function closeTaskModal() {
taskModal.classList.remove("show");

taskForm.reset();


}

/* =========================================
ADD TASK
========================================= */

taskForm.addEventListener("submit", event => {
event.preventDefault();

const task = {

    id: Date.now(),

    name: document.getElementById("taskName").value,

    course: document.getElementById("taskCourse").value,

    date: document.getElementById("taskDate").value,

    priority: document.getElementById("taskPriority").value,

    notes: document.getElementById("taskNotes").value,

    completed: false

};


tasks.push(task);

saveTasks();

renderTasks();

updateStatistics();

closeTaskModal();


});

/* =========================================
SAVE TASKS
========================================= */

function saveTasks() {
localStorage.setItem(
    "studentTasks",
    JSON.stringify(tasks)
);


}

/* =========================================
RENDER TASKS
========================================= */

function renderTasks() {
renderUpcomingTasks();

renderAllTasks();


}

function renderUpcomingTasks() {
upcomingTasks.innerHTML = "";

const pending = tasks
    .filter(task => !task.completed)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);


if (pending.length === 0) {

    upcomingTasks.innerHTML = `
        <div class="empty-state">
            <h4>No upcoming tasks</h4>
            <p>You are all caught up!</p>
        </div>
    `;

    return;
}


pending.forEach(task => {

    upcomingTasks.appendChild(
        createTaskElement(task)
    );

});


}

function renderAllTasks() {
allTasks.innerHTML = "";

const searchValue =
    document.getElementById("searchTasks").value
        .toLowerCase();

const priorityFilter =
    document.getElementById("filterPriority").value;

const statusFilter =
    document.getElementById("filterStatus").value;


let filteredTasks = tasks.filter(task => {

    const matchesSearch =
        task.name.toLowerCase().includes(searchValue) ||
        task.course.toLowerCase().includes(searchValue);

    const matchesPriority =
        priorityFilter === "all" ||
        task.priority === priorityFilter;

    const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "completed" && task.completed) ||
        (statusFilter === "pending" && !task.completed);

    return (
        matchesSearch &&
        matchesPriority &&
        matchesStatus
    );

});


filteredTasks.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
);


if (filteredTasks.length === 0) {

    allTasks.innerHTML = `
        <div class="empty-state">
            <h4>No tasks found</h4>
            <p>Try changing your search or filters.</p>
        </div>
    `;

    return;

}


filteredTasks.forEach(task => {

    allTasks.appendChild(
        createTaskElement(task)
    );

});


}

/* =========================================
CREATE TASK ELEMENT
========================================= */

function createTaskElement(task) {
const div = document.createElement("div");

div.className =
    "task-item " +
    (task.completed ? "completed" : "");


div.innerHTML = `

    <div class="task-left">

        <input
            type="checkbox"
            class="task-check"
            ${task.completed ? "checked" : ""}
            data-id="${task.id}"
        >

        <div class="task-info">

            <h4>${escapeHTML(task.name)}</h4>

            <p>
                ${escapeHTML(task.course)}
                • Due ${formatDate(task.date)}
            </p>

            ${
                task.notes
                    ? `<p>${escapeHTML(task.notes)}</p>`
                    : ""
            }

        </div>

    </div>


    <div class="task-actions">

        <span class="priority ${task.priority}">
            ${capitalize(task.priority)}
        </span>

        <button
            class="delete-btn"
            data-delete="${task.id}"
        >
            Delete
        </button>

    </div>
`;


const checkbox =
    div.querySelector(".task-check");


checkbox.addEventListener("change", () => {

    toggleTask(task.id);

});


const deleteButton =
    div.querySelector(".delete-btn");


deleteButton.addEventListener("click", () => {

    deleteTask(task.id);

});


return div;


}

/* =========================================
TOGGLE TASK
========================================= */

function toggleTask(id) {
tasks = tasks.map(task => {

    if (task.id === id) {

        return {
            ...task,
            completed: !task.completed
        };

    }

    return task;

});


saveTasks();

renderTasks();

updateStatistics();


}

/* =========================================
DELETE TASK
========================================= */

function deleteTask(id) {
const confirmed =
    confirm("Are you sure you want to delete this task?");


if (!confirmed) {
    return;
}


tasks = tasks.filter(
    task => task.id !== id
);


saveTasks();

renderTasks();

updateStatistics();


}

/* =========================================
STATISTICS
========================================= */

function updateStatistics() {

const total = tasks.length;

const completed =
    tasks.filter(task => task.completed).length;

const pending = total - completed;

const today = new Date();

const nextWeek = new Date();

nextWeek.setDate(
    today.getDate() + 7
);


const dueSoon = tasks.filter(task => {

    if (task.completed) {
        return false;
    }

    const date =
        new Date(task.date + "T00:00:00");

    return date >= today && date <= nextWeek;

}).length;


totalTasks.textContent = total;

pendingTasks.textContent = pending;

completedTasks.textContent = completed;

dueSoonTasks.textContent = dueSoon;

}

/* =========================================
SEARCH / FILTER
========================================= */

document
.getElementById("searchTasks")
.addEventListener("input", renderAllTasks);

document
.getElementById("filterPriority")
.addEventListener("change", renderAllTasks);

document
.getElementById("filterStatus")
.addEventListener("change", renderAllTasks);

/* =========================================
SCHEDULE MODAL
========================================= */

document
.getElementById("openScheduleModal")
.addEventListener("click", () => {

    scheduleModal.classList.add("show");

    document.getElementById("scheduleDate").value =
        getToday();

    document.getElementById("scheduleSubject").focus();

});

document
.getElementById("closeScheduleModal")
.addEventListener("click", closeScheduleModal);

document
.getElementById("cancelSchedule")
.addEventListener("click", closeScheduleModal);

function closeScheduleModal() {

scheduleModal.classList.remove("show");

scheduleForm.reset();

}

/* =========================================
ADD SCHEDULE
========================================= */

scheduleForm.addEventListener("submit", event => {

event.preventDefault();


const session = {

    id: Date.now(),

    subject:
        document.getElementById("scheduleSubject").value,

    date:
        document.getElementById("scheduleDate").value,

    time:
        document.getElementById("scheduleTime").value,

    duration:
        document.getElementById("scheduleDuration").value

};


schedule.push(session);

localStorage.setItem(
    "studentSchedule",
    JSON.stringify(schedule)
);


renderSchedule();

closeScheduleModal();

});

/* =========================================
RENDER SCHEDULE
========================================= */

function renderSchedule() {

renderTodaySchedule();

renderFullSchedule();

}

function renderTodaySchedule() {

todaySchedule.innerHTML = "";

const todaySessions =
    schedule
        .filter(session => session.date === getToday())
        .sort((a, b) => a.time.localeCompare(b.time));


if (todaySessions.length === 0) {

    todaySchedule.innerHTML = `
        <div class="empty-state">
            <h4>No study sessions</h4>
            <p>Your schedule is clear today.</p>
        </div>
    `;

    return;

}


todaySessions.forEach(session => {

    todaySchedule.appendChild(
        createScheduleElement(session)
    );

});

}

function renderFullSchedule() {

fullSchedule.innerHTML = "";


const sorted =
    [...schedule].sort(
        (a, b) => {

            const first =
                new Date(a.date + "T" + a.time);

            const second =
                new Date(b.date + "T" + b.time);

            return first - second;

        }
    );


if (sorted.length === 0) {

    fullSchedule.innerHTML = `
        <div class="empty-state">
            <h4>No study sessions</h4>
            <p>Add your first study session.</p>
        </div>
    `;

    return;

}


sorted.forEach(session => {

    const element =
        createScheduleElement(session);

    fullSchedule.appendChild(element);

});

}

/* =========================================
CREATE SCHEDULE ELEMENT
========================================= */

function createScheduleElement(session) {

const div =
    document.createElement("div");

div.className = "schedule-item";


div.innerHTML = `

    <div class="schedule-time">

        ${formatTime(session.time)}

    </div>


    <div class="schedule-info">

        <h4>
            ${escapeHTML(session.subject)}
        </h4>

        <p>
            ${formatDate(session.date)}
            • ${session.duration}
        </p>

    </div>

`;


return div;

}

/* =========================================
UTILITY FUNCTIONS
========================================= */

function capitalize(value) {

return value.charAt(0).toUpperCase()
    + value.slice(1);

}

function formatTime(time) {

const [hours, minutes] =
    time.split(":");

const date =
    new Date();

date.setHours(
    Number(hours),
    Number(minutes)
);


return date.toLocaleTimeString(
    "en-US",
    {
        hour: "numeric",
        minute: "2-digit"
    }
);

}

/*
Prevent HTML injection when displaying
user-entered information.
*/

function escapeHTML(value) {

const div =
    document.createElement("div");

div.textContent = value;

return div.innerHTML;

}

/* =========================================
CLOSE MODALS WHEN CLICKING OUTSIDE
========================================= */

window.addEventListener("click", event => {

if (event.target === taskModal) {

    closeTaskModal();

}


if (event.target === scheduleModal) {

    closeScheduleModal();

}

});
