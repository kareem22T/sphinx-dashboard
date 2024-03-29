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
export function approve(req_id) {
    //axios call
    const postData = {
        req_id
    };
    return axios.post(
        `${url}/api/admin/requests/approve`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        },
    );
}

// Update Requests
export function cancel(req_id) {
    //axios call
    const postData = {
        req_id
    };
    return axios.post(
        `${url}/api/admin/requests/cancel`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        },
    );
}


