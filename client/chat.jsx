const ConnectedUserList = require('./containers/connected_userlist.jsx'),
      ConnectedHistory = require('./containers/message/connected_history.jsx'),
      MessageForm = require('./message/form.jsx'),
      React = require('react');

const Chat = React.createClass({
    render() {
        return (
            <div>
                <div className='app'>
                    <div className='nicklist'>
                        <ConnectedUserList />
                    </div>
                    <div className='chat'>
                        <ConnectedHistory channel={this.props.channel} />
                        <MessageForm
                                     channel={this.props.channel}
                                     onMessageSubmit={this.props.onMessageSubmit}
                                     onTypingUpdate={this.props.onTypingUpdate}
                                     onStartTyping={this.props.onStartTyping} />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Chat;
