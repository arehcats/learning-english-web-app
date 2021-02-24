import React from 'react';
import NaukaContent from './NaukaContent.js'
import { withAuthorization } from '../Session';

function Nauka(history) {
    return (
        <div>
            <NaukaContent history={history} />
        </div>
    );
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Nauka);