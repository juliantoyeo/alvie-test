import React from 'react'
import SVGminifier from '../../utils/SVGMinifier';
import Svg, { Circle, Rect, Path } from 'react-native-svg';

const ParcelSVG = ({path, height, width}) => {
    const minifiedSVG = new SVGminifier(path)
    return (
        <Svg height={height} width={width} viewBox={minifiedSVG.getViewportAsString()}>
            <Path d={minifiedSVG.getMinifiedPath()} stroke="white" stroke-width="2" fill="green" />
        </Svg>
    )
}

export default ParcelSVG