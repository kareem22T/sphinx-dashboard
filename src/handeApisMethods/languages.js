import axios from 'axios';
import { token } from './a-MainVariables';
import { url } from './a-MainVariables';

// Get Languages
export function getLanguages() {
    //axios call
    // console.log(token);
    return axios.get(
        `${url}/api/admin/languages`,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        }
    );
}

// Add Languages
export function addLanguage(key, name) {
    //axios call
    const postData = {
        key,
        name,
    };
    return axios.post(
        `${url}/api/admin/languages/add`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        },
    );
}

// Update Languages
export function updateLanguage(id, key, name) {
    //axios call
    const postData = {
        id,
        key,
        name,
    };
    return axios.put(
        `${url}/api/admin/languages/update`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        },
    );
}


// Delete Languages
export function deleteLanguage(id) {
    //axios call
    const postData = {
        id,
    };
    return axios.post(
        `${url}/api/admin/languages/delete`,
        postData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
    );
}

