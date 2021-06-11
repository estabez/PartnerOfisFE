import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import RouteModule from '../RouteModule';
import Forbidden from '../views/403';
import NotFound from '../views/404'


export const PrivateRoute = ({component: Component, ...rest}) => {

    const {authUser, location} = rest;

    const routes = new RouteModule();
    const requestedPath = location.pathname;

    let route = routes.getRoute(requestedPath);

    if (route.status === 200 &&
        authUser !== null &&
        !authUser.role.permittedPages.includes(requestedPath)) {

        route.status = 403;
        route.route.component = Forbidden;
        route.route.exact = false;

    } else if (route.status === 404) {
        route.route.component = NotFound;
    }

    rest = {...rest, ...route.route};

    return (

        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /signin page
        <Route {...rest} render={props => (
            localStorage.getItem('e2eToken')
                ? <Component {...props} />
                : <Redirect to="/login" />
        )} />
    );
};