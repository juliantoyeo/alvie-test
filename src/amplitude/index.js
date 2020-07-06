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
        click_toNextPulvScreen: "click_realtimescreen_tonextpulvscreen"
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