from flask import Flask
from model import load_image, symmetry_stats, color_stats
from contours import process_image
from flask import Flask, request, jsonify  # Added jsonify import
import os
import joblib
from PIL import Image
import cv2, base64
import numpy as np

app = Flask(__name__)

#it is called knn_model because idk how do do replace all in nano
knn_model = joblib.load('random_forest_model.joblib')
label_encoder = joblib.load('label_encoder.joblib')

@app.route('/', methods=['GET', 'POST'])  # Added GET for standard root access
def hello_world():
        file = request.files['file']  # Matches the 'file' in your curl -F "file=@1.jpg"

        # Save to /tmp with original filename
        file.save(f"/tmp/{file.filename}")

        features, _ = load_image(f"/tmp/{file.filename}")
        # return jsonify({"message": "HEllow4 World"})

        color_features = color_stats(Image.open(f"/tmp/{file.filename}"))
        symmetry_features = symmetry_stats(Image.open(f"/tmp/{file.filename}"))
        combined_features = color_features + symmetry_features

        prediction = knn_model.predict([features])
        predicted_label = label_encoder.inverse_transform(prediction)[0]
        probas = knn_model.predict_proba([combined_features])[0]

        confidence = probas[prediction[0]]

        #confidence = {
        #       "benign": probas[prediction[0]],
        #       "malignant": probas[prediction[0]]
        #}

        #confidence = probs[prediction[0]]
        region, image_with_rect = process_image(f"/tmp/{file.filename}")
        _, img_encoded = cv2.imencode(".jpg", image_with_rect)
        img_base64 = base64.b64encode(img_encoded).decode("utf-8")

        if os.path.exists(f"/tmp/{file.filename}"):
                os.remove(f"/tmp/{file.filename}")

        return jsonify({
                "status": "success",
                "prediction": predicted_label,
                "filename": file.filename,
                "confidence": float(confidence),
                "color_features": [float(x) for x in color_features],  # Convert numpy to native Python
                "symmetry_features": [float(x) for x in symmetry_features],
                "regions": region,
                "image": img_base64
        })



#       return jsonify({'message': 'Hello World!'})

@app.route('/test')
def test():
    return jsonify({'message': 'Test route works!'})

@app.route('/predict', methods=['POST'])
def predict():
    return jsonify({'message': 'POST request received!'})

if __name__ == "__main__":
    app.run()
