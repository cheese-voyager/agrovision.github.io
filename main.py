import cv2
import numpy as np
import tensorflow as tf

# ==============================
# KONFIGURASI
# ==============================
MODEL_PATH = "soil_model_saved.keras"
IMG_SIZE = 128
CAMERA_INDEX = 0  # 0 = webcam default

# ⚠️ URUTAN HARUS SAMA DENGAN train_ds.class_names
class_names = [
    "Red Soil",
    "Clay Soil",
    "Black Soil",
    "Alluvial Soil"
]

NUM_CLASSES = len(class_names)
print("Loaded classes:", class_names)

# ==============================
# LOAD MODEL
# ==============================
model = tf.keras.models.load_model(MODEL_PATH)
print("Model loaded successfully")

# ==============================
# WEBCAM
# ==============================
cap = cv2.VideoCapture(CAMERA_INDEX)

if not cap.isOpened():
    raise RuntimeError("Webcam tidak bisa dibuka")

print("Webcam started. Press 'q' to quit.")

# ==============================
# MAIN LOOP
# ==============================
while True:
    ret, frame = cap.read()
    if not ret:
        break

    # OpenCV (BGR) -> RGB
    img = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Resize sesuai training
    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))

    # Convert ke float32
    img = img.astype(np.float32)

    # Preprocessing MobileNetV3 (WAJIB SAMA DENGAN TRAINING)
    img = tf.keras.applications.mobilenet_v3.preprocess_input(img)

    # Tambah dimensi batch
    img = np.expand_dims(img, axis=0)

    # Inference
    preds = model.predict(img, verbose=0)[0]
    class_id = np.argmax(preds)
    confidence = preds[class_id]

    label = f"{class_names[class_id]} ({confidence:.2f})"

    # ==============================
    # DISPLAY
    # ==============================
    cv2.putText(
        frame,
        label,
        (20, 40),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 255, 0),
        2
    )

    cv2.imshow("Webcam - Klasifikasi Tanah", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# ==============================
# CLEANUP
# ==============================
cap.release()
cv2.destroyAllWindows()
print("Webcam closed")
