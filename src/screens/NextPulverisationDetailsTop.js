import React, { useEffect, useState } from 'react'

import NextPulverisationDetails from './NextPulverisationDetails'

import { PADDED } from '../constants'

const NextPulverisationDetailsTop = ({ navigation }) => {
  let result = navigation.getParam('data')
  let day = navigation.getParam('day')
  let hour = navigation.getParam('hour')
  let ra = navigation.getParam('r')

  const getNext12HoursData = () => {
    let start = parseInt(hour), output = {}

    for (let i = start; i < start + 12; i++) {
      let h = i % 24, r = parseInt(i / 24)

      let d = day
      if (r > 0) {
        d = result.days[result.days.indexOf(day) + r]
      }

      output[PADDED[i]] = result.data[d].hours1[PADDED[h]]
    }

    output.ready = true

    return output
  }

  const [next12HoursData] = useState(getNext12HoursData())

  return (
    <NextPulverisationDetails navigation={navigation} next12HoursData={next12HoursData} result={result} ra={ra} day={day} hour={hour} />
  )
}

export default NextPulverisationDetailsTop