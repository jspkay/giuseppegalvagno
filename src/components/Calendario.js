import React, {useContext} from "react";
import Paper from '@material-ui/core/Paper';

import {EditingState, IntegratedEditing, ViewState} from '@devexpress/dx-react-scheduler';
import {
    DragDropProvider,
    AppointmentForm,
    DateNavigator,
    Scheduler,
    DayView,
    Appointments,
    AppointmentTooltip,
    ConfirmationDialog,
    Toolbar, ViewSwitcher, MonthView, WeekView, Resources
} from '@devexpress/dx-react-scheduler-material-ui';

import "./calendario.css";

import moment from "moment";

import {tipiPrestazione, durataPrestazioni} from "../helpers/tipiPrestazioni";
import sovrapposizione from "../helpers/sovrapposizione";
import {PrenotazioniContext} from "./Prenotazioni";

const axios = require("axios");

let BooleanEditors = (props) => {
    return(
    <AppointmentForm.BooleanEditor className={"invisible"} >

    </AppointmentForm.BooleanEditor>
    );
}

let Calendario = () => {
    let [context, changeCalendarState] = useContext(PrenotazioniContext);
    let state = {
        prenotazioni: context.prenotazioni,
        refetch: context.refetch,
        operationAlert: context.operationAlert
    }
    let calendarState = context.calendarState;

    function getInstances(){
        let res = [], i=0;
        for(let el of tipiPrestazione){
            res.push({
                id: i,
                text: el,
            });
            i++;
        }
        return res;
    }
    let resources = [{
        fieldName: "tipo",
        title: "Tipo",
        instances: getInstances()
    }]

    function setOrario(changes){
        if(changes["startDate"]){
            changes["endDate"] = moment(changes["startDate"]).add({hour:.5}).toDate();
        }
        console.log(changes);
    }
    function aggiornaPrenotazioni({added, changed, deleted}) {
        console.log(added);
        let url = "http://giuseppegalvagno.altervista.org/php/gestisciPrenotazioni.php?";

        if(changed){
            url = url+"modifica";

            let changing = {
                nomeCognome: false,
                telefonoInfo: false,
                data: false,
                tipo: false,
            }


            let element;
            for(let e of state.prenotazioni){
                if(changed[e.id]){
                    changed = changed[e.id];
                    element = e;
                    break;
                }
            }
            url += "&id="+element.id;
            for(let prop in changed){
                if(prop === "title") changing.nomeCognome = true;
                if(prop === "startDate") changing.data = true;
                if(prop === "notes") changing.telefonoInfo = true;
                if(prop === "tipo") changing.tipo = true;
                console.log(prop);
            }

            // Nome e cognome
            let nm = changing.nomeCognome ? changed.title : element.title;
            let tmp = nm.split(" ");
            let [nome, cognome] = [tmp.shift(), tmp.join(" ")];
            url += `&nome=${nome}&cognome=${cognome}`;

            //Telefono e info
            let telefono, info;
            if(changing.telefonoInfo){
                let tmp = changed.notes.split("\n");
                if(!tmp[0].match("/d{10,13}/")){
                    alert("Andare a capo per inserire il numero di telefono");
                    return;
                }
                [telefono, info] = [tmp.shift(), tmp.join("\n")];
            }
            else [telefono, info] = [element.telefono, element.info];
            url += `&telefono=${telefono}&info=${info}`;

            //Data e tipo
            console.log(changed);
            console.log(element);
            let dataP = changing.data ? changed.startDate : element.startDate,
                tipo= changing.tipo ? changed.tipo : element.tipo;
            if(sovrapposizione(element, dataP, tipo, state.prenotazioni)){
                alert("Errore nella data o nel tipo, c'è sovrapposizione!");
                return;
            }
            dataP = moment(dataP).format("YYYY-MM-DD kk:mm");
            console.log(dataP);
            url += `&dataP=${dataP}&tipo=${tipo}`;

            console.log(url);

            axios.get(url)
                .then(
                    response => {
                        console.log(response);
                        if(response.data === "OK"){
                            state.operationAlert(true);
                            state.refetch();
                        }
                        else{
                            state.operationAlert(false);
                        }
                    }
                )
                .catch(() => {alert("Can't connect")});

            console.log(element);
            state.refetch();
        }
        if(deleted) {
            let element = state.prenotazioni.find(o => o.id==deleted);

            url = url+"elimina&";
            let urlQuery = `${url}id=${element.id}&telefono=${element.telefono}`;

            axios.get(urlQuery)
                .then(
                    response => {
                        console.log(response);
                        if(response.data === "OK") {
                            state.operationAlert(true);
                            state.refetch();
                        }
                        else{
                            state.operationAlert(false);
                        }
                    }
                )
                .catch(() => {alert("can't connect");})
            console.log(element);
        }

    }

    console.log(state.prenotazioni);
    return (
        <>
        <Paper>
            <Scheduler data={state.prenotazioni} >

                <ViewState
                    onCurrentDateChange={(date) => {
                        changeCalendarState({...calendarState, date:date});}}
                    currentDate={calendarState.date}
                    defaultCurrentDate={Date.now()}
                    currentViewName={calendarState.view}
                    onCurrentViewNameChange={(view) => {
                        console.log("VIEW:" +view);
                        changeCalendarState({...calendarState, view: view, ciao: "ciao"})
                    }}
                />

                <DayView
                    name="giornaliera"
                    startDayHour={calendarState.startDayHour}
                    endDayHour={calendarState.endDayHour}
                    displayName={"Giorno"}
                    className={"calendario"} />
                <WeekView
                    name="settimanale"
                    startDayHour={calendarState.startDayHour}
                    endDayHour={calendarState.endDayHour}
                    displayName={"Settimana"}
                    className={"calendario"} />
                <MonthView
                    name="mensile"
                    startDayHour={calendarState.startDayHour}
                    endDayHour={calendarState.endDayHour}
                    displayName={"Mese"}
                    className={"calendario"} />

                <Toolbar />
                <ViewSwitcher />
                <DateNavigator />


                <EditingState
                    onCommitChanges={aggiornaPrenotazioni}
                    onAppointmentChangesChange={setOrario}
                    onAddedAppointmentChange={() => {}}
                />
                <IntegratedEditing />
                <ConfirmationDialog />
                <Appointments />
                <AppointmentTooltip showOpenButton showCloseButton showDeleteButton/>
                <AppointmentForm commitCommand={"Salva"} booleanEditorComponent={BooleanEditors} />
                <Resources data={resources} mainResourceName={"tipo"}/>
                <DragDropProvider allowResize={() => false} />
            </Scheduler>
        </Paper>
        </>
    );
}

export default Calendario;