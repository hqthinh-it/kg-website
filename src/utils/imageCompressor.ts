/**
 * Multi-purpose client-side image compressor using HTML Canvas
 * Reduces file sizes dramatically before storing in LocalStorage or cloud DBs.
 */
export function compressImage(
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // Draw image to canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string || '');
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to data URL with JPEG compression
        try {
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (err) {
          // If canvas taint or other issues occur, return original
          resolve(event.target?.result as string || '');
        }
      };

      img.onerror = () => {
        resolve(event.target?.result as string || '');
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Lỗi khi đọc file ảnh.'));
    };

    reader.readAsDataURL(file);
  });
}
