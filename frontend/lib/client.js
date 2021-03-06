import broswerRequest from 'browser-request';

const urlBase = '/api';

export function request(method, path, data) {
    return new Promise((resolve, reject) => {
        method = method.toUpperCase();
        const option = {
            method,
            url: `${urlBase}/${path}`
        }
        if (method === 'GET' || method === 'HEAD') {
            option.qs = data;
        } else {
            option.form = data;
        }

        broswerRequest(option, (err, res, body) => {
            if (err) {
                reject(err);
            } else {
                let data;
                try {
                    data = JSON.parse(body.toString());
                } catch (error) {
                    return reject(new Error('parse json data error : ' + error.message));
                }
                if (data.error) {
                    reject(data.error);
                } else {
                    resolve(data.result);
                }
            }
        });
    })
}

export function getTopicList(options) {
    return request('get', 'topic/list', options);
}

export function getTopicDetail(id) {
    return request('get', `topic/item/${id}`).then(ret => ret.topic);
}

export function login(name, password) {
    return request('post', 'login', { name, password });
}

export function loginUser() {
    return request('get', 'login_user').then(ret => ret.user);
}

export function logout() {
    return request('post', 'loginout');
}

export function siginup(name, email, password, nickname) {
    return request('post', 'siginup', { name, email, password, nickname });
}

export function addTopic(title, tags, content) {
    return request('post', 'topic/add', { title, tags, content }).then(ret => ret.topic);
}

export function updateTopic(id, title, tags, content) {
    return request('post', `topic/item/${id}`, { title, tags, content }).then(ret => ret.topic);
}

export function addComment(id, content) {
    return request('post', `topic/item/${id}/comment/add`, { content }).then(ret => ret.comment);
}

export function deleteComment(id, cid) {
    return request('post', `topic/item/${id}/comment/delete`, { cid });
}

export function updateProfile(email, nickname, about) {
    return request('post', 'user/profile', { email, nickname, about });
}

export function deleteTopic(id) {
    return request('delete', `topic/item/${id}/`);
}

export function notificationCount(isRead) {
    return request('get', 'notification/count', { isRead }).then(ret => ret.count);
}

export function notificationList() {
    return request('get', 'notification/list');
}

export function notificationSetRead(id) {
    return request('post', `notification/${id}/read`);
}

export function requestResetPassword(email) {
    return request('post', '/user/request_reset_password', { email });
}

export function resetPassword(code, email, password) {
    return request('post', '/user/reset_password', { code, email, password });
}