import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  firstEditorSelector,
  secondEditorSelector,
} from '../redux/EditorRedux';
import { currentUserSelector } from '../redux/UserRedux';
import userTypes from '../config/userTypes';
import Editor from './Editor';
import GameStatusTab from './GameStatusTab';
import { sendEditorData, editorReady } from '../middlewares/Game';

class GameWidget extends Component {
  static propTypes = {
    currentUser: PropTypes.shape({
      id: PropTypes.number,
      type: PropTypes.string,
    }).isRequired,
    firstEditor: PropTypes.shape({
      value: PropTypes.string,
    }),
    secondEditor: PropTypes.shape({
      value: PropTypes.string,
    }),
    sendData: PropTypes.func.isRequired,
    editorReady: PropTypes.func.isRequired,
  }

  static defaultProps = {
    firstEditor: {},
    secondEditor: {},
  }

  componentDidMount() {
    this.props.editorReady();
  }

  getLeftEditorParams() {
    const { currentUser, firstEditor, secondEditor, sendData } = this.props;
    const isPlayer = currentUser.id !== userTypes.spectator;
    const editable = isPlayer;
    const editorState = currentUser.type === userTypes.secondPlayer ? secondEditor : firstEditor;
    const onChange = isPlayer ?
      (value) => { sendData(value); } :
      _.noop;

    return {
      onChange,
      editable,
      value: editorState.value,
      name: 'left-editor',
    };
  }

  getRightEditorParams() {
    const { currentUser, firstEditor, secondEditor } = this.props;
    const editorState = currentUser.type === userTypes.secondPlayer ? firstEditor : secondEditor;

    return {
      onChange: _.noop,
      editable: false,
      value: editorState.value,
      name: 'right-editor',
    };
  }

  render() {
    return (
      <div>
        <div className="row mt-3 mx-auto">
          <div className="col-md-6">
            <GameStatusTab />
          </div>
        </div>
        <div className="row mt-3 mx-auto">
          <div className="col-md-6">
            <Editor {...this.getLeftEditorParams()} />
          </div>
          <div className="col-md-6">
            <Editor {...this.getRightEditorParams()} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: currentUserSelector(state),
  firstEditor: firstEditorSelector(state),
  secondEditor: secondEditorSelector(state),
});

const mapDispatchToProps = dispatch => ({
  // editorActions: bindActionCreators(EditorActions, dispatch),
  sendData: (...args) => { dispatch(sendEditorData(...args)); },
  editorReady: () => { dispatch(editorReady()); },
});

export default connect(mapStateToProps, mapDispatchToProps)(GameWidget);

