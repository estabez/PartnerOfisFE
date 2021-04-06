export const groupingMap = [
    {
        label: "",
        color: "color10",
        colspan: 0,
        columns: [
            {
                data: "LOCK_STATUS",
                label: "Status",
                type: "text",
                readOnly: true, // primary priority for writable columns
                width: 90,
                rerenderer: "iconForLockStatusInCell"
            }
        ]
    },
    {
        label: "Primary",
        color: "color1",
        colspan: 0,
        columns: [
            {
                importColumnId: "region",
                data: "region",
                label: "Region",
                type: "dropdown",
                readOnly: false,
                //initialValue: "Not Specified",
                mandatory: false,
                readOnlyInEditMode: true,
                width: 100
            },
            {
                data: "name",
                label: "Name",
                type: "text",
                readOnly: true, // primary priority for writable columns
                mandatory: false,
                width: 100
            },
            {
                importColumnId: "etat",
                data: "etat",
                label: "ETAT",
                type: "dropdown",
                initialValue: "Ready",
                allowInvalid: false,
                mandatory: true,
                width: 110
            },
            {
                data: "archived",
                label: "Archived",
                type: "dropdown",
                initialValue: "NO",
                readOnly: true,
                mandatory: true,
                width: 100
            },
            {
                importColumnId: "oldAggrSite",
                data: "oldAggrSite",
                label: "OLD Aggreg site",
                type: "text",
                mandatory: false,
                width: 130
            },
            {
                importColumnId: "newAggrSite",
                data: "newAggrSite",
                label: "NEW Aggreg site",
                type: "text",
                mandatory: true,
                width: 130
            },
            {
                importColumnId: "radioSite",
                data: "radioSite",
                label: "Radio Site",
                type: "text",
                mandatory: true,
                readOnlyInEditMode: true,
                width: 120
            },
            {
                data: "revisionNumber",
                label: "Revision Number",
                type: "numeric",
                readOnly: true,
                mandatory: false,
                width: 130
            },
            {
                importColumnId: "projet",
                data: "project",
                label: "Project",
                type: "dropdown",
                allowInvalid: false,
                mandatory: false,
                width: 100
            },
            {
                importColumnId: "transmissionType",
                data: "transmissionType",
                label: "Transmission Type",
                type: "dropdown",
                allowInvalid: false,
                mandatory: false,
                width: 150
            },
            {
                importColumnId: "dateIng",
                data: "dateIng",
                label: "Date ING",
                type: "date",
                dateFormat: "MM/DD/YYYY",
                datePickerConfig: {
                    firstDay: 1
                },
                mandatory: false,
                width: 100
            },
            {
                importColumnId: "siteTechnology",
                data: "siteTechnology",
                label: "Site Technology",
                type: "dropdown",
                initialValue: "2G/3G/4G",
                allowInvalid: false,
                mandatory: false,
                width: 120
            },
        ]
    },
    {
        label: "Information",
        color: "color2",
        colspan: 0,
        columns: [
            {
                data: "comments",
                label: "Comments",
                type: "text",
                mandatory: false,
                width: 100
            }
        ]
    },
    {
        label: "Microwave Part",
        color: "color3",
        colspan: 0,
        columns: [
            {
                importColumnId: "sVlan",
                data: "sVlan",
                label: "SVLAN",
                type: "dropdown",
                allowInvalid: false,
                mandatory: false,
                width: 100
            },
            {
                importColumnId: "techMwSite",
                data: "techMwSite",
                label: "TECH MW SITE",
                type: "dropdown",
                allowInvalid: false,
                mandatory: false,
                width: 150
            },
            {
                importColumnId: "mwequipment",
                data: "mwEquip",
                label: "MW Equipment",
                type: "dropdown",
                allowInvalid: true,
                mandatory: false,
                width: 250
            },
            {
                importColumnId: "mwPort",
                data: "mwPort",
                label: "MW Port",
                type: "dropdown",
                allowInvalid: true,
                mandatory: false,
                width: 150
            },
            {
                importColumnId: "technoMwAggre",
                data: "technoMwAggre",
                label: "TECHNO MW AGGRE",
                type: "dropdown",
                allowInvalid: false,
                mandatory: false,
                width: 150
            },
            {
                importColumnId: "mwEquipmentAggre",
                data: "mwEquipmentAggre",
                label: "MW EQUIPMENT AGGRE",
                type: "dropdown",
                allowInvalid: true,
                mandatory: false,
                width: 150
            },
            {
                importColumnId: "mwPortAggre",
                data: "mwPortAggre",
                label: "MW PORT AGGRE",
                type: "dropdown",
                allowInvalid: true,
                mandatory: false,
                width: 150
            },
            {
                importColumnId: "mwportagredescr",
                data: "mwPortAggreDesc",
                label: "MW PORT AGGRE DESCR",
                type: "text",
                mandatory: false,
                width: 150
            },
        ]
    },
    {
        label: "SDH Part",
        color: "color4",
        colspan: 0,
        columns: [
            {
                importColumnId: "RaccordementSdhSite",
                data: "RaccordementSdhSite",
                label: "Raccordement SDH Site",
                type: "text",
                mandatory: false,
                width: 150
            },
            {
                importColumnId: "sdhEquipment",
                data: "sdhEquipment",
                label: "SDH Equipment",
                type: "text",
                mandatory: false,
                width: 150
            },
            {
                importColumnId: "sdhEquipmentPortType",
                data: "sdhEquipmentPortType",
                label: "SDH Equipment PORT TYPE",
                type: "text",
                mandatory: false,
                width: 150
            },
            {
                importColumnId: "sdhEquipmentPortDesc",
                data: "sdhEquipmentPortDesc",
                label: "SDH Equipment PORT DESC",
                type: "text",
                mandatory: false,
                width: 150
            },
            {
                importColumnId: "raccordementSdhAggreSite",
                data: "raccordementSdhAggreSite",
                label: "Raccordement SDH AGGRE Site",
                type: "text",
                mandatory: false,
                width: 150
            },
            {
                importColumnId: "sdhAggreEquipment",
                data: "sdhAggreEquipment",
                label: "SDH AGGRE Equipment",
                type: "text",
                mandatory: false,
                width: 150
            },
            {
                importColumnId: "sdhEquipmentPortAggreDesc",
                data: "sdhEquipmentPortAggreDesc",
                label: "SDH Equipment PORT AGGRE DESC",
                type: "text",
                mandatory: false,
                width: 150
            },
        ]
    },
    {
        label: "FO Part",
        color: "color5",
        colspan: 0,
        columns: [
            {
                importColumnId: "ticketNumber",
                data: "ticketNumber",
                label: "Ticket Number",
                type: "text",
                mandatory: false,
                width: 150
            },
            {
                importColumnId: "portSite",
                data: "portSite",
                label: "PORT SITE",
                type: "text",
                mandatory: false,
                width: 150
            },
            {
                importColumnId: "portAggre",
                data: "portAggre",
                label: "PORT AGGRE",
                type: "text",
                mandatory: false,
                width: 150
            }
        ]
    },
    {
        label: "IP Part",
        color: "color6",
        colspan: 0,
        columns: [
            {
                importColumnId: "ipTechno",
                data: "ipTechno",
                label: "IP TECHNO",
                type: "dropdown",
                allowInvalid: false,
                mandatory: false,
                width: 150
            },
            {
                importColumnId: "ipEquipment",
                data: "ipEquipment",
                label: "IP EQUIPMENT",
                type: "dropdown",
                allowInvalid: true,
                mandatory: false,
                width: 150
            },
            {
                importColumnId: "ipPort",
                data: "ipPort",
                label: "IP PORT",
                type: "dropdown",
                allowInvalid: true,
                mandatory: false,
                width: 150
            },
            {
                importColumnId: "ipportdescri",
                data: "ipPortDescr",
                label: "IP PORT DESCR",
                type: "dropdown",
                allowInvalid: false,
                mandatory: false,
                width: 150
            }
        ]
    },
    {
        label: "Radio Side",
        color: "color7",
        colspan: 0,
        columns: [
            {
                importColumnId: "type",
                data: "type",
                label: "Type",
                type: "dropdown",
                allowInvalid: false,
                mandatory: false,
                width: 150
            },
            {
                importColumnId: "boardType",
                data: "boardType",
                label: "Board Type",
                type: "dropdown",
                allowInvalid: false,
                mandatory: false,
                width: 150
            },
            {
                importColumnId: "o&m",
                data: "om",
                label: "O&M",
                type: "numeric",
                initialValue: "13",
                mandatory: false,
                width: 120
            },
            {
                importColumnId: "nbIp",
                data: "nbIp",
                label: "NB IP",
                type: "text",
                initialValue: "10.251.0.0",
                validator: "ipValidator",
                mandatory: false,
                width: 120
            },
            {
                importColumnId: "Gw",
                data: "Gw",
                label: "GW",
                type: "text",
                initialValue: "10.251.0.0",
                validator: "ipValidator",
                mandatory: false,
                width: 120
            },
            {
                importColumnId: "mask",
                data: "mask",
                label: "Mask",
                initialValue: "255.255.255.192",
                validator: "ipValidator",
                type: "text",
                mandatory: false,
                width: 120
            },
            {
                importColumnId: "2emeIp",
                data: "2emeIp",
                label: "2eme IP",
                validator: "ipValidator",
                type: "text",
                mandatory: false,
                width: 110
            },
            {
                importColumnId: "ntpIp",
                data: "ntpIp",
                label: "NTP IP",
                validator: "ipValidator",
                type: "text",
                mandatory: false,
                width: 110
            },
            {
                importColumnId: "ntpGw",
                data: "ntpGw",
                label: "NTP GW",
                //validator: "ipValidator",
                type: "text",
                mandatory: false,
                width: 110
            }
        ]
    },
    {
        label: "RNC Side",
        color: "color8",
        colspan: 0,
        columns: [
            {
                importColumnId: "rncName",
                data: "rncName",
                label: "RNC Name",
                type: "dropdown",
                allowInvalid: false,
                mandatory: false,
                width: 100
            },
            {
                importColumnId: "rncPort",
                data: "rncPort",
                label: "RNC PORT",
                type: "text",
                mandatory: false,
                width: 150
            },
            {
                importColumnId: "rncIp",
                data: "rncIp",
                label: "RNC IP",
                validator: "ipValidator",
                type: "text",
                mandatory: false,
                width: 100
            }
        ]
    },
    {
        label: "2G Site Side",
        color: "color9",
        colspan: 0,
        columns: [
            {
                importColumnId: "bscName",
                data: "bscName",
                label: "BSC Name",
                type: "dropdown",
                allowInvalid: false,
                mandatory: false,
                width: 120
            },
            {
                importColumnId: "bscPort",
                data: "bscPort",
                label: "BSC PORT",
                type: "text",
                mandatory: false,
                width: 130
            },
            {
                importColumnId: "bscIp",
                data: "bscIp",
                label: "BSC IP",
                validator: "ipValidator",
                type: "text",
                initialValue: "10.137.0.0",
                mandatory: false,
                width: 110
            },
            {
                importColumnId: "nexthopebsc",
                data: "bscNextHopIp",
                label: "Next Hope BSC",
                validator: "ipValidator",
                type: "text",
                initialValue: "10.137.0.0",
                mandatory: false,
                width: 120
            }
        ]
    },
    {
        label: "",
        color: "color10",
        colspan: 0,
        columns: [
            {
                data: "USER_NAME",
                label: "Lock By User",
                type: "text",
                readOnly: true, // primary priority for writable columns
                width: 120
            },
            {
                data: "LOCK_TIME",
                label: "Lock Time",
                type: "text",
                readOnly: true, // primary priority for writable columns
                width: 120
            }
        ]
    },
];
