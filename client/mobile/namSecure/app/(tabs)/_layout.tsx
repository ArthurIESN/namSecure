import React from 'react';

import {withLayoutContext} from "expo-router";


import {
    createNativeBottomTabNavigator,
    NativeBottomTabNavigationEventMap,
    NativeBottomTabNavigationOptions
} from "@bottom-tabs/react-navigation";
import {ParamListBase, TabNavigationState} from "@react-navigation/native";

const BottomTabNavigator = createNativeBottomTabNavigator().Navigator;

const Tabs = withLayoutContext<
    NativeBottomTabNavigationOptions,
    typeof BottomTabNavigator,
    TabNavigationState<ParamListBase>,
    NativeBottomTabNavigationEventMap
>(BottomTabNavigator);

export default function TabLayout() {


  return (
      <Tabs>
          <Tabs.Screen
                name="index"
                options={{
                    title: 'Gregory',
                    tabBarIcon: () => ({ sfSymbol: "dog"}),
                }}
            />
          <Tabs.Screen
              name="explore"
              options={{
                  title: 'Il est pd',
                  tabBarIcon: () => ({ sfSymbol: "magnifyingglass" }),
              }}
          />

      </Tabs>
  )
}