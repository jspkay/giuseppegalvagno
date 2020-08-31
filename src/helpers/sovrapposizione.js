import "./tipiPrestazioni";
import moment from "moment";
import {durataPrestazioni, tipiPrestazione} from "./tipiPrestazioni";

export default function sovrapposizione(exclude, data, tipo, prenotazioni){
    let res = false;

    let startDate = moment(data);
    let endDate = moment(data);
    endDate.add(60, "m");

    console.log("StartDate: " + startDate.toDate());
    console.log("EndDate: " + endDate.toDate());

    let sameDay = prenotazioni.filter(
        p => {
            let d = moment(p.startDate);
            return startDate.isSame(d, "day");
        }
    )

    for(let p of sameDay){
        let startD = moment(p.startDate);
        let endD = moment(p.startDate);
        endD.add(durataPrestazioni[tipiPrestazione[p.tipo]], "minutes");

        console.log("StartD: "+ startD.toDate());
        console.log("EndD: " + endD.toDate());

        if(p === exclude) continue;

        console.log(endDate.isBefore(startD));
        console.log(startDate.isAfter(endD));

        let before = endDate.isBefore(startD) ? true : endDate.isSame(startD, "minutes");
        let after = startDate.isAfter(endD) ? true : startDate.isSame(endD, "minutes");

        let s = !(before || after);
        if(s){
            res = true;
        }
    }

    return res;
}