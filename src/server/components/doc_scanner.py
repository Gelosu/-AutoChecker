import cv2
import os
import imutils
from imutils.perspective import four_point_transform
import numpy as np

def document_scanner(image, upload_folder):

    image = imutils.resize(image, height=image.shape[0])
    ratio = image.shape[0] / image.shape[0]
    orig = image.copy()

    kernel = np.ones((7,7),np.uint8)
    img = cv2.morphologyEx(image, cv2.MORPH_CLOSE, kernel, iterations=3)
    img_filename = os.path.join(upload_folder, 'image2.0_morph.jpg')
    cv2.imwrite(img_filename, img)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (11, 11), 0)
    edged = cv2.Canny(gray, 0, 200)
    edged = cv2.dilate(edged, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
    edged_filename = os.path.join(upload_folder, 'image2.1_edged.jpg')
    cv2.imwrite(edged_filename, edged)

    blur = cv2.GaussianBlur(gray, (5, 5), 0)

    _, threshold = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    threshold_filename = os.path.join(upload_folder, 'image2.2_thresholded.jpg')
    cv2.imwrite(threshold_filename, threshold)

    # find the contours in the edged image, keeping only the largest ones, and initialize the screen contour
    cnts = cv2.findContours(edged, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)
    cnts = sorted(cnts, key=cv2.contourArea, reverse=True)[:5]

    screenCnt = None  # Initialize screenCnt to None

    for c in cnts:
        peri = cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, 0.02 * peri, True)

        if len(approx) == 4:
            screenCnt = approx
            break

    if screenCnt is None:  # If screenCnt is not found, try using contours in the threshold image
        cnts = cv2.findContours(threshold, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        cnts = imutils.grab_contours(cnts)
        cnts = sorted(cnts, key=cv2.contourArea, reverse=True)[:5]

        for c in cnts:
            peri = cv2.arcLength(c, True)
            approx = cv2.approxPolyDP(c, 0.02 * peri, True)

            if len(approx) == 4:
                screenCnt = approx
                break

    if screenCnt is not None:
        cv2.drawContours(image, [screenCnt], -1, (0, 255, 0), 2)
        cnts_filename = os.path.join(upload_folder, 'image3_cnts.jpg')
        cv2.imwrite(cnts_filename, image)

        # Apply four-point perspective transform to the original image
        warped = four_point_transform(orig, screenCnt.reshape(4, 2) * ratio)
        margin = 10
        warped_cropped = warped[margin:-margin, margin:-margin]
        warped_filename = os.path.join(upload_folder, 'image4_warped.jpg')
        cv2.imwrite(warped_filename, warped_cropped)

        return warped_filename
    else:
        return None  # Return None if screenCnt is not found
