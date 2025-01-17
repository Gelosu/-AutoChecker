import React, { useEffect, useState } from 'react';
import { createWorker } from 'tesseract.js';

function TextLocalization({ imageData }) {
  const [localizedImageData, setLocalizedImageData] = useState(null);
  const [localizedImageWithBoxes, setLocalizedImageWithBoxes] = useState(null);

  useEffect(() => {
    if (imageData) {
      localizeText(imageData);
    }
  }, [imageData]);

  const localizeText = async (imageData) => {
    // Load the original image as an HTMLImageElement
    const originalImage = new Image();
    originalImage.src = imageData;

    originalImage.onload = async () => {
      const worker = await createWorker();
      
      // Set additional parameters for Tesseract
      worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,. ) ',
      });

      try {
        const { data } = await worker.recognize(originalImage);

        // Create a new canvas to draw the image
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        // Set canvas dimensions to match the image
        canvas.width = originalImage.width;
        canvas.height = originalImage.height;

        // Draw the original image on the canvas
        context.drawImage(originalImage, 0, 0);

        // Draw red boxes around words and display red text above each box
        context.strokeStyle = 'green';
        context.fillStyle = 'red';
        context.lineWidth = 1;
        context.font = '16px Arial';

        data.words.forEach((word) => {
          // Draw the red box
          context.strokeRect(
            word.bbox.x0,
            word.bbox.y0,
            word.bbox.x1 - word.bbox.x0,
            word.bbox.y1 - word.bbox.y0
          );

          // Display red text above the box
          context.fillText(word.text, word.bbox.x0, word.bbox.y0 - 5);
        });

        // Convert canvas to base64 image data
        const imageWithBoxes = canvas.toDataURL('image/jpeg');

        setLocalizedImageData(data.text);
        setLocalizedImageWithBoxes(imageWithBoxes);
      } catch (error) {
        console.error('Error recognizing text:', error);
      } finally {
        await worker.terminate();
      }
    };
  };

  return (
    <div>
      {localizedImageData && (
        <div>
          <h2>Localized Image:</h2>
          <img
            src={localizedImageWithBoxes}
            alt="Localized"
            style={{ maxWidth: '100%' }}
          />
        </div>
      )}
    </div>
  );
}

export default TextLocalization;
