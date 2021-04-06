import aggreg_site from "./images/vis_icons/aggreg_site.png";
import gateway from "./images/vis_icons/aggreg_gateway.png";
import bsc from "./images/vis_icons/bsc.png";
import rnc from "./images/vis_icons/rnc.png";
import osn from "./images/vis_icons/osn.png";
import ip from "./images/vis_icons/ip.png";
import radio from "./images/vis_icons/radio_site.png";
import cloud from "./images/vis_icons/cloud.png";
import mgw from './images/vis_icons/mgw.png';
import site from './images/vis_icons/site.png';

export default class IconModule {

    getIconForNode(type) {
        let icon = null;
        switch (type) {
            case 'AGGREGATE_SITE': icon = aggreg_site; break;
            case 'AGGREGATE_GATEWAY': icon = gateway; break;
            case 'BSC': icon = bsc; break;
            case 'RNC': icon = rnc; break;
            case 'OSN': icon = osn; break;
            case 'IP_EQUIP': icon = ip; break;
            case 'RADIO_SITE': icon = radio; break;
            case 'IP_Could': icon = cloud; break;
            case 'MGW': icon = mgw; break;
            case 'SITE': icon = site; break;
        }
        return icon
    }
}