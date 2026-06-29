# SnapPDF

SnapPDF is a modern React + Vite web app for converting multiple images into a PDF and extracting PDF pages into separate images. Every conversion runs locally in the browser, so files are never uploaded to a server.

## Features

- Convert JPG, JPEG, PNG, and WEBP images into a PDF
- Reorder images with drag-and-drop
- Preview image metadata, rotate images, zoom previews, remove items, and clear batches
- Customize PDF paper size, orientation, margins, image fit, and image quality
- Preview and download the generated PDF
- Convert PDF pages into PNG, JPG, or WEBP images
- Choose extraction quality and resolution: 72 DPI, 150 DPI, or 300 DPI
- Download individual extracted images or all images as a ZIP
- Recent conversion history stored in Local Storage
- Light and dark mode with saved preference
- Toast notifications, progress indicators, responsive layouts, and keyboard-friendly controls

## Privacy

SnapPDF uses browser APIs, PDF-lib, pdf.js, JSZip, and FileSaver.js for client-side conversion. No files are uploaded, transmitted, or stored on a server.

## Tech Stack

- React.js + Vite
- Tailwind CSS
- JavaScript
- PDF-lib
- pdf.js
- JSZip
- FileSaver.js
- Framer Motion
- Lucide React Icons

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```text
src/
  assets/
  components/
  pages/
  hooks/
  utils/
  services/
  context/
  App.jsx
  main.jsx
```

## Notes

Recent file repeat downloads are stored in Local Storage only when generated outputs fit within browser storage limits. Large outputs remain downloadable immediately after conversion, but may not be saved for repeat download.
