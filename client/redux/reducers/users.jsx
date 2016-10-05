const usersReducer = function(state=[], action) {
    var new_state = null;

    switch (action.type) {
        case 'JOIN':
            new_state = state.concat(action.username);
        break;

        case 'PART':
            new_state = state.slice(0);

            new_state = new_state.filter((name) => {
                return action.username != name;
            });
        break;

        case 'LOGIN':
            new_state = action.payload.people;
        break;

        default:
            new_state = state;
        break;
    }

    return new_state;
};

module.exports = usersReducer;
