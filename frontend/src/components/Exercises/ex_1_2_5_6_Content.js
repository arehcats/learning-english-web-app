import React from 'react';
import '../../css/Kategorie.css'
import Button from '@material-ui/core/Button';
import "../../css/Exercise1.css"
import { withFirebase } from '../Firebase';
import CircularProgress from '@material-ui/core/CircularProgress';


const ExerciseContent = ({ exerciseNumber }) => (
    <div>
        <ExerciseContentHOC exerciseNumber={exerciseNumber} />
    </div>
);


let msg, voices
msg = new SpeechSynthesisUtterance();


class ExerciseContentBase extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            allWords: [],
            restWords: [],
            settings: [],
            answer: "1",
            rightWord: "",
            learnedWords: 0,
            loadContent: "1",
            randomWords: [],
            finish: 0,
            chceckButton: "Rozpocznij!",
            leftRepetitionsNumber: "",
            rightWordIndex: "",
            buttonNumber: "1",
            drawnWord: "Powodzenia!",
            exerciseNumber: this.props.exerciseNumber,
            title: 1,
            updateStatus: 1,
            exerciseTitle: "",
            showSaved: false,
            disableUsun: false,
            disableZapisz: false
        }
    }

    componentDidMount() {
        this.setState({ learnedWords: this.state.allWords.length - this.state.restWords.length })

        this.props.firebase
            .save(this.props.firebase.currentUser()).once('value', snapshot => {
                const userObject = snapshot.val();
                if (!userObject) return this.setState({ loading: false });
                // console.log(userObject.exercise1.settings);
                const { exerciseNumber } = this.state
                let userObjectWords
                switch (exerciseNumber) {
                    case "exercise1":
                        this.setState({ exerciseTitle: "Wybierz angielskie znaczenie" })
                        userObjectWords = userObject.exercise1
                        break;
                    case "exercise2":
                        this.setState({ exerciseTitle: "Wybierz polskie znaczenie" })
                        userObjectWords = userObject.exercise2
                        break;
                    case "exercise5":
                        this.setState({
                            exerciseTitle: "Wybierz angielskie znaczenie ze słuchu"
                        })
                        userObjectWords = userObject.exercise5
                        break;
                    case "exercise6":
                        this.setState({
                            exerciseTitle: "Wybierz polskie znaczenie ze słuchu"
                        })
                        userObjectWords = userObject.exercise6
                        break;
                    default:
                        return console.log("return case");
                }
                if (userObjectWords === undefined || userObjectWords.angielski === undefined) return alert("stwórz nowy zapis")

                this.setState({
                    settings: [userObjectWords.settings[0], userObjectWords.settings[1]],
                    allWords: [...userObjectWords.angielski.slice(0)],
                    restWords: userObjectWords.angielski,
                    loadContent: ""
                });
            })


    }

    randomWords = () => {
        this.setState({
            randomWords: [],
            answer: "1",
            rightWord: "",
            loadContent: "1",
            leftRepetitionsNumber: "",
            buttonNumber: true,
            rightWordIndex: 0,
            title: 0,
            disableUsun: false,
            showSaved: false,
            disableZapisz: false
        }, () => {

            let { randomWords, allWords, rightWord, restWords, rightWordIndex } = this.state
            if (restWords.length === 0) {
                this.setState({
                    loadContent: "",
                    finish: 1,
                    title: 1,
                    chceckButton: "Koniec!",
                    allWords: [],
                    drawnWord: "Gratulacje, ćwiczenie ukończone! :)"


                })
                return
            }
            let answerAmount = 3
            rightWord = Math.floor(Math.random() * restWords.length);
            rightWordIndex = rightWord
            // console.log("jego pl " + this.state.restWords[rightWord][1]);
            // console.log("jego ang " + this.state.restWords[rightWord][0]);


            let allWordsLegngth = allWords.length
            if (allWordsLegngth === 3) { answerAmount = 2 }
            else if (allWordsLegngth === 2) { answerAmount = 1 }
            else if (allWordsLegngth === 1) { answerAmount = 0 }

            rightWord = this.state.restWords[rightWord][0]
            while (randomWords.length < answerAmount) {
                let r = Math.floor(Math.random() * allWordsLegngth);
                r = this.state.allWords[r][0]
                if (r === rightWord) { }
                else if ((randomWords.indexOf(r) === -1)) randomWords.push(r);
            }
            randomWords.push(rightWord)

            for (let i = randomWords.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [randomWords[i], randomWords[j]] = [randomWords[j], randomWords[i]];
            }
            let drawWord = ""
            if (this.state.exerciseNumber === "exercise1" || this.state.exerciseNumber === "exercise2") {
                drawWord = this.state.restWords[rightWordIndex][1]
            }
            else {
                drawWord = <img onClick={() => this.audio(msg, this.state.restWords[rightWordIndex][1])}
                    id="audio" src={require("../../media/audio.svg")} alt="Audio" />
            }

            this.setState({
                randomWords: randomWords,
                rightWord: rightWord,
                leftRepetitionsNumber: restWords[rightWordIndex][2],
                chceckButton: "Sprawdź!",
                rightWordIndex: rightWordIndex,
                drawnWord: drawWord
            }, () => {
                this.setState({
                    loadContent: "",
                })

            }
            )

        })
    }
    audio = (msg, word) => {
        msg.text = word;
        speechSynthesis.speak(msg);
    }
    answer = (answer) => {
        this.setState({ answer: answer })
    }

    checkAnswer = () => {

        if (this.state.chceckButton !== "Sprawdź!") return this.randomWords()

        document.getElementById(0).style.pointerEvents = "none"
        document.getElementById(1).style.pointerEvents = "none"
        document.getElementById(2).style.pointerEvents = "none"
        document.getElementById(3).style.pointerEvents = "none"


        const { rightWord, rightWordIndex, answer, restWords, settings, randomWords, leftRepetitionsNumber, buttonNumber } = this.state
        let rightAnswetIndex = randomWords.indexOf(rightWord)

        if (answer === rightWord) {
            document.getElementById(buttonNumber).style.borderColor = "rgb(59, 248, 7)"
            document.getElementById(buttonNumber).style.boxShadow = "0px 0px 0px 2px rgb(59, 248, 7)"

            if (leftRepetitionsNumber === 1 || leftRepetitionsNumber === "1") {
                this.setState({
                    leftRepetitionsNumber: 0,
                    disableUsun: true,
                })
                restWords.splice(rightWordIndex, 1)
                this.setState({ restWords: restWords })

            }
            else {
                restWords[rightWordIndex][2] = restWords[rightWordIndex][2] - 1
                this.setState({
                    restWords: restWords,
                    leftRepetitionsNumber: restWords[rightWordIndex][2],
                })
            }
        }
        else {
            document.getElementById(buttonNumber).style.borderColor = "red"
            document.getElementById(buttonNumber).style.boxShadow = "0px 0px 0px 2px red"

            document.getElementById(rightAnswetIndex).style.borderColor = "rgb(227, 231, 0)"
            document.getElementById(rightAnswetIndex).style.boxShadow = "0px 0px 0px 3px rgb(227, 231, 0)"

            restWords[rightWordIndex][2] = parseInt(restWords[rightWordIndex][2]) + parseInt(settings[1])
            if (restWords[rightWordIndex][2] > settings[0]) {
                restWords[rightWordIndex][2] = parseInt(settings[0])
            }
            this.setState({
                restWords: restWords,
                leftRepetitionsNumber: restWords[rightWordIndex][2],
            })
        }
        this.setState({
            chceckButton: "Dalej!",
            learnedWords: this.state.allWords.length - this.state.restWords.length
        })


        if (this.state.updateStatus) {
            this.setState({ updateStatus: 0 }, () => {
                this.props.firebase.save((this.props.firebase.currentUser() + `/${this.state.exerciseNumber}`))
                    .update({
                        angielski: this.state.restWords
                    })
                    .then(() => {
                        this.setState({ updateStatus: 1 })
                    })
            }
            )

        }

    }

    deleteWord = () => {

        this.setState({
            disableUsun: true,
            leftRepetitionsNumber: 0,
            chceckButton: "Dalej!",
            buttonNumber: false
        })

        this.state.restWords.splice(this.state.rightWordIndex, 1)

        this.setState({ learnedWords: this.state.allWords.length - this.state.restWords.length })

        this.createSave()

    }
    createSave = () => {
        if (!this.state.disableZapisz) {
            this.props.firebase.save((this.props.firebase.currentUser() + `/${this.state.exerciseNumber}`))
                .update({
                    angielski: this.state.restWords
                })
                .then(() => {
                    this.setState({
                        showSaved: true,
                        leftRepetitionsNumber: 0
                    })
                })
                .catch(error => {
                    console.log(error);
                });
        }
        this.setState({ disableZapisz: true })

    }

    render() {
        const { buttonNumber, drawnWord, exerciseTitle } = this.state;
        msg = new SpeechSynthesisUtterance();
        voices = window.speechSynthesis.getVoices();
        msg.voice = voices[4]
        msg.lang = 'en';

        return (
            <div id="exerciseContent">
                { this.state.loadContent ? <div id="centerLoading"><CircularProgress /></div> :
                    <div>
                        <div id="infoBar">
                            <h1 >{exerciseTitle}</h1>
                            {
                                this.state.title ?
                                    <div>
                                        Pozostało słówek w zapisie: <strong>{this.state.allWords.length}</strong>
                                    </div>
                                    :
                                    <div>
                                        <div id="optionsButtons" className="blueBacground">
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                className="blueBacground"
                                                onClick={() => this.deleteWord()}
                                                disabled={this.state.disableUsun}

                                            >
                                                Usuń słówko z zapisu</Button>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                className="blueBacground"
                                                disabled={this.state.disableZapisz}
                                                onClick={() => this.createSave()}

                                            >
                                                Zapisz</Button>
                                        </div>
                                        <div id="saveFeedback">{this.state.showSaved && <b>Zapisano!</b>}</div>
                                        <div>
                                            Zapamiętanych słówek <strong>{this.state.learnedWords}</strong> z <strong>{this.state.allWords.length}</strong>
                                        </div>
                                    </div>

                            }
                            <div id="word">
                                {drawnWord}
                            </div>

                            {!this.state.title && <div>
                                Pozostało powtórzeń: <strong>{this.state.leftRepetitionsNumber}</strong>
                            </div>}

                        </div>
                        {<div id="answer">
                            {this.state.randomWords.map((randomWord, i) =>
                                <div key={i}>
                                    <Button id={i} disabled={buttonNumber === i} onClick={() => this.setState({
                                        answer: this.state.randomWords[i],
                                        buttonNumber: i,
                                    })}
                                        variant="outlined" color="primary">
                                        <strong>{this.state.randomWords[i]}</strong>
                                    </Button>
                                </div>
                            )}
                            <Button id="nextWord" onClick={() => this.checkAnswer()}
                                disabled={buttonNumber === true} type="submit" variant="contained" color="primary">
                                {this.state.chceckButton}
                            </Button>
                            <div id="0" ></div>
                            <div id="1"></div>
                            <div id="2"></div>
                            <div id="3"></div>
                        </div>}
                    </div>}
                <div id="rules">
                    <h2>
                        Zasady i uwagi:
                    </h2>
                    <ul>
                        <li>Po każdej udzielonej odpowiedzi w przypadku <b> aktywnego połączenia z internetem</b>,
                    wykonuje się automatyczny zapis. Dla pewności po zakończeniu nauki można wykonać zapis samemu
                    za pomocą przycisku <b>Zapisz</b>
                        </li>
                        <li>
                            W przypadku gdy stwierdzimy, że słówko już zostało zapamiętane, lub że jednak nie chcemy się go 
                            uczyć, możemy użyć przycisku <b>Usuń słówko z zapisu</b>, co spowoduje jego całkowite usunięcie z danego zapisu.
                        </li>

                    </ul>
                </div>
            </div >
        );
    }
}

const ExerciseContentHOC = withFirebase(ExerciseContentBase)

export default ExerciseContent;
