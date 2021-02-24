import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import '../../css/mojeSlowka.css'


const AddWord = () => (
    <div id="flex">
        <div id="naglowek" >
            <h1>Moje słówka</h1>
        </div>
        <div id="addWordForm">
            <AddWordForm />
        </div>
    </div>
);

const INITIAL_STATE = {
    angielski: '',
    polski: '',
    error: null,
};

class AddWordFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        event.preventDefault();
        const { angielski, polski } = this.state;


        this.props.firebase.user(this.props.firebase.currentUser()).update({
            [angielski]: polski
        })
        .then(()=>{
            this.setState({
                angielski: "",
                polski: ""
            })
        })
        .catch(error => {
            alert(error)
          });
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });

    };

    render() {
        const { angielski, polski, error } = this.state;

        const isInvalid = angielski === '' || polski === '';

        return (
            <form id="addWordSubmit" onSubmit={this.onSubmit}>
                <div>
                    <TextField name="angielski"
                        value={angielski}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Angielskie słówko" />
                </div>
                <div>
                    <TextField name="polski"
                        value={polski}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Tłumaczenie" />
                </div>
                <div className="blueBacground">
                    <Button disabled={isInvalid} type="submit" variant="contained" color="primary">
                        Dodaj słówko
                    </Button>
                </div>
                {error && <p>{error.message}</p>}
            </form>
        );
    }
}
const AddWordForm = withFirebase(AddWordFormBase)

export default AddWord;




