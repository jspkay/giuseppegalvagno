import React, {Children} from "react";
import {Link} from "gatsby";
import {StateProvider, useStateValue} from "./StateContext";
import {cancellaPrenotazione, initialState, reducerOld, showDetails} from "../helpers/reducerOld";
import {Container, NavbarBrand} from "react-bootstrap";

function getAppointemnts(p){
    let res = p.map(e => {
        let date = new Date( `${e.dataP} ${e.oraP}`);
        let diff = 0;
        if(e.tipo === 'taglio') diff = 30;
        if(e.tipo === 'tinta') diff = 60;
        if(e.tipo === 'permanente') diff = 120;
        let endDate = new Date(date.getTime() + diff*60000);

        return ({
            title: `${e.cognome}-${e.tipo}`,
            startDate: date,
            endDate: endDate,
            id: `${e.nome}${e.cognome}${e.dataP}${e.oraP}`,
            item: e
        })
    })
    return res;
}

const Layout = ({children, ...props}) => {
    //let [state, dispatch] = useStateValue();


    //function deleteApp(p){ dispatch(cancellaPrenotazione(p)); }

    //let appointments = getAppointemnts(state.prenotazioni);

    return (
    <StateProvider initialState={initialState} reducer={reducerOld}>
        <Container className={"Header"}>
            <NavbarBrand>Barberia di Giuseppe Galvagno</NavbarBrand>
            <Link to={"/login"}>Login</Link>
        </Container>
        {children}
    </StateProvider>
    );
}

export default Layout;
