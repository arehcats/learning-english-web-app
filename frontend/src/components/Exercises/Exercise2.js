import React from 'react';
import { withAuthorization } from '../Session';
import Exercise1Content from "./ex_1_2_5_6_Content"

function Exercise2() {
    return (
        <div>
            <Exercise1Content exerciseNumber={"exercise2"} />
        </div>
    );
}


const condition = authUser => !!authUser;

export default withAuthorization(condition)(Exercise2);