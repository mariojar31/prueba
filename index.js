async function uploadFile(file) {
  // Check if file type is supported
  const supportedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
  if (!supportedTypes.includes(file.type)) {
      throw new Error('Unsupported file type');
  }

  // Convert file to base64
  const base64Content = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
          // Get the base64 string without the data URL prefix
          const base64 = reader.result.split(',')[1];
          resolve(base64);
      };
      reader.readAsDataURL(file);
  });

  // API Gateway endpoint
  const apiEndpoint = 'https://ne0sqvfmj6.execute-api.us-east-1.amazonaws.com/dev/upload-archivos';

  try {
      const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
              'Content-Type': file.type,
              'Accept': 'application/json'
          },
          body: base64Content
      });

      const result = await response.json();
      return result;
  } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
  }
}

// Example usage with file input
document.getElementById('fileInput').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  try {
      const result = await uploadFile(file);
      console.log('Upload successful:', result);
  } catch (error) {
      console.error('Upload failed:', error);
  }
});
