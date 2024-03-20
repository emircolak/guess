import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
} from "react-native";
import { useFonts } from "expo-font";
import OnboardingModal from "react-native-onboarding-modal";
import { useState } from "react";

const { width, height } = Dimensions.get("window");

const DifficultyLevel = ({ navigation }) => {
  let [fontsLoaded] = useFonts({
    UbuntuMedium: require("../assets/fonts/Ubuntu-Medium.ttf"),
  });

  const normalMode = () => {
    navigation.navigate("Game", { mode: "normal" });
  };
  const difficultMode = () => {
    navigation.navigate("Game", { mode: "difficult" });
  };

  const handleBack = () => {
    navigation.navigate("Mode");
  };

  return (
    <>
      <ImageBackground
        source={require("../assets/images/blurry_background1.png")}
        style={styles.background}
      >
        <View style={styles.container}>
          <View>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  flex: 1,
                  marginTop: height * 0.05,
                  marginLeft: width * 0.05,
                }}
              >
                <TouchableOpacity onPress={() => handleBack()}>
                  <Image
                    source={require("../assets/images/back.png")}
                    style={styles.back}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  marginTop: height * 0.1,
                  marginRight: width * 0.05,
                }}
              >
                <Image
                  source={require("../assets/images/icon.png")}
                  style={styles.logo}
                />
              </View>
              <View style={{ flex: 1 }}></View>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={normalMode} style={styles.button1}>
              <Text
                style={[styles.buttonText1, { fontFamily: "UbuntuMedium" }]}
              >
                Normal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={difficultMode} style={styles.button}>
              <Text style={[styles.buttonText, { fontFamily: "UbuntuMedium" }]}>
                Zor
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: height * 0.1,
  },
  back: {
    width: width * 0.1,
    height: width * 0.1,
    position: "fixed",
    resizeMode: "contain",
    top: 0,
    left: 0,
  },
  logo: {
    width: width * 0.25,
    height: width * 0.25,
    resizeMode: "contain",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: width * 0.05,
    borderRadius: 30,
    marginVertical: 5,
    width: "80%",
    alignItems: "center",
  },
  button1: {
    backgroundColor: "#FFFF02",
    paddingVertical: 15,
    paddingHorizontal: width * 0.05,
    borderRadius: 30,
    marginVertical: 5,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontSize: width * 0.05,
  },
  buttonText1: {
    color: "black",
    fontSize: width * 0.05,
    fontFamily: "UbuntuMedium",
  },
});

export default DifficultyLevel;
