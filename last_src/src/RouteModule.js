import Matrix from './views/Matrix';
import Ran from './views/Ran';
import Core from './views/Core';
import Wdm from './views/Wdm';
import Help from "./views/Help";
import Main from "./views/Main";
import Siparis from "./views/Siparis";
import SiparisDetay from "./components/SiparisDetay";
import Vendor from "./views/Vendor";
import Fatura from "./views/Fatura";

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
            },
            {
                path: "/help",
                component: Help,
                exact: false
            },
            {
                path: "/main",
                component: Main,
                exact: false
            },
            {
                path: "/siparisler",
                component: Siparis,
                exact: false
            },
            {
                path: "/siparisDetay",
                component: SiparisDetay,
                exact: false
            },
            {
                path: "/vendor",
                component: Vendor,
                exact: false
            },
            {
                path: "/fatura",
                component: Fatura,
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
