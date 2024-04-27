import axios from 'axios';
import { token } from './a-MainVariables';
import { url } from './a-MainVariables';

export function saveHomeTours(tours) {
    return axios.post(
        `${url}/api/admin/settings/set-home-tours`,
        {
            tours
        },
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        }
    );
}

export function getHomeTours() {
    return axios.get(
        `${url}/api/admin/settings/get-home-tours`,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        }
    );
}

export function saveHomeHotels(hotels) {
    return axios.post(
        `${url}/api/admin/settings/set-home-hotels`,
        {
            hotels
        },
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        }
    );
}

export function getHomeHotels() {
    return axios.get(
        `${url}/api/admin/settings/get-home-hotels`,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        }
    );
}

export function saveHomeAd(ad, thumbnail) {
    return axios.post(
        `${url}/api/admin/settings/set-home-ad`,
        {
            ad, thumbnail
        },
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        }
    );
}

export function getHomeAd() {
    return axios.get(
        `${url}/api/admin/settings/get-home-ad`,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        }
    );
}
