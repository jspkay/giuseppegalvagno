import React, {useState} from "react";
import DatePicker from "react-datepicker"
import moment from "moment";

import {tipiPrestazione, durataPrestazioni} from "../helpers/tipiPrestazioni";
import Prenotazione from "../helpers/Prenotazione";

import "react-datepicker/dist/react-datepicker.css";
import "./formPrenotazione.css";
import {Input} from "@material-ui/core";

import sovrapposizione from "../helpers/sovrapposizione";
import Button from "react-bootstrap/Button";
import {Modal} from "react-bootstrap";

const INSERITA_CORRETTAMENTE = "INSERITA_CORRETTAMENTE",
        NON_INSERITA = "NON_INSERITA",
        ERRORE = "ERRORE";
const axios = require("axios");

function controllaDati(prenotazioni, date, component){
    let form = document.getElementById("DataForm");
    let dataP = moment(date);

    let nome = form.nome.value,
        cognome = form.cognome.value,
        telefono = form.telefono.value,
        tipo = form.tipo.value,
        privacy = form.privacy.checked;

    //Controllo numero telefonico e campi anagrafici
    if( isVoid(nome) || isVoid(cognome) || !phonenumber(telefono) || !privacy){
        alert("controllare i dati inseriti!");
        return;
    }

    //Che la data sia nel futuro
    let today = new moment();
    if(moment(date).isBefore(today, "minutes")){
        alert("Errore data!");
        return;
    }


    let prenotazione = new Prenotazione(nome, cognome, telefono, tipo, date);

    // controllo sovrapposizioni
    let sovrapp = sovrapposizione(null, date, tipo, prenotazioni);
    if(sovrapp){
        alert("Selezionare un altro orario");
        return;
    }

    dataP = dataP.format("YYYY-MM-DD kk:mm");
    let url = "http://giuseppegalvagno.altervista.org/php/gestisciPrenotazioni.php?inserisci"
    url += `&nome=${nome}&cognome=${cognome}&telefono=${telefono}`;
    url += `&tipo=${tipo}&dataP=${dataP}`;

    console.log(url);

    axios.get(url)
        .then(response => {
            console.log(response);
            if(response.data === "OK"){
                component.setState({
                    state: INSERITA_CORRETTAMENTE,
                })
            }
        })
        .catch(() => {});
}
function phonenumber(input) {
    const phoneno = /^\d{10,13}$/;
    if(input.match(phoneno))
    {
        return true;
    }
    else
    {
        alert("Numero di telefono errato");
        return false;
    }
}
function isVoid(input) {
    return input.length === 0 || input==="";
}
function excludeTimes(prenotazioni, date){
    let others = [];
    let res = prenotazioni
        .filter(p => {
            let data1 = moment(date).format("DD/MM/YYYY");
            let data2 = moment(p.data).format("DD/MM/YYYY");
            return data1 === data2;
        })
        .map((p) => {
            let exclude = moment(p.data).seconds(0).millisecond(0).toDate();
            let durata = durataPrestazioni[tipiPrestazione[p.tipo]];
            if(durata > 30){
                let n = moment(p.data).add(30, "minutes").seconds(0).millisecond(0).toDate();
                others.push(n);
            }if(durata > 60){
                let n = moment(p.data).add(60, "minutes").seconds(0).millisecond(0).toDate();
                others.push(n);
            }
            return exclude;
        });
    res = res.concat(others);
    return res;
}
function axiosGetData(){
    axios
        .get("http://giuseppegalvagno.altervista.org/php/gestisciPrenotazioni.php?tuttePrenotazioni")
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

let Alert = (props) => {

    if(props.success) {
        return (
            <Modal show={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Prenotazione inserita correttamente</Modal.Title>
                </Modal.Header>
                <Modal.Body>La tua prenotazione è stata inserita correttamente</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {window.location.reload()}}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
class FormPrenotazione extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            component: this,
            state: NON_INSERITA,
            startDate: null,
            excludedTimes: [],
            prenotazioni: {
                error: false,
                loading: false,
                data: []
            },
        }
    }

    componentDidMount(){
        let w = window, d = document;
        let loader = function() {
            var s = d.createElement("script"),
                tag = d.getElementsByTagName("script")[0];
            s.src = " //cdn.iubenda.com/iubenda.js";
            tag.parentNode.insertBefore(s, tag);
        };
        if (w.addEventListener) {
            w.addEventListener("load", loader, false);
        } else if (w.attachEvent) {
            w.attachEvent("onload", loader);
        } else {
            w.onload = loader;
        }

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
        console.log(this.state);
        if(this.state.prenotazioni.loading){return <p>Caricamento...</p>}

        return (
                <div className={"bg-primary over-all"}>
                    {/* <Link to="/" className="close" aria-label="Close">X</Link><br/> */}
                    <h5>Inserisci nuova prenotazione</h5>
                    <form id={"DataForm"} action={"inserisciPrenotazione.php"}>
                        <div className={"form-group"}>
                            <label className={"mr-sm-2"}>Nome:</label>
                            <input name="nome" className={"form-control mb-2 mr-sm-1"} type="text" placeholder={"il tuo nome"}/>
                        </div>
                        <div className={"form-group"}>
                            <label>Cognome:</label>
                            <input name="cognome" className={"form-control mb-2 mr-sm-1"} type="text" placeholder={"il tuo cognome"}/>
                        </div>
                        <div className={"form-group"}>
                            <label> Nr. di telefono:</label>
                            <input name="telefono" className={"form-control mb-2 mr-sm-1"} type={"text"} placeholder={"XXX XXX XXXX"}/>
                        </div>
                        <div className={"form-gruop"}>
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
                        </div>
                        <div className={"form-group"}>
                            <label> Data e ora:</label>
                            <DatePicker name={"dataP"}
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
                        </div>
                        <div className={"form-group privacy"}>
                            <input type={"checkbox"} name={"privacy"} />
                            <a href="//www.iubenda.com/privacy-policy/28869504" className="iubenda-white iubenda-embed" title="Privacy Policy">Privacy Policy</a>
                        </div>
                        <div className={"form-group"}>
                            <Button className={"bg-tertiary"} onClick={() => controllaDati(prenotazioni, state.startDate, state.component)} value={"Invia"} type={"button"}>
                                Prenota
                            </Button>
                        </div>
                    </form>
                    {state.state === INSERITA_CORRETTAMENTE && <Alert success /> }
                    {state.state === ERRORE && (<Alert error/>)}
                </div>
        );
    }
}

export default FormPrenotazione;