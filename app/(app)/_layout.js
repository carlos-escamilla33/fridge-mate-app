import { Tabs } from "expo-router/js-tabs";
import TabBar from "../../components/TabBar";

// The tab bar is drawn by components/TabBar.js; this file only sets the tab order.
export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="recipes" />
      <Tabs.Screen name="add-item" />
      <Tabs.Screen name="groceries" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
