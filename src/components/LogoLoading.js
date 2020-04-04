import React, { useState, useEffect, useRef } from 'react'
import { Animated, Easing } from 'react-native'
import * as SvgLib from 'react-native-svg';
const { Svg, Path, LinearGradient, Defs, Stop } = SvgLib;

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const LogoLoading = ({ color, duration }) => {
  const [offsetAnim]= useState(new Animated.Value(0))
  const [offset, setOffset] = useState('100%')

  const [opacityAnim]= useState(new Animated.Value(0))
  const [opacity, setOpacity] = useState('0')

  useEffect(() => {
    offsetAnim.addListener((p) => {
      setOffset(`${parseInt(100 - p.value*100)}%`)
    });

    opacityAnim.addListener((p) => {
      setOpacity(`${p.value}`)
    });

    startAnimation()
  }, [])

  useEffect(() => {
    return () => {
      offsetAnim.removeAllListeners()
      opacityAnim.removeAllListeners()
    }
  }, [])

  const startAnimation = () => {
    Animated.sequence([
      Animated.timing(
        offsetAnim,
        {
          toValue: 1,
          duration: duration,
          easing: Easing.linear
        },
      ),
      Animated.timing(
        opacityAnim,
        {
          toValue: 1,
          duration: duration / 4,
          easing: Easing.linear
        },
      ),
      Animated.timing(
        opacityAnim,
        {
          toValue: 0,
          duration: 0.25 * duration,
          easing: Easing.linear
        },
      ),
      Animated.timing(
        offsetAnim,
        {
          toValue: 0,
          duration: duration,
          easing: Easing.linear
        },
      ),
    ]).start(() => startAnimation());
  }

  return (
    <AnimatedSvg
      viewBox="0 0 130 50" 
      width="140" 
      height="60"
      fill={color}>
      <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="100%">
          <Stop offset={offset} stopColor={color} stopOpacity={opacity} />
          <Stop offset="100%" stopColor={color} stopOpacity="1" />
        </LinearGradient>
      </Defs>
      
      <Path d="M0 35.48L0 6.38L2.96 6.38L2.96 19L18.82 19L18.82 6.38L21.78 6.38L21.78 35.48L18.82 35.48L18.82 21.71L2.96 21.71L2.96 35.48L0 35.48Z" />
      <Path d="M36.54 35.48L36.54 22.94L25.65 6.38L29.35 6.38L38.1 20.48L46.94 6.38L50.39 6.38L39.5 22.94L39.5 35.48L36.54 35.48Z" />
      <Path d="M60.79 35.07C58.92 34.3 57.32 33.24 55.98 31.88C54.64 30.53 53.59 28.92 52.83 27.05C52.08 25.19 51.7 23.15 51.7 20.93C51.7 18.71 52.09 16.67 52.85 14.81C53.62 12.94 54.68 11.33 56.04 9.98C57.4 8.62 59 7.56 60.85 6.79C62.7 6.02 64.71 5.64 66.87 5.64C69.2 5.64 71.23 5.98 72.95 6.67C74.68 7.35 76.16 8.31 77.39 9.55C77.19 9.75 75.54 11.39 75.34 11.6C74.32 10.53 73.12 9.7 71.72 9.11C70.32 8.52 68.72 8.23 66.91 8.23C65.05 8.23 63.37 8.57 61.88 9.26C60.38 9.94 59.12 10.87 58.07 12.03C57.03 13.2 56.23 14.55 55.67 16.08C55.11 17.61 54.83 19.23 54.83 20.93C54.83 22.63 55.11 24.25 55.67 25.78C56.23 27.31 57.03 28.66 58.07 29.81C59.12 30.96 60.38 31.88 61.88 32.56C63.37 33.25 65.05 33.59 66.91 33.59C68.55 33.59 70.06 33.41 71.43 33.05C72.8 32.7 73.91 32.25 74.76 31.7C74.76 31.11 74.76 28.16 74.76 22.86L67.98 22.86L67.98 20.27L77.72 20.27C77.72 28.14 77.72 32.51 77.72 33.38C76.13 34.34 74.42 35.05 72.58 35.52C70.75 35.99 68.84 36.22 66.87 36.22C64.68 36.22 62.65 35.84 60.79 35.07Z" />
      <Path strokeWidth="2" stroke={color} fill="url(#grad)" d="M89.12 32.49C86.15 29.7 84.36 25.68 84.36 21.28C84.36 17.48 87.38 14.29 89.67 11.62C91.55 9.43 94.88 5.56 99.68 0C104.58 5.54 107.97 9.41 109.84 11.62C112.11 14.29 115 17.5 115 21.28C115 25.66 113.25 29.7 110.31 32.49C107.56 35.09 103.76 36.6 99.68 36.6C95.62 36.6 91.86 35.07 89.12 32.49Z" />
    </AnimatedSvg>
  )
}

export default LogoLoading
