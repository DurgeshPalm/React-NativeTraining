import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{headerShown:false,tabBarActiveTintColor: 'tomato', tabBarStyle: {
          backgroundColor: '#4cd137',
        },
    tabBarInactiveTintColor: 'gray',}}>
      <Tabs.Screen name="index" options={{ title: "Dashboard",   tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),}} />
      <Tabs.Screen name="feed" options={{ title: "About" ,tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24}/>
          ),}} />
      <Tabs.Screen name="profile" options={{ title: "Profile",  tabBarIcon: ({ color, focused }) => (
      <Ionicons name={focused ? "person" : "person-outline"} color={color} size={24}  />
    ),}} />
    <Tabs.Screen name="friends" options={{title: "Friends", tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
