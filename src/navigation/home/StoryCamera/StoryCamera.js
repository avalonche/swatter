import React from "react";
import { StyleSheet } from "react-native";
import { RNCamera } from 'react-native-camera';

export default function StoryCamera() { 
  const readBarCode = (e) => {
    const { data, rawData } = e;
    console.log(data, rawData);
  };

  return (
    <RNCamera
      style={styles.cameraContainer}
      type={RNCamera.Constants.Type.back}
      onBarCodeRead={(e) => readBarCode(e)}
      barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
    />
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "column",
    alignItems: "center",
  },
});
