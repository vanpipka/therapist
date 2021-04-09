import React, { Component, useRef, useState } from 'react';
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo
} from 'react-native-twilio-video-webrtc';
import { Platform, StatusBar, StyleSheet, View, Text, TextInput, Button, TouchableOpacity } from 'react-native';

export default function VideoCall (props) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [status, setStatus] = useState('disconnected');
  const [participants, setParticipants] = useState(new Map());
  const [videoTracks, setVideoTracks] = useState(new Map());
  const [token, setToken] = useState('');
  const twilioRef = useRef(null);

  const _onConnectButtonPress = () => {
    //twilioRef.current.connect({ accessToken: token });
    setStatus('connecting');
  }

  const _onEndButtonPress = () => {
    twilioRef.current.disconnect();
  };

  const _onMuteButtonPress = () => {
    twilioRef.current
      .setLocalAudioEnabled(!isAudioEnabled)
      .then(isEnabled => setIsAudioEnabled(isEnabled));
  };

  const _onFlipButtonPress = () => {
    twilioRef.current.flipCamera();
  };

  const _onRoomDidConnect = ({roomName, error}) => {
    console.log('onRoomDidConnect: ', roomName);

    setStatus('connected');
  };

  const _onRoomDidDisconnect = ({ roomName, error }) => {
    console.log('[Disconnect]ERROR: ', error);

    setStatus('disconnected');
  };

  const _onRoomDidFailToConnect = error => {
    console.log('[FailToConnect]ERROR: ', error);

    setStatus('disconnected');
  };

  const _onParticipantAddedVideoTrack = ({ participant, track }) => {
    console.log('onParticipantAddedVideoTrack: ', participant, track);

    setVideoTracks(
      new Map([
        ...videoTracks,
        [
          track.trackSid,
          { participantSid: participant.sid, videoTrackSid: track.trackSid },
        ],
      ]),
    );
  };

  const _onParticipantRemovedVideoTrack = ({ participant, track }) => {
    console.log('onParticipantRemovedVideoTrack: ', participant, track);

    const videoTracksLocal = videoTracks;
    videoTracksLocal.delete(track.trackSid);

    setVideoTracks(videoTracksLocal);
  };

  return (
    <View style={styles.container}>
      {
        status === 'disconnected' &&
        <View>
          <Text style={styles.welcome}>
            React Native Twilio Video
          </Text>
          <TextInput
            style={styles.input}
            autoCapitalize='none'
            value={token}
            onChangeText={(text) => setToken(text)}>
          </TextInput>
          <Button
            title="Connect"
            style={styles.button}
            onPress={_onConnectButtonPress}>
          </Button>
        </View>
      }

      {
        (status === 'connected' || status === 'connecting') &&
          <View style={styles.callContainer}>
          {
            status === 'connected' &&
            <View style={styles.remoteGrid}>
              {

              }
            </View>
          }
          <View
            style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onEndButtonPress}>
              <Text style={{fontSize: 12}}>End</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onMuteButtonPress}>
              <Text style={{fontSize: 12}}>{ isAudioEnabled ? "Mute" : "Unmute" }</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onFlipButtonPress}>
              <Text style={{fontSize: 12}}>Flip</Text>
            </TouchableOpacity>

          </View>
        </View>
      }

      <TwilioVideo
        ref={ twilioRef }
        onRoomDidConnect={ _onRoomDidConnect }
        onRoomDidDisconnect={ _onRoomDidDisconnect }
        onRoomDidFailToConnect= { _onRoomDidFailToConnect }
        onParticipantAddedVideoTrack={ _onParticipantAddedVideoTrack }
        onParticipantRemovedVideoTrack= { _onParticipantRemovedVideoTrack }
      />

    </View>
  );
}
/*
<TwilioVideoLocalView
  enabled={true}
  style={styles.localVideo}
/>*/
/*<TwilioVideo
  ref={ twilioRef }
  onRoomDidConnect={ _onRoomDidConnect }
  onRoomDidDisconnect={ _onRoomDidDisconnect }
  onRoomDidFailToConnect= { _onRoomDidFailToConnect }
  onParticipantAddedVideoTrack={ _onParticipantAddedVideoTrack }
  onParticipantRemovedVideoTrack= { _onParticipantRemovedVideoTrack }
/>*/

/*Array.from(videoTracks, ([trackSid, trackIdentifier]) => {
  return (
    <TwilioVideoParticipantView
      style={styles.remoteVideo}
      key={trackSid}
      trackIdentifier={trackIdentifier}
    />
  )
})*/

/*import React from 'react';
import { Text, View, StyleSheet, AsyncStorage, ActivityIndicator, ImageBackground, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements'
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import { Camera } from 'expo-camera';
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo,
} from 'react-native-twilio-video-webrtc';

export default class VideoCall extends React.Component {

  static navigationOptions = {
    header: null,
  };

  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
  };

  async componentDidMount() {
    const user_ID = await AsyncStorage.getItem("user_id");
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });

    if (status == 'granted') {

      console.log("user_ID: "+user_ID);
      fetch(`http://188.68.221.66:3000/getToken?userName=${user_ID}`)
                    .then((response) => {
                      if (response.ok) {
                        response.text().then((jwt) => {
                          //console.log(jwt);
                          this.setState({token: jwt}, this.twilioConnect({token: jwt}))

                          return true;
                        });
                      } else {
                        response.text().then((error) => {
                          Alert.alert(error);
                        });
                      }
                    })
                    .catch((error) => {
                      console.log('error', error);
                      Alert.alert('API not available');
                    });
    }
  };

  twilioConnect(props) {
    TwilioVideo.current.connect({
        roomName: 'testRoom',
        accessToken: props.token,
      });
  }

  snap = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync({"quality": 0.1, "base64": true});

      this.props.navigation.state.params.onGoBack({'photo': photo})
      this.props.navigation.goBack()

    }
  };

  render() {

    console.log('render: '+this.state.token);
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
              style={{ flex: 1 }}
              type={this.state.type}
              ref={ref => {this.camera = ref;}}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.2,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  margin: 8,
                }}>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  callContainer: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },
  welcome: {
    fontSize: 30,
    textAlign: "center",
    paddingTop: 40,
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginRight: 70,
    marginLeft: 70,
    marginTop: 50,
    textAlign: "center",
    backgroundColor: "white",
  },
  button: {
    marginTop: 100,
  },
  localVideo: {
    flex: 1,
    width: 150,
    height: 250,
    position: "absolute",
    right: 10,
    bottom: 10,
  },
  remoteGrid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  remoteVideo: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    width: 100,
    height: 120,
  },
  optionsContainer: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    height: 100,
    backgroundColor: "blue",
    flexDirection: "row",
    alignItems: "center",
  },
  optionButton: {
    width: 60,
    height: 60,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 100 / 2,
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center",
  },
});
