from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import cv2
from components.doc_scanner import document_scanner 
from components.box_scanner import box_scanner
from components.preprocess import preprocess0
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads1'
app.config['UPLOAD_FOLDER1'] = UPLOAD_FOLDER

UPLOAD_FOLDER = 'uploads2'
app.config['UPLOAD_FOLDER2'] = UPLOAD_FOLDER

UPLOAD_FOLDER = 'uploads3'
app.config['UPLOAD_FOLDER3'] = UPLOAD_FOLDER

@app.route('/post-test1', methods=['POST'])
def post_image1():
    if 'image' not in request.files:
        return jsonify({'error': 'No image part'})
    
    image = request.files['image']
    if image.filename == '':
        return jsonify({'error': 'No selected image'})
    
    if image:
        filename = os.path.join(app.config['UPLOAD_FOLDER1'], 'image1_original.jpg')
        image.save(filename)
        image = cv2.imread(filename)

        cropped_filename = document_scanner(image, app.config['UPLOAD_FOLDER1'])
        image = cv2.imread(cropped_filename)
        cropped_filename2 = box_scanner(image, app.config['UPLOAD_FOLDER1'])
        image = cv2.imread(cropped_filename2)
        # Preprocess
        preprocess0(image, app.config['UPLOAD_FOLDER1'], app)

        return jsonify({'message': 'Image uploaded successfully'})

@app.route('/get-test1', methods=['GET'])
def get_image1():
    processed_image_path = os.path.join(app.config['UPLOAD_FOLDER1'], 'image14cropped.jpg')

    if not os.path.exists(processed_image_path):
        return jsonify({'error': 'Processed image not found'})

    return send_file(processed_image_path, as_attachment=True)

@app.route('/post-test2', methods=['POST'])
def post_image2():
    if 'image' not in request.files:
        return jsonify({'error': 'No image part'})
    
    image = request.files['image']
    if image.filename == '':
        return jsonify({'error': 'No selected image'})
    
    if image:
        filename = os.path.join(app.config['UPLOAD_FOLDER2'], 'image1_original.jpg')
        image.save(filename)
        image = cv2.imread(filename)

        cropped_filename = document_scanner(image, app.config['UPLOAD_FOLDER2'])
        image = cv2.imread(cropped_filename)
        cropped_filename2 = box_scanner(image, app.config['UPLOAD_FOLDER2'])
        image = cv2.imread(cropped_filename2)
        # Preprocess
        preprocess0(image, app.config['UPLOAD_FOLDER2'], app)

        return jsonify({'message': 'Image uploaded successfully'})

@app.route('/get-test2', methods=['GET'])
def get_image2():
    processed_image_path = os.path.join(app.config['UPLOAD_FOLDER2'], 'image14cropped.jpg')

    if not os.path.exists(processed_image_path):
        return jsonify({'error': 'Processed image not found'})

    return send_file(processed_image_path, as_attachment=True)

@app.route('/post-test3', methods=['POST'])
def post_image3():
    if 'image' not in request.files:
        return jsonify({'error': 'No image part'})
    
    image = request.files['image']
    if image.filename == '':
        return jsonify({'error': 'No selected image'})
    
    if image:
        filename = os.path.join(app.config['UPLOAD_FOLDER3'], 'image1_original.jpg')
        image.save(filename)
        image = cv2.imread(filename)

        cropped_filename = document_scanner(image, app.config['UPLOAD_FOLDER3'])
        image = cv2.imread(cropped_filename)
        cropped_filename2 = box_scanner(image, app.config['UPLOAD_FOLDER3'])
        image = cv2.imread(cropped_filename2)
        # Preprocess
        preprocess0(image, app.config['UPLOAD_FOLDER3'], app)

        return jsonify({'message': 'Image uploaded successfully'})

@app.route('/get-test3', methods=['GET'])
def get_image3():
    processed_image_path = os.path.join(app.config['UPLOAD_FOLDER3'], 'image14cropped.jpg')

    if not os.path.exists(processed_image_path):
        return jsonify({'error': 'Processed image not found'})

    return send_file(processed_image_path, as_attachment=True)

if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(debug=True, port=3002)