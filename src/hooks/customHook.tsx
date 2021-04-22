import { useState, useEffect, useRef } from 'react'
import _ from 'lodash'

export function useCustomHook<any>(value) {
	const [state, setState] = useState<any>(value)
	let prevState = state

	const customSetState = (newState) => {
		if (!_.isEqual(prevState, newState))
		{
			setState(newState)
			prevState = newState
		}
	}

	return [state, customSetState]
}