import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import withWidth from 'material-ui/utils/withWidth';
import { withStyles } from 'material-ui/styles';
import styles from './style';

/**
 * Это вполне может быть stateless компонентом без методов жизненого цикла так как
 * он не имеет локального стостояния и методов
 */

// class UserBox extends Component {
//     render() {
//         const {classes, user} = this.props;
//         return(
//                 <div className={classes.userBox}>
//                     <h2>{user.name}</h2>
//                     <img src={user.photo} alt=""/>
//                     <p className={classes.userEmail}>{user.email}</p>
//                 </div>
//         )
//     }
// }

export const UserBox = ({ classes: { userBox, userEmail }, user: { name, photo, email } }) => (
    <div className={userBox}>
        <h2>{name}</h2>
        <img src={photo} alt=""/>
        <p className={userEmail}>{email}</p>
    </div>
);

// PropTypes ??

UserBox.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withWidth())(UserBox);
