import firestore from "@react-native-firebase/firestore";
import { RTCIceCandidate, RTCSessionDescription } from "react-native-webrtc";

export async function joinCall(pc,channelId){
  const channelDoc = firestore().collection('channels').doc(channelId);
  const offerCandidates = channelDoc.collection('offerCandidates');
  const answerCandidates = channelDoc.collection('answerCandidates');

  pc.current.onicecandidate = async event => {
    if (event.candidate) {
      await answerCandidates.add(event.candidate.toJSON());
    }
  };

  const channelDocument = await channelDoc.get();
  const channelData = channelDocument.data();

  const offerDescription = channelData.offer;

  await pc.current.setRemoteDescription(
    new RTCSessionDescription(offerDescription),
  );

  const answerDescription = await pc.current.createAnswer();
  await pc.current.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
  };

  await channelDoc.update({answer});

  offerCandidates.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        const data = change.doc.data();
        pc.current.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });
}
