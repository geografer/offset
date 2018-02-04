import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AccountActions from '../Account/AccountActions.js';
import LinkButtonView from './LinkButtonView.js';

const mapStateToProps = (state) => {
  return {

  }
}

const LinkButton = connect(
  mapStateToProps,
  dispatch => bindActionCreators(AccountActions, dispatch)
)(LinkButtonView);

export default LinkButton;
