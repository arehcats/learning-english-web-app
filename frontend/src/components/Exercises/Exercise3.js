import React from 'react';
import { withAuthorization } from '../Session';
import ExerciseContent from "./ex_3_4_7_8_Content"
function Exercise3(props) {
    return (
        <div>
            <ExerciseContent exerciseNumber={"exercise3"} />
        </div>
    );
}


const condition = authUser => !!authUser;

export default withAuthorization(condition)(Exercise3);