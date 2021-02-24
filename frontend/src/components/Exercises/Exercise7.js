import React from 'react';
import { withAuthorization } from '../Session';
import ExerciseContent from "./ex_3_4_7_8_Content"
function Exercise7(props) {
    return (
        <div>
            <ExerciseContent exerciseNumber={"exercise7"} />
        </div>
    );
}


const condition = authUser => !!authUser;

export default withAuthorization(condition)(Exercise7);