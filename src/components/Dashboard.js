import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Icon from 'material-ui/Icon';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import { withStyles } from 'material-ui/styles';
import withWidth from 'material-ui/utils/withWidth';
import compose from 'recompose/compose';
import { connect } from 'react-redux';

// UserBox по новой структуре с юнит тестами
import UserBox from './user-box';
import { bindActionCreators } from 'redux';
import { getPasswords, removePassword, addPassword, editPassword } from '../actions/passwords';

import FormDialog from './Dialog';

// Вероятно было бы хорошо, если уж используется подход
// css in js - хранить описание стилей для компонента в отдельном файле
// и импортировать его
const styles = theme => ({
    root: theme.root,
    dashboardHead: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
        paddingBottom: '10px',
        borderBottom: '2px solid #ccc',
        '& > button': {
            marginTop: '12px'
        },
    },
    passHolder: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px 0',
        marginBottom: '15px',
        borderBottom: '2px solid #eee',
        '& > .material-icons': {
            border: 'none',
            background: 'none',
            padding: '3px',
            borderRadius: '100px',
            marginLeft: '6px',
            cursor: 'pointer',
        }
    },
    passName: {
        margin: '0 15px 0 0',
        maxWidth: '200px',
        minWidth: '200px',
    },
    passInput: {
        cursor: 'pointer',
        padding: '2px 5px',
    },
});



class Dashboard extends Component {
    state = {
        open: false,
        mode: 'add',
        editIndex: false,
    };
    constructor(props) {
        super(props);
        this.addNewPassword = this.addNewPassword.bind(this);
        this.editPassword = this.editPassword.bind(this);
        this.removePassword = this.removePassword.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }
    componentWillMount() {
        // Ты же можешь получить пароли уже в экшене без передачи localStorage
        // в качестве параметра
        if (localStorage.passwords) {
            this.props.getPasswords();
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.login.isLoggedIn) {
            localStorage.setItem('passwords', JSON.stringify(nextProps.passwords));
        }
    }
    addNewPassword() {
        this.setState({ mode: 'add', open: true, editIndex: false });
    }
    closeModal() {
        this.setState({ open: false });
    }
    removePassword(event) {
        this.props.removePassword(event.target.parentNode.dataset.index);
    }

    /**
     * Хорошей практикой считается не мутировать локальное состояние компонента
     * а передавать в setState функцию, которая 100% будет изменять только нужные поля
     * состояния.
     *
     * @example this.setState((prevState) => ({
     *      ...prevState,
     *      mode: 'edit',
     *      open: true,
     *      editIndex: event.target.parentNode.dataset.index}));
     *
     * @param event
     * https://medium.com/@shopsifter/using-a-function-in-setstate-instead-of-an-object-1f5cfd6e55d1
     */
    editPassword(index) {
        // Если тебе нужен индекс итерируемого элемента то ты же можешь кинуть банально индекс элемента
        // иля какой нибудь его уникальный id и затем в localStorage найти этот элемент по id и поменять пароль у него
        this.setState({ mode: 'edit', open: true, editIndex: index});
    }

    // getAttribute - работает с реальным DOM API. Получается не очень react way
    // Такие вещи лучше делать через локальное состояние компонента
    showPassword(event) {
        event.preventDefault();
        let target = event.target;
        target.blur();
        if(target.getAttribute('type') === 'text') {
            target.setAttribute('type', 'password');
        } else {
            target.setAttribute('type', 'text');
        }
    }
    render() {
        const {classes, login, passwords, addPassword, editPassword} = this.props;
        const {open, editIndex, mode} = this.state;
        return(
            <div className={classes.root}>
                <Paper>
                    {login.isLoggedIn ?
                        <Grid container>
                        <Grid item xs={8}>
                            <div className={classes.dashboardHead}>
                                <h1>Dashboard</h1>
                                <Button onClick={this.addNewPassword} fab color="primary" aria-label="add">
                                    <AddIcon />
                                </Button>
                            </div>
                            {/*
                                Не очень хорошая практика использовать в качестве уникального идентификатора для dom узла
                                его индек из метода map, так как это не надженый подход. Index такой же может быть и у
                                какого то дочернего жлемента или же на таком же уровне вложенности и
                                react просто не отрендерит этот узел

                                https://github.com/ai/nanoid
                             */}

                            {/* Я рекомендовал бы map выносить в отдельный метод в классе чтобы рендер был максимально чистым */}
                            {passwords.map((item, index) => {
                                
                                // Через деструктуризацию более читаемей
                                const { passHolder, passName, passInput } = classes;
                                const { name, password } = item;
                                
                                return (
                                    <div key={index} data-index={index} className={passHolder}>
                                        <p className={passName}>{name}</p>
                                        {/* Почему нельзя input подключить из material или сделать его отдельным компонентом ? */}
                                        <input
                                            value={password}
                                            readOnly
                                            type="password"
                                            className={passInput}
                                            onClick={this.showPassword}
                                        />
                                        <Icon onClick={() => this.editPassword(index)} color="primary">mode_edit</Icon>
                                        <Icon onClick={this.removePassword} color="error">delete</Icon>
                                    </div>
                                )
                            })}
                        </Grid>
                        <Grid item xs={4}><UserBox user={login}/></Grid>
                    </Grid>

                    : <h1>Dashboard</h1>}
                </Paper>
                <FormDialog
                    open={open}
                    editIndex={editIndex}
                    addPassword={addPassword}
                    editPassword={editPassword}
                    closeModal={this.closeModal}
                    mode={mode}
                    passwords={passwords}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        login: state.loginReducer,
        passwords: state.passwordsReducer,
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        getPasswords: bindActionCreators(getPasswords, dispatch),
        removePassword: bindActionCreators(removePassword, dispatch),
        addPassword: bindActionCreators(addPassword, dispatch),
        editPassword: bindActionCreators(editPassword, dispatch),
    }
};

export default compose(withStyles(styles), connect(mapStateToProps, mapDispatchToProps), withWidth())(Dashboard);