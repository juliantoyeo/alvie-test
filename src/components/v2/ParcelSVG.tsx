import React from 'react'
import SVGminifier from '../../utils/SVGMinifier';
import Svg, { Circle, Rect, Path } from 'react-native-svg';
import COLORS from '../../colors';

const ParcelSVG = ({path, height, width}) => {
    
    const minifiedSVG = new SVGminifier(path)
    return (
        minifiedSVG.getViewportAsString() != '' && (
        <Svg height={height} width={width} viewBox={minifiedSVG.getViewportAsString()}>
            <Path d={minifiedSVG.getMinifiedPath()} stroke="white" stroke-width="0" fill={COLORS.DARK_BLUE} />
        </Svg>
        )
    )
}

export default ParcelSVG