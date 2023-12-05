import os
import cv2
import numpy as np
import imutils
from skimage.filters import threshold_local

def preprocess0(image, upload_folder, app):
    
    image = imutils.resize(image, height=image.shape[0])

    # Grayscale
    gray_type_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    grayscale_filename = os.path.join(upload_folder, f'image8grayscale.jpg')
    cv2.imwrite(grayscale_filename, gray_type_image)

    # Noise Reduction
    _, threshold = cv2.threshold(gray_type_image, 0, 255, cv2.THRESH_OTSU)
    threshold_filename = os.path.join(upload_folder, f'image9threshold.jpg')
    cv2.imwrite(threshold_filename, threshold)

    # Dilation
    kernel = np.ones((1, 2), np.uint8)
    dilate = cv2.dilate(threshold, kernel, iterations=1)
    dilate_filename = os.path.join(upload_folder, f'image10dilate.jpg')
    cv2.imwrite(dilate_filename, dilate)

    # Morphological opening
    kernel = np.ones((2, 3), np.uint8)
    opening = cv2.morphologyEx(dilate, cv2.MORPH_OPEN, kernel)
    opening_filename = os.path.join(upload_folder, f'image11opening.jpg')
    cv2.imwrite(opening_filename, opening)

    # Erosion
    kernel = np.ones((2, 3), np.uint8)
    erode = cv2.erode(opening, kernel, iterations=1)
    erode_filename = os.path.join(upload_folder, f'image12erode.jpg')
    cv2.imwrite(erode_filename, erode)
    
    # Morphological closing
    kernel = np.ones((3, 3), np.uint8)
    closing = cv2.morphologyEx(erode, cv2.MORPH_CLOSE, kernel)
    # crop_left = int(closing.shape[1] * 0.18)
    # closing = closing[:, crop_left:]
    closing_filename = os.path.join(upload_folder, f'image13closing.jpg')
    cv2.imwrite(closing_filename, closing)

    margin_size = 30
    closing = closing[margin_size:-margin_size, margin_size:-margin_size]
    
    crop_left = int(closing.shape[1] * 0.18)
    closing = closing[:, crop_left:]
    
    cropped_filename = os.path.join(upload_folder, f'image14cropped.jpg')
    cv2.imwrite(cropped_filename, closing)

    return closing
