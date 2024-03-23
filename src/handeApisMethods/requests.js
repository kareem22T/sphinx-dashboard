import axios from 'axios';
import { token } from './a-MainVariables';
import { url } from './a-MainVariables';

// Get requests
export function getRequests() {
    //axios call
    // console.log(token);
    return axios.get(
        `${url}/api/admin/requests`,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        }
    );
}

export function seen() {
    //axios call
    // console.log(token);
    return axios.get(
        `${url}/api/admin/requests/seen`,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        }
    );
}

// Get requests
export function getRequestsNew() {
    //axios call
    // console.log(token);
    return axios.get(
        `${url}/api/admin/requests/new`,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        }
    );
}

// Add Requests
export function addRequest(key, name) {
    //axios call
    const postData = {
        key,
        name,
    };
    return axios.post(
        `${url}/api/admin/requests/add`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        },
    );
}

// Update Requests
export function updateRequest(id, key, name) {
    //axios call
    const postData = {
        id,
        key,
        name,
    };
    return axios.put(
        `${url}/api/admin/requests/update`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        },
    );
}


// Delete Requests
export function deleteRequest(id) {
    //axios call
    const postData = {
        id,
    };
    return axios.post(
        `${url}/api/admin/requests/delete`,
        postData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
    );
}

