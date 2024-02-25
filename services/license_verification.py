from roboflow import Roboflow
from PIL import Image
import os
from inference.models.utils import get_model
import numpy as np
import pytesseract

class LicenseVerificationService:
    def __init__(self, api_key, project_id, version, output_dir='../data/cropped_faces'):
        self.api_key = api_key
        self.project_id = project_id
        self.version = version
        self.output_dir = output_dir
        self.model = self.load_model()
        os.makedirs(self.output_dir, exist_ok=True)

    def load_model(self):
        model = get_model(model_id=f"{self.project_id}/{self.version}", api_key=self.api_key)
        return model

    def predict(self, image_path):
        predictions = self.model.infer(image=image_path)
        return predictions 
    
    def extract_text_with_ocr(self, image_path, bbox):
        """
        Extracts text from a specified region (bbox) of an image.
        """
        image = Image.open(image_path)
        cropped_region = image.crop(bbox)
        text = pytesseract.image_to_string(cropped_region, lang='eng')
        return text.strip()

    def extract_details(self, image_path):
        response = self.predict(image_path)
        
        extraction_successful = False
        extracted_info = {
            'First name': None,
            'Last name': None,
            'Exp Date': None,
        }

        if response:
            for inference_response in response:
                predictions = getattr(inference_response, 'predictions', [])
                for prediction in predictions:
                    pred_dict = prediction.__dict__ if hasattr(prediction, '__dict__') else {}
                    class_name = pred_dict.get('class_name', '')
                    if class_name in extracted_info:
                        bbox = (pred_dict.get('x', 0) - pred_dict.get('width', 0) / 2,
                                pred_dict.get('y', 0) - pred_dict.get('height', 0) / 2,
                                pred_dict.get('x', 0) + pred_dict.get('width', 0) / 2,
                                pred_dict.get('y', 0) + pred_dict.get('height', 0) / 2)

                        # Perform OCR for specified classes
                        if class_name in ['First name', 'Last name', 'Exp Date']:
                            extracted_text = self.extract_text_with_ocr(image_path, bbox)
                            if extracted_text is not None and len(extracted_text) > 0:
                                extracted_info[class_name] = extracted_text
                                extraction_successful = True
        
        return extraction_successful, extracted_info