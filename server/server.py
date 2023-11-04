from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from phe import paillier
import json

app = Flask(__name__)

cors = CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:5500"}})

public_key, private_key = paillier.generate_paillier_keypair()

def encrypted_to_string(k, encrypted_value):
    return f"{encrypted_value.ciphertext(False)}, {encrypted_value.exponent}"

@app.route('/')
@cross_origin(origin='http://127.0.0.1:5500', headers=['Content-Type'])
def index():
    return "Paillier Cryptosystem Server"

def encrypt_and_serialize(value, key):
    encrypted = public_key.encrypt(value)
    return {
        'value': value,
        'encrypted': {
            'ciphertext': str(encrypted.ciphertext()), 
            'exponent': encrypted.exponent
        },
        'serialized': encrypted_to_string(key, encrypted)
    }

@app.route('/perform', methods=['POST'])
@cross_origin(origin='http://127.0.0.1:5500', headers=['Content-Type'])
def perform_operations():
    data = request.json
    original_data = data['data']
    additional_data = data['additional_data']

    encrypted_original_data = {k: encrypt_and_serialize(v, k) for k, v in original_data.items()}
    encrypted_additional_data = {f'add_{k}': encrypt_and_serialize(v, f'add_{k}') for k, v in additional_data.items()}

    encrypted_sum = {}
    decrypted_sum = {}
    for k in original_data.keys():
        encrypted_value_original = public_key.encrypt(original_data[k])
        encrypted_value_additional = public_key.encrypt(additional_data[f'add_{k}'])
        encrypted_added_value = encrypted_value_original + encrypted_value_additional
        decrypted_added_value = private_key.decrypt(encrypted_added_value)
        
        encrypted_sum[k] = encrypted_to_string(f'sum_{k}', encrypted_added_value)
        decrypted_sum[k] = decrypted_added_value

    response = {
        "encrypted_original_data": encrypted_original_data,
        "encrypted_additional_data": encrypted_additional_data,
        "encrypted_sum": encrypted_sum,
        "decrypted_sum": decrypted_sum
    }
    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True)
