const connect = require('react-redux').connect,
      UserList = require('../userlist.jsx');

const mapStateToProps = function(state) {
    return {
        users: state.users
    };
};

const ConnectedUserList = connect(
    mapStateToProps,
    null
)(UserList);

module.exports = ConnectedUserList;

