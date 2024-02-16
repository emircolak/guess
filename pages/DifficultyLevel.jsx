import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

const DifficultyLevel = ({navigation}) => {

    let [fontsLoaded] = useFonts({
        UbuntuMedium: require('../assets/fonts/Ubuntu-Medium.ttf'),
      });
    
      if (!fontsLoaded) {
        return <AppLoading />;
      }

        const normalMode = () => {
            navigation.navigate('Game', {mode: 'normal'});
        };
        const difficultMode = () => {
            navigation.navigate('Game', {mode: 'difficult'});
        };

  return (
    <>
        <ImageBackground source={require('../assets/images/background.png')} style={styles.background}>
            <Image source={require('../assets/images/backgroundNumbers.png')} style={styles.overlayImage} />
            <View style={styles.container}>
            <View style={styles.buttonsContainer}>
                <Image source={require('../assets/images/icon.png')} style={styles.logo} />
                <TouchableOpacity onPress={normalMode}  style={styles.button1}>
                <Text style={[styles.buttonText1, {fontFamily: 'UbuntuMedium'}]}>Normal</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={difficultMode} style={styles.button}>
                <Text style={[styles.buttonText, {fontFamily: 'UbuntuMedium'}]}>Zor</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.robotContainer}>
                <Image source={require('../assets/images/robot.png')} style={styles.robot} />
            </View>
            </View>
        </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({ 
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  buttonsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  robotContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    position: 'relative',
    bottom: 50,
  },
  button: {
    backgroundColor: '#FE840A',
    padding: 15,
    borderRadius: 30,
    marginVertical: 5,
    width: '80%',
    alignItems: 'center',
  },
  button1: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 30,
    marginVertical: 5, 
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white', 
    fontSize: 20, 
  },
  buttonText1: {
    color: 'black', 
    fontSize: 20,
  },
  robot: {
    width: '60%',
    height: 300,
    resizeMode: 'contain',
    position: 'relative',
    bottom: -100,
    left: 200,
    transform: [{ rotateZ: '-35deg' }], 
  },
  overlayImage: {
    position: 'absolute',
    width: '100%', 
    height: '50%', 
    resizeMode: 'cover', 
    top: 0, 
  }
});


export default DifficultyLevel;