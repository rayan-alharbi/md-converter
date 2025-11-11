// Export Functionality
const Export = {
    // Get current timestamp for filenames
    getTimestamp() {
        const now = new Date();
        return now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
    },

    // Download a file
    downloadFile(content, filename, type) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    // Print to PDF (Browser native - works better for long documents)
    printToPdf() {
        // Store original state
        const editorPane = document.querySelector('.editor-pane');
        const toolbar = document.querySelector('.toolbar');
        const header = document.querySelector('.app-header');
        const footer = document.querySelector('.app-footer');
        const paneHeader = document.querySelector('.pane-header');
        
        // Hide UI elements
        if (editorPane) editorPane.style.display = 'none';
        if (toolbar) toolbar.style.display = 'none';
        if (header) header.style.display = 'none';
        if (footer) footer.style.display = 'none';
        if (paneHeader) paneHeader.style.display = 'none';

        // Trigger print dialog
        window.print();

        // Restore UI after print dialog closes
        setTimeout(() => {
            if (editorPane) editorPane.style.display = '';
            if (toolbar) toolbar.style.display = '';
            if (header) header.style.display = '';
            if (footer) footer.style.display = '';
            if (paneHeader) paneHeader.style.display = '';
        }, 1000);
    },

    // Export as Markdown
    exportMarkdown() {
        const editor = document.getElementById('mdInput');
        if (!editor) return;

        const content = editor.value;
        const filename = `document-${this.getTimestamp()}.md`;
        this.downloadFile(content, filename, 'text/markdown');
    },

    // Export as HTML
    exportHtml() {
        const preview = document.getElementById('preview');
        if (!preview) return;

        const prefs = Prefs.load();
        const theme = prefs.theme;
        const fontSize = prefs.fontSize;
        const direction = prefs.direction;

        // Get theme colors
        const themeColors = {
            light: { bg: '#ffffff', text: '#333333' },
            dark: { bg: '#1e1e1e', text: '#e0e0e0' },
            sepia: { bg: '#f4ecd8', text: '#5a4a3a' },
            github: { bg: '#ffffff', text: '#24292f' }
        };

        const colors = themeColors[theme] || themeColors.light;

        const html = `<!doctype html>
<html lang="en" dir="${direction}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Markdown Document</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
            line-height: 1.6;
            max-width: 900px;
            margin: 0 auto;
            padding: 2rem;
            background-color: ${colors.bg};
            color: ${colors.text};
            font-size: ${fontSize}px;
        }
        h1, h2, h3, h4, h5, h6 {
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            font-weight: 600;
            line-height: 1.3;
        }
        h1 { font-size: 2.25rem; border-bottom: 2px solid #ddd; padding-bottom: 0.5rem; }
        h2 { font-size: 1.875rem; border-bottom: 1px solid #ddd; padding-bottom: 0.5rem; }
        h3 { font-size: 1.5rem; }
        h4 { font-size: 1.25rem; }
        h5 { font-size: 1.125rem; }
        h6 { font-size: 1rem; }
        p { margin-bottom: 1rem; }
        a { color: #4a90e2; text-decoration: none; }
        a:hover { text-decoration: underline; }
        ul, ol { margin-bottom: 1rem; padding-left: 2rem; }
        li { margin-bottom: 0.5rem; }
        blockquote {
            margin: 1rem 0;
            padding: 0.5rem 1rem;
            border-left: 4px solid #4a90e2;
            background-color: #f5f5f5;
            color: #666;
        }
        code {
            padding: 0.2rem 0.4rem;
            background-color: #f5f5f5;
            border-radius: 4px;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 0.9em;
        }
        pre {
            margin: 1rem 0;
            padding: 1rem;
            background-color: #282c34;
            border-radius: 8px;
            overflow-x: auto;
        }
        pre code {
            padding: 0;
            background-color: transparent;
            border-radius: 0;
        }
        table {
            width: 100%;
            margin: 1rem 0;
            border-collapse: collapse;
            border: 1px solid #ddd;
        }
        th, td {
            padding: 0.75rem;
            border: 1px solid #ddd;
            text-align: left;
        }
        th {
            background-color: #f5f5f5;
            font-weight: 600;
        }
        img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 1rem 0;
        }
        hr {
            margin: 2rem 0;
            border: none;
            border-top: 2px solid #ddd;
        }
        .task-list-item {
            list-style: none;
        }
        [dir="rtl"] ul, [dir="rtl"] ol {
            padding-right: 2rem;
            padding-left: 0;
        }
        [dir="rtl"] blockquote {
            border-left: none;
            border-right: 4px solid #4a90e2;
        }
    </style>
</head>
<body>
${preview.innerHTML}
</body>
</html>`;

        const filename = `document-${this.getTimestamp()}.html`;
        this.downloadFile(html, filename, 'text/html');
    },

    // Export as PNG
    async exportPng() {
        const preview = document.getElementById('preview');
        if (!preview || !window.html2canvas) {
            alert('PNG export is not available');
            return;
        }

        try {
            // Show loading
            const btn = document.getElementById('exportPng');
            const originalText = btn ? btn.textContent : '';
            if (btn) btn.textContent = '⏳ Generating...';

            const canvas = await html2canvas(preview, {
                scale: 2,
                useCORS: true,
                backgroundColor: window.getComputedStyle(preview).backgroundColor
            });

            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `document-${this.getTimestamp()}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                if (btn) btn.textContent = originalText;
            });
        } catch (e) {
            console.error('Failed to export PNG:', e);
            alert('Failed to export PNG');
            const btn = document.getElementById('exportPng');
            if (btn) btn.textContent = '⬇️ .png';
        }
    },

    // Export as PDF - Custom method for long documents
    async exportPdf() {
        const preview = document.getElementById('preview');
        if (!preview) {
            alert('Preview not available');
            return;
        }

        // Check document length
        const contentLength = preview.innerText.length;
        const isLongDocument = contentLength > 10000; // More than 10k characters

        // For long documents, suggest browser print
        if (isLongDocument) {
            const usePrint = confirm(
                'Long document (' + Math.round(contentLength / 1000) + 'k characters)\n\n' +
                'For best results, use:\n' +
                '✓ Direct printing (recommended)\n' +
                '✗ Automatic export (may cause issues)\n\n' +
                'Press OK for direct printing\n' +
                'Press Cancel for automatic export'
            );
            
            if (usePrint) {
                this.printToPdf();
                return;
            }
        }

        // Check if required libraries are loaded
        if (!window.html2pdf) {
            alert('PDF libraries not available. Use direct printing (Ctrl+P)');
            return;
        }

        try {
            // Show loading
            const btn = document.getElementById('exportPdf');
            const originalText = btn ? btn.textContent : '';
            if (btn) btn.textContent = '⏳ Converting...';

            // Get current direction for RTL support
            const direction = document.documentElement.getAttribute('dir') || 'ltr';
            const bgColor = window.getComputedStyle(preview).backgroundColor;

            // Create temporary container
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.top = '0';
            container.style.width = '794px'; // A4 width in pixels at 96 DPI
            container.style.padding = '40px';
            container.style.backgroundColor = bgColor;
            container.style.color = window.getComputedStyle(preview).color;
            container.style.fontFamily = window.getComputedStyle(preview).fontFamily;
            container.style.fontSize = window.getComputedStyle(preview).fontSize;
            container.style.lineHeight = window.getComputedStyle(preview).lineHeight;
            container.setAttribute('dir', direction);
            
            // Clone content
            const clone = preview.cloneNode(true);
            container.appendChild(clone);
            document.body.appendChild(container);

            // Wait for images to load
            const images = container.querySelectorAll('img');
            const imagePromises = Array.from(images).map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve;
                    setTimeout(resolve, 3000); // Timeout after 3 seconds
                });
            });
            await Promise.all(imagePromises);

            // Use html2pdf with optimized settings
            const opt = {
                margin: 10,
                filename: `document-${this.getTimestamp()}.pdf`,
                image: { type: 'jpeg', quality: 0.92 },
                html2canvas: { 
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: bgColor,
                    logging: false,
                    scrollY: 0,
                    scrollX: 0,
                    windowWidth: container.scrollWidth,
                    windowHeight: container.scrollHeight
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait',
                    compress: true
                },
                pagebreak: { 
                    mode: ['avoid-all', 'css', 'legacy'],
                    avoid: ['img', 'pre', 'code', 'table', 'tr']
                }
            };

            // Generate and save PDF
            const worker = html2pdf().set(opt).from(container);
            await worker.save();

            // Clean up
            document.body.removeChild(container);

            // Restore button
            if (btn) {
                btn.textContent = '✓ Downloaded';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 3000);
            }

        } catch (e) {
            console.error('Failed to export PDF:', e);
            
            // Clean up container if exists
            const container = document.querySelector('[style*="-9999px"]');
            if (container && container.parentNode) {
                container.parentNode.removeChild(container);
            }

            // Offer print as alternative
            const usePrint = confirm(
                `Failed to export PDF: ${e.message}\n\n` +
                'Do you want to use direct printing instead?'
            );
            
            if (usePrint) {
                this.printToPdf();
            }
            
            const btn = document.getElementById('exportPdf');
            if (btn) btn.textContent = '⬇️ .pdf';
        }
    },

    // Initialize export buttons
    init() {
        const exportMdBtn = document.getElementById('exportMd');
        if (exportMdBtn) {
            exportMdBtn.addEventListener('click', () => this.exportMarkdown());
        }

        const exportHtmlBtn = document.getElementById('exportHtml');
        if (exportHtmlBtn) {
            exportHtmlBtn.addEventListener('click', () => this.exportHtml());
        }

        const exportPngBtn = document.getElementById('exportPng');
        if (exportPngBtn) {
            exportPngBtn.addEventListener('click', () => this.exportPng());
        }

        const exportPdfBtn = document.getElementById('exportPdf');
        if (exportPdfBtn) {
            exportPdfBtn.addEventListener('click', () => this.exportPdf());
        }

        const printPdfBtn = document.getElementById('printPdf');
        if (printPdfBtn) {
            printPdfBtn.addEventListener('click', () => this.printToPdf());
        }
    }
};
