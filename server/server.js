const express = require('express');
const cors = require('cors');
const paillierBigint = require('paillier-bigint')
const bigintConversion = require('bigint-conversion')

const app = express();
const PORT = 3000;
app.use(cors(
    {
        origin: 'http://localhost:5173',
    }
));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function startServer() {
    try {
        const { publicKey, privateKey } = await paillierBigint.generateRandomKeys(3072);
      
        function encryptedToString(encryptedValue) {
            return `${bigintConversion.bigintToHex(encryptedValue)}`;
        }
    
        app.get('/', (req, res) => {
            res.send('Paillier Cryptosystem Server');
        });
        
        function encryptAndSerialize(value) {
            const encrypted = publicKey.encrypt(BigInt(value));
            return {
                value: value,
                encrypted: {
                    ciphertext: bigintConversion.bigintToHex(encrypted)
                },
                serialized: encryptedToString(encrypted)
            };
        }
        
        app.post('/perform', (req, res) => {
            const originalData = req.body.data;
            const additionalData = req.body.additional_data;
        
            const encryptedOriginalData = {};
            const encryptedAdditionalData = {};
            const encryptedSum = {};
            const decryptedSum = {};
        
            for (const k in originalData) {
                encryptedOriginalData[k] = encryptAndSerialize(originalData[k]);
                encryptedAdditionalData[`add_${k}`] = encryptAndSerialize(additionalData[`add_${k}`]);
        
                const encryptedValueOriginal = publicKey.encrypt(BigInt(originalData[k]));
                const encryptedValueAdditional = publicKey.encrypt(BigInt(additionalData[`add_${k}`]));
                const encryptedAddedValue = publicKey.addition(encryptedValueOriginal, encryptedValueAdditional);
                const decryptedAddedValue = privateKey.decrypt(encryptedAddedValue);
        
                encryptedSum[k] = encryptedToString(encryptedAddedValue);
                decryptedSum[k] = decryptedAddedValue.toString();
            }
        
            const response = {
                encrypted_original_data: encryptedOriginalData,
                encrypted_additional_data: encryptedAdditionalData,
                encrypted_sum: encryptedSum,
                decrypted_sum: decryptedSum
            };
            res.json(response);
        });
        
        const votes = [];

        app.post('/vote', (req, res) => {
            const encryptedVote = new paillierBigint.EncryptedNumber(publicKey, BigInt(req.body.vote), BigInt(req.body.exponent));
            votes.push(encryptedVote);
            res.json({ success: true });
        });

        app.get('/tally', (req, res) => {
    
            let sumVotes = publicKey.encrypt(BigInt(0));

            for (const vote of votes) {
                sumVotes = publicKey.addition(sumVotes, vote);
            }

            const result = privateKey.decrypt(sumVotes);
            res.json({ total: result.toString() });
        });

        app.get('/public_key', (req, res) => {
            res.json({ n: publicKey.n.toString() });
        });

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
      console.error("Error during key generation or server start:", error);
    }
}
  
startServer();