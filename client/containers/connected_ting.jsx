const connect = require('react-redux').connect,
      Action = require('../redux/actions/actions.jsx'),
      Ting = require('../ting.jsx');

const mapStateToProps = function(state) {
    return {
        lastMessageType: state.lastMessageType
    };
};

const mapDispatchToProps = function(dispatch) {
    return {
        onLogin(username, people) {
            dispatch(Action.onLogin(username, people));
        },
        onJoin(username) {
            dispatch(Action.onJoin(username));
        },
        onHistoricalMessagesAvailable(history) {
            dispatch(Action.onHistoricalMessagesAvailable(history));
        },
        onUpdateTypingMessages(messagesTyping) {
            dispatch(Action.onUpdateTypingMessages(messagesTyping));
        },
        onMessage(data) {
            dispatch(Action.onMessage(data));
        },
        onPart(username) {
            dispatch(Action.onPart(username));
        },
        deleteTypingMessages(username) {
            dispatch(Action.deleteTypingMessages(username));
        }
    };
};

const ConnectedTing = connect(
    mapStateToProps,
    mapDispatchToProps
)(Ting);

module.exports = ConnectedTing;
