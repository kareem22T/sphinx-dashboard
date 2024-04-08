import axios from 'axios';
import { token } from './a-MainVariables';
import { url } from './a-MainVariables';

export function getRating() {
    //axios call
    // console.log(token);
    return axios.get(
        `${url}/api/admin/ratings`,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        }
    );
}

export function Approve(id) {
    //axios call
    const postData = {
        id,
    };
    return axios.post(
        `${url}/api/admin/ratings/approve`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        },
    );
}

export function Reject(id) {
    //axios call
    const postData = {
        id,
    };
    return axios.post(
        `${url}/api/admin/ratings/reject`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        },
    );
}

