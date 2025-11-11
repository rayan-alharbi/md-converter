// Preferences Management
const Prefs = {
    // Default preferences
    defaults: {
        theme: 'light',
        fontSize: '16',
        direction: 'ltr'
    },

    // Load preferences from localStorage
    load() {
        const saved = localStorage.getItem('markdown-app-prefs');
        if (saved) {
            try {
                return { ...this.defaults, ...JSON.parse(saved) };
            } catch (e) {
                console.error('Failed to load preferences:', e);
                return this.defaults;
            }
        }
        return this.defaults;
    },

    // Save preferences to localStorage
    save(prefs) {
        try {
            localStorage.setItem('markdown-app-prefs', JSON.stringify(prefs));
        } catch (e) {
            console.error('Failed to save preferences:', e);
        }
    },

    // Apply theme
    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.value = theme;
        }
    },

    // Apply font size
    applyFontSize(size) {
        document.body.setAttribute('data-font-size', size);
        const fontSizeSelect = document.getElementById('fontSizeSelect');
        if (fontSizeSelect) {
            fontSizeSelect.value = size;
        }
    },

    // Apply text direction
    applyDirection(dir) {
        document.documentElement.setAttribute('dir', dir);
        const preview = document.getElementById('preview');
        if (preview) {
            preview.setAttribute('dir', dir);
        }
    },

    // Initialize preferences system
    init() {
        const prefs = this.load();
        
        // Apply saved preferences
        this.applyTheme(prefs.theme);
        this.applyFontSize(prefs.fontSize);
        this.applyDirection(prefs.direction);

        // Theme selector
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                const theme = e.target.value;
                this.applyTheme(theme);
                const currentPrefs = this.load();
                this.save({ ...currentPrefs, theme });
            });
        }

        // Font size selector
        const fontSizeSelect = document.getElementById('fontSizeSelect');
        if (fontSizeSelect) {
            fontSizeSelect.addEventListener('change', (e) => {
                const size = e.target.value;
                this.applyFontSize(size);
                const currentPrefs = this.load();
                this.save({ ...currentPrefs, fontSize: size });
            });
        }

        // Toggle theme button
        const toggleTheme = document.getElementById('toggleTheme');
        if (toggleTheme) {
            toggleTheme.addEventListener('click', () => {
                const currentPrefs = this.load();
                const themes = ['light', 'dark', 'sepia', 'github'];
                const currentIndex = themes.indexOf(currentPrefs.theme);
                const nextTheme = themes[(currentIndex + 1) % themes.length];
                this.applyTheme(nextTheme);
                this.save({ ...currentPrefs, theme: nextTheme });
            });
        }

        // Toggle direction button
        const toggleDir = document.getElementById('toggleDir');
        if (toggleDir) {
            toggleDir.addEventListener('click', () => {
                const currentPrefs = this.load();
                const newDir = currentPrefs.direction === 'ltr' ? 'rtl' : 'ltr';
                this.applyDirection(newDir);
                this.save({ ...currentPrefs, direction: newDir });
            });
        }

        return prefs;
    }
};
