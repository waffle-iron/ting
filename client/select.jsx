const React = require('react');

const Select = React.createClass({
    Range(from, until) {
        var ret = [];

        for(var i=from; i<=until; ++i)
            ret.push(i);

        return ret;
    },

    render() {
        var elements = null,
            options = null,
            type = this.props.type;
            
        if (type == 'number') {
            elements = this.Range(this.props.from, this.props.until);
        }
        else if (type == 'container') {
            elements = this.props.container;
        }
        
        if(elements != null) {
            options = elements.map(function(elem, ind) {
                return <option key={ind}>{elem}</option>;
            });
        }

        return (
            <select>
                {options}
            </select>
        );
    }
});

module.exports = Select;
