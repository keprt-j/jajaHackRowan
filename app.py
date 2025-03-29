from flask import Flask
from model import load_image
from flask import Flask, request, jsonify  
import os
import joblib
import aimodel

app = Flask(__name__)

knn_model = joblib.load('random_forest_model.joblib')
label_encoder = joblib.load('label_encoder.joblib')

@app.route('/', methods=['GET', 'POST']) 
def hello_world():

        file = request.files['file']  

        file.save(f"/tmp/{file.filename}")

        features, _ = load_image(f"/tmp/{file.filename}")

        prediction = knn_model.predict([features])
        predicted_label = label_encoder.inverse_transform(prediction)[0]

        results = aimodel.process_image(f"/tmp/{file.filename}")

        if os.path.exists(f"/tmp/{file.filename}"):
                os.remove(f"/tmp/{file.filename}")
        
        return jsonify({
                "status": "success",
                "prediction": predicted_label,
                "filename": file.filename,
                "results": results
        })

@app.route('/test')
def test():
    return jsonify({'message': 'Test route works!'})

@app.route('/predict', methods=['POST'])
def predict():
    return jsonify({'message': 'POST request received!'})

if __name__ == "__main__":
    app.run()