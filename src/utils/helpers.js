import TurndownService from 'turndown';
import { jsPDF } from 'jspdf';

const turndownService = new TurndownService();

export function isTouchDevice() {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints ||
    window.matchMedia('(pointer: coarse)').matches
  );
}
export function isElementEmpty(htmlElement) {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = htmlElement;
  return !tempElement.textContent.trim();
}
export function getDeletionMessage(element, status, singular, selected, number) {
  if (status === 'success') {
    if ((selected && number === 1) || singular)
      return `${element.charAt(0).toUpperCase() + element.slice(1)} has been successfully deleted.`;
    if (selected && number > 1) return `${number} ${element}s have been successfully deleted`;
    return `All ${element}s have been successfully deleted.`;
  }
  if (status === 'error') {
    if ((selected && number === 1) || singular) return `Failed to delete the ${element}.`;
    if (selected && number > 1) return `Failed to delete the ${element}s.`;
    return `Failed to delete all ${element}s.`;
  }
}

export const exportAs = (format, editor, title) => {
  const formats = {
    text: {
      filename: `${title}.txt`,
      content: editor.getText(),
      type: 'text/plain',
    },
    html: {
      filename: `${title}.html`,
      content: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body>
  <h1>${title}</h1>
  ${editor.getHTML()}
</body>
</html>
      `,
      type: 'text/html',
    },
    markdown: {
      filename: `${title}.md`,
      content: turndownService.turndown(
        `<h1>${title}</h1>
         ---
        ${editor.getHTML()}`,
      ),
      type: 'text/markdown',
    },
  };

  if (format === 'pdf') return exportAsPDF(title);

  const { filename, content, type } = formats[format];

  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const exportAsPDF = (title) => {
  const content = document.querySelector('.tiptap');
  content.querySelector('#info').classList.add('hidden');
  const doc = new jsPDF();
  doc.html(content, {
    callback: function (doc) {
      doc.save(`${title}.pdf`);
      content.querySelector('#info').classList.remove('hidden');
    },
    x: 15,
    y: 15,
    width: 170,
    windowWidth: 650,
  });
};
