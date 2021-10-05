from PIL import Image
import pytesseract
import os

base_path = '/home/lucky/lucky/project/himatro-web-app/uploads/ocrImage/'

def get_text_from_image(image_name):
    file_path = os.path.join(base_path, image_name)
    try:
        img = Image.open(file_path)
        text = pytesseract.image_to_string(img)
        text = text.replace('\n', ' ')
        text = text.replace('  ', '')
        text = text.replace(' ', ',')

        return text
    except Exception as e:
        raise Exception('Failed to extract text from image, probably caused by img not found error.')