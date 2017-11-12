/**
 * Часто реакт приложениях строятся по следующей файловой архитектуре:
 * 
 *  Index.js => В этом корневом файле находится подключение всех низкоуровневых абстракций: redux, react-router, react-material,
 *  инициализация store, подключение middleware и redux-devtools
 *  
 *  Containers => это контейнеры которые подключены к redux хранилищу и пробрасывают данные в дочерние 
 *  компоненты, которые являются уже тупыми
 *  
 *  Components => тупые компоненты, которые имеют свое локальное состояние и в зависимости 
 *  от этого уже делятся на stateless и state
 *  
 * У тебя же в приложение redux store создается в index.js файле и затем прокидывается в виде
 * props в app.js Несколько не очевидно и избыточно. 
 * 
 * Рекомендую в index.js файле подключить вс енеобходимые зависимости и компоненты к ним,
 * создать папку Containers и в нее переместить app.js который будет подключен к redux store
 *  
 */

/**
 * Тестирование.
 * Очень полезная штука и если тесты написать в тестовом задании то ты определенно
 * сложишь хорошее впечатление. 
 * Смотри компонент user-box - там организация структуры для тестов.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import './index.css';
import 'normalize.css';
import App from './App';
import mainReducer from './reducers';
import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

const outerTheme = createMuiTheme();

const theme = (outerTheme) => {
    return {
        ...outerTheme,
        root: {
            margin: '0 auto',
            maxWidth: '1200px',
            width: '100%',
        },
        overrides: {
            MuiPaper: {
                root: {
                    padding: '5px 20px',
                }
            },
        },
    }
};

/**
 * Многие люди дебажат react приложения  спомощью redux-devtools
 * https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=ru
 *
 * потому будет не лишним установить в приложение поддержку redux-devtools
 */

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

const store = createStore(
    mainReducer,
    composeEnhancers(
        applyMiddleware(
            thunk,
            createLogger
        )
    )
);

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider theme={outerTheme}>
            <MuiThemeProvider theme={theme}>
                {/* Я бы рекомендовал сюда вынести и компонент роутера
                    а в контенере оставить только роуты */}
                <App />
            </MuiThemeProvider>
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root')
);
