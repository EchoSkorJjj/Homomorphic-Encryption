import React, { useState } from 'react';
import axios from 'axios'; 
import * as bigintConversion from 'bigint-conversion';
import * as paillierBigint from 'paillier-bigint'
import Alice from '../assets/alice.png';
import Mallory from '../assets/mallory.png';
import usePublicKeyStore from '../store/PublicKeyStore';

export default function Vote() {
    const [vote, setVote] = useState('');
    const [name, setName] = useState('');
    const [encryptedVote, setEncryptedVote] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const publicKeyData = usePublicKeyStore((state) => state.publicKeyData);

    const publicKey = publicKeyData
    ? new paillierBigint.PublicKey(BigInt(publicKeyData.n), BigInt(publicKeyData.g))
    : null;

    const shortenString = (str, maxLength) => {
        return str.length <= maxLength ? str : `${str.slice(0, maxLength - 3)}...`;
    };

    const handleName = (name) => {
        setMessage('');
        setName(name);
    };

    const handleVote = (newVote) => {
        if (newVote === '') {
            setVote('');
            setEncryptedVote('');
            setErrorMessage(''); 
            return;
        }
        setMessage('');
        const voteNumber = parseInt(newVote, 10);
        
        setVote(voteNumber);
        if (voteNumber === 1 || voteNumber === 2) {
            if (publicKey) {
                if (voteNumber === 2) {
                    const encrypted = publicKey.encrypt(BigInt(0));
                    setEncryptedVote(bigintConversion.bigintToHex(encrypted));
                } else {
                const encrypted = publicKey.encrypt(BigInt(voteNumber));
                setEncryptedVote(bigintConversion.bigintToHex(encrypted));
                }
            }
        } else {
            setErrorMessage('Please enter a valid vote.');
            setEncryptedVote('');
        }
    };

    const checkVote = async () => {
        try {
            setMessage('');
            setErrorMessage('');
            const response = await axios.post("http://localhost:3000/checkvote", {
                encryptedVote: encryptedVote
            })
            if (response.status === 200) {
                setEncryptedVote('');
                const { voteHex } = response.data;
                if (voteHex == 0) {
                    setMessage('Your vote is 2');
                } else {
                    setMessage('Your vote is ' + voteHex);
                }
            }
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message);
            } else if (error.request) {
                setErrorMessage('No response was received.');
            } else {
                setErrorMessage('Error in sending the request.');
            }
        }
    }

    const submitVote = async () => {
        try {
            setMessage('');
            setErrorMessage('');
            setEncryptedVote('');
            if (!publicKey) {
                setMessage('Public key not loaded.');
                return;
            }

            if (vote == 1 || vote == 2) {
            } else {
                setErrorMessage('Please enter a valid vote.');
                return;
            }
            const response = await axios.post('http://localhost:3000/vote', {
                encryptedVote: encryptedVote,
                name: name,
            });
            
            if (response.status === 200) {
                setMessage('Vote successfully submitted!');
            } 
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message);
            } else if (error.request) {
                setErrorMessage('No response was received.');
            } else {
                setErrorMessage('Error in sending the request.');
            }
        }
    };

    return (
        <div className='container mt-5'>
            <div className="row mb-4">
                <div className="col-6 text-center">
                    <p className='fw-bold fs-1'>1</p>
                    <img src={Alice} alt="Alice" className="img-fluid" />
                </div>
                <div className="col-6 text-center">
                    <p className='fw-bold fs-1'>2</p>
                    <img src={Mallory} alt="Mallory" className="img-fluid" />
                </div>
            </div>
            <h2 className='mb-4'>Submit your vote (1 or 2)</h2>
            <div className="row">
                <div className="col-12 col-md-6">
                    <div className="mb-3">
                        <label htmlFor="nameInput" className="form-label">Name</label>
                        <input type="text" className="form-control" id="nameInput" value={name} onChange={(e) => handleName(e.target.value)} placeholder="Enter your name" />
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="mb-3">
                        <label htmlFor="voteInput" className="form-label">Vote</label>
                        <input type="number" className="form-control" id="voteInput" value={vote} onChange={(e) => handleVote(e.target.value)} placeholder="Enter your vote" />
                    </div>
                </div>
            </div>
            {encryptedVote && <button className="btn btn-primary me-2" onClick={submitVote}>Vote</button>}
            {encryptedVote && <button className="btn btn-primary" onClick={checkVote}>Check Your Vote</button>}
            {message && <div className="alert alert-info mt-3" role="alert">{message}</div>}
            {encryptedVote && <div className="alert alert-info mt-3" role="alert">{shortenString(encryptedVote, 20)}</div>}
            {errorMessage && <div className="alert alert-danger mt-3" role="alert">{errorMessage}</div>}
        </div>
    );
};