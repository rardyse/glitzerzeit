const getEl = id => document.getElementById(id);

const postData = (url, data) => fetch(url, {
    method: "POST",
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    body: data
}).then(response => response.text()).catch(error => console.error(`Erreur Fetch: ${error}`));

const loadData = (url, handler) => fetch(url)
    .then(response => response.json())
    .then(handler)
    .catch(error => console.error(`Erreur Fetch: ${error}`));

document.getElementById("mood").addEventListener("change", function () {
    const customSection = getEl("custom-mood-section");
    customSection.style.display = this.value === "custom" ? "block" : "none";
});

document.getElementById("mood-form").addEventListener("submit", function (e) {
    e.preventDefault();
    let mood = getEl("mood").value;
    const note = getEl("note").value;
    let emoji = mood === "custom" ? getEl("custom-mood").value || "Unbenannte Stimmung" : document.querySelector(`#mood option[value="${mood}"]`).textContent.trim();
    console.log(`Mood: ${mood}, Note: ${note}, Emoji: ${emoji}`);

    postData("backend.php", `action=mood&mood=${encodeURIComponent(mood)}&note=${encodeURIComponent(note)}&emoji=${encodeURIComponent(emoji)}`)
        .then(data => getEl("mood-response").innerHTML = data);
});

document.getElementById("habit-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const habitName = getEl("habit-name").value;
    const habitProgress = getEl("habit-progress").value;
    if (!habitName || habitProgress < 0 || habitProgress > 100) {
        getEl("habit-response").innerText = "Bitte gültige Daten eingeben!";
        return;
    }

    console.log(`Habit Name: ${habitName}, Progress: ${habitProgress}`);

    postData("backend.php", `action=habit&habit-name=${encodeURIComponent(habitName)}&habit-progress=${habitProgress}`)
        .then(data => {
            getEl("habit-response").innerText = data;
            loadHabits();
        });
});

function loadHabits() {
    loadData("backend.php?action=habit", data => {
        const habitList = document.querySelector("#habit-list ul");
        habitList.innerHTML = "";
        data.forEach(habit => {
            const listItem = document.createElement("li");
            listItem.textContent = `${habit.habit_name} - ${habit.progress}%`;
            habitList.appendChild(listItem);
        });
    });
}

document.getElementById("journal-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const entry = getEl("journal-entry").value;
    if (!entry.trim()) {
        getEl("journal-response").innerText = "Bitte einen gültigen Eintrag eingeben!";
        return;
    }

    console.log(`Journal Entry: ${entry}`);
    postData("backend.php", `action=journal&journal-entry=${encodeURIComponent(entry)}`)
        .then(data => {
            getEl("journal-response").innerText = data;
            loadJournalEntries();
        });
});

function loadJournalEntries() {
    loadData("backend.php?action=journal", data => {
        const journalList = document.querySelector("#journal-list ul");
        journalList.innerHTML = "";
        data.forEach(entry => {
            const listItem = document.createElement("li");
            listItem.textContent = `${entry.date}: ${entry.entry}`;
            journalList.appendChild(listItem);
        });
    });
}

document.getElementById("todo-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const task = getEl("todo-task").value.trim();
    if (!task) {
        getEl("todo-response").innerText = "Bitte eine Aufgabe eingeben!";
        return;
    }

    console.log(`Task: ${task}`);
    postData("backend.php", `action=todo&task=${encodeURIComponent(task)}`)
        .then(data => {
            getEl("todo-response").innerText = data;
            loadTodos();
        });
});

function loadTodos() {
    loadData("backend.php?action=todo", data => {
        const todoList = document.querySelector("#todo-list ul");
        todoList.innerHTML = "";
        data.forEach(todo => {
            const listItem = document.createElement("li");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = todo.is_completed === 1 || todo.is_completed === true;

            checkbox.addEventListener("change", function () {
                fetch("backend.php", {
                    method: "PATCH",
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    body: `action=todo&id=${todo.id}&is_completed=${checkbox.checked ? 1 : 0}`
                }).then(() => {
                    listItem.classList.toggle("completed", checkbox.checked);
                }).catch(error => console.error("Erreur Fetch (Update Todo):", error));
            });

            const taskText = document.createElement("span");
            taskText.textContent = todo.task;
            listItem.appendChild(checkbox);
            listItem.appendChild(taskText);
            todoList.appendChild(listItem);
        });
    });
}

function checkCookieConsent() {
    if (!document.cookie.split('; ').find(row => row.startsWith('cookieConsent='))) {
        let consentBanner = document.createElement("div");
        consentBanner.id = "cookieConsentBanner";
        consentBanner.innerHTML = `
            <div style="position: fixed; bottom: 10px; left: 10px; background-color: #333; color: white; padding: 10px; border-radius: 5px; font-size: 14px;">
                Diese Seite verwendet Cookies, um Ihre Erfahrung zu verbessern! ^^
                <button onclick="acceptCookies()" style="margin-left: 10px; background-color:rgb(238, 175, 177); color: white; border: none; padding: 5px 10px; cursor: pointer;">Akzeptieren</button>
            </div>`;
        document.body.appendChild(consentBanner);
    }
}

function acceptCookies() {
    document.cookie = "cookieConsent=true; max-age=3600; path=/";
    let consentBanner = getEl("cookieConsentBanner");
    if (consentBanner) {
        consentBanner.style.display = "none";
    }
}

checkCookieConsent();