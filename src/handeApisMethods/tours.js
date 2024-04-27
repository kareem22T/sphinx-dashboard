import axios from 'axios';
import { token } from './a-MainVariables';
import { url } from './a-MainVariables';

// Get Tours
export function getTours() {
    //axios call
    // console.log(token);
    return axios.get(
        `${url}/api/admin/tours`,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        }
    );
}

// Add Tours
export function createTour(titles, intros, locations, transportations, duration, expired_date, min_participant, max_participant, includes, excludes, days, packages, gallery, tour_destination) {
    //axios call
    const postData = {
        titles, intros, locations, transportations, duration, expired_date, min_participant, max_participant, includes, excludes, days, packages, gallery, tour_destination
    };
    return axios.post(
        `${url}/api/admin/tours/add`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        },
    );
}

// Update Tours
export function updateTour(id, oldGallery, titles, intros, locations, transportations, duration, expired_date, min_participant, max_participant, includes, excludes, days, packages, gallery, tour_destination) {
    //axios call
    const postData = {
        id, oldGallery, titles, intros, locations, transportations, duration, expired_date, min_participant, max_participant, includes, excludes, days, packages, gallery, tour_destination
    };
    return axios.post(
        `${url}/api/admin/tours/update`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        },
    );
}

// get Tour details
export function getTour(id) {
    //axios call
    const postData = {
        id
    };
    return axios.post(
        `${url}/api/admin/tours/tour`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`,
            }
        },
    );
}

// Delete Tours
export function deleteTour(id) {
    //axios call
    const postData = {
        id,
    };
    return axios.post(
        `${url}/api/admin/tours/delete`,
        postData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
    );
}
