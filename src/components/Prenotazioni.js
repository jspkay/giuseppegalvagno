import React, {createContext, useReducer, useState} from "react";
import Button from "@material-ui/core/Button";
import useAxios from "axios-hooks";
import moment from "moment";
import {durataPrestazioni, tipiPrestazione} from "../helpers/tipiPrestazioni";
import {Alert} from "react-bootstrap";

export const PrenotazioniContext = createContext({prenotazioni: []});

let alertProps = {
    success:{
        show: true,
        text: "SUCCESS",
        variant: "success",
    },
    error:{
        show: true,
        text: "ERROR",
        variant: "danger",
    },
    invisible:{
        show:false,
        text:"",
        variant:""
    }
}
function reducerCalendario(state, calendarState){
    console.log(state);
    console.log(calendarState);
    let newState = {
        ...state,
        calendarState: calendarState,
    }
    console.log(newState);
    return newState;
}

let Prenotazioni = ({children, ...props}) => {
    let initialState = {
        prenotazioni:[],
        refetch: null,
        operationAlert: null,
        calendarState: {
            view: "giornaliera",
            date: Date(),
            startDayHour: 8,
            endDayHour: 20,
        }
    };

    let [state, changeCalendarState] = useReducer(reducerCalendario, initialState);
    console.log(state);

    let [alertProperties, changeAlertProperties] = useState(alertProps.invisible);
    console.log(alertProperties);

    state.prenotazioni = [];
    let [axios, refetch] = useAxios(
        {
            url: "http://giuseppegalvagno.altervista.org/php/gestisciPrenotazioni.php?tuttePrenotazioni",
            method: "GET",
        });
    if(axios.loading) return <Button>Caricamento</Button>;
    if(axios.error) {
        console.log("ERROR");
        return <p>ERROR</p>
    }

    state.refetch = refetch;
    console.log(axios.data);

    state.prenotazioni = axios.data.map(el => ({
        startDate: el.data,
        endDate: moment(el.data).add({minutes: durataPrestazioni[tipiPrestazione[el.tipo]]}),
        title: el.nome+" "+el.cognome,
        id: el.id,
        telefono: el.telefono,
        notes: el.telefono+"\n"+(el.info==null?"":el.info),
        info: el.info,
        tipo: Number(el.tipo),
    }));

    function operationAlert(success){
        if(success){
            changeAlertProperties(alertProps.success);
        }
        else{
            changeAlertProperties(alertProps.error);
        }
        setTimeout(
            () => {changeAlertProperties(alertProps.invisible)},
            1e5
        );
    }

    state.operationAlert = operationAlert;

    return (
        <PrenotazioniContext.Provider value={[state, changeCalendarState]}>
            <Alert show={alertProperties.text} variant={alertProperties.variant}>
                {alertProperties.text}
                <Button onClick={() => changeAlertProperties(alertProps.invisible)}>Dismiss</Button>
            </Alert>
            {children}
        </PrenotazioniContext.Provider>
    );

}

export default Prenotazioni;