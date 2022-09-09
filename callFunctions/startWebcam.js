import {mediaDevices, MediaStream, RTCPeerConnection} from "react-native-webrtc";

export async function startWebcam(pc,setLocalStream,setRemoteStream,setWebcamStarted,servers){
    pc.current = new RTCPeerConnection(servers);
    const local = await mediaDevices.getUserMedia({
        video: true,
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            googEchoCancellation: true,
            googAutoGainControl: true,
            googNoiseSuppression: true,
            googHighpassFilter: true,
            googTypingNoiseDetection: true,
            googNoiseReduction: true,
            volume: 2.0,
        }
    });
    pc.current.addStream(local);
    setLocalStream(local);
    const remote = new MediaStream();
    setRemoteStream(remote);

    // Push tracks from local stream to peer connection
    local.getTracks().forEach(track => {
        console.log(pc.current.getLocalStreams());
        pc.current.getLocalStreams()[0].addTrack(track);
    });

    // Pull tracks from remote stream, add to video stream
    pc.current.ontrack = event => {
        event.streams[0].getTracks().forEach(track => {
            remote.addTrack(track);
        });
    };

    pc.current.onaddstream = event => {
        setRemoteStream(event.stream);
    };

    setWebcamStarted(true);
}
