# recommendations/model_utils.py
import joblib
import tensorflow as tf
import numpy as np

# Load model and preprocessor
model = tf.keras.models.load_model('model.h5')
preprocessor = joblib.load('preprocessor.pkl')
label_encoder = joblib.load('label_encoder.pkl')

def make_prediction(input_data):
    processed_data = preprocessor.transform(input_data)
    predictions = model.predict(processed_data)
    predicted_classes = np.argmax(predictions, axis=1)
    recommendations = label_encoder.inverse_transform(predicted_classes)
    return recommendations
