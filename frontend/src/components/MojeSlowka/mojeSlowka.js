import React from 'react';
import MojeSlowkaContent from './mojeSlowkaContent.js'
import { withAuthorization } from '../Session';
import '../../css/mojeSlowka.css'
function MojeSlowka() {
    return (
        <div>
            <MojeSlowkaContent />
        </div>
    );
}


const condition = authUser => !!authUser;
 
export default withAuthorization(condition)(MojeSlowka);