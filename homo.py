import json
from phe import paillier

# Generate keys
public_key, private_key = paillier.generate_paillier_keypair()

# Sample JSON data
data = {
    "age": 35, 
    "height": 170,
    "weight": 80,
}

print("Original data:", data)

# Encrypt data
encrypted = {}
for k,v in data.items():
    encrypted[k] = public_key.encrypt(v)

# Custom function to convert EncryptedNumber to a string representation
def encrypted_to_string(encrypted_value):
    return f"<phe.paillier.EncryptedNumber: {encrypted_value.ciphertext(False)}, {encrypted_value.exponent}>"

print("Encrypted data:")
for key, value in encrypted.items():
    print(f'{key}: {encrypted_to_string(value)}')



# Perform operation on encrypted data
encrypted["age"] = encrypted["age"] + public_key.encrypt(5) 
encrypted["height"] = encrypted["height"] + public_key.encrypt(20)
encrypted["weight"] = encrypted["weight"] + public_key.encrypt(2) + public_key.encrypt(0.1)

# Decrypt data
decrypted = {}
for k,v in encrypted.items():
    decrypted[k] = private_key.decrypt(v)
    
print("Decrypted data:", decrypted)