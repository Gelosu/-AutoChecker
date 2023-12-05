import React, { useEffect } from 'react';
import { createWorker } from 'tesseract.js';

function TextLocalization1({ imageData, setData }) {
  useEffect(() => {
    if (imageData) {
      localizeText(imageData);
    }
  }, [imageData]);

  const localizeText = async (imageData) => {
    const originalImage = new Image();
    originalImage.src = imageData;

    originalImage.onload = async () => {
      const worker = await createWorker();

      try {
        const { data: allData } = await worker.recognize(originalImage);

        allData.words.forEach((word) => {
          if (/[a-z]/.test(word.text)) {
            word.text = word.text.toUpperCase();
          }
        });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = originalImage.width;
        canvas.height = originalImage.height;

        context.drawImage(originalImage, 0, 0);

        context.strokeStyle = 'blue';
        context.fillStyle = 'orange';
        context.lineWidth = 1;
        context.font = '16px Arial';

        allData.words.forEach((word) => {
          context.strokeRect(
            word.bbox.x0,
            word.bbox.y0,
            word.bbox.x1 - word.bbox.x0,
            word.bbox.y1 - word.bbox.y0
          );

          const displayText = word.text.length > 0 ? word.text : '?';
          context.fillText(displayText, word.bbox.x0 + 20, word.bbox.y0 - 5);
        });

        const imageWithBoxes = canvas.toDataURL('image/jpeg');

        const localizedImageData = {
          allText: allData.text.toUpperCase(),
        };

        // Use the setData callback to update the state in the parent component
        setData(localizedImageData);
      } catch (error) {
        console.error('Error recognizing text:', error);
      } finally {
        await worker.terminate();
      }
    };
  };

  return (
    <div>
      {/* Display your extracted text if needed */}
    </div>
  );
}

export default TextLocalization1;
