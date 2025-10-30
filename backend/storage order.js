// utils/storage.js - دوال LocalStorage الأساسية
function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getData(key) {
    const d = localStorage.getItem(key);
    return d ? JSON.parse(d) : null;
}

function removeData(key) {
    localStorage.removeItem(key);
}

function generateId(prefix = "id") {
    return prefix + "_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
}