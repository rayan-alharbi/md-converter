# MD CONVERTER
---


A powerful, fully **client-side** Markdown editor with real-time HTML preview and multiple export options including PDF. No backend required - everything runs in your browser!

🌐 **Live Preview:** [md-converter.pages.dev](https://md-converter.pages.dev)

## ✨ Features

### Core Functionality
- 📝 **Real-time Markdown Preview** - See your formatted content as you type
- 🎨 **Multiple Themes** - Light, Dark, Sepia, and GitHub themes
- ↔️ **RTL Support** - Full support for right-to-left languages (Arabic,etc.)
- 💾 **Auto-save** - Your work is automatically saved in browser storage
- 📊 **Word Counter** - Real-time word and character count

### Markdown Features
- ✅ **GitHub Flavored Markdown (GFM)** - Full GFM support
- 🎯 **Task Lists** - Interactive checkboxes
- 📚 **Footnotes** - Academic-style references
- 🔗 **Auto-linking** - URLs automatically become clickable
- 📋 **Tables** - Beautiful table rendering
- 💻 **Syntax Highlighting** - Code blocks with Prism.js
- 🧮 **Math Rendering** - KaTeX support for mathematical formulas
- 🖼️ **Images** - Embed images with alt text
- 📑 **Headings with Anchors** - Auto-generated heading IDs

### Export Options
- 📄 **Markdown (.md)** - Export raw Markdown source
- 🌐 **HTML (.html)** - Export as standalone HTML document
- 🖼️ **PNG (.png)** - Export preview as high-quality image
- 📕 **PDF (.pdf)** - Export as professionally formatted PDF with full styling

### Customization
- 🎨 **4 Color Themes** - Light, Dark, Sepia, GitHub
- 📏 **Adjustable Font Size** - 14px to 22px
- 🔄 **Text Direction Toggle** - Switch between LTR and RTL
- ⛶ **Fullscreen Preview** - Focus on your rendered content

## 🚀 Getting Started

### Quick Start
1. Download or clone this repository
2. Open `index.html` in a modern web browser
3. Start typing Markdown in the editor
4. See the live preview on the right

That's it! No installation, no build process, no server required.

### Browser Requirements
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Modern browsers with ES6 support and HTML5 features.

## 📁 Project Structure

```
MD CONVERTER/
├── index.html          # Main HTML file
├── css/
│   ├── base.css       # Base styles and layout
│   ├── rtl.css        # Right-to-left support
│   └── themes.css     # Theme definitions
├── js/
│   ├── app.js         # Main application logic
│   ├── editor.js      # Editor functionality
│   ├── prefs.js       # Preferences management
│   └── export.js      # Export handlers (MD, HTML, PNG, PDF)
└── README.md          # This file
```

## 🎯 Usage Guide

### Writing Markdown

The editor supports all standard Markdown syntax plus GFM extensions:

```markdown
# Heading 1
## Heading 2

**Bold** and *italic* text

- Unordered list
- Another item

1. Ordered list
2. Second item

[Link text](https://example.com)
![Image alt](https://example.com/image.png)

`inline code`

​```javascript
// Code block
console.log('Hello!');
​```

| Table | Header |
|-------|--------|
| Cell  | Cell   |

> Blockquote

- [ ] Task list item
- [x] Completed task

Inline math: $E = mc^2$

Block math:
$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$
```

### Keyboard Shortcuts

- **Escape** - Exit fullscreen preview

### Export Formats

#### Markdown Export
Downloads the raw Markdown content as a `.md` file.

#### HTML Export
Creates a standalone HTML file with embedded styles and all content. Can be opened directly in any browser.

#### PNG Export
Captures the preview pane as a high-resolution PNG image. Useful for sharing on social media or embedding in documents.

#### PDF Export

**Two methods available:**

1. **🖨️ Print to PDF (Recommended for long documents)**
   - Click the green "🖨️ print" button
   - Uses browser's native print dialog
   - Perfect for documents of any length
   - No blank page issues
   - Choose "Save as PDF" in print dialog
   - Works with RTL and all themes

2. **⬇️ Auto PDF Export**
   - Click "⬇️ .pdf" button
   - Automatic download
   - Best for shorter documents (< 10k characters)
   - May prompt to use print method for long documents

**Features:**
- Preserved styling and themes
- Syntax highlighting in code blocks
- Mathematical formulas
- Proper page breaks
- RTL text support (Arabic)

**PDF Export Tips:**
- **For long documents:** Always use the "🖨️ print" button
- Use light themes for better print quality
- Ensure images are loaded before exporting
- Set appropriate margins in print dialog
- For best results, select "Background graphics" in print options

## 🎨 Themes

### Light Theme
Clean, high-contrast theme for daytime use.

### Dark Theme  
Easy on the eyes for low-light environments.

### Sepia Theme
Warm, book-like reading experience.

### GitHub Theme
Mimics GitHub's Markdown rendering style.

## 🌍 RTL Support

Full support for right-to-left languages:

1. Click the **↔️** button in the header
2. Text direction switches to RTL
3. All UI elements adapt
4. Exports maintain the direction

Example RTL text:
```
مرحبا بك في محرر Markdown
```

## 🔧 Technical Details

### Libraries Used

| Library | Version | Purpose |
|---------|---------|---------|
| markdown-it | 13.0.2 | Markdown parsing |
| markdown-it-footnote | 3.0.3 | Footnote support |
| markdown-it-task-lists | 2.1.1 | Task list support |
| markdown-it-anchor | 8.6.7 | Heading anchors |
| DOMPurify | 3.0.6 | XSS protection |
| Prism.js | 1.29.0 | Syntax highlighting |
| KaTeX | 0.16.9 | Math rendering |
| html2pdf.js | 0.10.1 | PDF generation |
| html2canvas | 1.4.1 | PNG generation |

All libraries loaded via CDN - no npm or build step required.

### Browser Storage

The app uses `localStorage` to save:
- Editor content (auto-saved on every change)
- Theme preference
- Font size preference
- Text direction preference

**Privacy Note:** All data stays in your browser. Nothing is sent to any server.

### PDF Generation Process

1. Clones the preview container
2. Converts to canvas using `html2canvas`
3. Generates multi-page PDF using `jsPDF`
4. Preserves styles, fonts, and text direction
5. Downloads automatically

## 🐛 Troubleshooting

### PDF export not working
- Ensure you're using a modern browser
- Check browser console for errors
- Try a shorter document first
- Clear browser cache and reload

### Math formulas not rendering
- Check that KaTeX CDN is accessible
- Use double backslashes: `\\frac` instead of `\frac`
- Verify syntax at https://katex.org/

### Styles not applying
- Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)
- Check that CSS files are loading
- Verify no browser extensions are blocking styles

### Content not saving
- Check browser console for localStorage errors
- Ensure cookies/storage are enabled
- Try incognito/private mode
- Check available storage space

## 🔒 Security

- **XSS Protection**: All HTML is sanitized using DOMPurify
- **No External Data**: No data sent to servers
- **Local Storage Only**: All data stays in your browser
- **No Analytics**: No tracking or telemetry

## 📄 License

This project is free to use for personal and commercial purposes.

## 🤝 Contributing

Feel free to fork, modify, and use this project as you see fit!

Suggestions for improvements:
- Add more syntax highlighting languages
- Implement custom CSS themes
- Add diagram support (Mermaid)
- Export to other formats (DOCX, etc.)
- Add collaborative editing features

## 📝 Changelog

### Version 1.0.0 (Current)
- ✅ Initial release
- ✅ Markdown to HTML conversion
- ✅ Multiple export formats (MD, HTML, PNG, PDF)
- ✅ RTL support
- ✅ 4 themes
- ✅ Syntax highlighting
- ✅ Math rendering
- ✅ Auto-save
- ✅ Fully client-side

## 🙏 Acknowledgments

Built with amazing open-source libraries:
- markdown-it team
- Prism.js contributors  
- KaTeX developers
- html2pdf.js maintainers
- DOMPurify team

## 📞 Support

For issues or questions:
1. Check this README thoroughly
2. Check browser console for errors
3. Try in a different browser
4. Clear cache and try again

---

**Happy writing!** 📝✨

Made with ❤️ using vanilla JavaScript - no frameworks needed!
