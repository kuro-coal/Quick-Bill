/**
 * Client-side HTML5 Canvas image resizer and compressor.
 * Resizes uploaded PNG, JPG, WEBP, or SVG logos to max 400px width
 * while preserving aspect ratio and alpha transparency for PNG/WEBP/SVG.
 */
export function processLogoFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
    const extOk = /\.(png|jpe?g|webp|svg)$/i.test(file.name || '');
    if (!validTypes.includes(file.type) && !extOk) {
      reject(new Error('Please upload a PNG, JPG, WEBP, or SVG image.'));
      return;
    }

    const isSvg = file.type === 'image/svg+xml' || /\.svg$/i.test(file.name || '');
    const isTransparentType =
      isSvg ||
      file.type === 'image/png' ||
      file.type === 'image/webp' ||
      /\.(png|webp)$/i.test(file.name || '');

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the selected image file.'));

    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) {
        reject(new Error('Empty image file.'));
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error('Invalid or unsupported image file.'));
      img.onload = () => {
        try {
          const MAX_W = 400;
          const MAX_H = 400;
          let w = img.naturalWidth || img.width || 400;
          let h = img.naturalHeight || img.height || 200;

          if (w > MAX_W) {
            h = Math.round(h * (MAX_W / w));
            w = MAX_W;
          }
          if (h > MAX_H) {
            w = Math.round(w * (MAX_H / h));
            h = MAX_H;
          }
          w = Math.max(1, w);
          h = Math.max(1, h);

          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context unavailable.'));
            return;
          }

          if (!isTransparentType) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, w, h);
          } else {
            ctx.clearRect(0, 0, w, h);
          }

          ctx.drawImage(img, 0, 0, w, h);

          const outputDataUrl = isTransparentType
            ? canvas.toDataURL('image/png')
            : canvas.toDataURL('image/jpeg', 0.85);

          resolve(outputDataUrl);
        } catch {
          reject(new Error('Could not resize or compress logo image.'));
        }
      };
      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  });
}
