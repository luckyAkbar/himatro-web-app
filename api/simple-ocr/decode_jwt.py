import jwt
from environs import Env

env = Env()
env.read_env()
secret = env('SECRET_JWT_TOKEN')

def decode_jwt_token(jwt_token):
    try:
        decoded = jwt.decode(jwt_token, secret, algorithms='HS256')
        return decoded
    except Exception as e:
        print(e)
        raise Exception('Failed to decode JWT Token')