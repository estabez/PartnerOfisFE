export const columnLogic = [
    {
        id: "status",
        rules: [
            {
                columnValue: "Implemented",
                changedId: "archived",
                changedValue: "No"
            },
            {
                columnValue: "Archived",
                changedId: "archived",
                changedValue: "Yes"
            }
        ]
    },
    {
        id: "newAggregSite",
        methodName: "CheckIfAggregSiteExists",
        rules: [
            {
                changedId: "aggregEquipIp"
            },
            {
                changedId: "raccordmentOsnZ"
            }
        ]
    },
    {
        id: "mwVendor",
        rules: [
            {
                changedId: "mwEquip"
            }
        ]
    },
    {
        id: "mwEquip",
        rules: [
            {
                changedId: "mwPort"
            }
        ]
    },
    {
        id: "mwPreAggregEquip",
        rules: [
            {
                changedId: "mwPreAggregPort"
            }
        ]
    },
    {
        id: "preAggregSite",
        rules: [
            {
                changedId: "mwPreAggregEquip"
            },
            {
                changedId: "raccordmentOsnA"
            }
        ]
    }
]