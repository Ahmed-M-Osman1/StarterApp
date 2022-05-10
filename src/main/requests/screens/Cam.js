import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Micon from 'react-native-vector-icons/MaterialIcons';
import CMicon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import {HP, theme, WP} from '../../../utils/design';

const Cam = ({navigation, route}) => {
  const {goTo} = route?.params;
  const camera = useRef();
  const [flash, setFlash] = useState(false);
  const [isFront, setIsFront] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const takePicture = async () => {
    if (camera.current) {
      const data = await camera.current.takePictureAsync({quality: 0.8});
      navigation.navigate(goTo, {imgUri: data});
    }
  };

  const onStartRecording = async () => {
    try {
      if (camera.current) {
        setIsRecording(true);
        const data = await camera.current.recordAsync({mute: false});
        if (data) navigation.navigate(goTo, {video: data});
      }
    } catch (error) {
      console.log(error);
      setIsRecording(false);
    }
  };

  const onStopRecording = () => {
    camera.current.stopRecording();
    setIsRecording(false);
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          zIndex: 9,
          marginTop: HP(6),
          position: 'absolute',
        }}>
        <View style={{flex: 0.9}} />
        <Pressable
          style={{flex: 0.1, alignItems: 'center'}}
          onPress={() => navigation.goBack()}>
          <FontAwesome name={'times'} color={theme.whiteColor} size={WP('8')} />
        </Pressable>
      </View>
      <RNCamera
        ref={camera}
        style={styles.preview}
        type={
          isFront ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back
        }
        flashMode={
          flash
            ? RNCamera.Constants.FlashMode.on
            : RNCamera.Constants.FlashMode.off
        }
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        defaultVideoQuality={RNCamera.Constants.VideoQuality['480p']}
      />
      {isRecording && (
        <View style={styles.recordingContainer}>
          <Text style={styles.recording}>Recording</Text>
          <CMicon name="circle" color="rgb(245, 0, 0)" size={WP('4')} />
        </View>
      )}
      <View style={styles.ButtonContainer}>
        <Pressable onPress={() => setFlash(!flash)}>
          <Micon
            style={styles.icon}
            name={flash ? 'flash-on' : 'flash-off'}
            color={theme.whiteColor}
            size={WP('12')}
          />
        </Pressable>
        <TouchableOpacity
          onPress={takePicture}
          onLongPress={onStartRecording}
          onPressOut={isRecording ? onStopRecording : null}>
          <CMicon
            style={styles.icon}
            name="circle-outline"
            color={isRecording ? 'rgb(245, 0, 0)' : theme.whiteColor}
            size={WP('20')}
          />
        </TouchableOpacity>
        <Pressable onPress={() => setIsFront(!isFront)}>
          <CMicon
            style={styles.icon}
            name="rotate-3d-variant"
            color={theme.whiteColor}
            size={WP('12')}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Cam;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  ButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    position: 'absolute',
    width: '100%',
    bottom: '10%',
  },
  icon: {
    elevation: 6,
    shadowColor: theme.blackColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.6,
    shadowRadius: 100,
  },
  recording: {
    color: theme.whiteColor,
    fontSize: theme.titleFontSize,
    fontWeight: 'bold',
    marginRight: WP('4'),
  },
  recordingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    top: '3%',
  },
});
