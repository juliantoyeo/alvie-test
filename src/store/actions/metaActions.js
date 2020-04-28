export const updateParcellesList = (parcelles) => {
  return {
      type: 'UPDATE_PARCELLES',
      parcelles
  }
}

export const updateCulturesList = (cultures) => {
  return {
      type: 'UPDATE_CULTURES',
      cultures
  }
}

export const meteoSynced = (d) => {
  return {
    type: 'METEO_SYNCED',
    now: d
  }
}