from flask import Flask
from model import load_image
from flask import Flask, request, jsonify  # Added jsonify import
import os
import joblib

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

        prediction = knn_model.predict([features])
        predicted_label = label_encoder.inverse_transform(prediction)[0]

        if os.path.exists(f"/tmp/{file.filename}"):
                os.remove(f"/tmp/{file.filename}")

        return jsonify({
                "status": "success",
                "prediction": predicted_label,
                "filename": file.filename
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
