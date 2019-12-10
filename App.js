import React, {Component} from 'react';
import {TouchableOpacity, PermissionsAndroid} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import moment from 'moment'

import {
  View,
  Text,
} from 'react-native';

const audioRecorderPlayer = new AudioRecorderPlayer();

class App extends Component{

  constructor(props){
    super(props);
    this.state = {
      isPlaying: true,
      isLongPress: false,
      liveLocation: true,
      playSeconds: 0,
      currentPositionSec: 0,
      currentDurationSec: 0,
      playTime: '00:00:00',
      duration: '00:00:00',
    }

  }

   async componentWillMount(): void {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Permissions for write access',
          message: 'Give permission to your storage to write a file',
          buttonPositive: 'ok',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the storage');
      } else {
        console.log('permission denied');
        return;
      }
    } catch (err) {
      console.warn(err);
      return;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Permissions for write access',
          message: 'Give permission to your storage to write a file',
          buttonPositive: 'ok',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('permission denied');
        return;
      }
    } catch (err) {
      console.warn(err);
      return;
    }
  }

  onStartRecord = async () => {
    console.log("sdfsdf")
    //const result = await audioRecorderPlayer.startRecorder();
    //console.log("result...", result)
    const path = Platform.select({
      ios: "audio.m4a",
      android: "audio.mp4", // should give extra dir name in android. Won't grant permission to the first level of dir.
    });
    const uri = await audioRecorderPlayer.startRecorder(path);
    console.log("uri...", uri)
    audioRecorderPlayer.addRecordBackListener((e) => {
      console.log("record...", e)
      this.setState({
        recordSecs: e.current_position,
        recordTime: audioRecorderPlayer.mmssss(
          Math.floor(e.current_position),
        ),
      }, () => console.log(""));
      return;
    });
    console.log(result);
  };

  onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    this.setState({
      recordSecs: 0,
    });
    console.log(result);
  };

  onStartPlay = async () => {
    console.log('onStartPlay');
    const msg = await audioRecorderPlayer.startPlayer();
    console.log(msg);
    audioRecorderPlayer.addPlayBackListener((e) => {
      if (e.current_position === e.duration) {
        console.log('finished');
        audioRecorderPlayer.stopPlayer();
      }
      this.setState({
        currentPositionSec: e.current_position,
        currentDurationSec: e.duration,
        playTime: audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
        duration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      });
      return;
    });
  };

  onPausePlay = async () => {
    await audioRecorderPlayer.pausePlayer();
  };

  onStopPlay = async () => {
    console.log('onStopPlay');
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };

  render() {
    return (
      <View style={{paddingTop: 20}}>
        <View>
          <TouchableOpacity >
            <Text style={{fontSize: 30, alignSelf: 'center'}}>Audio Recording Player</Text>
          </TouchableOpacity>
          <View style={{margin: 20}}>
            <Text>Time</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity style={{margin: 10,  padding:5, borderWidth: 2}} onPress={this.onStartRecord}>
              <Text style={{fontSize: 20}}>Record</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{margin: 10, padding:5, borderWidth: 2}} onPress={this.onStopRecord}>
              <Text style={{fontSize: 20}}>Stop</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity style={{margin: 10,  padding:5, borderWidth: 2}} onPress={this.onStartPlay}>
              <Text style={{fontSize: 20}}>Play</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{margin: 10, padding:5, borderWidth: 2}} onPress={this.onPausePlay}>
              <Text style={{fontSize: 20}}>Pause</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{margin: 10, padding:5, borderWidth: 2}} onPress={this.onStopPlay}>
              <Text style={{fontSize: 20}}>Stop</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    );
  }
}

export default App;
