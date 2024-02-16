import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Image, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import Toast from 'react-native-toast-message';

const Game = ({ route }) => {
  const { mode } = route.params;
  const [numbers, setNumbers] = useState([0, 0, 0, 0]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [guessesLeft, setGuessesLeft] = useState(20);
  const [randomNumber, setRandomNumber] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [correctGuesses, setCorrectGuesses] = useState([null, null, null, null]);
  const [maxPuan, setMaxPuan] = useState(0);

  let [fontsLoaded] = useFonts({
    UbuntuMedium: require('../assets/fonts/Ubuntu-Medium.ttf'),
  });

  useEffect(() => {
    if (isGameStarted) {
      if (timeLeft > 0 && guessesLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        console.log(guesses);
        console.log("Kaybettiniz");
        setIsGameStarted(false);
      }
    }
  }, [isGameStarted, timeLeft, guessesLeft]);

  useEffect(() => {
    if (isGameStarted) {
      const newRandomNumber = generateUniqueNumber();
      setRandomNumber(newRandomNumber);
      console.log(newRandomNumber);
    }
  }, [isGameStarted]);

  const generateUniqueNumber = () => {
    let numbers = [];
    numbers.push(Math.floor(Math.random() * 9) + 1);
    
    while(numbers.length < 4){
      let r = Math.floor(Math.random() * 10);
      if(numbers.indexOf(r) === -1) numbers.push(r);
    }
    
    return numbers.join('');
  };

  const puan =(timeLeft, guessesLeft) => {
    const maksimumPuan = 9999;
    const minimumPuan = 1000;
    const maksimumTahminSuresi = 180;
    const maksimumTahminHakki = 20;
    const gecen_sure = maksimumTahminSuresi - timeLeft;
    const kullanilan_hak = maksimumTahminHakki - guessesLeft;

    const sureFarkiKatsayisi = gecen_sure / maksimumTahminSuresi;
    const hakFarkiKatsayisi = kullanilan_hak / maksimumTahminHakki;

    const puan = minimumPuan + (maksimumPuan - minimumPuan) * (1 - sureFarkiKatsayisi) * (1 - hakFarkiKatsayisi);

    return Math.round(Math.min(maksimumPuan, Math.max(minimumPuan, puan)));

  };

  const incrementNumber = (index) => {
    if(correctGuesses[index] === null){
      setNumbers(numbers.map((number, numberIndex) => {
        if (numberIndex === index) {
          return number < 9 ? number + 1 : number;
        }
        return number;
      }));
    }
  };
  
  const decrementNumber = (index) => {
    if(correctGuesses[index] === null){
      setNumbers(numbers.map((number, numberIndex) => {
        if (numberIndex === index) {
          return number > 0 ? number - 1 : number;
        }
        return number;
      }));
    }
  };

  const calculateMatchCounts = (guess, randomNumber) => {
    let correctPositions = 0;
    let correctNumbersWrongPosition = 0;
    let seen = new Array(10).fill(false);
  
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === randomNumber[i]) {
        correctPositions++;
        seen[guess[i]] = true;
      }
    }
  
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] !== randomNumber[i] && randomNumber.includes(guess[i]) && !seen[guess[i]]) {
        correctNumbersWrongPosition++;
        seen[guess[i]] = true;
      }
    }
  
    return { correctPositions, correctNumbersWrongPosition };
  };
  

  const handleGuess = () => {
    if (!isGameStarted) {
      setIsGameStarted(true);
      setTimeLeft(180);
      setGuessesLeft(20);
      setGuesses([]);
      setCorrectGuesses([null, null, null, null]);
      setNumbers([0, 0, 0, 0]);
    } else {
      const currentGuess = numbers.join('');
  
      if (numbers[0] === 0) {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Tahmindeki sayılar birbirinden farklı olmalıdır.',
          topOffset: 60,
          visibilityTime: 2000,
        });
        return;
      }
      const uniqueNumbers = new Set(numbers);
      if (uniqueNumbers.size !== numbers.length) {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Tahmindeki sayılar birbirinden farklı olmalıdır.',
          topOffset: 60,
          visibilityTime: 2000,
        });
        return;
      }
  
      setGuessesLeft(guessesLeft - 1);
      setGuesses([...guesses, currentGuess]);
  
      if (mode !== 'difficult') {
        const newCorrectGuesses = correctGuesses.slice();
        for (let i = 0; i < randomNumber.length; i++) {
          if (currentGuess[i] === randomNumber.toString()[i]) {
            newCorrectGuesses[i] = currentGuess[i];
          }
        }
        setCorrectGuesses(newCorrectGuesses);
      }
  
      if (currentGuess === randomNumber.toString()) {
        const puanim = puan(timeLeft, guessesLeft);
        if (puanim > maxPuan) {
          setMaxPuan(puanim);
          Toast.show({
            type: 'success',
            position: 'top',
            text1: `Tebrikler! Yeni rekor: ${puanim}`,
            topOffset: 60,
            visibilityTime: 3000,
          });
        }
        Toast.show({
          type: 'success',
          position: 'top',
          text1: `Tebrikler! Puanınız: ${puanim}`,
          text2: 'Yeni oyun başlatmak için başlat butonuna basınız.',
          topOffset: 60,
          visibilityTime: 3000,
        
        });
        setIsGameStarted(false);
      } else if (guessesLeft - 1 === 0) {
        console.log("Tahmin hakkınız bitti. Kaybettiniz!");
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Tahmin hakkınız bitti. Kaybettiniz!',
          text2: 'Yeni oyun başlatmak için başlat butonuna basınız.',
          topOffset: 60,
          visibilityTime: 1500,
        });
        setIsGameStarted(false);
      }
      else if(timeLeft - 1 === 0){
        console.log("Süreniz doldu. Kaybettiniz!");
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Süreniz doldu. Kaybettiniz!',
          text2: 'Yeni oyun başlatmak için başlat butonuna basınız.',
          topOffset: 60,
          visibilityTime: 1500,
        });
        setIsGameStarted(false);
      } 
    }
  };
  

  if (!fontsLoaded) {
    return <AppLoading />;
  }


  return (
    <>
      <ImageBackground source={require('../assets/images/background.png')} style={styles.background}>
        <View style={styles.container}>
          <Image source={require('../assets/images/backgroundNumbers.png')} style={styles.overlayImage} />
          <View style={styles.topSection}>
            <Image source={require('../assets/images/icon.png')} style={styles.logo} />
          </View>
          <View style={styles.sayacGuess}>
            <View style={styles.sayac}>
              <Image source={require('../assets/images/kumSaati.png')} />
              <Text style={[{fontFamily:'UbuntuMedium'}, {fontSize: 21}]}>Kalan Süre</Text>
              <Text style={[{fontFamily:'UbuntuMedium'}, {fontSize: 43}, {color: '#7900FF'}]}>{timeLeft}</Text>
            </View>
            <View style={styles.guess}>
              <Image source={require('../assets/images/guess.png')} />
              <Text style={[{fontFamily:'UbuntuMedium'}, {fontSize: 21}]}>Kalan Tahmin</Text>
              <Text style={[{fontFamily:'UbuntuMedium'}, {fontSize: 43}, {color: '#7900FF'}]}>{guessesLeft}</Text>
            </View>
          </View>
          <View style={styles.container2}>
            {numbers.map((number, index) => (
              <View key={index} style={styles.numberArrowContainer}>
                <View style={styles.arrowContainer}>
                  <TouchableOpacity disabled={correctGuesses[index] !== null} onPress={() => incrementNumber(index)}>
                    <Text style={styles.arrowText}>↑</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.numberContainer}>
                  <Text style={[styles.number, {color: correctGuesses[index] !== null ? 'black' : '#7900FF'}]}>{number}</Text>
                </View>
                <View style={styles.arrowContainer}>
                  <TouchableOpacity disabled={correctGuesses[index] !== null} onPress={() => decrementNumber(index)}>
                    <Text style={styles.arrowText}>↓</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.tahminContainer}>
            <TouchableOpacity onPress={handleGuess} style={styles.tahminEt} >
              <Text style={styles.tahminEtText}>{isGameStarted ? "Tahmin Et" : "Başlat"}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tahminler}>
            <View style={styles.tahminlerTextContainer}>
                <Text style={styles.tahminlerText}>Tahminler</Text>
            </View>
            <ScrollView style={styles.tahminlerScrollView}>
              {guesses.slice(0).reverse().map((guess, index) => {
                let displayText = guess;
                if (mode === 'difficult') {
                  const { correctPositions, correctNumbersWrongPosition } = calculateMatchCounts(guess.toString(), randomNumber);
          return <View style={styles.difficultTahmin}>
                      <View style={styles.dogruKonum}>
                        <Text style={styles.dogruKonumText}>
                          {correctNumbersWrongPosition} -
                        </Text>
                      </View>
                      <View style={styles.dogruSayi}>
                        <Text style={styles.dogruSayiText}>
                            {correctPositions} +
                        </Text>
                      </View>
                      <Text style={styles.tahminText3}>
                        {guess}
                      </Text>
                  </View>
                }
                else{
                  const { correctPositions, correctNumbersWrongPosition } = calculateMatchCounts(guess.toString(), randomNumber);
                  displayText = `${correctPositions + correctNumbersWrongPosition} -> ${guess}`;
            return <Text key={`guess-${guesses.length - index}`} style={styles.tahminText2}>{displayText}</Text>;
                }
                
              })}
            </ScrollView>
          </View>
        </View>
      </ImageBackground>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 30,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  overlayImage: {
    position: 'absolute',
    width: '100%',
    height: '50%',
    resizeMode: 'cover',
    top: 0,
  },
  sayacGuess: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  sayac: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 160,
    height: 160,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 80,
    padding: 10,
  },
  guess: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 160,
    height: 160,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 80,
    padding: 10,
    marginLeft: 50,
  },
  container2: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,

  },
  numberArrowContainer: {
    flexDirection: 'column', 
    alignItems: 'center', 
    marginHorizontal: 10, 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
  },
  number: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7900FF', 
  },
  arrowContainer: {
    padding: 5,
  },
  arrowText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FE840A',
  },
  numberContainer: {
    padding: 10, 
    backgroundColor: 'white',
    borderRadius: 10,
    width: 55,
    alignItems: 'center',
  },
  tahminContainer: {
    width: '100%',
    alignItems: 'center',
  },
  tahminEt: {
    backgroundColor: '#FE840A',
    padding: 15,
    borderRadius: 12,
    marginVertical: 15, 
    width: '100%',
    alignItems: 'center',
  },
  tahminEtText: {
    color: 'white', 
    fontSize: 22,
    fontFamily: 'UbuntuMedium',
  },
  tahminler: {
    flexDirection: 'column',
    width: '100%',
    height: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: 10,
  },
  tahminlerTextContainer: {
    width: '100%',
    alignItems: 'center',
    padding: 10,
  },
  tahminlerText: {
    fontSize: 24,
    fontFamily: 'UbuntuMedium',
    color: '#FE840A',
  },
  tahminText2: {
    fontSize: 20,
    fontFamily: 'UbuntuMedium',
    padding: 10,
    marginStart: 140,
  },
  tahminText1: {
    fontSize: 20,
    fontFamily: 'UbuntuMedium',
    padding: 10,
    marginStart: 140,
  },
  tahminlerScrollView: {
    width: '100%',
    padding: 10,
  },
  difficultTahmin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  dogruKonumText: {
    fontSize: 20,
    fontFamily: 'UbuntuMedium',
    color: 'white',
  },
  dogruSayiText: {
    fontSize: 20,
    fontFamily: 'UbuntuMedium',
    color: 'white',
  },
  tahminText3: {
    fontSize: 25,
    fontFamily: 'UbuntuMedium',
    marginStart: 20,
    color: 'black',
  },
  dogruKonum: {
    backgroundColor: '#62de04',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: 10,
  },
  dogruSayi: {
    backgroundColor: '#62de04',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: 10,
  },
});



export default Game;