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

export const HygoIconsSprayer = (props) => {
	return (

		<Svg
			width={146}
			height={98}
			viewBox="0 0 146 98"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<Path
				d="M31.268 56.843c-6.566 0-11.899 5.03-11.899 11.21 0 6.18 5.334 11.21 11.899 11.21 6.566 0 11.9-5.03 11.9-11.208.003-6.182-5.334-11.212-11.9-11.212z"
				fill="#fff"
				fillOpacity={0.5}
			/>
			<Path
				d="M31.264 38.964C14.23 38.964.375 52.012.375 68.056c0 16.043 13.858 29.096 30.889 29.096 17.035 0 30.899-13.054 30.899-29.096.001-16.044-13.864-29.092-30.9-29.092zm.004 45.475c-9.59 0-17.395-7.347-17.395-16.384 0-9.037 7.803-16.387 17.395-16.387 9.592 0 17.396 7.351 17.396 16.387 0 9.035-7.804 16.384-17.396 16.384zM123.598 55.705c-12.134 0-21.996 9.294-21.996 20.72 0 11.426 9.861 20.724 21.996 20.724 12.129 0 22.005-9.298 22.005-20.725.001-11.425-9.876-20.719-22.005-20.719zm0 30.472c-5.719 0-10.353-4.365-10.353-9.751 0-5.386 4.632-9.748 10.353-9.748 5.719 0 10.356 4.36 10.356 9.748 0 5.385-4.637 9.75-10.356 9.75z"
				fill="#fff"
				fillOpacity={0.5}
			/>
			<Path
				d="M105.767 57.679c-4.601-3.391-12.006-7.578-22.046-9.637v-2.629c11.273 2.178 19.404 6.859 24.278 10.561 4.396-2.992 9.773-4.777 15.598-4.777 3.16 0 6.178.545 8.986 1.5-.294-6.496-1.147-13.337-3.444-14.157-11.308-3.965-26.041-6.337-37.923-7.338V10.577c0-2.896 1.533-3.567 1.748-3.65 1.463-.386 2.314-1.82 1.898-3.194-.413-1.372-1.914-2.164-3.391-1.783-2.137.57-5.75 3.023-5.75 8.627v20.242c-.84-.045-1.634-.072-2.422-.102L76.87 4.67c-.251-1.011-1.114-1.784-2.197-1.963-1.325-.22-32.708-5.358-56.312-.882-1.485.281-2.451 1.645-2.155 3.047.3 1.4 1.742 2.316 3.237 2.026.329-.062.67-.104 1-.162L16.11 30.48c-.007.049.012.098.004.151h-.974c-5.194 0-6.228 3.155-6.228 3.155L5.73 41.296l2.645 1.238c6.185-4.93 14.173-7.918 22.887-7.918 19.585 0 35.513 15.005 35.513 33.441 0 3.235-.515 6.352-1.43 9.312H96.95c-.013-.342-.054-.678-.054-1.025 0-7.41 3.438-14.057 8.871-18.665zm10.49-18.143c.703-.258 1.499.067 1.785.732l2.228 5.35c.277.663-.075 1.412-.777 1.676a1.528 1.528 0 01-.504.088c-.546 0-1.062-.312-1.278-.82l-2.231-5.349c-.276-.665.071-1.417.777-1.677zm-6.474 0c.695-.258 1.5.067 1.78.732l2.231 5.35c.276.663-.074 1.412-.779 1.676a1.528 1.528 0 01-.504.088c-.55 0-1.064-.312-1.279-.82l-2.228-5.349c-.277-.665.07-1.417.779-1.677zm-64.456-7.623c-2.16-.666-4.245-1.146-6.076-1.283H21.659l4.06-22.236h19.608v23.52zM78.223 51.84l-9.953-.01c-3.304-8.355-10.385-14.324-17.45-17.774V8.395h21.328l6.072 24.62V51.84h.003v-.002z"
				fill="#fff"
				fillOpacity={0.5}
			/>
		</Svg>
	)
}
