const connect = require('react-redux').connect,
      Settings = require('../settings.jsx');

const mapStateToProps = function(state) {
    return {
        username: state.username
    };
};

const ConnectedSettings = connect(
    mapStateToProps,
    null
)(Settings);

module.exports = ConnectedSettings;
