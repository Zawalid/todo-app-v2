import { toast } from 'sonner';

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
export function checkIsEmailValid(email) {
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(email);
}
export function copyToClipBoard(text) {
  navigator.clipboard.writeText(text);
  toast.success('Copied to clipboard');
}
export function exportDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
