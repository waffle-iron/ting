const usernameReducer = function(state=null, action) {
    var new_state = null;

    switch (action.type) {
        case 'LOGIN':
            new_state = action.payload.username;
        break;
        
        default:
            new_state = state;
        break;
    }

    return new_state;
};

module.exports = usernameReducer;
