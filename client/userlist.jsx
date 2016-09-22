const React = require('react'),
      Avatar = require('./avatar.jsx');

const UserList = React.createClass({
    render() {
        var userNodes = this.state.users.map((user) => {
            return (
                <User key={user} username={user} />
            );
        });

        return (
            <ul id='online-list'>
                <li className='active'><span>ting</span></li>
                {userNodes}
            </ul>
        );
    }
});

const User = React.createClass({
    render() {
        return (
            <li>
                <Avatar username={this.props.username} />
                <span>{this.props.username}</span>
            </li>
        );
    }
});

module.exports = UserList;
