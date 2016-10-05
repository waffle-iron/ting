const messagesReducer = function(state={}, action) {
    var new_state = null;

    switch (action.type) {
        case 'HISTORICAL_MESSAGES_AVAILABLE':
            new_state = Object.assign({}, action.messages);
        break;

        case 'UPDATE_TYPING_MESSAGES':
            new_state = Object.assign({}, state);
            
            $.each(action.messagesTyping, (messageid, message) => {
                if (message.message_content.trim().length == 0) {
                    delete new_state[messageid];
                }
                else {
                    if (new_state[messageid]) {
                        new_state[messageid].message_content = message.message_content;
                    }
                    else {
                        new_state[messageid] = {
                            message_content: message.message_content,
                            username: message.username,
                            target: message.target,
                            id: messageid,
                            typing: true,
                            message_type: message.message_type
                        };
                    }
                }
            });
        break;

        case 'MESSAGE':
            new_state = Object.assign({}, state);

            new_state[action.data.messageid].message_content = action.data.message_content;
            new_state[action.data.messageid].typing = false;
        break;
        
        case 'PART':
            new_state = Object.assign({}, state);

            for (var id in new_state) {
                if (new_state[id].username == action.username && new_state[id].typing) {
                    delete new_state[id];
                }
            }
        break;

        default:
            new_state = state;
        break;
    }

    return new_state;
};

module.exports = messagesReducer;
