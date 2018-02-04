import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as FootprintActions from './FootprintActions.js';
import FootprintDisplayView from './FootprintDisplayView.js';

const mapStateToProps = (state) => {
  return {
    footprintData: state.footprint.footprintData
  }
}

const FootprintDisplay = connect(
  mapStateToProps,
  dispatch => bindActionCreators(FootprintActions, dispatch)
)(FootprintDisplayView);

export default FootprintDisplay;
