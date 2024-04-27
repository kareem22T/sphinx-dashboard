import { url } from "./a-MainVariables";
import { token } from "./a-MainVariables";
import axios from "axios";

// Get resturants
export function getResturants() {
    //axios call
    // console.log(token);
    return axios.get(
        `${url}/api/admin/resturants`,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        }
    );
}

export function createResturant(thumbnail, titles, descriptions, address, addressName, lng, lat) {
    //axios call
    const postData = {
        thumbnail, titles, descriptions, address, addressName, lng, lat
    };
    return axios.post(
        `${url}/api/admin/resturants/add`,
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
export function updateResturant(id, thumbnail, titles, descriptions, address, addressName, lng, lat) {
    //axios call
    const postData = {
        id, thumbnail, titles, descriptions, address, addressName, lng, lat
    };
    return axios.post(
        `${url}/api/admin/resturants/update`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'

            }
        },
    );
}



// get Resturant
export function getResturant(id) {
    //axios call
    const postData = {
        id,
    };
    return axios.post(
        `${url}/api/admin/resturants/resturant`,
        postData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
    );
}

// Delete Resturant
export function deleteResturant(id) {
    //axios call
    const postData = {
        id,
    };
    return axios.post(
        `${url}/api/admin/resturants/delete`,
        postData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
    );
}
