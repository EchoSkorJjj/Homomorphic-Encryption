import React, { useState } from 'react';
import axios from 'axios';  
import ResultTable from '../components/ResultTable.jsx';

function AdditionDemo() {
    const [inputData, setInputData] = useState({
      age: '',
      height: '',
      weight: '',
    });
    const [additionalData, setAdditionalData] = useState({
      add_age: '',
      add_height: '',
      add_weight: '',
    });
    const [result, setResult] = useState(null);

    const handleInputChange = (e) => {
      const { id, value } = e.target;
      setInputData((prev) => ({ ...prev, [id]: value }));
    };

    const handleAdditionalChange = (e) => {
      const { id, value } = e.target;
      setAdditionalData((prev) => ({ ...prev, [id]: value }));
    };

    const performOperation = () => {
        const requestData = {
            data: inputData,
            additional_data: additionalData,
        };
  
        axios.post('http://127.0.0.1:3000/perform', requestData)
        .then(response => {
            setResult(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    return (
      <div className="container mt-5">
        <div className="row text-center">
          <h1>Paillier Cryptosystem</h1>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="age">Age:</label>
              <input
                type="number"
                className="form-control"
                id="age"
                value={inputData.age}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="height">Height:</label>
              <input
                type="number"
                className="form-control"
                id="height"
                value={inputData.height}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="weight">Weight:</label>
              <input
                type="number"
                className="form-control"
                id="weight"
                value={inputData.weight}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="add_age">Add to Age:</label>
              <input
                type="number"
                className="form-control"
                id="add_age"
                value={additionalData.add_age}
                onChange={handleAdditionalChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="add_height">Add to Height:</label>
              <input
                type="number"
                className="form-control"
                id="add_height"
                value={additionalData.add_height}
                onChange={handleAdditionalChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="add_weight">Add to Weight:</label>
              <input
                type="number"
                className="form-control"
                id="add_weight"
                value={additionalData.add_weight}
                onChange={handleAdditionalChange}
              />
            </div>
            
            <button onClick={performOperation} className="btn btn-primary mt-2">
              Perform Operation and Show Details
            </button>
          </div>
        </div>
        {result && (
          <div className="row">
            <div className="col-md-8">
                <ResultTable
                    encrypted_original_data={result.encrypted_original_data}
                    encrypted_additional_data={result.encrypted_additional_data}
                    encrypted_sum={result.encrypted_sum}
                    decrypted_sum={result.decrypted_sum}
                />
            </div>
          </div>
        )}
      </div>
    );
  }
  
  export default AdditionDemo;