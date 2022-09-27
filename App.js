import React, {useRef} from 'react';

import {
  Button,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet, Text,
  TextInput,
  View,
} from 'react-native';

import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  mediaDevices,
} from 'react-native-webrtc';
import {useState} from 'react';

import firestore from '@react-native-firebase/firestore';
import {startWebcam} from "./callFunctions/startWebcam";
import reactFiberErrorDialog from "react-native/Libraries/Core/ReactFiberErrorDialog";
import {stopCall} from "./callFunctions/stopCall";
import { joinCall } from "./callFunctions/joinCall";
import { startCall } from "./callFunctions/startCall";

const App = ({navigation}) => {
  const [remoteStream, setRemoteStream] = useState(null);
  const [webcamStarted, setWebcamStarted] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [channelId, setChannelId] = useState(null);
  const pc = useRef();
  const servers = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };


  return (
    <KeyboardAvoidingView style={styles.body} behavior="position">
      <SafeAreaView>
        {localStream && (
          <RTCView
            streamURL={localStream?.toURL()}
            style={styles.stream}
            objectFit="cover"
            mirror
          />
        )}

        {remoteStream && (
          <RTCView
            streamURL={remoteStream?.toURL()}
            style={styles.stream}
            objectFit="cover"
            mirror
          />
        )}
        {!webcamStarted && (
          <Text style={{fontSize:29}}>Welcome doctor</Text>
        )}
        <View style={styles.buttons}>
          {!webcamStarted && (
              <View style={{width:200}}>
                <Button title="Start webcam" onPress={()=>startWebcam(pc,setLocalStream,setRemoteStream,setWebcamStarted,servers)} />
              </View>
          )}
          {webcamStarted && <Button title="Start call" onPress={()=>startCall(pc,setChannelId)} />}
          {webcamStarted && (
            <View style={{flexDirection: 'row'}}>
              <Button title="Join call" onPress={joinCall} />
              <TextInput
                value={channelId}
                placeholder="callId"
                minLength={45}
                style={{borderWidth: 1, padding: 5, color: 'red'}}
                onChangeText={newText => setChannelId(newText)}
              />
            </View>
          )}
          {webcamStarted && (
              <Button
                  title="Stop Call"
                  onPress={() => {
                    stopCall(pc, localStream).then(r =>{
                        setWebcamStarted(false)
                        setLocalStream(false)
                        setRemoteStream(false)
                    });
                  }}
              />
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#fff',

    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFill,
  },
  stream: {
    flex: 2,
    width: 250,
    height: 200,
  },
  buttons: {
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
});

export default App;
