// Immediate check to prevent flash of unstyled content
(function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-mode');
    }
})();

// DOM Logic
document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('themeToggleBtn');
    const root = document.documentElement; // <html> tag

    // Set initial icon
    if (root.classList.contains('light-mode')) {
        updateIcon('light');
    } else {
        updateIcon('dark');
    }

    // Toggle event
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            if (root.classList.contains('light-mode')) {
                // Switch to dark
                root.classList.remove('light-mode');
                localStorage.setItem('theme', 'dark');
                updateIcon('dark');
            } else {
                // Switch to light
                root.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
                updateIcon('light');
            }
        });
    }

    function updateIcon(theme) {
        if (!themeBtn) return;
        if (theme === 'light') {
            themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
            themeBtn.setAttribute('aria-label', 'Switch to Dark Mode');
        } else {
            themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
            themeBtn.setAttribute('aria-label', 'Switch to Light Mode');
        }
    }
});
