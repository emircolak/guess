import React, { useEffect } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { Video } from 'expo-av';

export default function VideoSplashScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Mode'); // MainScreen isimli ekrana yönlendir
    }, 3000); // Video süresine göre ayarlayın
  }, []);

  return (
    <ImageBackground source={require('../assets/images/blurry_background3.png')} style={styles.svgBackground} >
        <View style={styles.container}>
        <Video
            source={require('../assets/splashScreen.mp4')}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay
            isLooping={false}
            style={{ width: '100%', height: '100%' }}
        />
        </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
      },
      svgBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
      },
});
