// Функция для определения темы браузера
function detectBrowserTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    } else {
        return 'light';
    }
}

function addDarkModeClass() {
    document.documentElement.classList.add('dark-mode');
}

function removeDarkModeClass() {
    document.documentElement.classList.remove('dark-mode');
}

function applyDarkTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        addDarkModeClass();
    } else {
        removeDarkModeClass();
    }
}

function saveThemePreference(theme) {
    localStorage.setItem('theme', theme);
}

applyDarkTheme();

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (e.matches) {
        saveThemePreference('dark');
        addDarkModeClass();
    } else {
        saveThemePreference('light');
        removeDarkModeClass();
    }
});
