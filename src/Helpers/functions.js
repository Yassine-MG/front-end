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

export const options = [
    {
    value: "developer",
    label: "Developer",
    checkboxes: [
        { value: "front-end", label: "Front-end" },
        { value: "back-end", label: "Back-end" },
        { value: "full-stack", label: "Full Stack" },
        { value: "aI Applications", label: "AI Applications" },
        { value: "devOps & cloud", label: "DevOps & Cloud" },
        { value: "mobile Apps", label: "Mobile Apps" },
    ],
    },
    {
    value: "designer",
    label: "Designer",
    checkboxes: [
        { value: "logo & brand identity", label: "Logo & Brand Identity" },
        { value: "web & app design", label: "Web & App design" },
        { value: "art & illustration", label: "Art & Illustration" },
        { value: "architecture & building design", label: "Architecture & Building Design" },
        { value: "product & gaming", label: "Product & Gaming" },
        { value: "visual design", label: "Visual Design" },
    ],
    },
    {
        value: "writing & translation",
        label: "Writing & Translation",
        checkboxes: [
            { value: "Sales CopySales Copy", label: "Sales Copy" },
            { value: "resume writing", label: "Resume Writing" },
            { value: "email copy", label: "Email Copy" },
            { value: "social media copy", label: "Social Media Copy" },
            { value: "transcription", label: "Transcription" },
            { value: "website content", label: "Website Content" },
        ],
        },
        {
        value: "business",
        label: "Business",
        checkboxes: [
            { value: "presentations", label: "Presentations" },
            { value: "legal consulting", label: "Legal Consulting" },
            { value: "Sales", label: "Sales" },
            { value: "project management", label: "Project Management" },
            { value: "E-Commerce Management", label: "E-Commerce Management" },
            { value: "game concept design", label: "Game Concept Design" },
        ],
        },
        {
            value: "video & animation",
            label: "Video & Animation",
            checkboxes: [
                { value: "editing & post-production", label: "Editing & Post-Production" },
                { value: "animation", label: "Animation" },
                { value: "social & marketing videos", label: "Social & Marketing Videos" },
                { value: "product & explainer videos", label: "Product & Explainer Videos" },
                { value: "tutorials & eduction", label: "Tutorials & Education" },
                { value: "miscellaneous", label: "Miscellaneous" },
            ],
            },               
            {
            value: "data",
            label: "Data",
            checkboxes: [
                { value: "data analytics", label: "Data Analytics" },
                { value: "databases", label: "Databases" },
                { value: "data visualization", label: "Data Visualization" },
                { value: "data science & AI", label: "Data Science & AI" },
                { value: "data engineering", label: "Data Engineering" },
                { value: "data processing", label: "Data Processing" },
            ],
            },
];
export const deleverytimes = [
    {
    value: "1 Day Delivery",
    label: "1 Day Delivery",
    },
    {
    value: "2 Days Delivery",
    label: "2 Days Delivery",
    },
    {
    value: "3 Days Delivery",
    label: "3 Days Delivery",
    },
    {
    value: "4 Days Delivery",
    label: "4 Days Delivery",
    },
    {
    value: "5 Days Delivery",
    label: "5 Days Delivery",
    },               
    {
    value: "6 Days Delivery",
    label: "6 Days Delivery",
    },    
    {
    value: "7 Days Delivery",
    label: "7 Days Delivery",
    },
    {
    value: "8 Days Delivery",
    label: "8 Days Delivery",
    },
    {
    value: "9 Days Delivery",
    label: "9 Days Delivery",
    },
    {
    value: "10 Days Delivery",
    label: "10 Days Delivery",
    },
    {
    value: "11 Days Delivery",
    label: "11 Days Delivery",
    },
    {
    value: "12 Days Delivery",
    label: "12 Days Delivery",
    },
    {
    value: "13 Days Delivery",
    label: "13 Days Delivery",
    },
    {
    value: "14 Days Delivery",
    label: "14 Days Delivery",
    },
    {
    value: "21 Days Delivery",
    label: "21 Days Delivery",
    },    
    {
    value: "30 Days Delivery",
    label: "30 Days Delivery",
    },
];