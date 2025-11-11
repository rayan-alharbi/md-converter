// Main Application
const App = {
    md: null,

    // Initialize markdown-it with plugins
    initMarkdown() {
        // Create markdown-it instance with options
        this.md = window.markdownit({
            html: true,
            linkify: true,
            typographer: true,
            breaks: false,
            highlight: function(str, lang) {
                if (lang && window.Prism && window.Prism.languages[lang]) {
                    try {
                        return window.Prism.highlight(str, window.Prism.languages[lang], lang);
                    } catch (e) {
                        console.error('Prism highlighting error:', e);
                    }
                }
                return '';
            }
        });

        // Add plugins
        if (window.markdownItFootnote) {
            this.md.use(window.markdownItFootnote);
        }

        if (window.markdownItTaskLists) {
            this.md.use(window.markdownItTaskLists, {
                enabled: true,
                label: true
            });
        }

        if (window.markdownItAnchor) {
            this.md.use(window.markdownItAnchor.default, {
                permalink: false,
                permalinkBefore: false,
                permalinkSymbol: '#'
            });
        }

        // Custom KaTeX renderer
        this.addKatexSupport();
    },

    // Add KaTeX support for math rendering
    addKatexSupport() {
        if (!window.katex) return;

        // Inline math: $...$
        this.md.inline.ruler.after('escape', 'math_inline', function(state, silent) {
            if (state.src[state.pos] !== '$') return false;

            const start = state.pos + 1;
            let end = start;
            let found = false;

            while (end < state.src.length) {
                if (state.src[end] === '$' && state.src[end - 1] !== '\\') {
                    found = true;
                    break;
                }
                end++;
            }

            if (!found) return false;

            if (!silent) {
                const content = state.src.slice(start, end);
                const token = state.push('math_inline', 'math', 0);
                token.content = content;
                token.markup = '$';
            }

            state.pos = end + 1;
            return true;
        });

        // Block math: $$...$$
        this.md.block.ruler.after('blockquote', 'math_block', function(state, startLine, endLine, silent) {
            let pos = state.bMarks[startLine] + state.tShift[startLine];
            let max = state.eMarks[startLine];

            if (pos + 2 > max) return false;
            if (state.src.slice(pos, pos + 2) !== '$$') return false;

            pos += 2;
            let firstLine = state.src.slice(pos, max);

            if (silent) return true;

            let lastLine = firstLine;
            let next = startLine;
            let lastPos;

            while (next < endLine) {
                next++;
                if (next >= endLine) break;

                pos = state.bMarks[next] + state.tShift[next];
                max = state.eMarks[next];

                if (pos < max && state.tShift[next] < state.blkIndent) break;

                const lineContent = state.src.slice(pos, max);
                if (lineContent.trim().endsWith('$$')) {
                    lastPos = lineContent.trim().length - 2;
                    lastLine = lineContent.trim().slice(0, lastPos);
                    break;
                }

                lastLine += '\n' + lineContent;
            }

            const content = (firstLine + '\n' + lastLine).trim();
            const token = state.push('math_block', 'math', 0);
            token.content = content.replace(/\$\$$/g, '').trim();
            token.block = true;

            state.line = next + 1;
            return true;
        });

        // Renderer for inline math
        this.md.renderer.rules.math_inline = function(tokens, idx) {
            try {
                return window.katex.renderToString(tokens[idx].content, {
                    throwOnError: false,
                    displayMode: false
                });
            } catch (e) {
                return `<span class="katex-error">${tokens[idx].content}</span>`;
            }
        };

        // Renderer for block math
        this.md.renderer.rules.math_block = function(tokens, idx) {
            try {
                return window.katex.renderToString(tokens[idx].content, {
                    throwOnError: false,
                    displayMode: true
                });
            } catch (e) {
                return `<div class="katex-error">${tokens[idx].content}</div>`;
            }
        };
    },

    // Render markdown to HTML
    render() {
        const input = document.getElementById('mdInput');
        const preview = document.getElementById('preview');

        if (!input || !preview || !this.md) return;

        try {
            // Convert markdown to HTML
            let html = this.md.render(input.value);

            // Sanitize HTML
            if (window.DOMPurify) {
                html = DOMPurify.sanitize(html, {
                    ADD_TAGS: ['math', 'semantics', 'mrow', 'mi', 'mo', 'mn', 'msup', 'msub', 'mfrac', 'msqrt'],
                    ADD_ATTR: ['xmlns', 'encoding']
                });
            }

            // Update preview
            preview.innerHTML = html;

            // Highlight code blocks
            if (window.Prism) {
                window.Prism.highlightAllUnder(preview);
            }

        } catch (e) {
            console.error('Render error:', e);
            preview.innerHTML = `<div style="color: red; padding: 1rem;">
                <strong>Rendering Error:</strong><br>
                ${e.message}
            </div>`;
        }
    },

    // Initialize the application
    init() {
        console.log('Initializing Markdown to HTML App...');

        // Initialize markdown parser
        this.initMarkdown();

        // Initialize modules
        Prefs.init();
        Editor.init();
        Export.init();

        // Setup editor event listener
        const editor = document.getElementById('mdInput');
        if (editor) {
            editor.addEventListener('input', () => this.render());
            
            // Initial render
            this.render();
        }

        // Load sample if editor is empty
        if (editor && !editor.value.trim()) {
            setTimeout(() => {
                Editor.loadSample();
            }, 500);
        }

        console.log('App initialized successfully!');
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

// Make App available globally for other modules
window.App = App;
