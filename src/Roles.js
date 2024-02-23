import React, {useState} from 'react';
import goBuddyLogo from './images/gobuddy-target.png';
import TrainTicket from './TrainTicket';
import Speech from './Speech';
function Roles(props) {
  const rolesMap = {
    careGuide: 'Care Guide',
    engineer: 'Engineer',
    customer: 'Customer'
  };
  const [role, setRole] = useState(null);
  const [showTargetImg, setShowTargetImg] = useState(false);
  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const [activateARScene, setActivateARScene] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const onSpeaking = (val) => {
    setIsSpeaking(val);
  }

  const onClickRole = (role) => {
    setRole(role);
  }

  const onClickNext = () => {
    console.log('Next clicked');
    if(role)
      setShowTargetImg(true);
  }

  const onClickStart = () => {
    console.log("start clicked");
    setActivateARScene(true);
    setShowTargetImg(false);
  };

  return (
  <>
      { !activateARScene &&
      <>
        {!showTargetImg && <div>
        <h2>What's your role?</h2>
        <div style={{margin: '15px'}}>
          <p >Please select your role at GoDaddy</p>
        </div>
        <div style={{margin: '15px'}}>
      { Object.keys(rolesMap).map(r =>
      (<div key={r} style={{margin: '15px'}}>
          <button className="secondary-button" onClick={ () => onClickRole(r) }>{ rolesMap[r] } </button>
        </div>)
          ) }
          </div>
        <button className="black-button" disabled={ !role } onClick={ onClickNext }> Next </button>
    </div>
      }
      { showTargetImg &&
        <div style={ { margin: '10px' } }>
          <h2>Get your AR image target Ready!</h2>
          <div style={{margin: '15px'}}>
            <img src={ goBuddyLogo } style={ { height: '15rem' } } />
          </div>
        <div>
        <p>Make sure your GoBuddy image target is ready and sitting flat on your desk. Don't have the image target? Visit this site to print it.</p>
        <button style={{margin:'10px'}} onClick={onClickStart} className="black-button"> I'm Ready! </button>
        </div>
          </div> }
        </>
      }

      { activateARScene && (
        <>
        <TrainTicket isTalking={isSpeaking} />
        <Speech onSpeaking={onSpeaking} />
        </>
) }
  </>
  );
}

export default Roles;