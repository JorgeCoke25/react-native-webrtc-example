export async function stopCall(pc, localStream) {
  localStream.getTracks().forEach(t => t.stop());
  localStream.release();
}
