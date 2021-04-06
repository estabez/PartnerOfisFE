/*
* User Role definitions and tools
*
*/
import RestApiModule from './RestApiModule'

export default class RoleModule {

    constructor(token) {
        this.restApi = new RestApiModule();
        this.roleDefinitions = [];

        this.restApi.callApi('getConfig', {
            token
        }).then(response => {
            this.roleDefinitions = JSON.parse(response.configurations.roleDefinitions);
        })
    }

    getRole(role) {
        if (this.roleDefinitions) {
            return this.roleDefinitions.find((item) => {
                return (item.roleName === role)
            })
        }
    }
}
