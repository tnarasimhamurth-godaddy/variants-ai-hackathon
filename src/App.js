import React, {useState} from "react";
import Roles from "./Roles";
import Modal from "./Modal";
import arIcon from "./images/ar-icon.png";
import './styles.css';

export default function App() {
  const [showRoles, setShowRoles] = useState(false);
 const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };


  const onClick = () => {
    console.log("Button clicked");
    setShowRoles(true);
  };

  const welcomeComponent = (
    <div className="App">

      { !showRoles &&
        <div style={{margin:'10%'}}>
        <h2>Hi! Welcome to the GoBuddy AR App!</h2>
        <div style={{padding:'1rem'}}>
          <img src={ arIcon } />
        </div>
        <button className="black-button" onClick={ onClick }> Start </button>
      </div> }
      { showRoles && <Roles /> }
    </div>
  );

  return (
    <div>
      <button className='ux-button ux-button-primary ' onClick={toggleModal}>Open Modal</button>
      { welcomeComponent }
    </div>
  );
}
