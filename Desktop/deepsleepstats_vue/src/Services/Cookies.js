export default class Cookies {
    static get(cookie_name){
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${cookie_name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    static ersase(cookie_name){
        document.cookie = cookie_name + '=';
    }
    static set(cookie_name, data){
        document.cookie = cookie_name + '=' + data;
    }
}