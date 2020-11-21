import React, { useState, useEffect, useRef, createRef, Fragment } from 'react'
import { Platform } from 'react-native';
import { Polygon } from 'react-native-maps';

export const Polygon2 = ({ strokeWidth, strokeColor, fillColor, _ref, onLayout, tappable, onPress, coordinates}) => {

    const [_fillColor, setFillColor] = useState(Platform.OS === 'ios' ? null : fillColor)
    const [_strokeColor, setStrokeColor] = useState(Platform.OS === 'ios' ? null : strokeColor)
   
    const setColors = () => {
      setFillColor(fillColor)
      setStrokeColor(strokeColor)
    }
    
    useEffect(() => {
        setTimeout(() => {setColors()}, 1000)
    },[])
     
    return (
    <Polygon
        strokeWidth={strokeWidth}
        strokeColor= {_strokeColor}
        fillColor= {_fillColor}
        
        onLayout={onLayout}

        tappable={tappable}
        onPress={onPress}
        coordinates={coordinates}
    />
)}