import * as Ampli from 'expo-analytics-amplitude';

export const Amplitude = Ampli
Amplitude.initialize("08c9ee18dfdbde19c858b154c6ee0787")

export const EVENTS = {
    bottomTabMenu: {
        click_meteo: "click_bottomtabmenu_meteo",
        click_pulv: "click_bottomtabmenu_pulverisation",
        click_realtime: 'click_bottomtabmenu_realtime',
        click_interv: "click_bottomtabmenu_intervention"
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
        click_tabBar: "click_meteodetailedscreen_tabbar",
        click_goToPulvDetails: "click_meteodetailedscreen_gotodetails"
    },
    meteoDetailedDetailsScreen: {

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
        click_timeSlot: "click_nextpulverisationdetailsscreen_timeslot",
        click_update: "click_nextpulverisationdetailsscreen_updatemodulation",
        click_map: "click_nextpulverisationdetailsscreen_map",
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
        click_map: "click_fieldsscreen_map"
    },
    equipmentScreen : {
        render: "render_equipmentscreen",
        click_validate :"click_equipmentscreen_validate",
        click_family: "click_equipmentscreen_busefamily",
        click_size: "click_equipmentscreen_busesize",
        click_speed: "click_equipmentscreen_speed",
        click_pressure: "click_equipmentscreen_pressure",
        click_soil: "click_equipmentscreen_soil"
    }
}