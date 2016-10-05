const React = require('react'),
      Avatar = require('./avatar.jsx'),
      Select = require('./select.jsx');

const Settings = React.createClass({
    getInitialState() {
        return {
            sex: ['Αγόρι', 'Κορίτσι', '-'],
            cities: []
        };
    },
    componentWillMount() {
        var cities = [];

        $.getJSON('/api/cities', (allCities) => {
            for (var i=0; i<allCities.length; ++i) {
                cities.push(allCities[i].name);
            }

            this.setState({cities});
        });
    },
    render() {
        return (
            <div>
                <div id='settings'>
                    <div className='icon-username'>
                        <h2>{this.props.username}</h2>
                        <div className='icon'>
                            <Avatar username={this.props.username} />
                            <span>Αλλαγή της εικόνας μου</span>
                        </div>
                    </div>

                    <div className='form'>
                        <p>
                            <label htmlFor='password'>Κωδικός</label>
                            <input type='password' id='password' />
                        </p>
                        <p>
                            <label htmlFor='email'>E-mail</label>
                            <input type='text' id='email' />
                        </p>

                        <p>
                            <label htmlFor='birth'>Ημερομηνία Γέννησης</label>
                            <Select id='birth' from={1} until={31} type='number' /> 
                            <Select from={1} until={12} type='number' />
                            <Select from={1920} until={2016} type='number' /> 
                        </p>

                        <p>
                            <label htmlFor='sex'>Φύλο</label>
                            <Select id='sex' container={this.state.sex} type='container' />
                        </p>

                        <p>
                            <label htmlFor='region'>Περιοχή</label>
                            <Select id='region' container={this.state.cities} type='container' />
                        </p>

                        <button>Αποθήκευσης</button>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Settings;

