import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Mode from './pages/Mode.jsx';
import Game from './pages/Game.jsx';
import Score from './pages/Score.jsx';
import DifficultyLevel from './pages/DifficultyLevel.jsx';
import VideoSplashScreen from './components/splash_screen.jsx';


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={VideoSplashScreen} />
        <Stack.Screen name="Mode" component={Mode} />
        <Stack.Screen name="Game" component={Game} />
        <Stack.Screen name="Score" component={Score} />
        <Stack.Screen name="DifficultyLevel" component={DifficultyLevel} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
