import axios from 'axios';
import { token } from './a-MainVariables';
import { url } from './a-MainVariables';

// Get Reasons
export function getReasons() {
    //axios call
    // console.log(token);
    return axios.get(
        `${url}/api/admin/reasons`,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        }
    );
}

// Add Reasons
export function addReason(icon_path, names, descriptions) {
    //axios call
    const postData = {
        icon_path,
        names,
        descriptions
    };
    return axios.post(
        `${url}/api/admin/reasons/add`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        },
    );
}


// Update Reasons
export function updateReason(id, icon_path, names, descriptions) {
    //axios call
    const postData = {
        id,
        icon_path,
        names,
        descriptions
    };
    return axios.post(
        `${url}/api/admin/reasons/update`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        },
    );
}

// Delete Reasons
export function deleteReason(id) {
    //axios call
    const postData = {
        id,
    };
    return axios.post(
        `${url}/api/admin/reasons/delete`,
        postData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
    );
}

