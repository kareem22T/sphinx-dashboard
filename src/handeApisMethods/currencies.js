import axios from 'axios';
import { token } from './a-MainVariables';
import { url } from './a-MainVariables';

// Get Currencies
export function getCurrencies() {
    //axios call
    // console.log(token);
    return axios.get(
        `${url}/api/admin/currencies`,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        }
    );
}

// Add Currency
export function addCurrency(code, names) {
    //axios call
    const postData = {
        code,
        names,
    };
    return axios.post(
        `${url}/api/admin/currencies/add`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        },
    );
}

// Update Currency
export function updateCurrency(id, code, names) {
    //axios call
    const postData = {
        id,
        code,
        names,
    };
    return axios.put(
        `${url}/api/admin/currencies/update`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        },
    );
}


// Delete Currency
export function deleteCurrency(id) {
    //axios call
    const postData = {
        id,
    };
    return axios.post(
        `${url}/api/admin/currencies/delete`,
        postData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
    );
}

