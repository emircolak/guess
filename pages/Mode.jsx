import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Image, Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

const Mode = ({ navigation }) => {
  let [fontsLoaded] = useFonts({
    UbuntuMedium: require('../assets/fonts/Ubuntu-Medium.ttf'),
  });

  const tekliOyun = () => {
    navigation.navigate('DifficultyLevel');
    console.log(width, height);
  };
  const ArkadasinlaOyun = () => {
    Toast.show({
      type: 'info',
      position: 'top',
      text1: 'Çok yakında.',
      topOffset: 60,
      visibilityTime: 1500,
    });
  };
  const RastgeleOyun = () => {
    Toast.show({
      type: 'info',
      position: 'top',
      text1: 'Çok yakında.',
      topOffset: 60,
      visibilityTime: 1500,
    });
  };

return (
  <>
      <ImageBackground source={require('../assets/images/blurry_background3.png')} style={styles.svgBackground} >
      <View style={styles.container}>
          <View style={styles.overlay}>
            <Image source={require('../assets/images/icon.png')} style={styles.logo} />
            <TouchableOpacity onPress={tekliOyun} style={styles.button1}>
              <Text style={[styles.buttonText1, { fontFamily: 'UbuntuMedium' }]}>Tekli Oyun</Text>
            </TouchableOpacity>
          {/* <TouchableOpacity onPress={ArkadasinlaOyun} style={styles.button}>
                <Text style={[styles.buttonText, {fontFamily: 'UbuntuMedium'}]}>Arkadaşınla Oyna</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={RastgeleOyun} style={styles.button}>
                <Text style={[styles.buttonText, {fontFamily: 'UbuntuMedium'}]}>Rastgele Oyna</Text>
              </TouchableOpacity> */}
          </View>
      </View>
      </ImageBackground>
      <Toast ref={(ref) => Toast.setRef(ref)} />
  </>
);
};


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
  overlay: {
    flex: 1,
    justifyContent: 'flex-start', // Bu satırı değiştirdim
    alignItems: 'center',
    paddingTop: height * 0.1, // Ekranın yüksekliğine bağlı olarak üstten boşluk ekledim
  },
  button1: {
    backgroundColor: '#FFFF02',
    paddingVertical: 15,
    paddingHorizontal: width * 0.05, 
    borderRadius: 30,
    marginVertical: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText1: {
    color: 'black', 
    fontSize: width * 0.05,
    fontFamily: 'UbuntuMedium',
  },
  logo: {
    width: width * 0.25, 
    height: width * 0.25, 
    resizeMode: 'contain',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: width * 0.05, 
    borderRadius: 30,
    marginVertical: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black', 
    fontSize: width * 0.05,
  },
});


export default Mode;

          
