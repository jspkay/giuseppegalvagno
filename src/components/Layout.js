import React from "react";
import {Link} from "gatsby";
import {Container, Navbar} from "react-bootstrap";

import "../helpers/bootstrap.min.css";
import "../helpers/global.css";
import "./layout.css";

const Layout = ({children, ...props}) => {
    return (
        <>
        <Container className={"Header bg-primary"}>
            <Navbar className={"navbar bg-primary"}>
                <Link to={"/"} className={"navbar-brand"}>
                    Barberia di Giuseppe Galvagno
                </Link>
                <Link to={"/login"} className={"link"}>
                    Area riservata
                </Link>
            </Navbar>
        </Container>
        {children}
        </>
    );
}

export default Layout;
