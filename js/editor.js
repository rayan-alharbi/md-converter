// Editor Functionality
const Editor = {
    // Get word count from text
    getWordCount(text) {
        const trimmed = text.trim();
        if (!trimmed) return 0;
        return trimmed.split(/\s+/).length;
    },

    // Get character count
    getCharCount(text) {
        return text.length;
    },

    // Update word count display
    updateWordCount(text) {
        const wordCount = this.getWordCount(text);
        const charCount = this.getCharCount(text);
        const btn = document.getElementById('wordCount');
        if (btn) {
            btn.textContent = `${wordCount} words, ${charCount} chars`;
        }
    },

    // Load content from localStorage
    loadContent() {
        const saved = localStorage.getItem('markdown-app-content');
        return saved || '';
    },

    // Save content to localStorage
    saveContent(content) {
        try {
            localStorage.setItem('markdown-app-content', content);
        } catch (e) {
            console.error('Failed to save content:', e);
        }
    },

    // Clear editor
    clear() {
        const editor = document.getElementById('mdInput');
        if (editor && confirm('Are you sure you want to clear the editor?')) {
            editor.value = '';
            this.saveContent('');
            this.updateWordCount('');
            // Trigger render
            if (window.App && window.App.render) {
                window.App.render();
            }
        }
    },

    // Load sample Markdown
    loadSample() {
        const sample = `# Welcome to Markdown Editor with PDF Export

This is a **powerful** Markdown editor with *full-featured* HTML preview and PDF export capabilities.

## Features

### Text Formatting
- **Bold text** with \`**bold**\`
- *Italic text* with \`*italic*\`
- ~~Strikethrough~~ with \`~~text~~\`
- \`Inline code\` with backticks

### Lists

#### Unordered List
- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
- Item 3

#### Ordered List
1. First item
2. Second item
3. Third item

#### Task List
- [x] Completed task
- [ ] Pending task
- [ ] Another pending task

### Code Blocks

JavaScript example:
\`\`\`javascript
function greet(name) {
    console.log(\`Hello, \${name}!\`);
}

greet('World');
\`\`\`

Python example:
\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
\`\`\`

### Blockquotes

> This is a blockquote.
> It can span multiple lines.
>
> — Famous Person

### Tables

| Feature | Supported | Notes |
|---------|-----------|-------|
| Markdown | ✅ | Full GFM support |
| PDF Export | ✅ | Client-side generation |
| RTL | ✅ | Right-to-left text |
| Themes | ✅ | 4 themes available |

### Links and Images

[Visit GitHub](https://github.com)

![Placeholder Image](https://via.placeholder.com/400x200/4a90e2/ffffff?text=Markdown+Preview)

### Mathematics (KaTeX)

Inline math: $E = mc^2$

Block math:

$$
\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$

$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$

### Horizontal Rules

---

### Footnotes

Here's a sentence with a footnote[^1].

[^1]: This is the footnote content.

## Export Options

You can export your document in multiple formats:

1. **Markdown (.md)** - Raw Markdown text
2. **HTML (.html)** - Complete HTML document
3. **PNG (.png)** - Image snapshot
4. **PDF (.pdf)** - Fully formatted PDF with styling

## RTL Support

Toggle the text direction button (↔️) to test right-to-left languages like Arabic or Hebrew.

مرحبا بك في محرر Markdown

## Tips

- Use the theme selector to change appearance
- Adjust font size for better readability
- All your work is saved automatically in your browser
- No data is sent to any server - everything stays local

---

**Happy writing!** 📝
`;

        const editor = document.getElementById('mdInput');
        if (editor) {
            editor.value = sample;
            this.saveContent(sample);
            this.updateWordCount(sample);
            // Trigger render
            if (window.App && window.App.render) {
                window.App.render();
            }
        }
    },

    // Toggle fullscreen preview
    toggleFullscreen() {
        const previewPane = document.querySelector('.preview-pane');
        if (previewPane) {
            previewPane.classList.toggle('fullscreen');
            const btn = document.getElementById('fullscreen');
            if (btn) {
                btn.textContent = previewPane.classList.contains('fullscreen') ? '✕' : '⛶';
            }
        }
    },

    // Copy preview HTML to clipboard
    async copyPreview() {
        const preview = document.getElementById('preview');
        if (preview) {
            try {
                await navigator.clipboard.writeText(preview.innerHTML);
                const btn = document.getElementById('copyPreview');
                if (btn) {
                    const originalText = btn.textContent;
                    btn.textContent = '✓';
                    setTimeout(() => {
                        btn.textContent = originalText;
                    }, 2000);
                }
            } catch (e) {
                console.error('Failed to copy:', e);
                alert('Failed to copy HTML to clipboard');
            }
        }
    },

    // Initialize editor
    init() {
        const editor = document.getElementById('mdInput');
        if (!editor) return;

        // Load saved content
        const saved = this.loadContent();
        if (saved) {
            editor.value = saved;
            this.updateWordCount(saved);
        }

        // Auto-save on input
        editor.addEventListener('input', (e) => {
            this.saveContent(e.target.value);
            this.updateWordCount(e.target.value);
        });

        // Clear button
        const clearBtn = document.getElementById('clearEditor');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clear());
        }

        // Load sample button
        const sampleBtn = document.getElementById('loadSample');
        if (sampleBtn) {
            sampleBtn.addEventListener('click', () => this.loadSample());
        }

        // New document button
        const newBtn = document.getElementById('newDoc');
        if (newBtn) {
            newBtn.addEventListener('click', () => this.clear());
        }

        // Fullscreen button
        const fullscreenBtn = document.getElementById('fullscreen');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }

        // Copy preview button
        const copyBtn = document.getElementById('copyPreview');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyPreview());
        }

        // Handle Escape key in fullscreen
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const previewPane = document.querySelector('.preview-pane.fullscreen');
                if (previewPane) {
                    this.toggleFullscreen();
                }
            }
        });
    }
};
