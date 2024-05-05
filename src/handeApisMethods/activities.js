import axios from 'axios';
import { token } from './a-MainVariables';
import { url } from './a-MainVariables';

// Get activities
export function getActivities() {
    //axios call
    // console.log(token);
    return axios.get(
        `${url}/api/admin/activities`,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        }
    );
}

export function getActivity(id) {
    //axios call
    // console.log(token);
    return axios.get(
        `${url}/api/admin/activities/activity?id=${id}`,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        }
    );
}

// Add Activity
export function addActivity(name_en, name_ar, desc_ar, desc_en, thumbnail_path) {
    //axios call
    const postData = {
        name_en, name_ar, desc_ar, desc_en, thumbnail_path
    };
    return axios.post(
        `${url}/api/admin/activities/add`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        },
    );
}

// Update Activity
export function updateActivity(id, name_en, name_ar, desc_ar, desc_en, thumbnail_path) {
    //axios call
    const postData = {
        id,
        name_en,
        name_ar, desc_ar, desc_en,
        thumbnail_path
    };
    return axios.post(
        `${url}/api/admin/activities/update`,
        postData,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        },
    );
}


// Delete Activity
export function deleteActivity(id) {
    //axios call
    const postData = {
        id,
    };
    return axios.post(
        `${url}/api/admin/activities/delete`,
        postData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
    );
}

