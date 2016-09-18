const React = require('react'),
      ReactDOM = require('react-dom'),
      emoticons = require('emoticons'),
      Message = require('./view.jsx'),
      _ = require('lodash');

const History = React.createClass({
    _wrapper: null,
    _scrollDown() {
        setTimeout(() => {
            this._wrapper.scrollTop = this._wrapper.scrollHeight;
        }, 30);
    },
    componentDidMount() {
        this._wrapper = ReactDOM.findDOMNode(this.refs.wrapper);

        $.getJSON('node_modules/emoticons/support/skype/emoticons.json', function(definition) {
            emoticons.define(definition);
        });
    },
    render() {
        const messageNodes = _.chain(this.props.messages)
            .values()
            .sortBy('id')
            .map(({id, username, message_content, typing, message_type}) => {
                return (
                    <Message key={id}
                             username={username}
                             own={username == this.props.username}
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
        this._scrollDown();
    }
});

module.exports = History;
