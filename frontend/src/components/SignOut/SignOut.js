import React from 'react';
import { withFirebase } from '../Firebase';
import '../../css/Header.css'

const SignOutButton = ({ firebase }) => (
  <div  onClick={firebase.doSignOut}>
    <div>
      <strong>Wyloguj</strong>
    </div>
  </div>
);

export default withFirebase(SignOutButton);