// Import các thư viện cần thiết
import React, { useContext, useReducer } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon } from "react-native-paper";

// Import các component màn hình
import Home from './components/Home/Home';
import Login from './components/User/Login';
import Register from './components/User/Register';
import UserProfile from "./components/User/Profile";

import ChiTietBaiDang from "./components/Home/ChiTietBaiDang";
import TrangCaNhan from "./components/Home/TrangCaNhan";

// Import context và reducer
import { MyDispatchContext, MyUserContext } from './configs/MyUserContext';
import MyUserReducers from './configs/MyUserReducers';

// Tạo TabNavigator
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tạo HomeStackNavigator để điều hướng trong Home
const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={Home} 
        options={{ title: "Trang chính" }} 
      />
      <Stack.Screen 
        name="ChiTietBaiDang" 
        component={ChiTietBaiDang} 
        options={{ title: "Chi tiết bài đăng" }} 
      />

      <Stack.Screen 
        name="TrangCaNhan" 
        component={TrangCaNhan} 
        options={{ title: "Trang cá nhân" }} 
      />
    </Stack.Navigator>
  );
};

// Tạo TabNavigator
const TabNavigator = () => {
  const user = useContext(MyUserContext);

  return (
    <Tab.Navigator>
      {user === null ? (
        <>
          <Tab.Screen 
            name="Login" 
            component={Login} 
            options={{ 
              title: "Đăng nhập", 
              tabBarIcon: () => <Icon source="account-check" size={20} /> 
            }} 
          />
          <Tab.Screen 
            name="Register" 
            component={Register} 
            options={{ 
              title: "Đăng ký", 
              tabBarIcon: () => <Icon source="account-plus" size={20} /> 
            }} 
          />
        </>
      ) : (
        <>
          <Tab.Screen 
            name="HomeStack" 
            component={HomeStackNavigator} 
            options={{ 
              title: "Trang chủ", 
              headerShown: false,
              tabBarIcon: () => <Icon source="home-account" size={20} /> 
            }} 
          />
          <Tab.Screen 
            name="Profile" 
            component={UserProfile} 
            options={{ 
              title: "Tài khoản", 
              headerShown: false, 
              tabBarIcon: () => <Icon source="account-check" size={20} /> 
            }} 
          />
        </>
      )}
    </Tab.Navigator>
  );
};

// App chính
export default function App() {
  const [user, dispatch] = useReducer(MyUserReducers, null);

  return (
    <NavigationContainer>
      <MyUserContext.Provider value={user}>
        <MyDispatchContext.Provider value={dispatch}>
          <TabNavigator />
        </MyDispatchContext.Provider>
      </MyUserContext.Provider>
    </NavigationContainer>
  );
}
