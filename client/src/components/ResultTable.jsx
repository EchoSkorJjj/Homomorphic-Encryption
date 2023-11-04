export default function ResultTable({ encrypted_original_data, encrypted_additional_data, encrypted_sum, decrypted_sum }) {
    
    const shortenString = (str, maxLength) => {
        return str.length <= maxLength ? str : `${str.slice(0, maxLength - 3)}...`;
      };

    let age, height, weight;
    let encrypted_age = '', encrypted_height = '', encrypted_weight = '';

    Object.keys(encrypted_original_data).forEach(key => {
        const { value, encrypted } = encrypted_original_data[key];
        if (key === 'age') {
            age = value;
            encrypted_age = shortenString(encrypted?.ciphertext, 15);
        } else if (key === 'height') {
            height = value;
            encrypted_height = shortenString(encrypted?.ciphertext, 15);
        } else if (key === 'weight') {
            weight = value;
            encrypted_weight = shortenString(encrypted?.ciphertext, 15);
        }
    });

    let add_age, add_height, add_weight;
    let encrypted_add_age = '', encrypted_add_height = '', encrypted_add_weight = '';

    Object.keys(encrypted_additional_data).forEach(key => {
        const { value, encrypted } = encrypted_additional_data[key];
        if (key === 'add_age') {
        add_age = value;
        encrypted_add_age = shortenString(encrypted?.ciphertext, 15);
        } else if (key === 'add_height') {
        add_height = value;
        encrypted_add_height = shortenString(encrypted?.ciphertext, 15);
        } else if (key === 'add_weight') {
        add_weight = value;
        encrypted_add_weight = shortenString(encrypted?.ciphertext, 15);
        }
    });

    let sum_age, sum_height, sum_weight;
    Object.entries(decrypted_sum).forEach(([key, value]) => {
        if (key === 'age') sum_age = value;
        else if (key === 'height') sum_height = value;
        else if (key === 'weight') sum_weight = value;
    });

    let encrypted_sum_age = '', encrypted_sum_height = '', encrypted_sum_weight = '';
    Object.entries(encrypted_sum).forEach(([key, value]) => {
        if (key === 'age') encrypted_sum_age = shortenString(value, 15);
        else if (key === 'height') encrypted_sum_height = shortenString(value, 15);
        else if (key === 'weight') encrypted_sum_weight = shortenString(value, 15);
    });

    return (
      <table className='table'>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Original Data</th>
            <th scope="col">Add Data</th>
            <th scope="col">Sum</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Age</th>
            <td>{age}</td>
            <td>{add_age}</td>
            <td>{sum_age}</td>
          </tr>
          <tr>
            <th scope="row">Encrypted Age</th>
            <td>{encrypted_age}</td>
            <td>{encrypted_add_age}</td>
            <td>{encrypted_sum_age}</td>
          </tr>
          <tr>
            <th scope="row">Height</th>
            <td>{height}</td>
            <td>{add_height}</td>
            <td>{sum_height}</td>
          </tr>
          <tr>
            <th>Encrypted Height</th>
            <td>{encrypted_height}</td>
            <td>{encrypted_add_height}</td>
            <td>{encrypted_sum_height}</td>
          </tr>
          <tr>
            <th>Weight</th>
            <td>{weight}</td>
            <td>{add_weight}</td>
            <td>{sum_weight}</td>
          </tr>
          <tr>
            <th>Encrypted Weight</th>
            <td>{encrypted_weight}</td>
            <td>{encrypted_add_weight}</td>
            <td>{encrypted_sum_weight}</td>
          </tr>
        </tbody>
      </table>
    );
  }