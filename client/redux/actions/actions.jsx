module.exports = {
    onLogin(username, people) {
        return {
            type: 'LOGIN',
            payload: {
                username: username,
                people: people
            }
        };
    },
    onJoin(username) {
        return {
            type: 'JOIN',
            username: username
        };
    },
    onHistoricalMessagesAvailable(messages) {
        return {
            type: 'HISTORICAL_MESSAGES_AVAILABLE',
            messages: messages
        };
    },
    onUpdateTypingMessages(messagesTyping) {
        return {
            type: 'UPDATE_TYPING_MESSAGES',
            messagesTyping: messagesTyping
        };
    },
    onMessage(data) {
        return {
            type: 'MESSAGE',
            data: data
        };
    },
    onPart(username) {
        return {
            type: 'PART',
            username: username
        };
    } 
};
