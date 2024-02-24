import axios from 'axios';
import { token } from './a-MainVariables';
import { url } from './a-MainVariables';

// Get Hotels
export function getHotels() {
    //axios call
    // console.log(token);
    return axios.get(
        `${url}/api/admin/hotels`,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        }
    );
}

// Add Hotels
export function createHotel(names, slogans, descriptions, addresses, phone, gallery, map, check_in, check_out, features, reasons) {
    //axios call
    const postData = {
        names, slogans, descriptions, addresses, phone, gallery, map, check_in, check_out, features, reasons
    };
    return axios.post(
        `${url}/api/admin/hotels/add`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        },
    );
}

// get Hotel details
export function getHotel(id) {
    //axios call
    const postData = {
        id
    };
    return axios.post(
        `${url}/api/admin/hotels/hotel`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`,
            }
        },
    );
}

// Update Hotels
export function updateHotel(id, key, name) {
    //axios call
    const postData = {
        id,
        key,
        name,
    };
    return axios.put(
        `${url}/api/admin/hotels/update`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        },
    );
}


// Delete Hotels
export function deleteHotel(id) {
    //axios call
    const postData = {
        id,
    };
    return axios.post(
        `${url}/api/admin/hotels/delete`,
        postData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
    );
}

// Add Room
export function creatRoom(hotel_id, names, descriptions, gallery, prices) {
    //axios call
    const postData = {
        hotel_id, names, descriptions, gallery, prices
    };
    return axios.post(
        `${url}/api/admin/hotels/room/add`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        },
    );
}

// Delete Hotels
export function deleteRoom(id) {
    //axios call
    const postData = {
        id,
    };
    return axios.post(
        `${url}/api/admin/hotels/room/delete`,
        postData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
    );
}

