/*
* Authentication Manage Module
*
*/

import RestApiModule from './RestApiModule'
import CryptoModule from './CryptoModule'

import store from './redux/store'
import {setToken, setAuthUser, setRegions, setSelectedRegion, setRadioSites, setCompany} from './redux/actions'

class AuthModule {

    constructor() {
        this.store = store;
        this.restApi = new RestApiModule();
        this.crypto = new CryptoModule();

        this.roleDefinitions = [];
    }

    login(u, p) {

        return new Promise((res, rej) => {

            this.restApi.callApi('login', {

                username: u,
                password: this.crypto.encrypt(p)

            }).then(async (response) => {

                const {token} = response;
                const {company} = response;

                console.log(company);
                this.store.dispatch(setCompany(company));
                await this.registerUser(token, u).then(r => res(r));

            }).catch((err) => {
                rej({
                    loginError: true,
                    err: err
                })
            })
        })
    }

    constructRoleDefinitions(token) {

        return new Promise((res, rej) => {

            this.restApi.callApi('getConfig', {
                token
            }).then(response => {
                this.roleDefinitions = JSON.parse(response.configurations.roleDefinitions);
                res(true)
            })
        })
    }

    registerUser(token, u) {

        return new Promise (async (res, rej) => {
            res(true);
            //await this.constructRoleDefinitions(token);

          /*  await this.userRegions(token).then(async (regions) => {

                this.store.dispatch(setRegions(regions));
                this.store.dispatch(setSelectedRegion(regions[0]));

                // Set radio site list for default region
                await this.defaultRadioSiteList(token, regions[0]);

            }).catch((empty) => {
                this.store.dispatch(setRegions(empty));
                this.store.dispatch(setSelectedRegion(null));

            });
*/
         /*   this.roleDef(token).then(role => {

                const user = {
                    name: u,
                    role
                };

                this.store.dispatch(setToken(token));
                this.store.dispatch(setAuthUser(user));
                res(true);
            }).catch(() =>{
                rej(true)
            })*/
        })
    }

    userRegions(token) {
        // this method changed to get all picklist in db
        // In prev version we got only user's regions

        return new Promise((res, rej) => {

            this.restApi.callApi('getPickList', {
                pickListName: "regionPicklist",
                token
            }).then((response) => {

                const regions = response.pickList.map((item) => {
                    return item.regionPicklist_value;
                });

                res(regions.sort());
            }).catch(err => {
                rej([])
            })
        });
    }

    defaultRadioSiteList(token, region) {
        // It'll set radio site list for default region for user.
        // Radio site list will change once region changed

        return new Promise((res, rej) => {

            this.restApi.callApi('getRadioListByRegion', {
                region,
                token
            }).then(async (response) => {

                const list = await response.List.map((item) => {
                    return item.value;
                });


                this.store.dispatch(setRadioSites(list.sort()));

                res(true);
            }).catch(err => {
                //this.store.dispatch(setRadioSites([]));

                rej(false)
            })
        });
    }

    getRole(role) {
        if (this.roleDefinitions) {
            return this.roleDefinitions.find((item) => {
                return (item.roleName === role)
            })
        }
    }

    roleDef(token) {

        return new Promise((res, rej) => {

            this.restApi.callApi('getRoles', {
                token
            }).then((response) => {

                let roleDefinition = {
                    mainPage: '',
                    permittedColumns: [],
                    permittedPages: []
                }

                if (response) {
                    //console.log(response)
                    response.roles.map(item => {

                        const {mainPage, permittedColumns, permittedPages} = this.getRole(item.role);

                        if (permittedColumns !== null && typeof permittedColumns === 'object') {
                            permittedColumns.map(col => {
                                if (!roleDefinition.permittedColumns.includes(col))
                                    roleDefinition.permittedColumns.push(col);
                            })
                        }

                        if (permittedPages !== null && typeof permittedPages === 'object') {
                            permittedPages.map(col => {
                                if (!roleDefinition.permittedPages.includes(col))
                                    roleDefinition.permittedPages.push(col);
                            })
                        }

                        if (roleDefinition.mainPage === '') {
                            roleDefinition.mainPage = mainPage;
                        }
                    })
                }
                res(roleDefinition);

            }).catch(e => rej(e));
        })
    }
}

export default AuthModule;