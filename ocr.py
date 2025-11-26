import sys, os, re, math, io, zipfile, pathlib, shutil
from typing import List, Tuple
import numpy as np

try:
    import cv2
except Exception:
    !pip -q install opencv-python-headless
    import cv2


have_rapid = True
try:
    from rapidocr_onnxruntime import RapidOCR
except Exception:
    try:
        !pip -q install rapidocr-onnxruntime
        from rapidocr_onnxruntime import RapidOCR
    except Exception:
        have_rapid = False


have_easy = True
try:
    import easyocr
except Exception:
    try:
        !pip -q install easyocr
        import easyocr
    except Exception:
        have_easy = False

from google.colab import files
import matplotlib.pyplot as plt



INDIA_PLATE = re.compile(r"^[A-Z]{2}\d{1,2}[A-Z]{0,2}\d{4}$")
BAD_TOKENS = {
    "SHUTTERSTOCK","IMAGEID","WWW","COM","STOCK","GETTY","ALAMY","PIXABAY",
    "INDIA","IND","BHARAT","KIA","MARUTI","SUZUKI","HONDA","TOYOTA","MAHINDRA"
}

def clean_text(t: str) -> str:
    t = t.upper()
    t = re.sub(r"[^A-Z0-9\- ]", "", t)
    t = t.replace(" ", "").replace("-", "")
    return t

def poly_to_xyxy(poly) -> Tuple[float,float,float,float]:
    # poly can be 4 points [[x,y],...]
    xs = [p[0] for p in poly]
    ys = [p[1] for p in poly]
    return float(min(xs)), float(min(ys)), float(max(xs)), float(max(ys))

def aspect_ratio(x1,y1,x2,y2):
    w = max(1.0, x2 - x1)
    h = max(1.0, y2 - y1)
    return w / h

def center_distance_weight(img_w, img_h, x1,y1,x2,y2):
    # Plates are often near horizontal center & bottom half.
    cx = (x1 + x2) / 2.0
    cy = (y1 + y2) / 2.0
    dx = abs(cx - img_w/2) / (img_w/2)
    dy = max(0.0, (cy - img_h*0.45) / (img_h*0.55))  # prefers lower half lightly
    # Small penalty; closer to 0 is better.
    return 1.0 - 0.25*dx - 0.15*dy

def score_candidate(txt: str, conf: float, box, img_shape) -> float:
    h, w = img_shape[:2]
    x1,y1,x2,y2 = box
    ar = aspect_ratio(x1,y1,x2,y2)
    cleaned = clean_text(txt)
    length = len(cleaned)

    s = 0.0
    # Base on confidence
    s += float(conf)

    # Regex match for India format is a big boost
    if INDIA_PLATE.match(cleaned):
        s += 0.8

    # Penalize obvious brand/watermark/site tokens
    if any(bad in cleaned for bad in BAD_TOKENS):
        s -= 0.7

    # Prefer plausible length (6~10 chars)
    if 6 <= length <= 10:
        s += 0.2
    elif length < 4 or length > 12:
        s -= 0.2

    # Prefer wide-ish aspect ratios typical for plates
    if 2.0 <= ar <= 6.0:
        s += 0.2
    else:
        s -= 0.1

    # Gentle bias to lower/center area
    s += 0.2 * center_distance_weight(w, h, x1,y1,x2,y2)

    return s

def draw_annotation(img, box, text):
    x1,y1,x2,y2 = map(int, box)
    out = img.copy()
    cv2.rectangle(out, (x1,y1), (x2,y2), (0,255,0), 2)
    y_text = max(0, y1-10)
    cv2.putText(out, text, (x1, y_text), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0,255,0), 2, cv2.LINE_AA)
    return out

def run_rapidocr(image_bgr) -> List[Tuple[Tuple[float,float,float,float], str, float]]:
    """Returns list of (xyxy_box, text, score)"""
    engine = RapidOCR()
    # RapidOCR accepts path or ndarray (BGR). Use ndarray.
    result, _ = engine(image_bgr)
    out = []
    if result:
        for item in result:
            # Expected: [box(4x2), text, score]
            box_poly, txt, sc = item[0], item[1], float(item[2])
            x1,y1,x2,y2 = poly_to_xyxy(box_poly)
            out.append(((x1,y1,x2,y2), txt, sc))
    return out

def run_easyocr(image_bgr) -> List[Tuple[Tuple[float,float,float,float], str, float]]:
    """Returns list of (xyxy_box, text, score)"""
    reader = easyocr.Reader(['en'], gpu=True)
    res = reader.readtext(image_bgr)  # each: [bbox, text, conf]
    out = []
    for bbox, txt, sc in res:
        # bbox is 4 points
        x1,y1,x2,y2 = poly_to_xyxy(bbox)
        out.append(((x1,y1,x2,y2), txt, float(sc)))
    return out

def best_plate(image_bgr, detections):
    if not detections:
        return None
    scored = []
    for (box, txt, sc) in detections:
        s = score_candidate(txt, sc, box, image_bgr.shape)
        scored.append((s, box, txt, sc))
    scored.sort(key=lambda x: x[0], reverse=True)
    return scored[0]  # (score, box, txt, conf)



print("Upload 1–3 plate/car images (JPG/PNG).")
up = files.upload()
os.makedirs("inputs", exist_ok=True)
paths = []
for name, data in up.items():
    p = os.path.join("inputs", name)
    with open(p, "wb") as f:
        f.write(data)
    paths.append(p)

for p in paths:
    img = cv2.imread(p)
    if img is None:
        print(f"\n[!] Could not read image: {p}")
        continue

    detections = []
    used = ""

    if have_rapid:
        try:
            detections = run_rapidocr(img)
            used = "RapidOCR (PP-OCR ONNX)"
        except Exception as e:
            detections = []
    if not detections and have_easy:
        try:
            detections = run_easyocr(img)
            used = "EasyOCR (fallback)"
        except Exception as e:
            detections = []

    if not detections:
        print(f"\nImage: {os.path.basename(p)}")
        print("No text detected. Try a closer/clearer plate photo.")
        continue

    winner = best_plate(img, detections)
    score, box, raw_text, conf = winner
    cleaned = clean_text(raw_text)
    is_india = bool(INDIA_PLATE.match(cleaned))
    ann = draw_annotation(img, box, cleaned if is_india else raw_text)

    print(f"Image: {os.path.basename(p)}")
    print(f"Engine used: {used}")
    print("All detections (text :: conf) [top 8]:")
    for (b, t, c) in sorted(detections, key=lambda x: x[2], reverse=True)[:8]:
        print(f"  {t} :: {c:.3f}")

    print(f"\nPredicted plate (cleaned): {cleaned}")
    print(f"Confidence (detector): {conf:.3f}")
    print(f"India format valid?: {'True' if is_india else 'False'}")

    # Show annotated preview
    rgb = cv2.cvtColor(ann, cv2.COLOR_BGR2RGB)
    plt.figure(figsize=(10,6))
    plt.imshow(rgb); plt.axis('off'); plt.show()
