import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import COLORS from '../colors'

const S = StyleSheet.create({
  top: {
    backgroundColor: COLORS.BEIGE
  },
  container: { 
    flexDirection: "row", 
    height: 50, 
    elevation: 2, 
    borderTopRightRadius: 40, 
    borderTopLeftRadius: 40, 
    backgroundColor: COLORS.CYAN ,
    paddingLeft: 30,
    paddingRight: 30,
  },
  tabButton: { flex: 1, justifyContent: "center", alignItems: "center" },
  circle: {
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: .2,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 3,
    elevation: 2
  },
  topCircle: {
    backgroundColor: COLORS.CYAN,
    width: 65,
    height: 65,
    borderRadius: 130,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 5
  }
});

const TabBar = props => {
  const {
    renderIcon,
    getLabelText,
    activeTintColor,
    inactiveTintColor,
    onTabPress,
    onTabLongPress,
    getAccessibilityLabel,
    navigation
  } = props;

  const { routes, index: activeRouteIndex } = navigation.state;

  return (
    <View style={S.top}>
      <View style={S.container}>
        {routes.map((route, routeIndex) => {
          const isRouteActive = routeIndex === activeRouteIndex;
          const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;

          return (
            <TouchableOpacity
              activeOpacity={.6}
              key={routeIndex}
              style={S.tabButton}
              onPress={() => {
                onTabPress({ route });
              }}
              onLongPress={() => {
                onTabLongPress({ route });
              }}
              accessibilityLabel={getAccessibilityLabel({ route })}
            >
              { isRouteActive && (
                <View style={S.topCircle}>
                  <View style={S.circle}>
                    {renderIcon({ route, focused: isRouteActive, tintColor })}
                  </View>
                </View>
              )}

              { !isRouteActive && renderIcon({ route, focused: isRouteActive, tintColor })}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default TabBar;
