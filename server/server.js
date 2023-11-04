const express = require('express');
const cors = require('cors');
const paillierBigint = require('paillier-bigint')
const bigintConversion = require('bigint-conversion')
const mongoose = require('mongoose');
const User = require('./models/userModel');


require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
const mongoString = process.env.DATABASE_URL

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

        app.post('/vote', async (req, res) => {
            try {
                const encryptedVote = req.body.encryptedVote;
                const name = req.body.name;

                const user = await User.findOne({ name: name });
                if (user) {
                    return res.status(400).json({ message: 'This name has already submitted a vote.' });
                }

                const newUser = new User({
                    name: name,
                    vote: encryptedVote
                });

                await newUser.save();
                
                res.status(200).json({ message: 'Voting Success' });
            } catch (error) {
                res.status(400).json({ message: 'Invalid vote format' });
            }
        });

        app.post('/checkvote', async (req, res) => {
            try {
                const { encryptedVote } = req.body;
                const nonHexVote = bigintConversion.hexToBigint(encryptedVote);
                const vote = privateKey.decrypt(nonHexVote);
                const voteHex = vote.toString();
                res.status(200).json({ voteHex: voteHex});
            } catch {
                res.status(400).json({ message: 'Invalid vote format' });
            }
        });

        app.get('/tally', async (req, res) => {
            try {
                const users = await User.find({});
                const allVotes = users.map((user) => {
                    return {
                        name: user.name,
                        vote: user.vote
                    }
                });
                const sumVotes = users.reduce((acc, user) => publicKey.addition(acc, bigintConversion.hexToBigint(user.vote)), publicKey.encrypt(BigInt(0)));
                const totalForOptionOne = privateKey.decrypt(sumVotes);
                const optionOne = totalForOptionOne.toString()
                const totalVotes = users.length;
                const optionTwo = totalVotes - optionOne;
                res.json({optionOne: optionOne, optionTwo: optionTwo, allVotes: allVotes, sumVotes: sumVotes.toString() });
            } catch (error) {
                res.status(500).json({ message: 'Error tallying the votes' });
            }
        });
        
        app.get('/public_key', (req, res) => {
            try {
                res.status(200).json({n: publicKey.n.toString(),g: publicKey.g.toString()});
            } catch (error) {
                res.status(500).json({ message: 'Error getting the public key', error: error.message });
            }
        });
        
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        mongoose.connect(mongoString);
        const database = mongoose.connection

        database.on('error', (error) => {
            console.log(error)
        })
        database.once('connected', () => {
            console.log('Database Connected');
        })
    } catch (error) {
      console.error("Error during key generation or server start:", error);
    }
}
  
startServer();