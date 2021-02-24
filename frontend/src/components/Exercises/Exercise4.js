import React from 'react';
import { withAuthorization } from '../Session';
import ExerciseContent from "./ex_3_4_7_8_Content"
function Exercise4(props) {
    return (
        <div>
            <ExerciseContent exerciseNumber={"exercise4"} />
        </div>
    );
}


const condition = authUser => !!authUser;

export default withAuthorization(condition)(Exercise4);