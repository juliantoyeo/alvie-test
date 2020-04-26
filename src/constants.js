import i18n from 'i18n-js'
i18n.defaultLocale = 'fr'
i18n.fallbacks = true

const PADDED = [ "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48" ]

const CONDITIONS_ORDERING = {
  FORBIDDEN: 0, 
  BAD: 1,
  CORRECT: 2,
  GOOD: 3,
  EXCELLENT: 4
}

const MONTHS = [
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

const DAYS = [
  i18n.t('days.sunday'),
  i18n.t('days.monday'),
  i18n.t('days.tuesday'),
  i18n.t('days.wednesday'),
  i18n.t('days.thursday'),
  i18n.t('days.friday'),
  i18n.t('days.saturday'),
]

export {
  PADDED,
  CONDITIONS_ORDERING,
  MONTHS,
  DAYS,
}