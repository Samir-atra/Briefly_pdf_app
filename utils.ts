export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
};

export const fetchPdfFromUrl = async (url: string): Promise<{ name: string; data: string }> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }
    const blob = await response.blob();
    if (blob.type !== 'application/pdf') {
      throw new Error('URL does not point to a valid PDF file');
    }
    
    // Convert blob to file-like object to reuse base64 logic or just read blob
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.readAsDataURL(blob);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const base64 = reader.result.split(',')[1];
          // Try to derive name from URL
          const urlParts = url.split('/');
          const name = urlParts[urlParts.length - 1] || 'downloaded.pdf';
          resolve({ name, data: base64 });
        } else {
          reject(new Error('Failed to convert blob to base64'));
        }
      };
      reader.onerror = (e) => reject(e);
    });
  } catch (error: any) {
    // Check for CORS error indicators (simplistic check)
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('CORS Error: Cannot access this URL directly due to browser security. Please download the file and upload it manually.');
    }
    throw error;
  }
};
