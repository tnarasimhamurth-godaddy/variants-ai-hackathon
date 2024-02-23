import React, { useState } from "react";
import { AFrameRenderer, Marker } from "react-web-ar";
import TextToSpeech from "./TextToSpeech";

function TrainTicket() {

  const [isTalking, setIsTalking] = useState(false);

  return (
    <>
      <AFrameRenderer arToolKit={{ sourceType: "webcam" }}>
        <Marker
          parameters={{
            preset: "pattern",
            type: "pattern",
            url: "/target/heart.patt"
          }}
        >

          <a-gltf-model src="/models/robot.gltf"
            position="0 0.5 0"
            scale="0.5 0.5 0.5"
            rotation="0 -90 90"
          >
            {/* adds a lil wiggle :3 */}
            {isTalking &&
              <a-animation
                attribute="rotation"
                dur="1000"
                direction="alternate"
                repeat="indefinite"
                to="0 -75 90"
                from="0 -105 90"
                easing="ease-in-out">
              </a-animation>
            }
          </a-gltf-model>
        </Marker>
      </AFrameRenderer>
      <TextToSpeech
        text="That's a great question! Let me think about that..."
        onStart={() => setIsTalking(true)}
        onEnd={() => setIsTalking(false)} />
    </>
  );
}

export default TrainTicket;
