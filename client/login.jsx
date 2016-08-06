var React = require('react');
var i18n = require('i18next-client');
var classNames = require('classnames');

var LoginForm = React.createClass({
    getInitialState() {
        return {
            validationStateUsername: true,
            validationStatePassword: true,
            validationState: true,
            errorStr: '',
            username: '',
            password: null,
            usernameChanged: false,
            passwordChanged: false,
            type: 'simpleLogin'
        };
    },
    _validateUsername(username) {
        var rex = /^[ά-ώα-ωa-z0-9]+$/i;

        if (username == '') {
            return 'username-empty';
        }
        else if (username.length > 20) {
            return 'username-length';
        }
        else if (!rex.test(username)) {
            return 'username-chars';
        }
        return true;
    },
    _validatePassword(password) {
        if (password == '') {
            return 'password-empty';
        }

        return true;
    },
    _handleError(validationState) {
        this.setState({
            validationState: validationState,
            errorStr: i18n.t('errors.' + validationState)
        });
    },
    _onUsernameChanged(username) {
        var validationStateUsername = this._validateUsername(username);
        this.setState({validationStateUsername, username});

        if (!this.state.usernameChanged) {
            this.setState({
                usernameChanged: true
            });
        }

        if (validationStateUsername !== true) {
            this._handleError(validationStateUsername);
        }
        else if (this.state.validationStatePassword !== true) {
            this._handleError(this.state.validationStatePassword);
        }
        else {
            this._handleError(true);
        }
    },
    _onPasswordChanged(password) {
        var validationStatePassword = this._validatePassword(password);
        this.setState({validationStatePassword, password});

        if (!this.state.passwordChanged) {
            this.setState({
                passwordChanged: true
            });
        }

        if (this.state.validationStateUsername !== true) {
            this._handleError(this.state.validationStateUsername);
        }
        else if (validationStatePassword !== true) {
            this._handleError(validationStatePassword);
        }
        else {
            this._handleError(true);
        }
    },
    onError(error) {
        this._handleError(error);
    },
    onSuccess() {
        $(React.findDOMNode(this.refs.usernameSetModal)).modal('hide');
    },
    handleChangeUsername(event) {
        this._onUsernameChanged(event.target.value);
    },
    handleChangePassword(event) {
        this._onPasswordChanged(event.target.value);
    },
    handleSubmit(event) {
        event.preventDefault();

        if (!this.state.usernameChanged) {
            this._onUsernameChanged('');
            return;
        }

        if (this.state.type == 'passwordLogin' && !this.state.passwordChanged) {
            this._onPasswordChanged('');
            return;
        }

        if (this.state.validationStateUsername !== true) {
            return;
        }

        if (this.state.type == 'passwordLogin') {
            if (this.state.validationStatePassword !== true) {
                return;
            }
        }

        this.props.onLoginIntention(this.state.username, this.state.password);
    },
    switchToPasswordLogin() {
        this.setState({type: 'passwordLogin'});
    },
    componentDidMount() {
        $(React.findDOMNode(this.refs.usernameSetModal)).modal('show');
        setTimeout(() => {
            React.findDOMNode(this.refs.username).focus();
        }, 300);
    },
    render() {
        var alertClasses = classNames({
            'alert': true,
            'alert-warning': true,
            'hidden': this.state.validationState === true
        });

        var haveAccLink = null,
            passwordField = null;

        if (this.state.type == 'simpleLogin') {
            haveAccLink = <div onClick={this.switchToPasswordLogin}>Έχω ήδη ψευδώνυμο</div>;
        }
        else if (this.state.type == 'passwordLogin') {
            passwordField = <input type='password'
                                   className='form-control input-small'
                                   placeholder={i18n.t('passwordSet.placeholder')}
                                   ref='password'
                                   onChange={this.handleChangePassword} />;
        }

        return (
            <div className='modal fade'
                 ref='usernameSetModal'
                 data-backdrop='static'
                 data-keyboard='false'
                 role='dialog'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='text-center'
                             id='login'>
                            <h1>Ting</h1>
                            <div className={alertClasses}
                                 role='alert'>
                                <p>{this.state.errorStr}</p>
                            </div>
                            <form id='username-set'
                                  onSubmit={this.handleSubmit}>
                                <input type='text'
                                       className='form-control input-small'
                                       placeholder={i18n.t('usernameSet.placeholder')}
                                       ref='username'
                                       onChange={this.handleChangeUsername} />
                                {passwordField}
                                <input type='submit'
                                       name='join'
                                       id='join'
                                       value={i18n.t('usernameSet.submit')}
                                       className='btn btn-primary' />
                            </form>
                            {haveAccLink}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = LoginForm;
