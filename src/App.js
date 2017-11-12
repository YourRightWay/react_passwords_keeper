import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import About from './components/About';
import { loginAction, logOut } from './actions/login';
import { resetPasswords } from './actions/passwords';

// Я бы сделал этот компонент просто оберткой для роутера 
// без подключения к store а loginAction вынес в какой то layout или header

class App extends Component {
    componentWillMount() {
        // Достаточно if (localStorage.email)
        if (localStorage.email) {
            this.props.loginAction(localStorage);
        }
    };
    
    render() {
        const { login, logOut, resetPasswords} = this.props;
        return (
            <BrowserRouter>
                <div>
                    <Header login={login} logout={logOut} resetPasswords={resetPasswords}/>
                    <Switch>
                        <Route exact path='/' component={Dashboard}/>
                        <Route path='/signin' component={Login}/>
                        <Route path='/about' component={About}/>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    };
}

const mapStateToProps = (state) => {
    return {
        login: state.loginReducer,
    }
};

// const mapDispatchToProps = (dispatch) => {
//     return {
//         loginAction: bindActionCreators(loginAction, dispatch),
//         logOut: bindActionCreators(logOut, dispatch),
//         resetPasswords: bindActionCreators(resetPasswords, dispatch),
//     }
// };

/**
 * Без этих выебонов тоже работает все ))
 * @type {{loginAction: loginAction, logOut: logOut, resetPasswords: resetPasswords}}
 */
const mapDispatchToProps = {
    loginAction,
    logOut,
    resetPasswords
};

// Prop Types ??

export default connect(mapStateToProps, mapDispatchToProps)(App)
