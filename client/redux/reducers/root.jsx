const combineReducers = require('redux').combineReducers,
      usernameReducer = require('./username.jsx'),
      usersReducer = require('./users.jsx'),
      messagesReducer = require('./messages.jsx');

const rootReducer = combineReducers({
    username: usernameReducer,
    users: usersReducer,
    messages: messagesReducer
});

module.exports = rootReducer;
