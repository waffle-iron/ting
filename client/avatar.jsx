var React = require('react');

var Avatar = React.createClass({
    _getAvatar(username) {
        return 'https://avatars.githubusercontent.com/' + username.toLowerCase();
    },
    render() {
        var ret = null;

        if(this.props.username != null) {
            var src = this._getAvatar(this.props.username);
            ret = <img src={src}
                       alt={this.props.username}
                       className='avatar'
                       onClick={this.props.toggleUserMenu} />;
        }

        return (
            <div>
                {ret}
            </div>
        );
    }
});

module.exports = Avatar;
