# utils/auth.py
from ultralytics import YOLO
import pytesseract
from PIL import Image
import cv2

model = YOLO('yolo')
