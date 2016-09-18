const React= require('react'),
      ReactDOM = require('react-dom'),
      i18n = require('i18next-client'),
      Router = require('react-router').Router,
      Route = require('react-router').Route,
      IndexRoute = require('react-router').IndexRoute,
      hashHistory = require('react-router').hashHistory,
      Provider = require('react-redux').Provider,
      createStore = require('redux').createStore,
      RootReducer = require('./redux/reducers/root.jsx'),
      ConnectedTing = require('./containers/connected_ting.jsx'),
      ConnectedSettings = require('./containers/connected_settings.jsx'),
      Chat = require('./chat.jsx');


i18n.init(
    {
        resGetPath:' locales/__lng__.json',
        lng: 'el-GR'
    },
    () => {
        ReactDOM.render((
                <Provider store={store}>
                    <Router history={hashHistory}>
                        <Route path='/' component={ConnectedTing}>
                            <IndexRoute component={Chat} />
                            <Route path='/settings' component={ConnectedSettings} />
                        </Route>
                    </Router>
                </Provider>), document.getElementsByClassName('ting')[0]);
    }
);
