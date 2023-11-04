import React, { useState } from 'react';
import axios from 'axios';
import * as bigintConversion from 'bigint-conversion';
import * as paillierBigint from 'paillier-bigint'
import Alice from '../assets/alice.png';
import Mallory from '../assets/mallory.png';
import usePublicKeyStore from '../store/PublicKeyStore';

export default function VotingTally() {
    const [aliceStatus, setAliceStatus] = useState('');
    const [aliceCount, setAliceCount] = useState('');
    const [malloryStatus, setMalloryStatus] = useState('');
    const [malloryCount, setMalloryCount] = useState('');
    const [allVotes, setAllVotes] = useState([]);
    const [sumVotes, setSumVotes] = useState('');

    const shortenString = (str, maxLength) => {
        return str.length <= maxLength ? str : `${str.slice(0, maxLength - 3)}...`;
    };

    const base_url = import.meta.env.VITE_NODE_ENV === 'production' ? import.meta.env.VITE_PRODUCTION_URL : import.meta.env.VITE_DEVELOPMENT_URL;

    async function getTotalVote() {
        try {
            const response = await axios.get(`${base_url}/tally`);
            const { optionOne, optionTwo, allVotes, sumVotes } = response.data;
            setAllVotes(allVotes);
            setSumVotes(sumVotes);
            setAliceCount(optionOne);
            setMalloryCount(optionTwo);
            if (optionOne > optionTwo) {
                setAliceStatus('Winner!');
                setMalloryStatus('Loser!');
            }
            else if (optionOne < optionTwo) {
                setAliceStatus('Loser!');
                setMalloryStatus('Winner!');
            }
            else {
                setAliceStatus('Tie!');
                setMalloryStatus('Tie!');
            }
        } catch (error) {
            console.error('Error fetching total vote:', error);
        }
    }

    return (
        <div className='container mt-5'>
            <div className="row mb-4">
                <div className="col-6 text-center">
                    <p className='fw-bold fs-1'>{aliceStatus}</p>
                    <img src={Alice} alt="Alice" className="img-fluid" />
                    <p className='fw-bold fs-1'>{aliceCount}</p>
                </div>
                <div className="col-6 text-center">
                    <p className='fw-bold fs-1'>{malloryStatus}</p>
                    <img src={Mallory} alt="Mallory" className="img-fluid" />
                    <p className='fw-bold fs-1'>{malloryCount}</p>
                </div>
            </div>
            <button className="btn btn-primary" onClick={getTotalVote}>Get Total Vote</button>
            <div className='row mt-4 d-flex justify-content-center'>
                <div className="col-6 text-center">
                    <h2 className='fw-bold fs-1'>Total vote calculated from server</h2>
                    <div style={{ maxHeight: '200px', overflowY: 'auto', wordWrap: 'break-word' }}>
                        <pre>{sumVotes}</pre>
                    </div>
                </div>
            </div>
            <div className="table-responsive mt-5" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Vote</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allVotes.map((voteRecord, index) => (
                            <tr key={index}>
                                <td>{voteRecord.name}</td>
                                <td className="text-truncate" style={{ maxWidth: '200px' }}>
                                    {shortenString(voteRecord.vote, 15)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}