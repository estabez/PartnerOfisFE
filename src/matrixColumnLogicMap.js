export const columnLogic = [
    {
        id: "etatCheckValue",
        isValue: ["Ready", "Not Ready"]
    },
    {
        id: "archivedCheckValue",
        isValue: ["NO"]
    },
    {
        id: "etat",
        rules: [
            {
                columnValue: "Ready",
                changedId: "archived",
                changedValue: "NO"
            },
            {
                columnValue: "Not Ready",
                changedId: "archived",
                changedValue: "NO"
            },
            {
                columnValue: "Archived",
                changedId: "archived",
                changedValue: "YES"
            }
        ]
    },
    {
        id: "radioSite",
        methodCaller: "checkRadioSite",
        paramName: "radioSite",
        executeRules: [
            {
                propId: "techMwSite",
            },
            {
                propId: "mwEquip",
            }
        ],
        ruleChain: [
            // rule chain will work on itself
            {
                parentResponse: true,
                methodCaller: "getRegionByRadioSite",
                parsingKey: "region",
                responseType: "object", // "string"
                rules: [
                    {
                        changedId: "region",
                        changedValue: null
                    }
                ]
            }
        ]
    },
    {
        id: "newAggrSite",
        methodCaller: "checkNewAggrSite",
        paramName: "newAggregSiteName",
        executeRules: [
            {
                propId: "technoMwAggre",
            },
            {
                propId: "mwEquipmentAggre"
            },
            {
                propId: "ipTechno"
            },
            {
                propId: "ipEquipment"
            }
        ]
    },
    {
        id: "oldAggrSite",
        methodCaller: "checkOldAggrSite",
        paramName: "oldAggrSite",
        rules: []
    },
    {
        id: "bscName",
        methodCaller: "checkBscName",
        paramName: "bscName",
        //additionalParams: ['siteTechnology'],
        rules: []
    },
    {
        id: "rncName",
        methodCaller: "checkRncName",
        paramName: "rncName",
        rules: []
    },
    {
        id: "techMwSite",
        methodCaller: "getMWListByTechMWSite",
        paramName: "techMwSite",
        additionalParams: ['radioSite'],
        rules: [
            {
                changedId: "mwEquip",
                changedValue: null
            }
        ]
    },{
        id: "mwEquip",
        methodCaller: "getMWPortListByMWEquip",
        paramName: "mwEquip",
        additionalParams: ['radioSite', 'techMwSite'],
        rules: [
            {
                changedId: "mwPort",
                changedValue: null
            }
        ]
    },
    {
        id: "technoMwAggre",
        methodCaller: "getMWAggreListByTechnoMWAggre",
        paramName: "technoMwAggre",
        additionalParams: ['newAggrSite'],
        rules: [
            {
                changedId: "mwEquipmentAggre",
                changedValue: null
            }
        ]
    },{
        id: "mwEquipmentAggre",
        methodCaller: "getMWPortAggreListByMWEquipmentAggre",
        paramName: "mwEquipmentAggre",
        additionalParams: ['technoMwAggre', 'newAggrSite'],
        rules: [
            {
                changedId: "mwPortAggre",
                changedValue: null
            }
        ]
    },
    {
        id: "ipTechno",
        methodCaller: "getIpListByIPTechno",
        paramName: "ipTechno",
        additionalParams: ['newAggrSite'],
        rules: [
            {
                changedId: "ipEquipment",
                changedValue: null
            }
        ]
    },
    {
        id: "ipEquipment",
        methodCaller: "getIpPortListUnderIpEquip",
        paramName: "ipEquipment",
        additionalParams: ['ipTechno','newAggrSite'],
        rules: [
            {
                changedId: "ipPort",
                changedValue: null
            }
        ]
    }
]