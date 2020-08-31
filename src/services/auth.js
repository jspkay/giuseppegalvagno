const axios = require("axios");
const qs = require("qs");

export const isBrowser = () => typeof window !== "undefined"

export const getUser = () =>
    isBrowser() && window.localStorage.getItem("gatsbyUser")
        ? JSON.parse(window.localStorage.getItem("gatsbyUser"))
        : {}

const setUser = user =>
    window.localStorage.setItem("logged", JSON.stringify(user))

export async function handleLogin(user, pswd){
    let res = axios.post(
        "http://localhost:8000/php/handleLogin.php",
        qs.stringify({username: user, password: pswd}),
    ).then(response => {
        let tmp = response.data.split("-");
        console.log(response.data);
        localStorage.setItem("login", tmp[1]); //tmp[1] is session token
        return tmp[0] === "LOGGED";
    }).catch(() => {
        console.log("ERROR-AXIOS");
    });

    return await res;
}

export async function isLoggedIn(){
    let res = axios.post(
        "http://localhost:8000/php/isLogged.php",
        qs.stringify({session: localStorage.getItem("login")}),
    ).then(response => {
        console.log(response.data);
        return response.data === "TRUE";
    }).catch(() => {
        console.log("ERROR-AXIOS");
    });

    console.log(await res);
    return await res;
}

export const logout = callback => {
    setUser({})
    callback()
}