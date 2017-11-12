import * as types from '../constants';

/**
 * Я бы рекомендовал в качестве изначального состояния использовать обьект,
 * так как состояние в процессе может расширится и одним массивом не обойтись. Тем более 
 * с обьектом легче поддерживать иммутабельность состояния c помощью Object.assign и Object.merge
 */

/////////////// Пример //////////////////

// const initialState = {
//     passwords: [],
// };
//
// export default (state = initialState, action) => {
//     switch (action.type) {
//         case types.GET_PASSWORDS:
//         case types.ADD_PASSWORD:
//             return {
//                 ...state,
//                 passwords: action.passwords
//             };
//         default:
//             return state;
//     }
// }

// вместо response более ожидаемо видеть action
    
// Почему не switch ??
const passwordsReducer = (state = [], response) => {
    if (response.type === types.GET_PASSWORDS) {
        return state.concat(response.passwords);
    }
    if (response.type === types.REMOVE_PASSWORD) {
        return [
            ...state.slice(0, Number(response.index)),
            ...state.slice(Number(response.index) + 1),
        ]
    }
    if (response.type === types.ADD_PASSWORD) {
        return [
            ...state,
            response.addNew,
        ]
    }
    if (response.type === types.EDIT_PASSWORD) {
        return [
            ...state.slice(0, Number(response.index)),
            response.editedPass,
            ...state.slice(Number(response.index) + 1),
        ]
    }
    if (response.type === types.RESET_PASSWORDS) {
        return [];
    }
    return state
}

export default passwordsReducer;