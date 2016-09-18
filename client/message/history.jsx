const React = require('react'),
      ReactDOM = require('react-dom'),
      emoticons = require('emoticons'),
      Message = require('./view.jsx'),
      _ = require('lodash');

const History = React.createClass({
    _wrapper: null,
    _title: document.title,
    _audio: new Audio('static/sounds/message_sound.mp3'),
    _scrollDown() {
        setTimeout(() => {
            this._wrapper.scrollTop = this._wrapper.scrollHeight;
        }, 30);
    },
    _updateTitle() {
        var titlePrefix;

        if (this.state.active || this.state.unread == 0) {
            titlePrefix = '';
        }
        else {
            titlePrefix = '(' + this.state.unread + ') ';
        }

        document.title = titlePrefix + this._title;
    },
    getInitialState() {
        return {
            unread: 0,
            active: true
        };
    },
    componentDidMount() {
        this._wrapper = ReactDOM.findDOMNode(this.refs.wrapper);

        $.getJSON('node_modules/emoticons/support/skype/emoticons.json', function(definition) {
            emoticons.define(definition);
        });

        $(document).on({
            show: () => {
                this.setState({
                    active: true,
                    unread: 0
                });
            },
            hide: () => {
                this.setState({
                    active: false
                });
            }
        });
    },
    render() {
        const messageNodes = _.chain(this.state.messages)
            .values()
            .sortBy('id')
            .map(({id, username, message_content, typing, message_type}) => {
                return (
                    <Message key={id}
                             username={username}
                             own={username == this.state.myUsername}
                             message_content={message_content}
                             typing={typing}
                             messageType={message_type} />
                );
            })
            .value();

        return (
            <div className='history'>
                <div className='history-wrapper' id='scroller' ref='wrapper'>
                    <ul id='message-list'>
                        {messageNodes}
                    </ul>
                </div>
            </div>
        );
    },
    componentDidUpdate() {
        this._updateTitle();
        this._scrollDown();
    }
});

module.exports = History;
