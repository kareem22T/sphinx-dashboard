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
export function createHotel(names, slogans, descriptions, addresses, phone, gallery, address, addressName, lat, lng, check_in, check_out, features, reasons, tours, type, hotel_destination) {
    //axios call
    const postData = {
        names, slogans, descriptions, addresses, phone, gallery, address, addressName, lat, lng, check_in, check_out, features, reasons, tours, type, hotel_destination
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

// Update Hotels
export function updateHotel(id, oldGallery, oldReasons, names, slogans, descriptions, addresses, phone, gallery, address, addressName, lat, lng, check_in, check_out, features, reasons, tours, type, hotel_destination) {
    //axios call
    const postData = {
        id, oldGallery, oldReasons, names, slogans, descriptions, addresses, phone, gallery, address, addressName, lat, lng, check_in, check_out, features, reasons, tours, type, hotel_destination
    };
    return axios.post(
        `${url}/api/admin/hotels/update`,
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

// get Hotel details
export function getRoom(id) {
    //axios call
    const postData = {
        id
    };
    return axios.post(
        `${url}/api/admin/hotels/room`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`,
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
export function creatRoom(hotel_id, names, descriptions, gallery, prices, features) {
    //axios call
    const postData = {
        hotel_id, names, descriptions, gallery, prices, features
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

// update Room
export function updateRoom(room_id, oldGallery, names, descriptions, gallery, prices, features) {
    //axios call
    const postData = {
        room_id, oldGallery, names, descriptions, gallery, prices, features
    };
    return axios.post(
        `${url}/api/admin/hotels/room/update`,
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

