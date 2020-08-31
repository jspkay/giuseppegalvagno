import React, {useState} from "react";
import DatePicker from "react-datepicker"
import moment from "moment";

import {tipiPrestazione, durataPrestazioni} from "../helpers/tipiPrestazioni";
import {Link} from "gatsby";
import {Prenotazione, inserisciPrenotazione, formPrenotazione} from "../helpers/reducerOld";
import useAxios from "axios-hooks";

import "react-datepicker/dist/react-datepicker.css";
import "./FormPrenotazione.css";
import {Input} from "@material-ui/core";

import sovrapposizione from "../helpers/sovrapposizione";

const INSERITA_CORRETTAMENTE = "INSERITA_CORRETTAMENTE",
        NON_INSERITA = "NON_INSERITA",
        ERRORE = "ERRORE";
const axios = require("axios");

function controllaDati(e, prenotazioni, dispatch, startDate){
    e.preventDefault();

    let form = document.getElementById("DataForm");
    //let data = new moment(form.dataP.value);
    let data = moment(startDate);

    //Controllo numero telefonico e campi anagrafici
    if(!required(form.nome) || !required(form.cognome) || !phonenumber(form.telefono))
        return;

    //Che la data sia nel futuro
    let today = new moment();
    if(moment(startDate).isBefore(today)){
        alert("Errore data!");
        return;
    }

    let nome = form.nome.value,
        cognome = form.cognome.value,
        telefono = form.telefono.value,
        tipo = form.tipo.value;
    let prenotazione = new Prenotazione(nome, cognome, telefono, tipo, data);

    let hP = data.hours();
    let mP = data.minutes();

    // controllo sovrapposizioni


    let sovrapp = false;
    let durata = durataPrestazioni[tipo];

    prenotazioni.filter(e => (moment(e.data).format("YYYY/MM/DD") === data.format("YYYY/MM/DD")))
        .forEach(
        (e) => {
            let l = moment(e.data);
            let h = l.hour(), m = l.minute();
            h = Number(h);
            m = Number(m);
            let mT = h*60 + m;
            let mTp = hP*60+mP;
            let d = durataPrestazioni[e.tipo];
            /*
            mT      mT+30
            |       |
                 |       |
                 mTp    mTp+30
                 */
            if( (mT < mTp+durata) && (mTp < mT+d) ) {
                alert("sovrapposizione");
                sovrapp = true;
            }
        }
    )

    //if(!sovrapp) dispatch(inserisciPrenotazione(prenotazione));
    form.submit();



}
function phonenumber(inputtxt) {
    const phoneno = /^\d{10}$/;
    if(inputtxt.value.match(phoneno))
    {
        return true;
    }
    else
    {
        alert("Numero di telefono errato");
        return false;
    }
}
function required(inputtx) {
    if (inputtx.value.length === 0)
    {
        alert("Nome o Cognome non validi, riprova.");
        return false;
    }
    return true;
}

function excludeTimes(prenotazioni, date){
    console.log(prenotazioni);
    let res = prenotazioni
        .filter(p => {
            let data1 = moment(date).format("DD/MM/YYYY");
            let data2 = moment(p.data).format("DD/MM/YYYY");
            return data1 === data2;
        })
        .map((p) => {
            let exclude = moment(p.data).seconds(0).millisecond(0).toDate();

            return exclude;
        });
    console.log(res);
    return res;
}

function axiosGetData(){
    axios
        .get("http://giuseppegalvagno.altervista.org/gestisciPrenotazioni.php?tuttePrenotazioni")
        .then(
            response => {
                this.setState((state, props) => ({
                    prenotazioni:{
                        loading: false,
                        error: false,
                        data: response.data,
                    },
                    excludedTimes: excludeTimes(response.data, state.startDate),
                }));
            }
        )
        .catch(
            error => {
                this.setState({
                    prenotazioni:{
                        error: true,
                    }
                })
            }
        )
}

class FormPrenotazione extends React.Component{
    constructor(props) {
        super(props);
        moment.locale('it');
        this.state = {
            state: NON_INSERITA,
            startDate: new Date(),
            excludedTimes: [],
            prenotazioni: {
                error: false,
                loading: false,
                data: []
            },
        }
    }

    componentDidMount(){
        this.setState(
            {
                prenotazioni:{
                    error: false,
                    loading: true,
                    data: []
                }
            },
            axiosGetData
        );
    }

    render(){
        let state = this.state;
        let prenotazioni = this.state.prenotazioni.data;

        if(this.state.prenotazioni.loading){return <p>Caricamento...</p>}

        return (
            <div>
                <div className={"bg-primary over-all"}>
                    <Link to="/" className="close" aria-label="Close">X</Link><br/>
                    <h5>Inserisci nuova prenotazione:</h5>
                    <form id={"DataForm"} action={"inserisciPrenotazione.php"}>
                        <label className={"mr-sm-2"}>Nome:</label><input name="nome" className={"form-control mb-2 mr-sm-1"} type="text" placeholder={"il tuo nome"}/><br/>
                        <label>Cognome:</label> <input name="cognome" className={"form-control mb-2 mr-sm-1"} type="text" placeholder={"il tuo cognome"}/><br/>
                        <label> Nr. di telefono:</label><input name="telefono" className={"form-control mb-2 mr-sm-1"} type={"text"} placeholder={"XXX XXX XXXX"}/><br/>
                        <label>Tipo:</label>
                        <select name="tipo" className={"form-control mb-2 mr-sm-1"}>
                            {
                                tipiPrestazione.map(
                                    e => {
                                        return (<option key={tipiPrestazione.indexOf(e)} value={tipiPrestazione.indexOf(e)}>{e + `(${durataPrestazioni[e]}minuti)`}</option>);
                                    }
                                )
                            }
                        </select>
                        <br/>
                        <label> Data e ora:</label>
                        <DatePicker name={"dataP"}
                                    value={"12/07/2008 - 12:12"}
                                    showTimeSelect
                                    format = {"dd/MM/YY - hh:mm"}
                                    inline
                                    selected = {state.startDate}
                                    onSelect = {date => {
                                        this.setState({excludedTimes: excludeTimes(prenotazioni, date)});
                                        this.setState({startDate: date});
                                    }}
                                    onChange = {date => {
                                        this.setState({excludedTimes: (excludeTimes(prenotazioni, date))});
                                        this.setState({startDate: date});
                                    }}
                                    timeFormat = "HH:mm"
                                    excludeTimes = {this.state.excludedTimes}
                        />
                        <input readOnly style={{display: "none"}} name={"dataP"} value={moment(state.startDate).format("YYYY-MM-DD kk:mm")} />
                        <label>Privacy Consent</label>
                        <input type={"checkbox"} name={"privacy"} />
                        <Input className={"bg-secondary"} onClick={(e) => controllaDati(e, prenotazioni, null, state.startDate)} value={"Invia"} type={"button"} />
                    </form>
                    {state === INSERITA_CORRETTAMENTE && (<></>)}
                    {state === ERRORE && (<></>)}
                </div>
            </div>
        );
    }
}

export default FormPrenotazione;