import "../helpers/tipiPrestazioni";

export const initialState = {
    prenotazioni: [],
    data: [],
    formPrenotazione: false,
    refetch: null,
};

export class Prenotazione{
    constructor(nome, cognome, telefono, tipo, data) {
        this.nome = nome;
        this.cognome = cognome;
        this.telefono = telefono;
        this.tipo = tipo;
        this.data = data;
    }
}

export const
    INSERT_REFETCH = "INSERT_REFETCH";

export const insertRefetch = (f) => ({type: INSERT_REFETCH, refetch: f});

export const reducerOld = (state, action) => {
    switch (action.type) {
        case INSERT_REFETCH:
            return {refetch: action.refetch, ...state};
        default:
            return {...state};
    }
}