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
export function addDestination(name_en, name_ar) {
    //axios call
    const postData = {
        name_en, name_ar
    };
    return axios.post(
        `${url}/api/admin/destinations/add`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        },
    );
}

// Update Destination
export function updateDestination(id, name_en, name_ar) {
    //axios call
    const postData = {
        id,
        name_en,
        name_ar,
    };
    return axios.put(
        `${url}/api/admin/destinations/update`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
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

