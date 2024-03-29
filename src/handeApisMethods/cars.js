import { url } from "./a-MainVariables";
import { token } from "./a-MainVariables";
import axios from "axios";

// Get Cars
export function getCars() {
    //axios call
    // console.log(token);
    return axios.get(
        `${url}/api/admin/cars`,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        }
    );
}

// Add Tours
export function createCar(titles, types, descriptions, address, addressName, lng, lat, prices, features, gallery, phone) {
    //axios call
    const postData = {
        titles, types, descriptions, address, addressName, lng, lat, prices, features, gallery, phone
    };
    return axios.post(
        `${url}/api/admin/cars/add`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'

            }
        },
    );
}

// Add Tours
export function updateCar(id, titles, types, descriptions, address, addressName, lng, lat, prices, features, gallery, phone, oldGallery) {
    //axios call
    const postData = {
        id, titles, types, descriptions, address, addressName, lng, lat, prices, features, gallery, phone, oldGallery
    };
    return axios.post(
        `${url}/api/admin/cars/update`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'

            }
        },
    );
}



// get Car
export function getCar(id) {
    //axios call
    const postData = {
        id,
    };
    return axios.post(
        `${url}/api/admin/cars/car`,
        postData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
    );
}

// Delete Car
export function deleteCar(id) {
    //axios call
    const postData = {
        id,
    };
    return axios.post(
        `${url}/api/admin/cars/delete`,
        postData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
    );
}
