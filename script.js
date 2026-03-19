// ========== ПЛАНИРОВЩИК ЗАДАЧ 2026 ==========
// Исправленная версия лабораторной работы

// 1. Константы и настройки
const STORAGE_KEY = 'todo_app_tasks';

// 2. Элементы DOM
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const tasksList = document.getElementById('tasksList');
const totalSpan = document.getElementById('totalTasks');
const completedSpan = document.getElementById('completedTasks');
const pendingSpan = document.getElementById('pendingTasks');
const clearBtn = document.getElementById('clearBtn');

// 3. Состояние приложения
let tasks = [];

// 4. Вспомогательные функции (Логика)

// Сохранение в localStorage
const saveToStorage = () => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error('Ошибка сохранения:', error);
    }
};

// Обновление статистики на экране
const updateStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    
    // Проверка на существование элементов (чтобы не упало, если в HTML их нет)
    if (totalSpan) totalSpan.textContent = total;
    if (completedSpan) completedSpan.textContent = completed;
    if (pendingSpan) pendingSpan.textContent = pending;
};

// Отрисовка списка задач
const renderTasks = () => {
    if (!tasksList) return;

    if (tasks.length === 0) {
        tasksList.innerHTML = '<li class="empty-message">✨ Добавьте свою первую задачу</li>';
        return;
    }
    
    tasksList.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.setAttribute('data-id', task.id);
        
        // Плавное появление (анимация)
        li.style.animation = `fadeIn 0.3s ease ${index * 0.05}s both`;
        
        // Чекбокс
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-check';
        checkbox.checked = task.completed;
        
        // Текст задачи
        const textSpan = document.createElement('span');
        textSpan.className = `task-text ${task.completed ? 'completed' : ''}`;
        textSpan.textContent = task.text;
        
        // Дата создания
        const dateSpan = document.createElement('span');
        dateSpan.className = 'task-date';
        dateSpan.textContent = task.date;
        
        // Кнопка удаления
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '×';
        deleteBtn.setAttribute('aria-label', 'Удалить задачу');
        
        li.append(checkbox, textSpan, dateSpan, deleteBtn);
        tasksList.appendChild(li);
    });
};

// Создание объекта новой задачи
const createTask = (text) => {
    const newTask = {
        id: Date.now().toString(),
        text: text,
        completed: false,
        date: new Date().toLocaleDateString('ru-RU'),
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    saveToStorage();
    renderTasks();
    updateStats();
};

// 5. Обработчики событий

// Клик по кнопке "Добавить"
addBtn?.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (!text) {
        alert('Введите текст задачи!');
        return;
    }
    createTask(text);
    taskInput.value = '';
    taskInput.focus();
});

// Добавление через Enter
taskInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addBtn.click();
});

// Работа со списком (Делегирование событий)
tasksList?.addEventListener('click', (e) => {
    const target = e.target;
    const taskItem = target.closest('.task-item');
    if (!taskItem) return;
    
    const taskId = taskItem.getAttribute('data-id');
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    // Переключение состояния (чекбокс)
    if (target.classList.contains('task-check')) {
        tasks[taskIndex].completed = target.checked;
        saveToStorage();
        updateStats();
        // Перерисовываем, чтобы применился класс .completed к тексту
        renderTasks(); 
    }
    
    // Удаление
    if (target.classList.contains('delete-btn')) {
        if (confirm(`Удалить задачу "${tasks[taskIndex].text}"?`)) {
            tasks.splice(taskIndex, 1);
            saveToStorage();
            renderTasks();
            updateStats();
        }
    }
});

// Очистка всего списка
clearBtn?.addEventListener('click', () => {
    if (tasks.length === 0) return;
    
    if (confirm('Удалить все задачи?')) {
        tasks = [];
        saveToStorage();
        renderTasks();
        updateStats();
    }
});

// 6. Инициализация при запуске
const init = () => {
    // Добавляем CSS-анимацию в head
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
        }
        .completed { text-decoration: line-through; opacity: 0.6; }
    `;
    document.head.appendChild(style);

    // Загрузка данных
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            tasks = JSON.parse(saved);
        } catch (e) {
            tasks = [];
        }
    }

    renderTasks();
    updateStats();
    console.log('%c🚀 Планировщик готов!', 'color: #10b981; font-weight: bold;');
};

init();