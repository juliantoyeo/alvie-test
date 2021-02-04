import i18n from 'i18n-js'
i18n.defaultLocale = 'fr'
i18n.fallbacks = true

export const OTA = "040221"

export const PADDED = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48"]

export const CONDITIONS_ORDERING = {
    FORBIDDEN: 0,
    BAD: 1,
    CORRECT: 2,
    GOOD: 3,
    EXCELLENT: 4
}

export const PICTO_MAP = {
    'SUN': require('../assets/sunny.png'),
    'CLOUD': require('../assets/cloudy.png'),
    'STORM': require('../assets/stormy.png'),
    'RAIN': require('../assets/rainy.png'),
    'SNOW': require('../assets/snowy.png'),
}
export const PICTO_TO_IMG = {
    '1': 'SUN',
    '2': 'SUN',
    '3': 'SUN',
    '4': 'SUN',
    '5': 'SUN',
    '6': 'SUN',
    '7': 'SUN',
    '8': 'SUN',
    '9': 'SUN',
    '10': 'CLOUD',
    '11': 'CLOUD',
    '12': 'CLOUD',
    '13': 'SUN',
    '14': 'SUN',
    '15': 'SUN',
    '16': 'CLOUD',
    '17': 'CLOUD',
    '18': 'CLOUD',
    '19': 'CLOUD',
    '20': 'CLOUD',
    '21': 'CLOUD',
    '22': 'CLOUD',
    '23': 'RAIN',
    '24': 'SNOW',
    '25': 'RAIN',
    '26': 'SNOW',
    '27': 'STORM',
    '28': 'STORM',
    '29': 'SNOW',
    '30': 'STORM',
    '31': 'RAIN',
    '32': 'SNOW',
    '33': 'RAIN',
    '34': 'SNOW',
    '35': 'RAIN',
}

export const CONDITIONS = [
    "FORBIDDEN",
    "BAD",
    "CORRECT",
    "GOOD",
    "EXCELLENT"
]

export const BUSES = [
    'orange',
    'green',
    'yellow',
    'blue',
    'lilas',
    'red',
    'brown',
    'grey',
    'white',
]

export const MONTHS = [
    i18n.t('months.january'),
    i18n.t('months.february'),
    i18n.t('months.march'),
    i18n.t('months.april'),
    i18n.t('months.may'),
    i18n.t('months.june'),
    i18n.t('months.july'),
    i18n.t('months.august'),
    i18n.t('months.september'),
    i18n.t('months.october'),
    i18n.t('months.november'),
    i18n.t('months.december'),
]

export const DAYS = [
    i18n.t('days.sunday'),
    i18n.t('days.monday'),
    i18n.t('days.tuesday'),
    i18n.t('days.wednesday'),
    i18n.t('days.thursday'),
    i18n.t('days.friday'),
    i18n.t('days.saturday'),
]
