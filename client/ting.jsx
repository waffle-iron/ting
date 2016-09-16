const UserList = require('./userlist.jsx'),
      LoginForm = require('./login.jsx'),
      TopBar = require('./topbar.jsx'),
      History = require('./message/history.jsx'),
      MessageForm = require('./message/form.jsx'),
      React = require('react'),
      Analytics = require('./analytics.js'),
      i18n = require('i18next-client'),
      io = require('socket.io-client'),
      config = require('./config.jsx'),
      _ = require('lodash'),
      Settings = require('./settings.jsx'),
      Router = require('react-router').Router,
      Route = require('react-router').Route,
      hashHistory = require('react-router').hashHistory;

const Ting = React.createClass({
    _socket: null,
    onLogin(username, people) {
        this.refs.topBar.onLogin(username);
        this.props.onLogin(username, people);

        // currently `type` is always 'channel'
        $.getJSON('/api/messages/channel/' + this.state.channel, (messages) => {
            const history = _.indexBy(messages, 'id');

            this.props.onHistoricalMessagesAvailable(history);
        });
    },
    getInitialState() {
        const url = location.href,
              parts = url.split('/');
        var [channel] = parts.slice(-1);

        /*if (channel == '' || channel == '?') {
            channel = 'ting';
        }*/

        channel = 'ting';

        return {
            channel,
            intendedUsername: null,
            intendedPassword: null,
            // TODO(dionyziz): race conditions and queues
            currentMessageId: null
        };
    },
    componentWillMount() {
        const URL = window.location.hostname + ':' + config.port;
        this._socket = io.connect(URL, {secure: config.websocket.secure});

        this._socket.on('login-response', ({success, people, error}) => {
            if (!success) {
                this.refs.loginForm.onError(error);
            }
            else {
                this.refs.loginForm.onSuccess();

                var peopleList = _.chain(people)
                    .without(this.intendedUsername)
                    .value();

                this.onLogin(this.state.intendedUsername, peopleList);
            }
        });

        this._socket.on('message', (data) => {
            this.props.onMessage(data);
        });

        this._socket.on('part', (username) => {
            this.props.onPart(username);
        });

        this._socket.on('join', (username) => {
            if (username != this.state.intendedUsername) {
                this.props.onJoin(username);
            }
        });

        this._socket.on('start-typing-response', (messageid) => {
            this.setState({currentMessageId: messageid});
        });

        this._socket.on('update-typing-messages', (messagesTyping) => {
            this.props.onUpdateTypingMessages(messagesTyping);
        });

        });

        Analytics.init();
    },
    onMessageSubmit(message, messageType) {
        if (this.state.currentMessageId == null) {
            //console.log('Skipping message submit');
            return;
        }

        const data = {
            type: 'channel',
            target: this.state.channel,
            message_content: message,
            messageid: this.state.currentMessageId,
            message_type: messageType
        };
        this._socket.emit('message', data);

        Analytics.onMessageSubmit(message);

        this.setState({currentMessageId: null});
    },
    onStartTyping(message, messageType) {
        var data = {
            type: 'channel',
            target: this.state.channel,
            message_content: message,
            message_type: messageType
        };
        this._socket.emit('start-typing', data);
    },
    onTypingUpdate(message) {
        if (this.state.currentMessageId == null) {
            //console.log('Skipping typing-update');
            return;
        }

        var data = {
            message_content: message,
            messageid: this.state.currentMessageId
        };
        this._socket.emit('typing-update', data);
    },
    onLoginIntention(intendedUsername, intendedPassword) {
        this.setState({intendedUsername, intendedPassword});

        Analytics.onLoginIntention(intendedUsername);
        this._socket.emit('login', intendedUsername, intendedPassword);
    },
    render() {
        const children = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, {
                channel: this.state.channel,
                onMessageSubmit: this.onMessageSubmit,
                onTypingUpdate: this.onTypingUpdate,
                onStartTyping: this.onStartTyping
            })
        );

        return (
            <div>
                <div className='top'>
                    <h1>Ting</h1>
                    <TopBar ref='topBar' />
                </div>

                {children}

                <LoginForm ref='loginForm'
                           onLoginIntention={this.onLoginIntention} />
            </div>
        );
    }
});

i18n.init(
    {
        resGetPath:' locales/__lng__.json',
        lng: 'el-GR'
    },
    () => {
        React.render((
                <Router history={hashHistory}>
                    <Route path='/' component={Ting} />
                    <Route path='/settings' component={Settings} />
                </Router>), document.getElementsByClassName('ting')[0]);
    }
);
