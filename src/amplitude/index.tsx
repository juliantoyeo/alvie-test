import * as Amplitude from 'expo-analytics-amplitude';


Amplitude.initialize("08c9ee18dfdbde19c858b154c6ee0787")
export {Amplitude}

export const AMPLITUDE_EVENTS = {
    bottomTabMenu: {
        click_meteo: "click_bottomtabmenu_meteo",
        click_pulv: "click_bottomtabmenu_pulverisation",
        click_realtime: 'click_bottomtabmenu_realtime',
        click_interv: "click_bottomtabmenu_intervention"
    },
    barCodeScreen: {
        loggedin: "loggedin_barcodescreen",
    },
    waitActivationScreen : {
        render: "render_waitactivationscreen",
    },
    meteoBriefScreen : {
        render: "render_meteobriefscreen",
        click_hygoMeteoPhyto: "click_meteobriefscreen_hygometeophyto"
    },
    meteoDetailedScreen: {
        render: "render_meteodetailedscreen",
        click_goToPulvDetails: "click_meteodetailedscreen_gotodetails"
    },
    meteoDetailedDetailsScreen: {
        render: "render_meteodetaileddetailsscreen",
    },
    meteoRadarScreen: {
        render: "render_meteoradarscreen",
    },
    pulv2_parcel: {
        render: "render_pulv2parcel",
        click_toPulv2Product: "click_pulv2parcel_topulv2product", 
    },
    pulv2_product: {
        click_toPulv2Slot: "click_pulv2product_topulv2slot", 
        click_buses: "click_pulv2product_buses",
        click_favorites: "click_pulv2product_favorites"
    },
    pulv2_slot: {
        click_toPulv2Report: "click_pulv2slot_topulv2report", 
    },
    pulv2_report: {
        click_toHome: "click_pulv2report_tohome", 
    },
    nextPulvScreen : {
        render: "render_nextpulverisationscreen", 
        click_goToPulvDetails: "click_nextpulverisationscreen_gotopulvdetails"
    },
    PulvDetailsScreen :  {
        render: "render_nextpulverisationdetailsscreen",
        click_culturePicker: "click_nextpulverisationdetailsscreen_culturepicker",
        click_productPicker: "click_nextpulverisationdetailsscreen_productpicker",
        click_toRealTimeScreen: "click_nextpulverisationdetailsscreen_torealtimescreen"
    },
    realTimeScreen : {
        render: "render_realtimescreen",
        click_productPicker: "click_realtimescreen_productpicker",
        click_toNextPulvScreen: "click_realtimescreen_tonextpulvscreen",
        click_newIntervention: "click_realtimescreen_newintervention"
    },
    interventionScreen : {
        render: "render_interventionscreen",
        scroll: "scroll_interventionscreen"
    },
    interventionMapScreen : {
        render: "render_interventionmapscreen"
    },
    fieldsScreen : {
        render: "render_fieldsscreen",
    },
    equipmentScreen : {
        render: "render_equipmentscreen",
        click_validate :"click_equipmentscreen_validate",
    }
}