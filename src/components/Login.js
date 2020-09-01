import React from "react";

import {Input} from "@material-ui/core";
import {Form} from "react-bootstrap";
import {handleLogin} from "../services/auth";

import "./login.css";

async function submit(e, it){
    e.preventDefault();
    let form = document.getElementById("form");
    console.log(form);
    let user = form.user.value;
    let pswd = form.password.value;
    console.log(pswd);

    let l = handleLogin(user, pswd);
    console.log("front:" + l);
    if(await l){
        window.location.assign("/admin");
        console.log("You're admin");
    }
}

const Login = () => {
    return (
        <Form className={"form"} id={"form"} onSubmit={e => submit(e)}>
            <Input type={"text"} name={"user"} placeholder={"utente"} />
            <Input type={"password"} name={"password"} placeholder={"password"}/>
            <Input type={"submit"}>Entra</Input>
        </Form>
    );
}

export default Login;