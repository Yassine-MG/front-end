import React,{useState} from 'react'
import Cookies from "js-cookie";
import http from "../http";
export function saveUserInSession(data){
    sessionStorage.setItem('user', JSON.stringify(data));
}

export function getUserFromSession(){
    return JSON.parse(sessionStorage.getItem('user'));
}

export function postData(url,data){
    return http.post(url,data);
}

export function postDataWithToken(url,data){
    const token = Cookies.get('access_token');
    return http.post(url,data,{headers: {"Authorization": `Bearer ${token}`}})
}

