import axios from 'axios';
import { token } from './a-MainVariables';
import { url } from './a-MainVariables';

// Get Features
export function getFeatures() {
    //axios call
    // console.log(token);
    return axios.get(
        `${url}/api/admin/cars/features`,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        }
    );
}

// Add Features
export function addFeature(icon_path, names) {
    //axios call
    const postData = {
        icon_path,
        names,
    };
    return axios.post(
        `${url}/api/admin/cars/features/add`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        },
    );
}


// Update Features
export function updateFeature(id, icon_path, names) {
    //axios call
    const postData = {
        id,
        icon_path,
        names,
    };
    return axios.post(
        `${url}/api/admin/cars/features/update`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        },
    );
}

// Delete Features
export function deleteFeature(id) {
    //axios call
    const postData = {
        id,
    };
    return axios.post(
        `${url}/api/admin/cars/features/delete`,
        postData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
    );
}

