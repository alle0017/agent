export function copyToClipboard(message: string) {
      if (!navigator.clipboard) {
            return;
      }
      return navigator.clipboard.writeText(message);
}