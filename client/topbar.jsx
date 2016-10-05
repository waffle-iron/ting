const React = require('react'),
      Avatar = require('./avatar.jsx'),
      Link = require('react-router').Link;

const TopBar = React.createClass({ 
    getInitialState() {
        return {
            myUsername: null,
            showMenu: false
        };
    },
    onLogin(myUsername) {
        this.setState({myUsername});
    },
    toggleUserMenu() {
        if (this.state.showMenu === true) {
            this.setState({showMenu: false});
        }
        else {
            this.setState({showMenu: true});
        }
    },
    render() {
        var menu = null;

        if (this.state.showMenu === true) {
            menu = <ul className='menu'>
                    <li className='settings'><Link to='/settings'>Ρυθμίσεις</Link></li>
                    <li className='logout'>Έξοδος</li>
                   </ul>;
        }

        return (
            <div>
                <Avatar toggleUserMenu={this.toggleUserMenu} username={this.state.myUsername} />
                {menu}
            </div>
        );
    }
});

module.exports = TopBar;
