import axios from 'axios';
import { token } from './a-MainVariables';
import { url } from './a-MainVariables';

// chats
export function getChats() {
    return axios.get(
        `${url}/api/admin/chats/chats`,
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        }
    );
}
// chat
export function getChat(user_id) {
    return axios.post(
        `${url}/api/admin/chats/chat`,
        {
            user_id: user_id
        },
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        }
    );
}

// chat
export function sendMessage(user_id, msg) {
    return axios.post(
        `${url}/api/admin/chats/send`,
        {
            user_id: user_id,
            msg: msg,
        },
        {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        }
    );
}
