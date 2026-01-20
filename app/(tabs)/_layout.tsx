import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "red",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={28} name="fridge" color={color} />
          ),
        }}
      />

      <Tabs.Screen 
        name="profile"
        options={{
          title: "Profile",
          
        }}
      />
    </Tabs>
  );
}
