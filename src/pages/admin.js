import React, {createContext} from "react";

import Calendario from "../components/Calendario";
import Layout from "../components/Layout";
import Prenotazioni from "../components/Prenotazioni";
import {isLoggedIn} from "../services/auth";
import useAxios from "axios-hooks";

const qs = require("qs");

const Admin = () => {
    let localStorage = typeof(window) !== "undefined" ? window.localStorage : {getItem: () => {}};
    let login = localStorage.getItem("login");
    let unauthorizedLogin = <p>You don't have the permission to see this page!</p>;

    console.log(login);
    let [axios, refetch] = useAxios({
        url: "http://giuseppegalvagno.altervista.org/php/isLogged.php",
        method: "POST",
        data: qs.stringify({session: localStorage.getItem("login")})} );
    if(axios.loading) return <p>Checking login...</p>
    if(axios.error) return<p>Ricarica, per favore</p>

    console.log(axios.data);
    if(axios.data !== "TRUE" || login == null || login === "undefined")
    return (
        <>
            {unauthorizedLogin}
        </>
    )

    return(
        <Layout>
            <Prenotazioni>
                <Calendario />
            </Prenotazioni>
        </Layout>
    );
}

export default Admin;