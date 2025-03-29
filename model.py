from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from PIL import Image
from imutils import paths
import numpy as np
import argparse
import os
from flask import Flask
from joblib import dump

models = {
    "random_forest": RandomForestClassifier(n_estimators=100),
}

ap = argparse.ArgumentParser()
ap.add_argument("-d", "--dataset", type=str, default="dataset",
    help="path to directory containing the '3scenes' dataset")
ap.add_argument("-m", "--model", type=str, default="knn", help="type of pythoargs = vars(ap.parse_args())use")

def color_stats(image):
    (R, G, B) = image.split()
    features = [np.mean(R), np.mean(G), np.mean(B), np.std(R),
        np.std(G), np.std(B)]
    return features

def symmetry_stats(image):

    gray = image.convert("L")
    np_image = np.array(gray)

    mid = np_image.shape[1] // 2
    left_half = np_image[:, :mid]
    right_half = np_image[:, mid:]

    right_half_flipped = np.fliplr(right_half)

 
    symmetry_diff = np.abs(left_half - right_half_flipped)
    mean_symmetry = np.mean(symmetry_diff)
    std_symmetry = np.std(symmetry_diff)

    # Return symmetry features as a vector
    features = [mean_symmetry, std_symmetry]
    return features

def load_image(image_path):
        """
        Load images from the dataset, extract features, and prepare labels.
        """
        # Load the image
        image = Image.open(image_path)  # Resize for consistency

        color_features = color_stats(image)
        symmetry_features = symmetry_stats(image)
        features = color_features + symmetry_features

        label = image_path.split(os.path.sep)[-2]

        return features, label

def load_dataset(dataset_path):
    """
    Load images from the dataset, extract features, and prepare labels.
    """
    image_paths = list(paths.list_images(dataset_path))
    data = []
    labels = []

    for image_path in image_paths:
        # Load the image
        image = Image.open(image_path)  # Resize for consistency

        color_features = color_stats(image)
        symmetry_features = symmetry_stats(image)
        features = color_features + symmetry_features

        label = image_path.split(os.path.sep)[-2]
        labels.append(label)
        data.append(features)

    return np.array(data), np.array(labels)

if __name__ == "__main__":

        train_path = os.path.join("dataset", "train")
        test_path = os.path.join("dataset", "test")

        print("[INFO] Loading training data...")
        X_train, y_train = load_dataset(train_path)

        print("[INFO] Loading testing data...")
        X_test, y_test = load_dataset(test_path)

        # Encode the labels as integers
        le = LabelEncoder()
        y_train = le.fit_transform(y_train)
        y_test = le.transform(y_test)

        # Train the selected model
        model_name = "random_forest"
        model = models[model_name]

        print(f"[INFO] Training the {model_name} model...")
        model.fit(X_train, y_train)

        # Save the model and encoder

        dump(model, f'{model_name}_model.joblib')
        dump(le, 'label_encoder.joblib')

        # Evaluate the model
        print("[INFO] Evaluating the model...")
        predictions = model.predict(X_test)
        print(classification_report(y_test, predictions, target_names=le.classes_))

        load_dataset("dataset/data")
