import * as React from "react"
import Svg, { Path, Circle, Rect } from "react-native-svg"

export const HygoIconsArrowRightFilled = (props) => {
	return (
		<Svg
			width={60}
			height={60}
			viewBox="0 0 60 60"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<Circle cx={30} cy={26} r={26} fill="#009FB3" />

			<Path
				d="M16 24.25h21.297l-9.782-9.783L30 12l14 14-14 14-2.468-2.468 9.765-9.782H16v-3.5z"
				fill="#fff"
			/>

		</Svg>
	)
}

export const HygoIconsArrowRight = (props) => {
	return (
		<Svg
			width={60}
			height={60}
			viewBox="0 0 60 60"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<Path
				d="M16 24.25h21.297l-9.782-9.783L30 12l14 14-14 14-2.468-2.468 9.765-9.782H16v-3.5z"
				fill="#fff"
			/>

		</Svg>
	)
}

export const HygoIconsCheck = (props) => {
	return (
		<Svg
			width={115}
			height={85}
			viewBox="0 0 115 85"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<Path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M71.154 33.41L36.687 66.822l-14.51-13.994C10.183 41.263 7.172 39.137 4.817 40.578c-8.08 4.94-7.338 6.452 12.684 25.86L36.65 85l39.176-37.947C97.37 26.183 115 8.288 115 7.286 115 5.153 109.482 0 107.196 0c-.865 0-17.084 15.035-36.042 33.41z"
				fill="#fff"
			/>
		</Svg>
	)
}
export const HygoIconsCheckFilled = (props) => {
	return (
		<Svg
			width={60}
			height={60}
			viewBox="0 0 60 60"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<Circle cx={30} cy={26} r={26} fill="#009FB3" />
			<Path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M33.18 24.04l-9.29 9.041-3.912-3.786c-3.233-3.13-4.045-3.705-4.68-3.315-2.178 1.337-1.978 1.746 3.42 6.997L23.88 38l10.56-10.268C40.248 22.085 45 17.242 45 16.972 45 16.393 43.513 15 42.896 15c-.233 0-4.605 4.068-9.715 9.04z"
				fill="#fff"
			/>
		</Svg>
	)
}
export const HygoIconsPencil = (props) => {
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

export const HygoIconsCircle = (props) => {
	return (
		<Svg
			width={16}
			height={16}
			viewBox="0 0 16 16"
			{...props}
		>
			<Circle cx={8} cy={8} r={7.75} stroke="#AAA" strokeWidth={0.5} />
		</Svg>
	)
}


export const HygoIconsParcelle = (props) => {
	return (
		<Svg
			width={15}
			height={20}
			viewBox="0 0 15 20"
			fill="#AAA"
			{...props}
		>
			<Path
				d="M4.524 3.245l8.75-2.71a1 1 0 011.262 1.211l-2.14 8.067a1 1 0 000 .516l2.19 8.132a1 1 0 01-1.152 1.243L1.082 17.368a1 1 0 01-.774-1.262L3.86 3.92a1 1 0 01.665-.676z"
			/>
		</Svg>
	)
}

export const HygoIconsVolume = (props) => {
	return (
		<Svg
			width={16}
			height={13}
			viewBox="0 0 16 13"
			fill="none"
			{...props}
		>
			<Path d="M1 0v12h14V0" stroke="#AAA" />
			<Path fill="#C4C4C4" d="M2 3h12v8H2z" />
		</Svg>
	)
}

export const HygoIconsNuzzle = (props) => {
	return (
		<Svg
			width={28}
			height={34}
			viewBox="0 0 28 34"
			fill="none"
			{...props}
		>
			<Path
				d="M.049 28.903l10.195-4.561h7.244l10.463 4.56C25.537 31.318 19.581 34 14 34 8.42 34 3 31.586.049 28.903z"
				fill="#C9C9C9"
				fillOpacity={0.2}
			/>
			<Path
				d="M5.414 7.468V1.694a1 1 0 011-1h8.628a1 1 0 011 1V14.67a1 1 0 01-1 1h-4.376a1 1 0 01-.86-.492L5.552 7.977a1 1 0 01-.139-.509z"
				fill="#C9C9C9"
			/>
			<Path
				d="M22.646 7.468V1.694a1 1 0 00-1-1H13.02a1 1 0 00-1 1V14.67a1 1 0 001 1h4.375a1 1 0 00.861-.492l4.253-7.201a1 1 0 00.139-.509z"
				fill="#C9C9C9"
			/>
			<Rect
				x={10.098}
				y={16.306}
				width={7.566}
				height={7.205}
				rx={1}
				fill="#C9C9C9"
			/>
		</Svg>
	)
}
