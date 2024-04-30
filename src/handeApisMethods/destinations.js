import axios from 'axios';
import { token } from './a-MainVariables';
import { url } from './a-MainVariables';

// Get Destinations
export function getDestinations() {
    //axios call
    // console.log(token);
    return axios.get(
        `${url}/api/admin/destinations`,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        }
    );
}

// Add Destination
export function addDestination(name_en, name_ar, desc_ar, desc_en, thumbnail_path) {
    //axios call
    const postData = {
        name_en, name_ar, desc_ar, desc_en, thumbnail_path
    };
    return axios.post(
        `${url}/api/admin/destinations/add`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        },
    );
}

// Update Destination
export function updateDestination(id, name_en, name_ar, desc_ar, desc_en, thumbnail_path) {
    //axios call
    const postData = {
        id,
        name_en,
        name_ar, desc_ar, desc_en,
        thumbnail_path
    };
    return axios.post(
        `${url}/api/admin/destinations/update`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        },
    );
}


// Delete Destination
export function deleteDestination(id) {
    //axios call
    const postData = {
        id,
    };
    return axios.post(
        `${url}/api/admin/destinations/delete`,
        postData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
    );
}

