import React from 'react';
import '../../css/Nauka.css'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';



const WyborFormyNauki = (category) => (
    <div>
        <WyborFormyNaukiHOC category={category} />
    </div>
);



class WyborFormyNaukiBase extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            startNumber: "3",
            maxNumber: "10",
            StepNumber: "2",
            exercise: 0,
            error: null,
            createSave: []
        };
    }

    componentDidMount(){
        window.scrollTo(0, 0);
    }
    onSubmit = event => {
        event.preventDefault();
        const category = this.props.category.category
        const { startNumber, maxNumber, StepNumber, exercise } = this.state
        switch (exercise) {
            case 1:
                this.setState({ exercise: "exercise1" })
                break;
            case 2:
                this.setState({ exercise: "exercise2" })
                break;
            case 3:
                this.setState({ exercise: "exercise3" })
                break;
            case 4:
                this.setState({ exercise: "exercise4" })
                break;
            case 5:
                this.setState({ exercise: "exercise5" })
                break;
            case 6:
                this.setState({ exercise: "exercise6" })
                break;
            case 7:
                this.setState({ exercise: "exercise7" })
                break;
            case 8:
                this.setState({ exercise: "exercise8" })
                break;
            default:
                return console.log("return case");
        }

        if (category === "Moje słówka") {
            this.props.firebase
                .user(this.props.firebase.currentUser()).on('value', snapshot => {
                    const userObject = snapshot.val();
                    if (!userObject) return this.setState({ loading: false });

                    let createSave
                    if (exercise === 1 || exercise === 3) {
                        createSave = Object.keys(userObject).map(key =>
                            [key, userObject[key], startNumber]);
                    }
                    else if (exercise === 5 || exercise === 7) {
                        createSave = Object.keys(userObject).map(key =>
                            [key, key, startNumber]);
                    }
                    else if (exercise === 2 || exercise === 4 || exercise === 6 || exercise === 8) {
                        createSave = Object.keys(userObject).map(key =>
                            [userObject[key], key, startNumber]);
                    }

                    this.setState({
                        createSave: createSave,
                    }, () => {

                        this.props.firebase.save((this.props.firebase.currentUser() + `/${this.state.exercise}`))
                            .set({
                                angielski: createSave
                            });
                        this.props.firebase.save((this.props.firebase.currentUser() + `/${this.state.exercise}`))
                            .update({
                                settings: [maxNumber, StepNumber]
                            });
                        this.props.history.push("/nauka/" + this.state.exercise);
                    });
                })
        }
        else {
            this.props.firebase
                .slowaKategorii(category).once('value', snapshot => {
                    const kategoriaObject = snapshot.val();
                    if (!kategoriaObject) return this.setState({ loading: false });

                    let createSave
                    if (exercise === 1 || exercise === 3) {
                        createSave = Object.keys(kategoriaObject).map(key =>
                            [key, kategoriaObject[key], startNumber]);
                    }
                    else if (exercise === 5 || exercise === 7) {
                        createSave = Object.keys(kategoriaObject).map(key =>
                            [key, key, startNumber]);
                    }
                    else if (exercise === 2 || exercise === 4 || exercise === 6 || exercise === 8) {
                        createSave = Object.keys(kategoriaObject).map(key =>
                            [kategoriaObject[key], key, startNumber]);
                    }
                    this.setState({
                        createSave: createSave,
                    }, () => {

                        this.props.firebase.save((this.props.firebase.currentUser() + `/${this.state.exercise}`))
                            .set({
                                angielski: createSave
                            });
                        this.props.firebase.save((this.props.firebase.currentUser() + `/${this.state.exercise}`))
                            .update({
                                settings: [maxNumber, StepNumber]
                            });
                        this.props.history.push("/nauka/" + this.state.exercise);

                    });

                })
        }
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { startNumber, maxNumber, StepNumber, exercise, error } = this.state;


        const isInvalid = parseInt(startNumber) < 1 || parseInt(startNumber) > 100
            || parseInt(startNumber) > parseInt(maxNumber) || parseInt(StepNumber) < 0 || parseInt(exercise) === 0
            || startNumber === "" || maxNumber === "" || StepNumber === "";

        return (
            <div id="containerKategorie">
                <div>
                    Wybrano:  <strong>{this.props.category.category}</strong>
                    <div id="backToChangeCategory" className="blueBacground">
                        <Button onClick={() => this.props.category.backToCategory()} variant="outlined" color="primary">
                            <strong>Zmień kategorie</strong>
                        </Button>
                    </div>
                    <h1>Wybierz ćwiczenie</h1>
                </div>
                <div id="wyborCwiczenia">
                    <div>
                        <Button disabled={exercise === 1} onClick={() => this.setState({ exercise: 1 })}
                            variant="outlined" color="primary">
                            Ćwiczenie 1 - Wybierz angielskie znaczenie
                        </Button>
                    </div>
                    <div>
                        <Button disabled={exercise === 2} onClick={() => this.setState({ exercise: 2 })}
                            variant="outlined" color="primary">
                            Ćwiczenie 2 - Wybierz polskie znaczenie
                        </Button>
                    </div>
                    <div>
                        <Button disabled={exercise === 3} onClick={() => this.setState({ exercise: 3 })}
                            variant="outlined" color="primary">
                            Ćwiczenie 3 - Wpisz angielskie znaczenie
                        </Button>
                    </div>
                    <div>
                        <Button disabled={exercise === 4} onClick={() => this.setState({ exercise: 4 })}
                            variant="outlined" color="primary">
                            Ćwiczenie 4 - Wpisz polskie znaczenie
                        </Button>
                    </div>
                    <div>
                        <Button disabled={exercise === 5} onClick={() => this.setState({ exercise: 5 })}
                            variant="outlined" color="primary">
                            Ćwiczenie 5 - Wybierz angielskie znaczenie ze słuchu
                        </Button>
                    </div>
                    <div>
                        <Button disabled={exercise === 6} onClick={() => this.setState({ exercise: 6 })}
                            variant="outlined" color="primary">
                            Ćwiczenie 6 - Wybierz polskie znaczenie ze słuchu
                        </Button>
                    </div>
                    <div>
                        <Button disabled={exercise === 7} onClick={() => this.setState({ exercise: 7 })}
                            variant="outlined" color="primary">
                            Ćwiczenie 7 - Wpisz angielskie znaczenie ze słuchu
                        </Button>
                    </div>
                    <div>
                        <Button disabled={exercise === 8} onClick={() => this.setState({ exercise: 8 })}
                            variant="outlined" color="primary">
                            Ćwiczenie 8 - Wpisz polskie znaczenie ze słuchu
                        </Button>
                    </div>
                    <h1>Wybierz Ustawienia</h1>
                    <form id="NaukaSubmit" onSubmit={this.onSubmit}>
                        {/* Początkowa liczba powtórzeń */}
                        <div>
                            <TextField
                                name="startNumber"
                                value={startNumber}
                                onChange={this.onChange}
                                type="number"
                                label="Początkowa liczba powtórzeń" />
                        </div>
                        {/* Maksymalna liczba powtórzeń */}
                        <div>
                            <TextField name="maxNumber"
                                value={maxNumber}
                                onChange={this.onChange}
                                type="number"
                                label="Maksymalna liczba powtórzeń" />
                        </div>
                        {/* Dodatkowe powtórzenia przy błędnej odpowiedzi */}
                        <div>
                            <TextField name="StepNumber"
                                value={StepNumber}
                                onChange={this.onChange}
                                type="number"
                                label="Dodatkowe powtórzenia przy błędnej odpowiedzi" />
                        </div>
                        <div id = "marginSubmitButton" className="blueBacground">
                            <Button disabled={isInvalid} type="submit" variant="contained" color="primary">
                                Rozpocznij naukę!
                            </Button>
                        </div>
                        <div>
                            {error && <p>{error.message}</p>}
                        </div>

                    </form>
                </div>

            </div>
        )
    }
}


const WyborFormyNaukiHOC = compose(
    withRouter,
    withFirebase,
)(WyborFormyNaukiBase);

export default WyborFormyNauki;
