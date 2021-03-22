import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
	return (
		<Svg
			width={12}
			height={12}
			viewBox="0 0 12 12"
			fill="none"
			{...props}
		>
			<Path
				d="M0 9.5V12h2.5l7.372-7.372-2.5-2.5L0 9.5zm11.805-6.805c.26-.26.26-.68 0-.94l-1.56-1.56a.664.664 0 00-.94 0l-1.22 1.22 2.5 2.5 1.22-1.22z"
				fill="#AAA"
			/>
		</Svg>
	)
}

export default SvgComponent
