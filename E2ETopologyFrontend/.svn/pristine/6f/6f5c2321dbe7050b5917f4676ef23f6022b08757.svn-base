/*
* User Role definitions and tools
*
*/
export default class RoleModule {

    constructor() {
        this.roleDefinitions = [
            {
                roleName: "Admin",
                permittedPages: ['/matrix', '/ran', '/wdm', '/core'],
                permittedColumns: 'all',
                mainPage: '/matrix'
            },
            {
                roleName: "E2E BSS",
                permittedPages: ['/matrix', '/ran'],
                permittedColumns: [
                    'region',
                    'etat',
                    'oldAggrSite',
                    'newAggrSite',
                    'radioSite',
                    'revisionNumber',
                    'project',
                    'siteTechnology',
                    'sVlan',
                    'techMwSite',
                    'mwEquip',
                    'mwPort',
                    'technoMwAggre',
                    'mwEquipmentAggre',
                    'mwPortAggre',
                    'mwPortAggreDesc',
                    'type',
                    'boardType',
                    'om',
                    'nbIp',
                    'Gw',
                    'mask',
                    '2emeIp',
                    'ntpIp',
                    'ntpGw',
                    'rncName',
                    'rncPort',
                    'rncIp',
                    'bscName',
                    'bscPort',
                    'bscPort',
                    'bscNextHopIp'
                ],
                mainPage: '/matrix'
            },
            {
                roleName: "E2E TRANS",
                permittedPages: ['/matrix', '/ran'],
                permittedColumns: [
                    'oldAggrSite',
                    'newAggrSite',
                    'radioSite',
                    'transmissionType',
                    'sVlan',
                    'techMwSite',
                    'mwEquip',
                    'mwPort',
                    'technoMwAggre',
                    'mwEquipmentAggre',
                    'mwPortAggre',
                    'mwPortAggreDesc',
                    'RaccordementSdhSite',
                    'sdhEquipment',
                    'sdhEquipmentPortType',
                    'sdhEquipmentPortDesc',
                    'raccordementSdhAggreSite',
                    'sdhAggreEquipment',
                    'sdhEquipmentPortAggreDesc',
                    'ticketNumber',
                    'portSite',
                    'portAggre',
                    'ipTechno',
                    'ipEequipment',
                    'ipPort',
                    'ipPortDescr',
                    'rncName',
                    'rncPort',
                    'rncIp',
                    'bscName',
                    'bscPort',
                    'bscPort',
                    'bscNextHopIp'
                ],
                mainPage: '/matrix'
            },
            {
                roleName: "E2E RO",
                permittedPages: ['/matrix', '/ran'],
                permittedColumns: null,
                mainPage: '/matrix'
            },
            {
                roleName: "WDM Topology",
                permittedPages: ['/wdm'],
                permittedColumns: null,
                mainPage: '/wdm'
            },
            {
                roleName: "Core Topology",
                permittedPages: ['/core'],
                permittedColumns: null,
                mainPage: '/core'
            }
        ]
    }

    getRole(role) {
        return this.roleDefinitions.find((item) => {
            return (item.roleName === role)
        })
    }
}
