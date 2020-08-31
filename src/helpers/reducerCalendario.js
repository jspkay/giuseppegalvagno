export const CHANGE_VIEW = "CHANGE_VIEW";
export const CHANGE_DATE = "CHANGE_DATE";

export function changeView(view){
    return {
        action: CHANGE_VIEW,
        view: view,
    }
}
export const changeDate = (date) => ({action: CHANGE_DATE, date: date});

export default function reducerCalendario(state, action){
    switch(action.type){
        case CHANGE_VIEW:
            return {view: action.view, ...state};
        case CHANGE_DATE:
            return {date: action.date, ...state};
        default:
            return {...state};
    }
}