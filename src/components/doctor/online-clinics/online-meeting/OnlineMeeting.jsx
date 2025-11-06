import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const OnlineMeeting = () => {
  const navigate = useNavigate();
  const roomID = 1;
  const containerRef = useRef(null);

  useEffect(() => {
    const handleJoinMeeting = async () => {
      if (!containerRef.current) return;

      const appID = 1677194227;
      const ServerSecret = "17ebbacf1eb9e34048ea15dac205164e";

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        ServerSecret,
        roomID.toString(),
        Date.now().toString(),
        "Deepak Kashyap"
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference
        },

        // ✅ Callback fired when meeting ends
        onLeaveRoom: () => {
          console.log("Meeting finished!");
          navigate("/completed-consultation");   // redirect after exit
        },
      });
    };

    handleJoinMeeting();
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default OnlineMeeting;
