from fastapi import FastAPI, Cookie
import jwt
from pydantic import BaseModel

from decode_jwt import decode_jwt_token
from ocr import get_text_from_image

class OCRPayload(BaseModel):
    jwt: str

app = FastAPI()

@app.post('/simple-ocr')
def simple_ocr(payload: OCRPayload):
    try:
        jwt = decode_jwt_token(payload.jwt)
    except Exception as e:
        return {"status_code":401}

    try:
        text = get_text_from_image(jwt['filename'])
        return {"status_code":200, "text":text}
    except Exception as e:
        return {"status_code":400, "message":'Failed to get extract text. May caused by file not found.'}