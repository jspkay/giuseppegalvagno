import React from "react";
import moment from "moment";
import {aggiornaPrenotazioni, useStateValue} from "./StateContext";
import {formPrenotazione} from "../helpers/reducerOld";

const axios = require("axios");

class Prenotazione{
    constructor(nome, cognome, telefono, tipo, data) {
        this.nome = nome;
        this.cognome = cognome;
        this.telefono = telefono;
        this.tipo = tipo;
        this.data = data;
    }
}



let Data = (props) => {
    let [state, dispatch] = useStateValue();
    state.data = [];

    axios.get("https://giuseppeparrucchiere.altervista.org/requestPrenotazioni.php")
        .then((response) => {
            console.log("HEre I AM");
            console.log(response.data);
            let tmp = response.data.split("\n,");
            for(let element of tmp){
                let a = null;
                try{
                    a = JSON.parse(element);
                }
                catch{}
                if(a !== null) state.data.push(a);
            }
            console.log(state.data);

            console.log("There you are");
            console.log(state.prenotazioni);
        })
        .catch((error)=>{});


    return <></>
}

/*const data = [
    new Prenotazione("Michele", "La Rosa", "1234567890", "taglio", moment().date(22).hour(12).minutes(0)),
    new Prenotazione("Michele", "La Rosa", "1234567890", "taglio", moment().date(22).hour(18).minutes(0)),
    new Prenotazione("Michele", "La Rosa", "1234567890", "taglio", moment().date(22).hour(13).minutes(0)),
    ];
*/
export default Data;