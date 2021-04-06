import Matrix from './views/Matrix';
import Ran from './views/Ran';
import Core from './views/Core';
import Wdm from './views/Wdm';

export default class Route {

    constructor() {

        this.routes = [
            {
                path: "/matrix",
                component: Matrix,
                exact: false
            },
            {
                path: "/ran",
                component: Ran,
                exact: false
            },
            {
                path: "/core",
                component: Core,
                exact: false
            },
            {
                path: "/wdm",
                component: Wdm,
                exact: false
            }
        ];
    }

    getRoute(path) {
        let route = this.routes.find((item) => {
            return (item.path === path)
        });

        if (route)
            return {
                status: 200,
                route
            };
        else
            return {
                status: 404,
                route: {
                    component: null,
                    exact: false
                }
            };
    }
}
