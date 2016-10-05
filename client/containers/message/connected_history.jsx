const connect = require('react-redux').connect,
      History = require('../../message/history.jsx');

const mapStateToProps = function(state) {
    return {
        username: state.username,
        messages: state.messages
    };
};

const ConnectedHistory = connect(
    mapStateToProps,
    null
)(History);

module.exports = ConnectedHistory;
