import notifications from '../notifications';
import actions from '../actions';
import router from '../../router';
import { firebase } from '../../firebase';

const setObjToLS = (key, obj) => localStorage.setItem(key, JSON.stringify(obj));
const getObjFromLS = key => JSON.parse(localStorage.getItem(key));

export const signupWithEmail = () => {
  return async (dispatch, getState) => {
    const { email, pass, passRepeat } = getState().auth;

    if (pass !== passRepeat) {
      dispatch(notifications.auth.passwordsNotEqual());
      return;
    }

    dispatch(actions.ui.changeLoaderStatus(true));
    try {
      await firebase.createUserWithEmailAndPassword(email, pass);
      dispatch(notifications.auth.signup.success());
    } catch (e) {
      dispatch(notifications.auth.signup.failed(e));
    } finally {
      dispatch(actions.ui.changeLoaderStatus(false));
      dispatch(router.redirectToAccount());
    }
  };
};

export const signinWithEmail = () => {
  return async (dispatch, getState) => {
    const { email, pass } = getState().auth;
    dispatch(actions.ui.changeLoaderStatus(true));

    try {
      const { user } = await firebase.signInWithEmailAndPassword(email, pass);
      setObjToLS('user', user);

      dispatch(actions.auth.authorize(user));
      dispatch(actions.ui.changeDialogState(false));
      dispatch(notifications.auth.signinEmail.success());

      dispatch(router.redirectToAccount());
    } catch (e) {
      dispatch(notifications.auth.signinEmail.failed(e));
    } finally {
      dispatch(actions.ui.changeLoaderStatus(false));
    }
  };
};

export const signinWithGoogle = () => {
  return async dispatch => {
    try {
      const { user } = await firebase.doSignInWithGoogle();
      setObjToLS('user', user);

      dispatch(actions.auth.authorize(user));
      dispatch(notifications.auth.signinGoogle.success());
      dispatch(router.redirectToAccount());
    } catch (e) {
      dispatch(notifications.auth.signinGoogle.failed(e));
    }
  };
};

export const updateEmail = email => dispatch =>
  dispatch(actions.auth.updateEmail(email));
export const updatePass = pass => dispatch =>
  dispatch(actions.auth.updatePass(pass));
export const updatePassRepeat = pass => dispatch =>
  dispatch(actions.auth.updatePassRepeat(pass));

export const signout = () => {
  return dispatch => {
    localStorage.removeItem('user');

    dispatch(actions.auth.signout());
    dispatch(notifications.auth.signout());
    dispatch(actions.ui.changeQuitDialogStatus(false));
  };
};

export const loadFromLS = () => {
  return dispatch => {
    const user = getObjFromLS('user');
    if (!user) return;

    dispatch(actions.auth.authorize(user));
    dispatch(notifications.auth.loadFromLS());
    dispatch(router.redirectToAccount());
  };
};