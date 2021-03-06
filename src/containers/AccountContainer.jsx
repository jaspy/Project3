import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Account } from '../components';

import actionCreators from '../store/actionCreators';
import actions from '../store/actions';
import router from '../router';

const mapStateToProps = state => {
  return {
    auth: { ...state.auth },
    ui: { ...state.ui },
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...actionCreators.auth,
      ...actions.ui,
      ...router,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Account);
