/*
* Rest Api module
* Use for call rest api methods from one hand
* It includes error handler
*
*/

import axios from 'axios';
import AlertModule from './AlertModule'

class RestApiModule {

    constructor() {
        this.alert = new AlertModule();

        const {
            REACT_APP_ENV: environment,
            REACT_APP_API_GATEWAY_PREPROD: preprod,
            REACT_APP_API_GATEWAY_PROD: prod,
            REACT_APP_API_GATEWAY: dev
        } = process.env;

        this.serverPath = (environment === "preprod")
            ? preprod
            : (environment === "prod")
                ? prod
                : dev;

        this.endpoints = {
            getConfig: {
                serviceName: process.env.REACT_APP_MATRIX_SERVICE,
                methodName: "/GetConfigFileStream"
            },
            login: {
                serviceName: process.env.REACT_APP_AUTH_SERVICE,
                methodName: "/LoginWithCredentials"
            },
            exceldata: {
                serviceName: process.env.REACT_APP_AUTH_SERVICE,
                methodName: "/GetExcelData"
            },
            logout: {
                serviceName: process.env.REACT_APP_AUTH_SERVICE,
                methodName: "/Logout"
            },
            checkToken: {
                serviceName: process.env.REACT_APP_AUTH_SERVICE,
                methodName: "/LoginWithToken"
            },
            saveRowAndSendFlxPoint:{
                serviceName: process.env.REACT_APP_AUTH_SERVICE,
                methodName: "/SaveRow"
            },
            getRegions: {
                serviceName: process.env.REACT_APP_AUTH_SERVICE,
                methodName: "/GetUserRegions"
            },
            ranFirst: {
                serviceName: process.env.REACT_APP_RAN_SERVICE,
                methodName: "/GetRANTopologyFirstLevelforRegion",
            },
            ranSecond: {
                serviceName: process.env.REACT_APP_RAN_SERVICE,
                methodName: "/GetRANTopologySecondLevelforAggregSite"
            },
            core: {
                serviceName: process.env.REACT_APP_CORE_SERVICE,
                methodName: "/CoreTopologyView"
            },
            wdm: {
                serviceName: process.env.REACT_APP_WDM_SERVICE,
                methodName: "/WDMTopologyView"
            },
            getMatrixDataCount: {
                serviceName: process.env.REACT_APP_MATRIX_SERVICE,
                methodName: "/GetConnectivityMatrixCountbyRegion"
            },
            getMatrixData: {
                serviceName: process.env.REACT_APP_MATRIX_SERVICE,
                methodName: "/GetConnectivtyMatrixforRegion"
            },
            saveRow: {
                serviceName: process.env.REACT_APP_MATRIX_SERVICE,
                methodName: "/SaveRow"
            },
            getPickList: {
                serviceName: process.env.REACT_APP_MATRIX_SERVICE,
                methodName: '/GetPickList'
            },
            checkRadioSite: {
                serviceName: process.env.REACT_APP_MATRIX_SERVICE,
                methodName: '/CheckIfRadioSiteExists'
            },
            isRadioSiteExists: {
                serviceName: process.env.REACT_APP_MATRIX_SERVICE,
                methodName: '/IsRadioSiteExist'
            },
            checkNewAggrSite: {
                serviceName: process.env.REACT_APP_MATRIX_SERVICE,
                methodName: '/CheckIfAggregSiteExists'
            },
            checkOldAggrSite: {
                serviceName: process.env.REACT_APP_MATRIX_SERVICE,
                methodName: '/CheckIfPreAggregSiteExists'
            },
            checkBscName: {
                serviceName: process.env.REACT_APP_MATRIX_SERVICE,
                methodName: '/CheckBSCNameExists'
            },
            checkRncName: {
                serviceName: process.env.REACT_APP_MATRIX_SERVICE,
                methodName: '/CheckRNCNameExists'
            },
            getMWListByTechMWSite: {
                serviceName: process.env.REACT_APP_MATRIX_SERVICE,
                methodName: '/GetMWEquipListByTechMWSite'
            },
            getMWAggreListByTechnoMWAggre: {
                serviceName: process.env.REACT_APP_MATRIX_SERVICE,
                methodName: '/GetMWEquipAggreListByTechnoMWAggre'
            },
            getIpListByIPTechno: {
                serviceName: process.env.REACT_APP_MATRIX_SERVICE,
                methodName: '/GetIpEquipListByIPTechno'
            },
            getMWPortListByMWEquip: {
                serviceName: process.env.REACT_APP_MATRIX_SERVICE,
                methodName: '/GetMWPortListByMWEquip'
            },
            getMWPortAggreListByMWEquipmentAggre: {
                serviceName: process.env.REACT_APP_MATRIX_SERVICE,
                methodName: '/GetMWPortAggreListByMWEquipmentAggre'
            },
            getIpPortListUnderIpEquip: {
                serviceName: process.env.REACT_APP_MATRIX_SERVICE,
                methodName: '/GetIpPortListUnderIpEquip'
            },
            exportData: {
                serviceName: process.env.REACT_APP_MATRIX_SERVICE,
                methodName: '/ExportDataMatrixToExcel'
            },
            importData: {
                serviceName: process.env.REACT_APP_MATRIX_SERVICE,
                methodName: '/ImportDataMatrixFromExcel'
            },
            getImportStatus: {
                serviceName: process.env.REACT_APP_MATRIX_SERVICE,
                methodName: '/GetImportStatus'
            },
            getLocksCount: {
                serviceName: process.env.REACT_APP_MATRIX_SERVICE,
                methodName: '/getLocksCount'
            },
            getRadioListByRegion: {
                serviceName: process.env.REACT_APP_MATRIX_SERVICE,
                methodName: '/GetRadioSiteByRegion'
            },
            getRegionByRadioSite: {
                serviceName: process.env.REACT_APP_MATRIX_SERVICE,
                methodName: '/GetRegionName'
            },
            lock: {
                serviceName: process.env.REACT_APP_MATRIX_SERVICE,
                methodName: '/TryLock'
            },
            unlock: {
                serviceName: process.env.REACT_APP_MATRIX_SERVICE,
                methodName: '/Unlock'
            }
        }
    }

    callApi(endpoint, dto) {

        return new Promise((res, rej) => {
            const {serviceName, methodName} = this.endpoints[endpoint];

            axios({
                method: "POST",
                url: `${this.serverPath}${serviceName}${methodName}`,
                data: dto
            }).then(async (response) => {

                //console.log(response);

                const {exec_status, error_code, error_message} = response.data;

                if (exec_status === 'success') {
                    res(response.data);
                }

                if (exec_status === 'error') {

                    const message = error_message ? error_message : "Null exception"

                    if (+error_code === 10) {
                        this.alert.showMessage('error', 'Error', message, true);
                    } else {
                        this.alert.showMessage('error', 'Error', message, false);
                    }

                    rej(false)
                }

            }).catch((err) => {

                this.alert.showMessage('error', 'Error', err, false);
                rej(false)
            })
        })

    }

    getImportEndpoint(endpoint) {

        const {serviceName, methodName} = this.endpoints[endpoint];

        return `${this.serverPath}${serviceName}${methodName}`;
    }
}

export default RestApiModule;