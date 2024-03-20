import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  ScrollView,
  PanResponder,
  TouchableWithoutFeedback,
  Dimensions,
  Modal,
  Pressable,
} from "react-native";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import Toast from "react-native-toast-message";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import OnboardingModal from "react-native-onboarding-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Tooltip from "react-native-walkthrough-tooltip";

const { width, height } = Dimensions.get("window");

const Game = ({ route, navigation }) => {
  const { mode } = route.params;
  const [numbers, setNumbers] = useState([0, 0, 0, 0]);
  const [isVisible, setIsVisible] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [guessesLeft, setGuessesLeft] = useState(20);
  const [randomNumber, setRandomNumber] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [correctGuesses, setCorrectGuesses] = useState([
    null,
    null,
    null,
    null,
  ]);
  const [maxPuan, setMaxPuan] = useState(0);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
    // Sayfa ilk yüklendiğinde tooltip'i göster
    setTooltipVisible(true);

    // 3 saniye sonra tooltip'i gizle
    const timer = setTimeout(() => {
      setTooltipVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleAnswerIconPress = () => {
    setIsVisible(true);
  };
  const toggleModal = () => setModalVisible(!setModalVisible);

  let [fontsLoaded] = useFonts({
    UbuntuMedium: require("../assets/fonts/Ubuntu-Medium.ttf"),
  });

  useEffect(() => {
    const checkOnboarding = async () => {
      const hasOnboarded = await AsyncStorage.getItem("hasOnboarded");
      if (hasOnboarded !== "true") {
        setIsVisible(true);
      }
    };

    checkOnboarding();
  }, []);

  useEffect(() => {
    // Tooltip'i belirli bir süre sonra otomatik olarak gizlemek
    const timer = setTimeout(() => {
      setTooltipVisible(false);
    }, 5000); // 5 saniye sonra tooltip gizlenir

    // Component unmount olduğunda timer'ı temizle
    return () => clearTimeout(timer);
  }, []);

  const exampleData = [
    {
      asset: require("../assets/images/modal/1.png"),
    },
    {
      asset: require("../assets/images/modal/2.png"),
    },
    {
      asset: require("../assets/images/modal/3.png"),
    },
    {
      asset: require("../assets/images/modal/4.png"),
    },
    {
      asset: require("../assets/images/modal/5.png"),
    },
    {
      asset: require("../assets/images/modal/6.png"),
    },
  ];

  const modalClose = async () => {
    await AsyncStorage.setItem("hasOnboarded", "true");
    setIsVisible(false);
  };

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
    numbers.forEach((_, index) => {
      numbersPanResponders[index] = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gestureState) => {
          if (gestureState.dy < -10) {
            incrementNumber(index);
          } else if (gestureState.dy > 10) {
            decrementNumber(index);
          }
        },
      });
    });
  }, [numbers]);

  const [numbersPanResponders, setNumbersPanResponders] = useState(
    Array(numbers.length)
      .fill(null)
      .map(() => PanResponder.create({}))
  );

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

    while (numbers.length < 4) {
      let r = Math.floor(Math.random() * 10);
      if (numbers.indexOf(r) === -1) numbers.push(r);
    }

    return numbers.join("");
  };

  const puan = (timeLeft, guessesLeft) => {
    const maksimumPuan = 9999;
    const minimumPuan = 1000;
    const maksimumTahminSuresi = 180;
    const maksimumTahminHakki = 20;
    const gecen_sure = maksimumTahminSuresi - timeLeft;
    const kullanilan_hak = maksimumTahminHakki - guessesLeft;

    const sureFarkiKatsayisi = gecen_sure / maksimumTahminSuresi;
    const hakFarkiKatsayisi = kullanilan_hak / maksimumTahminHakki;

    const puan =
      minimumPuan +
      (maksimumPuan - minimumPuan) *
        (1 - sureFarkiKatsayisi) *
        (1 - hakFarkiKatsayisi);

    return Math.round(Math.min(maksimumPuan, Math.max(minimumPuan, puan)));
  };

  const incrementNumber = (index) => {
    const newNumbers = [...numbers];
    let newValue = newNumbers[index] === 9 ? 0 : newNumbers[index] + 1;

    while (newNumbers.includes(newValue)) {
      newValue = (newValue + 1) % 10;
    }

    newNumbers[index] = newValue;
    setNumbers(newNumbers);
  };

  const decrementNumber = (index) => {
    const newNumbers = [...numbers];
    let newValue = newNumbers[index] === 0 ? 9 : newNumbers[index] - 1;

    while (newNumbers.includes(newValue)) {
      newValue = (newValue - 1 + 10) % 10;
    }

    newNumbers[index] = newValue;
    setNumbers(newNumbers);
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
      if (
        guess[i] !== randomNumber[i] &&
        randomNumber.includes(guess[i]) &&
        !seen[guess[i]]
      ) {
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
      const currentGuess = numbers.join("");

      if (numbers[0] === 0) {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Tahmindeki sayılar birbirinden farklı olmalıdır.",
          topOffset: 60,
          visibilityTime: 2000,
        });
        return;
      }
      const uniqueNumbers = new Set(numbers);
      if (uniqueNumbers.size !== numbers.length) {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Tahmindeki sayılar birbirinden farklı olmalıdır.",
          topOffset: 60,
          visibilityTime: 2000,
        });
        return;
      }

      setGuessesLeft(guessesLeft - 1);
      setGuesses([...guesses, currentGuess]);

      if (mode !== "difficult") {
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
            type: "success",
            position: "top",
            text1: `Tebrikler! Yeni rekor: ${puanim}`,
            topOffset: 60,
            visibilityTime: 3000,
          });
        }
        Toast.show({
          type: "success",
          position: "top",
          text1: `Tebrikler! Puanınız: ${puanim}`,
          text2: "Yeni oyun başlatmak için başlat butonuna basınız.",
          topOffset: 60,
          visibilityTime: 3000,
        });
        setIsGameStarted(false);
      } else if (guessesLeft - 1 === 0) {
        console.log("Tahmin hakkınız bitti. Kaybettiniz!");
        Toast.show({
          type: "error",
          position: "top",
          text1: "Tahmin hakkınız bitti. Kaybettiniz!",
          text2: "Yeni oyun başlatmak için başlat butonuna basınız.",
          topOffset: 60,
          visibilityTime: 1500,
        });
        setIsGameStarted(false);
      } else if (timeLeft - 1 === 0) {
        console.log("Süreniz doldu. Kaybettiniz!");
        Toast.show({
          type: "error",
          position: "top",
          text1: "Süreniz doldu. Kaybettiniz!",
          text2: "Yeni oyun başlatmak için başlat butonuna basınız.",
          topOffset: 60,
          visibilityTime: 1500,
        });
        setIsGameStarted(false);
      }
    }
  };

  const handleBack = () => {
    setIsGameStarted(false);
    navigation.navigate("DifficultyLevel");
    console.log("Geri butonuna basıldı");
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <>
      <ImageBackground
        source={require("../assets/images/blurry_background2.png")}
        style={styles.background}
      >
        <View style={styles.container}>
          <OnboardingModal
            isVisible={isVisible}
            onboardingData={exampleData}
            buttonTextColor="#51186E"
            buttonBackgroundColor="#DCCFE2"
            photoStyle={{
              width: "100%",
              height: "100%",
              position: "absolute",
              borderRadius: 20,
              resizeMode: "cover",
            }}
            cardContainerStyle={{
              width: wp("75%"),
              height: hp("50%"),
              backgroundColor: "rgba(255, 255, 255, 0.6)",
            }}
            onBottomButtonPress={() => modalClose()}
            buttonText="Let's Play"
          />
          <View style={{ flex: 3 }}>
            <View style={styles.topSection}>
              <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => handleBack()}>
                  <Image
                    source={require("../assets/images/back.png")}
                    style={styles.back}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                <Image
                  source={require("../assets/images/icon.png")}
                  style={styles.logo}
                />
              </View>
              <View style={{ flex: 1 }}></View>
            </View>
            <View style={styles.sayacGuess}>
              <View style={styles.sayac}>
                <Image
                  style={styles.sayacIcon}
                  source={require("../assets/images/kumSaati.png")}
                />
                <Text
                  style={[
                    { fontFamily: "UbuntuMedium" },
                    { fontSize: wp("5%") },
                  ]}
                >
                  Kalan Süre
                </Text>
                <Text
                  style={[
                    { fontFamily: "UbuntuMedium" },
                    { fontSize: wp("7%") },
                    { color: "#7900FF" },
                  ]}
                >
                  {timeLeft}
                </Text>
              </View>
              <View style={styles.guess}>
                <Image
                  style={styles.guessIcon}
                  source={require("../assets/images/guess.png")}
                />
                <Text
                  style={[
                    { fontFamily: "UbuntuMedium" },
                    { fontSize: wp("5%") },
                  ]}
                >
                  Kalan Tahmin
                </Text>
                <Text
                  style={[
                    { fontFamily: "UbuntuMedium" },
                    { fontSize: wp("7%") },
                    { color: "#7900FF" },
                  ]}
                >
                  {guessesLeft}
                </Text>
              </View>
            </View>
            <View style={styles.container2}>
              {numbers.map((number, index) => (
                <View
                  key={index}
                  style={styles.numberArrowContainer}
                  {...numbersPanResponders[index].panHandlers}
                >
                  <View style={styles.arrowContainer}>
                    <TouchableOpacity
                      style={styles.numberButton}
                      disabled={correctGuesses[index] !== null}
                      onPress={() => incrementNumber(index)}
                    >
                      <Image
                        style={styles.arrowText}
                        source={require("../assets/images/plus.png")}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.numberContainer}>
                    <Text
                      style={[
                        styles.number,
                        {
                          color:
                            correctGuesses[index] !== null
                              ? "black"
                              : "#7900FF",
                        },
                      ]}
                    >
                      {number}
                    </Text>
                  </View>
                  <View style={styles.arrowContainer}>
                    <TouchableOpacity
                      style={styles.numberButton}
                      disabled={correctGuesses[index] !== null}
                      onPress={() => decrementNumber(index)}
                    >
                      {/* <Text style={styles.arrowText}>↓</Text> */}
                      <Image
                        style={styles.arrowText}
                        source={require("../assets/images/minus.png")}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.tahminContainer}>
            <TouchableOpacity onPress={handleGuess} style={styles.tahminEt}>
              <Text style={styles.tahminEtText}>
                {isGameStarted ? "Tahmin Et" : "Başlat"}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 2, width: "100%" }}>
            <View style={styles.tahminler}>
              <View style={{ flexDirection: "row", flex: 1 }}>
                <View style={{ flex: 1 }}></View>
                <View style={{ flex: 1 }}>
                  <View style={styles.tahminlerTextContainer}>
                    <Text style={styles.tahminlerText}>Tahminler</Text>
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Tooltip
                    isVisible={tooltipVisible}
                    content={<Text>İpuçları</Text>}
                    placement="top"
                    onClose={() => setTooltipVisible(false)}
                    showBackground={false}
                    backgroundColor="transparent"
                  >
                    <TouchableOpacity onPress={handleAnswerIconPress}>
                      <Image
                        source={require("../assets/images/answer_icon.png")}
                        style={styles.answerIcon}
                      />
                    </TouchableOpacity>
                  </Tooltip>
                </View>
              </View>
              <View style={{ flex: 5 }}>
                <ScrollView style={styles.tahminlerScrollView}>
                  {guesses
                    .slice(0)
                    .reverse()
                    .map((guess, index) => {
                      let displayText = guess;
                      if (mode === "difficult") {
                        const {
                          correctPositions,
                          correctNumbersWrongPosition,
                        } = calculateMatchCounts(
                          guess.toString(),
                          randomNumber
                        );
                        return (
                          <View style={styles.difficultTahmin}>
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
                            <Text style={styles.tahminText3}>{guess}</Text>
                          </View>
                        );
                      } else {
                        const {
                          correctPositions,
                          correctNumbersWrongPosition,
                        } = calculateMatchCounts(
                          guess.toString(),
                          randomNumber
                        );
                        displayText = `${
                          correctPositions + correctNumbersWrongPosition
                        } -> ${guess}`;
                        return (
                          <View style={styles.difficultTahmin}>
                            <Text
                              key={`guess-${guesses.length - index}`}
                              style={styles.tahminText2}
                            >
                              {displayText}
                            </Text>
                          </View>
                        );
                      }
                    })}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 20, // Logonun üstündeki boşluk için ayar
    paddingHorizontal: 30,
  },
  topSection: {
    flex: 1,
    alignItems: "center",
    marginTop: 40,
    flexDirection: "row",
  },
  logo: {
    width: wp("25%"),
    resizeMode: "contain",
    alignSelf: "center",
  },
  overlayImage: {
    position: "absolute",
    width: "100%",
    height: "50%",
    resizeMode: "cover",
  },
  answerIcon: {
    width: wp("12%"),
    height: wp("7%"),
    position: "absolute",
    resizeMode: "contain",
    top: 0,
    right: 0,
  },
  back: {
    width: wp("20%"),
    height: wp("10%"),
    position: "absolute",
    resizeMode: "contain",
    top: -45,
    left: -15,
  },
  numberButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  sayacGuess: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  sayac: {
    flex: 1, // Eşit alan kaplaması için
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  guess: {
    flex: 1, // Eşit alan kaplaması için
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  container2: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  numberArrowContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  number: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: "#7900FF",
  },
  arrowContainer: {
    padding: 5,
  },
  arrowText: {
    width: 30,
    height: 30,
  },
  numberContainer: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
    width: 55,
    alignItems: "center",
  },
  tahminContainer: {
    width: "100%",
    alignItems: "center",
  },
  tahminEt: {
    backgroundColor: "#FFFF02",
    padding: 10,
    borderRadius: 12,
    marginVertical: 15,
    width: "100%",
    alignItems: "center",
  },
  tahminEtText: {
    color: "black",
    fontSize: wp("4.5%"),
    fontFamily: "UbuntuMedium",
  },
  tahminler: {
    flex: 2,
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 10,
    width: "100%",
    marginBottom: 20,
  },
  tahminlerTextContainer: {
    width: "100%",
    alignItems: "center",
    padding: 10,
  },
  tahminlerText: {
    fontSize: wp("5%"),
    fontFamily: "UbuntuMedium",
    color: "#7900FF",
  },
  tahminText2: {
    fontSize: wp("5%"),
    fontFamily: "UbuntuMedium",
    padding: 5,
  },
  tahminText1: {
    fontSize: 24,
    fontFamily: "UbuntuMedium",
    padding: 10,
    marginStart: 140,
  },
  tahminlerScrollView: {
    width: "100%",
    padding: 10,
  },
  difficultTahmin: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  dogruKonumText: {
    fontSize: wp("4%"),
    fontFamily: "UbuntuMedium",
    color: "white",
  },
  dogruSayiText: {
    fontSize: wp("5%"),
    fontFamily: "UbuntuMedium",
    color: "white",
  },
  tahminText3: {
    fontSize: wp("6%"),
    fontFamily: "UbuntuMedium",
    marginStart: 20,
    color: "black",
  },
  dogruKonum: {
    backgroundColor: "#62de04",
    width: wp("8%"),
    height: wp("8%"),
    borderRadius: wp("4%"),
    justifyContent: "center",
    alignItems: "center",
    marginEnd: 10,
  },
  dogruSayi: {
    backgroundColor: "#62de04",
    width: wp("8%"),
    height: wp("8%"),
    borderRadius: wp("4%"),
    justifyContent: "center",
    alignItems: "center",
    marginEnd: 10,
  },
});

export default Game;
