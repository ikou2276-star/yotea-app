// ==========================================
// Yotea - 予定管理
// ==========================================

let schedules =
    JSON.parse(
        localStorage.getItem("yoteaSchedules")
    ) || [];

let trash =
    JSON.parse(
        localStorage.getItem("yoteaTrash")
    ) || [];

let currentMonth =
    new Date();

let editingId = null;


// ==========================================
// 保存
// ==========================================

function saveData() {

    localStorage.setItem(
        "yoteaSchedules",
        JSON.stringify(schedules)
    );

    localStorage.setItem(
        "yoteaTrash",
        JSON.stringify(trash)
    );

}


// ==========================================
// 日付
// ==========================================

function dateString(date) {

    const y =
        date.getFullYear();

    const m =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const d =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${y}-${m}-${d}`;

}


// ==========================================
// ナイトモード
// ==========================================

(function () {

    const button =
        document.getElementById("nightToggle");

    const icon =
        document.getElementById("nightIcon");

    const status =
        document.getElementById("nightStatus");

    if (!button) return;


    function updateNightMode() {

        const night =
            document.body.classList.contains(
                "night-mode"
            );

        icon.textContent =
            night ? "☀️" : "🌙";

        status.textContent =
            night ? "ON" : "OFF";
    }


    // 保存されている設定を読み込む
    const saved =
        localStorage.getItem(
            "yoteaNightMode"
        );

    if (saved === "on") {

        document.body.classList.add(
            "night-mode"
        );

    }


    updateNightMode();


    // ボタンを押したとき
    button.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "night-mode"
            );


            const night =
                document.body.classList.contains(
                    "night-mode"
                );


            localStorage.setItem(
                "yoteaNightMode",
                night ? "on" : "off"
            );


            updateNightMode();

        }
    );

})();


// ==========================================
// テーマ変更とナイトモードの連携
// ==========================================

(function () {

    const themeButtons =
        document.querySelectorAll(
            ".theme-option"
        );

    themeButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const wasNight =
                    localStorage.getItem(
                        "yoteaNightMode"
                    ) === "on";


                setTimeout(function () {

                    if (wasNight) {

                        document.body.classList.add(
                            "night-mode"
                        );

                    }


                    updateNightModeAfterTheme();

                }, 50);

            }
        );

    });


    function updateNightModeAfterTheme() {

        const night =
            document.body.classList.contains(
                "night-mode"
            );


        const icon =
            document.getElementById(
                "nightIcon"
            );

        const status =
            document.getElementById(
                "nightStatus"
            );


        if (icon) {

            icon.textContent =
                night
                ? "☀️"
                : "🌙";

        }


        if (status) {

            status.textContent =
                night
                ? "ON"
                : "OFF";

        }

    }

})();


function parseDate(str) {

    const parts =
        str.split("-").map(Number);

    return new Date(
        parts[0],
        parts[1] - 1,
        parts[2]
    );

}


function formatDate(str) {

    const date =
        parseDate(str);

    return `${date.getMonth() + 1}/${date.getDate()}`;

}


function dayName(str) {

    const date =
        parseDate(str);

    const names =
        [
            "日",
            "月",
            "火",
            "水",
            "木",
            "金",
            "土"
        ];

    return names[
        date.getDay()
    ];

}


// ==========================================
// 今日
// ==========================================

function updateToday() {

    const today =
        new Date();

    const todayStr =
        dateString(today);

    document.getElementById(
        "todayDate"
    ).textContent =
        `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日（${dayName(todayStr)}）`;

}


// ==========================================
// ID
// ==========================================

function createId() {

    return Date.now().toString()
        + Math.random()
            .toString(36)
            .substring(2);

}


// ==========================================
// 予定追加
// ==========================================

document.getElementById(
    "addButton"
).addEventListener(
    "click",
    addSchedule
);


function addSchedule() {

    const date =
        document.getElementById(
            "date"
        ).value;

    const time =
        document.getElementById(
            "time"
        ).value;

    const task =
        document.getElementById(
            "task"
        ).value.trim();

    const category =
        document.getElementById(
            "category"
        ).value;

    const priority =
        document.getElementById(
            "priority"
        ).value;

    const taskType =
        document.getElementById(
            "taskType"
        ).value;

    const repeat =
        document.getElementById(
            "repeat"
        ).value;

    const repeatEnd =
        document.getElementById(
            "repeatEndDate"
        ).value;

    const memo =
        document.getElementById(
            "memo"
        ).value;

    const hasCheck =
        document.getElementById(
            "hasCheck"
        ).checked;


    if (!date || !task) {

        alert(
            "日付と予定を入力してください。"
        );

        return;

    }


    const base = {

        id: createId(),

        date,

        time,

        task,

        category,

        priority,

        taskType,

        memo,

        hasCheck,

        completed: false

    };


    schedules.push(base);


    // ======================================
    // 繰り返し
    // ======================================

    if (
        repeat !== "none"
        && repeatEnd
    ) {

        let nextDate =
            parseDate(date);

        const endDate =
            parseDate(repeatEnd);


        while (true) {

            if (repeat === "daily") {

                nextDate.setDate(
                    nextDate.getDate() + 1
                );

            }

            if (repeat === "weekly") {

                nextDate.setDate(
                    nextDate.getDate() + 7
                );

            }

            if (repeat === "monthly") {

                nextDate.setMonth(
                    nextDate.getMonth() + 1
                );

            }


            if (
                nextDate >
                endDate
            ) {

                break;

            }


            schedules.push({

                ...base,

                id: createId(),

                date:
                    dateString(
                        nextDate
                    ),

                completed: false

            });

        }

    }


    saveData();

    clearAddForm();

    renderAll();

}


// ==========================================
// 入力欄クリア
// ==========================================

function clearAddForm() {

    document.getElementById(
        "task"
    ).value = "";

    document.getElementById(
        "time"
    ).value = "";

    document.getElementById(
        "memo"
    ).value = "";

}


// ==========================================
// 全体更新
// ==========================================

function renderAll() {

    renderToday();

    renderWeek();

    renderCalendar();

    renderCountdown();

    renderStats();

    renderMonthlyReview();

    renderTrash();

}


// ==========================================
// 今日の予定
// ==========================================

function renderToday() {

    const today =
        dateString(
            new Date()
        );

    const list =
        schedules.filter(
            item =>
                item.date === today
        );


    const container =
        document.getElementById(
            "todaySchedule"
        );

    const count =
        document.getElementById(
            "todayCount"
        );


    count.textContent =
        `${list.length}件`;


    if (!list.length) {

        container.innerHTML =
            `<div class="empty">
                🎉 今日の予定はありません
            </div>`;

        updateProgress(
            list
        );

        return;

    }


    container.innerHTML =
        list.map(
            createTodayHTML
        ).join("");


    updateProgress(
        list
    );

}


function createTodayHTML(item) {

    return `
        <div class="today-item">

            <div class="schedule-top">

                ${
                    item.hasCheck
                    ? `
                    <input
                        type="checkbox"
                        ${
                            item.completed
                            ? "checked"
                            : ""
                        }
                        onchange="
                            toggleComplete('${item.id}')
                        "
                    >
                    `
                    : ""
                }

                <div>

                    <div
                        class="schedule-name
                        ${
                            item.completed
                            ? "completed"
                            : ""
                        }"
                    >
                        ${escapeHTML(item.task)}
                    </div>

                    ${
                        item.time
                        ? `
                        <div class="schedule-time">
                            ${item.time}
                        </div>
                        `
                        : ""
                    }

                </div>

            </div>

        </div>
    `;

}


// ==========================================
// 完了
// ==========================================

function toggleComplete(id) {

    const item =
        schedules.find(
            x => x.id === id
        );

    if (!item) return;


    item.completed =
        !item.completed;


    saveData();

    renderAll();


    if (item.completed) {

        showCelebration();

    }

}


// ==========================================
// 褒め演出
// ==========================================

const celebrationMessages = [

    {
        emoji: "🌱",
        title: "よく頑張った！",
        message: "一歩前進！"
    },

    {
        emoji: "✨",
        title: "ナイス！",
        message: "今日もちゃんと進んでる！"
    },

    {
        emoji: "🎉",
        title: "予定クリア！",
        message: "その調子！"
    },

    {
        emoji: "🍀",
        title: "えらい！",
        message: "この調子でいこう！"
    },

    {
        emoji: "🌿",
        title: "一歩前進！",
        message: "今日もよく頑張ったね！"
    },

    {
        emoji: "💚",
        title: "今日も順調！",
        message: "積み重ねが力になる！"
    }

];


function showCelebration() {

    const random =
        celebrationMessages[
            Math.floor(
                Math.random()
                *
                celebrationMessages.length
            )
        ];


    document.getElementById(
        "celebrationEmoji"
    ).textContent =
        random.emoji;


    document.getElementById(
        "celebrationTitle"
    ).textContent =
        random.title;


    document.getElementById(
        "celebrationMessage"
    ).textContent =
        random.message;


    const box =
        document.getElementById(
            "celebration"
        );


    box.classList.add(
        "show"
    );


    setTimeout(
        () => {

            box.classList.remove(
                "show"
            );

        },
        2200
    );

}


// ==========================================
// 達成率
// ==========================================

function updateProgress(list) {

    const total =
        list.filter(
            x => x.hasCheck
        ).length;

    const completed =
        list.filter(
            x =>
                x.hasCheck
                &&
                x.completed
        ).length;


    const rate =
        total === 0
        ? 0
        : Math.round(
            completed / total * 100
        );


    document.getElementById(
        "todayRate"
    ).textContent =
        `${rate}%`;


    document.getElementById(
        "todayProgress"
    ).style.width =
        `${rate}%`;


    document.getElementById(
        "todayProgressText"
    ).textContent =
        `${completed} / ${total} 完了`;

}


// ==========================================
// 今週
// ==========================================

function renderWeek() {

    const today =
        new Date();

    const day =
        today.getDay();

    const sunday =
        new Date(today);

    sunday.setDate(
        today.getDate() - day
    );


    const container =
        document.getElementById(
            "weekSchedule"
        );


    let html = "";


    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const date =
            new Date(sunday);

        date.setDate(
            sunday.getDate() + i
        );


        const str =
            dateString(date);


        const list =
            schedules.filter(
                x => x.date === str
            );


        html += `
            <div class="week-item">

                <div class="week-date">

                    ${i === 0
                        ? "今日"
                        : dayName(str)
                    }

                    ${formatDate(str)}

                </div>

                ${
                    list.length
                    ? list.map(
                        item =>
                            `
                            <div>
                                ${
                                    item.completed
                                    ? "✓"
                                    : "○"
                                }

                                ${escapeHTML(
                                    item.task
                                )}
                            </div>
                            `
                    ).join("")
                    : `
                        <div
                            style="
                            color:#9aa69f;
                            font-size:12px;
                            margin-top:5px;
                            "
                        >
                            予定なし
                        </div>
                    `
                }

            </div>
        `;

    }


    container.innerHTML =
        html;

}


// ==========================================
// カレンダー
// ==========================================

document.getElementById(
    "prevMonth"
).addEventListener(
    "click",
    () => {

        currentMonth.setMonth(
            currentMonth.getMonth() - 1
        );

        renderCalendar();

    }
);


document.getElementById(
    "nextMonth"
).addEventListener(
    "click",
    () => {

        currentMonth.setMonth(
            currentMonth.getMonth() + 1
        );

        renderCalendar();

    }
);


function renderCalendar() {

    const year =
        currentMonth.getFullYear();

    const month =
        currentMonth.getMonth();


    document.getElementById(
        "monthTitle"
    ).textContent =
        `${year}年${month + 1}月`;


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const lastDate =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const previousLast =
        new Date(
            year,
            month,
            0
        ).getDate();


    const container =
        document.getElementById(
            "calendar"
        );


    let html = "";


    // 前月
    for (
        let i = firstDay - 1;
        i >= 0;
        i--
    ) {

        const day =
            previousLast - i;


        html += `
            <div class="day other-month">

                <div class="day-number">
                    ${day}
                </div>

            </div>
        `;

    }


    // 当月
    for (
        let day = 1;
        day <= lastDate;
        day++
    ) {

        const date =
            new Date(
                year,
                month,
                day
            );


        const str =
            dateString(date);


        const list =
            schedules.filter(
                x => x.date === str
            );


        const isToday =
            str ===
            dateString(
                new Date()
            );


        html += `
            <div
                class="day
                ${
                    isToday
                    ? "today"
                    : ""
                }"
                onclick="
                    selectCalendarDate('${str}')
                "
            >

                <div class="day-number">
                    ${day}
                </div>

                ${list.slice(0, 3)
                    .map(
                        item =>
                            `
                            <div class="schedule">

                                <div class="schedule-top">

                                    ${
                                        item.hasCheck
                                        ? `
                                        <input
                                            type="checkbox"
                                            ${
                                                item.completed
                                                ? "checked"
                                                : ""
                                            }
                                            onclick="
                                                event.stopPropagation();
                                                toggleComplete('${item.id}')
                                            "
                                        >
                                        `
                                        : ""
                                    }

                                    <div
                                        class="
                                        schedule-text
                                        ${
                                            item.completed
                                            ? "completed"
                                            : ""
                                        }"
                                    >
                                        ${
                                            item.taskType ===
                                            "deadline"
                                            ? "📚 "
                                            : ""
                                        }

                                        ${escapeHTML(
                                            item.task
                                        )}
                                    </div>

                                </div>

                                ${
                                    item.time
                                    ? `
                                    <div class="schedule-time">
                                        ${item.time}
                                    </div>
                                    `
                                    : ""
                                }

                                <div class="schedule-buttons">

                                    <button
                                        class="edit-button"
                                        onclick="
                                            event.stopPropagation();
                                            openEdit('${item.id}')
                                        "
                                    >
                                        ✏️
                                    </button>

                                    <button
                                        class="delete-button"
                                        onclick="
                                            event.stopPropagation();
                                            deleteSchedule('${item.id}')
                                        "
                                    >
                                        🗑️
                                    </button>

                                </div>

                            </div>
                            `
                    ).join("")}

            </div>
        `;

    }


    // 次月
    const totalCells =
        Math.ceil(
            (
                firstDay
                +
                lastDate
            ) / 7
        ) * 7;


    const nextDays =
        totalCells
        -
        (
            firstDay
            +
            lastDate
        );


    for (
        let i = 1;
        i <= nextDays;
        i++
    ) {

        html += `
            <div class="day other-month">

                <div class="day-number">
                    ${i}
                </div>

            </div>
        `;

    }


    container.innerHTML =
        html;

}


// ==========================================
// カレンダーの日付選択
// ==========================================

function selectCalendarDate(str) {

    document.getElementById(
        "date"
    ).value = str;


    document.getElementById(
        "date"
    ).scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


// ==========================================
// 編集
// ==========================================

function openEdit(id) {

    const item =
        schedules.find(
            x => x.id === id
        );

    if (!item) return;


    editingId = id;


    document.getElementById(
        "editDate"
    ).value =
        item.date;


    document.getElementById(
        "editTime"
    ).value =
        item.time;


    document.getElementById(
        "editTask"
    ).value =
        item.task;


    document.getElementById(
        "editCategory"
    ).value =
        item.category;


    document.getElementById(
        "editPriority"
    ).value =
        item.priority;


    document.getElementById(
        "editTaskType"
    ).value =
        item.taskType;


    document.getElementById(
        "editMemo"
    ).value =
        item.memo || "";


    document.getElementById(
        "editHasCheck"
    ).checked =
        item.hasCheck;


    document.getElementById(
        "editModal"
    ).classList.add(
        "show"
    );

}


document.getElementById(
    "cancelEdit"
).addEventListener(
    "click",
    closeEdit
);


function closeEdit() {

    document.getElementById(
        "editModal"
    ).classList.remove(
        "show"
    );

    editingId = null;

}


document.getElementById(
    "saveEdit"
).addEventListener(
    "click",
    saveEdit
);


function saveEdit() {

    const item =
        schedules.find(
            x => x.id === editingId
        );

    if (!item) return;


    item.date =
        document.getElementById(
            "editDate"
        ).value;


    item.time =
        document.getElementById(
            "editTime"
        ).value;


    item.task =
        document.getElementById(
            "editTask"
        ).value;


    item.category =
        document.getElementById(
            "editCategory"
        ).value;


    item.priority =
        document.getElementById(
            "editPriority"
        ).value;


    item.taskType =
        document.getElementById(
            "editTaskType"
        ).value;


    item.memo =
        document.getElementById(
            "editMemo"
        ).value;


    item.hasCheck =
        document.getElementById(
            "editHasCheck"
        ).checked;


    saveData();

    closeEdit();

    renderAll();

}


// ==========================================
// 削除
// ==========================================

function deleteSchedule(id) {

    const index =
        schedules.findIndex(
            x => x.id === id
        );


    if (index === -1) return;


    const item =
        schedules.splice(
            index,
            1
        )[0];


    trash.push(
        item
    );


    saveData();

    renderAll();

}


// ==========================================
// ゴミ箱
// ==========================================

function renderTrash() {

    const container =
        document.getElementById(
            "trashList"
        );


    if (!trash.length) {

        container.innerHTML =
            `
            <div class="empty">
                ゴミ箱は空です
            </div>
            `;

        return;

    }


    container.innerHTML =
        trash.map(
            item =>
                `
                <div
                    class="today-item"
                    style="
                    margin-bottom:8px;
                    "
                >

                    <div>

                        <strong>
                            ${escapeHTML(
                                item.task
                            )}
                        </strong>

                        <div
                            style="
                            font-size:12px;
                            color:#829087;
                            "
                        >
                            ${item.date}
                        </div>

                    </div>


                    <button
                        onclick="
                            restoreSchedule('${item.id}')
                        "
                    >
                        ♻️ 復元
                    </button>

                </div>
                `
        ).join("");

}


function restoreSchedule(id) {

    const index =
        trash.findIndex(
            x => x.id === id
        );


    if (index === -1) return;


    schedules.push(
        trash.splice(
            index,
            1
        )[0]
    );


    saveData();

    renderAll();

}


document.getElementById(
    "clearTrashButton"
).addEventListener(
    "click",
    () => {

        document.getElementById(
            "trashModal"
        ).classList.add(
            "show"
        );

    }
);


document.getElementById(
    "closeTrash"
).addEventListener(
    "click",
    () => {

        document.getElementById(
            "trashModal"
        ).classList.remove(
            "show"
        );

    }
);


// ==========================================
// カウントダウン
// ==========================================

function renderCountdown() {

    const container =
        document.getElementById(
            "countdownList"
        );


    const deadlines =
        schedules.filter(
            item =>
                item.taskType ===
                "deadline"
        );


    if (!deadlines.length) {

        container.innerHTML =
            `
            <div class="empty">
                提出物はありません
            </div>
            `;

        return;

    }


    const today =
        new Date();


    container.innerHTML =
        deadlines.map(
            item => {

                const target =
                    parseDate(
                        item.date
                    );


                const diff =
                    Math.ceil(
                        (
                            target -
                            new Date(
                                today.getFullYear(),
                                today.getMonth(),
                                today.getDate()
                            )
                        )
                        /
                        (
                            1000 *
                            60 *
                            60 *
                            24
                        )
                    );


                let text;


                if (diff < 0) {

                    text =
                        "期限切れ";

                }
                else if (diff === 0) {

                    text =
                        "今日";

                }
                else {

                    text =
                        `あと ${diff}日`;

                }


                return `
                    <div class="countdown-item">

                        <strong>
                            ${escapeHTML(
                                item.task
                            )}
                        </strong>

                        <div>
                            ${item.date}
                        </div>

                        <div class="countdown-days">
                            ${text}
                        </div>

                    </div>
                `;

            }
        ).join("");

}


// ==========================================
// 統計
// ==========================================

function renderStats() {

    const today =
        new Date();


    const day =
        today.getDay();


    const sunday =
        new Date(today);


    sunday.setDate(
        today.getDate() - day
    );


    let total = 0;

    let completed = 0;


    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const date =
            new Date(sunday);


        date.setDate(
            sunday.getDate() + i
        );


        const str =
            dateString(date);


        schedules
            .filter(
                x =>
                    x.date === str
                    &&
                    x.hasCheck
            )
            .forEach(
                item => {

                    total++;

                    if (
                        item.completed
                    ) {

                        completed++;

                    }

                }
            );

    }


    const rate =
        total
        ? Math.round(
            completed /
            total *
            100
        )
        : 0;


    document.getElementById(
        "weekRate"
    ).textContent =
        `${rate}%`;


    document.getElementById(
        "streak"
    ).textContent =
        `${calculateStreak()}日`;

}


function calculateStreak() {

    let streak = 0;

    const date =
        new Date();


    while (true) {

        const str =
            dateString(date);


        const list =
            schedules.filter(
                x =>
                    x.date === str
                    &&
                    x.hasCheck
            );


        if (
            !list.length
            ||
            !list.some(
                x => x.completed
            )
        ) {

            break;

        }


        streak++;

        date.setDate(
            date.getDate() - 1
        );

    }


    return streak;

}


// ==========================================
// 月間振り返り
// ==========================================

function renderMonthlyReview() {

    const now =
        new Date();


    const year =
        now.getFullYear();

    const month =
        now.getMonth();


    const list =
        schedules.filter(
            item => {

                const d =
                    parseDate(
                        item.date
                    );

                return (
                    d.getFullYear()
                    ===
                    year
                    &&
                    d.getMonth()
                    ===
                    month
                );

            }
        );


    const total =
        list.filter(
            x => x.hasCheck
        ).length;


    const completed =
        list.filter(
            x =>
                x.hasCheck
                &&
                x.completed
        ).length;


    const rate =
        total
        ? Math.round(
            completed /
            total *
            100
        )
        : 0;


    document.getElementById(
        "monthlyReview"
    ).innerHTML =
        `
        <div class="review-box">

            <div class="review-item">

                予定

                <strong>
                    ${list.length}
                </strong>

            </div>


            <div class="review-item">

                完了

                <strong>
                    ${completed}
                </strong>

            </div>


            <div class="review-item">

                達成率

                <strong>
                    ${rate}%
                </strong>

            </div>

        </div>
        `;

}


// ==========================================
// 検索
// ==========================================

document.getElementById(
    "search"
).addEventListener(
    "input",
    renderSearch
);


document.getElementById(
    "filterCategory"
).addEventListener(
    "change",
    renderSearch
);


document.getElementById(
    "hideCompleted"
).addEventListener(
    "change",
    renderSearch
);


function renderSearch() {

    const keyword =
        document.getElementById(
            "search"
        ).value
            .toLowerCase();


    const category =
        document.getElementById(
            "filterCategory"
        ).value;


    const hideCompleted =
        document.getElementById(
            "hideCompleted"
        ).checked;


    const result =
        schedules.filter(
            item => {

                const matchText =
                    item.task
                        .toLowerCase()
                        .includes(
                            keyword
                        );


                const matchCategory =
                    category === "all"
                    ||
                    item.category ===
                    category;


                const matchCompleted =
                    !hideCompleted
                    ||
                    !item.completed;


                return (
                    matchText
                    &&
                    matchCategory
                    &&
                    matchCompleted
                );

            }
        );


    console.log(
        "検索結果:",
        result
    );

}


// ==========================================
// バックアップ
// ==========================================

document.getElementById(
    "exportButton"
).addEventListener(
    "click",
    exportData
);


function exportData() {

    const data = {

        schedules,

        trash,

        exportedAt:
            new Date()
                .toISOString()

    };


    const blob =
        new Blob(
            [
                JSON.stringify(
                    data,
                    null,
                    2
                )
            ],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const a =
        document.createElement(
            "a"
        );


    a.href = url;

    a.download =
        `yotea-backup-${dateString(new Date())}.json`;

    a.click();


    URL.revokeObjectURL(
        url
    );

}


// ==========================================
// 復元
// ==========================================

document.getElementById(
    "importFile"
).addEventListener(
    "change",
    importData
);


function importData(event) {

    const file =
        event.target.files[0];


    if (!file) return;


    const reader =
        new FileReader();


    reader.onload =
        function () {

            try {

                const data =
                    JSON.parse(
                        reader.result
                    );


                if (
                    Array.isArray(
                        data.schedules
                    )
                ) {

                    schedules =
                        data.schedules;

                }


                if (
                    Array.isArray(
                        data.trash
                    )
                ) {

                    trash =
                        data.trash;

                }


                saveData();

                renderAll();


                alert(
                    "バックアップを復元しました！"
                );

            }
            catch {

                alert(
                    "バックアップファイルを読み込めませんでした。"
                );

            }

        };


    reader.readAsText(
        file
    );

}


// ==========================================
// テーマ
// ==========================================

document.getElementById(
    "themeButton"
).addEventListener(
    "click",
    () => {

        document.getElementById(
            "themeModal"
        ).classList.add(
            "show"
        );

    }
);


document.querySelectorAll(
    ".theme-option"
).forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const theme =
                    button.dataset.theme;


                document.body.className =
                    theme === "green"
                    ? ""
                    : `theme-${theme}`;


                localStorage.setItem(
                    "yoteaTheme",
                    theme
                );


                document.getElementById(
                    "themeModal"
                ).classList.remove(
                    "show"
                );

            }
        );

    }
);


document.getElementById(
    "themeModal"
).addEventListener(
    "click",
    event => {

        if (
            event.target.id ===
            "themeModal"
        ) {

            event.target.classList.remove(
                "show"
            );

        }

    }
);


// ==========================================
// HTMLエスケープ
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;

}


// ==========================================
// 初期設定
// ==========================================

function initialize() {

    const savedTheme =
        localStorage.getItem(
            "yoteaTheme"
        );


    if (
        savedTheme
        &&
        savedTheme !== "green"
    ) {

        document.body.classList.add(
            `theme-${savedTheme}`
        );

    }


    const today =
        dateString(
            new Date()
        );


    document.getElementById(
        "date"
    ).value =
        today;


    updateToday();

    renderAll();

}


initialize();
