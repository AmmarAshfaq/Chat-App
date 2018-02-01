import ActionTypes from '../constant/constant';
import configDefault from './firebaseConfig';
import { browserHistory } from 'react-router';

export function signup(obj) {
    return dispatch => {
        dispatch(signupRequest());
        configDefault.auth().createUserWithEmailAndPassword(obj.email, obj.password)
            .then((user) => {
                // console.log("user created", user);
                browserHistory.push('/');
                return user.updateProfile({
                    displayName: obj.username
                }).then(() => {
                    // console.log("obj with user name",user)
                    let obj = {
                        name: user.displayName,
                        email: user.email,
                        uid: user.uid
                    }
                    // console.log("user with its uid",obj)

                    configDefault.database().ref('/').child(`/${user.uid}`).set(obj)
                    dispatch(signupSucceed(obj));
                })

            })
            .catch((error) => {
                dispatch(signupError(error.message));
                browserHistory.push('/signup')
            })
    }
}


export function signupRequest() {
    return {
        type: ActionTypes.SIGNUP_PROGRESS
    }
}
export function signupSucceed(obj) {
    return {
        type: ActionTypes.SIGNUP_SUCCEED,
        payload: obj
    }
}
export function signupError(error) {
    return {
        type: ActionTypes.SIGNUP_ERROR,
        errorText: error
    }
}
export function signupErrorAlert() {
    return {
        type: ActionTypes.SIGNUP_ERROR_ALERT
    }
}