import axios from 'axios';
const http= axios.create({
    baseURL:"http://localhost:8000/api",
    headers:{
        "Access-Control-Allow-Origin": "*",
        "Content-type":"application/json",
        "Content-Type": "application/x-www-form-urlencoded",
    }
})

    http.interceptors.request.use((config) => {
        const token = getCookie("access_token");
        if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    });
    
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
        return parts.pop().split(";").shift();
        }
    }
    
    export default http;