import React, { useState, useEffect } from "react";
import '../../css/Kategorie.css'
import Button from '@material-ui/core/Button';
import "../../css/Exercise1.css"
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import { withFirebase } from '../Firebase';


function Ex_3_4_7_8_Content(props) {
    const [loadContent, setloadContent] = useState(1)
    const [exerciseTitle, setexerciseTitle] = useState("title")
    const [drawnWordString, setdrawnWordString] = useState("Powodzenia!")
    const [drawnWordStringAnswer, setdrawnWordStringAnswer] = useState("")
    const [settings, setsettings] = useState([])
    const [allWords, setallWords] = useState([])
    const [restWords, setrestWords] = useState([])
    const [title, settitle] = useState(1)
    const [learnedWords, setlearnedWords] = useState(0)
    const [leftRepetitionsNumber, setleftRepetitionsNumber] = useState("")
    const [chceckButton, setchceckButton] = useState("Rozpocznij!")
    const [buttonNumber, setbuttonNumber] = useState("1")
    const [textField, settextField] = useState("")
    const [userAnswer, setuserAnswer] = useState("")
    const [voices, setvoices] = useState()
    const [showCorrectAnswer, setshowCorrectAnswer] = useState(0)
    const [rightWordIndex, setrightWordIndex] = useState(0)
    const [updateStatus, setupdateStatus] = useState(1)
    const [disableUznaj, setdisableUznaj] = useState(true)
    const [temporaryValueForUznaj, settemporaryValueForUznaj] = useState()
    const [disableZapisz, setdisableZapisz] = useState(false)
    const [showSaved, setshowSaved] = useState(false)
    const [disableUsun, setdisableUsun] = useState(false)

    let exerciseNumber = props.exerciseNumber





    let msg = new SpeechSynthesisUtterance()

    useEffect(() => {
        console.log(props);
        props.firebase
            .save(props.firebase.currentUser()).once('value', snapshot => {
                const userObject = snapshot.val();
                if (!userObject) return setloadContent(0)
                // console.log(userObject.exercise1.settings);
                let userObjectWords
                switch (exerciseNumber) {
                    case "exercise3":
                        setexerciseTitle("Wpisz angielskie znaczenie")
                        userObjectWords = userObject.exercise3
                        break;
                    case "exercise4":
                        setexerciseTitle("Wpisz polskie znaczenie")
                        userObjectWords = userObject.exercise4
                        break;
                    case "exercise7":
                        setexerciseTitle("Wpisz angielskie znaczenie ze słuchu")

                        userObjectWords = userObject.exercise7
                        break;
                    case "exercise8":
                        setexerciseTitle("Wpisz polskie znaczenie ze słuchu")
                        userObjectWords = userObject.exercise8
                        break;
                    default:
                        return console.log("return case");
                }
                if (userObjectWords === undefined || userObjectWords.angielski === undefined) return alert("stwórz nowy zapis")

                setsettings([userObjectWords.settings[0], userObjectWords.settings[1]])
                setallWords([...userObjectWords.angielski.slice(0)])
                setrestWords(userObjectWords.angielski)
                setloadContent("")
            })

    }, [exerciseNumber, props]);

    useEffect(() => {
        console.log("useEffect 2");

        setvoices(window.speechSynthesis.getVoices())
        setlearnedWords(allWords.length - restWords.length)
    }, [allWords, restWords])

    function audio(msg, word) {
        if (voices) {
            if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                msg.voice = voices[11]
            }
            else {
                msg.voice = voices[4]
            }
        }
        msg.text = word;
        speechSynthesis.speak(msg);
    }

    function randomWord() {
        setloadContent(1)
        setdisableUsun(false)
        setleftRepetitionsNumber("")
        setbuttonNumber(true)
        settitle(0)
        setdisableUznaj(true)
        setshowCorrectAnswer(0)
        document.getElementById("word").style.pointerEvents = "unset"


        let input = document.getElementById("inputAnswer")
        if (input) input.value = ""

        if (restWords.length === 0) {
            settitle(1)
            setchceckButton("Koniec!")
            setallWords([])
            setdrawnWordString("Gratulacje, ćwiczenie ukończone! :)")
            setloadContent("")
            return
        }

        let rightWordIndexTemp = Math.floor(Math.random() * restWords.length);
        setrightWordIndex(rightWordIndexTemp)
        console.log("jego pl " + restWords[rightWordIndexTemp][1]);
        console.log("jego ang " + restWords[rightWordIndexTemp][0]);


        let drawnWord = ""
        let drawnWordAnswer = ""
        if (exerciseNumber === "exercise3" || exerciseNumber === "exercise4") {
            drawnWord = restWords[rightWordIndexTemp][1]
            drawnWordAnswer = restWords[rightWordIndexTemp][0]

        }
        else {
            if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                msg.voice = voices[11]
            }
            else {
                msg.voice = voices[4]
            }
            msg.lang = 'en';
            drawnWordAnswer = restWords[rightWordIndexTemp][0]
            drawnWord = <img onClick={() => audio(msg, restWords[rightWordIndexTemp][1])}
                id="audio" src={require("../../media/audio.svg")} alt="Audio" />
        }
        settextField(1)
        setleftRepetitionsNumber(restWords[rightWordIndexTemp][2])
        setchceckButton("Sprawdź!")
        setdrawnWordString(drawnWord)
        setloadContent("")
        setdrawnWordStringAnswer(drawnWordAnswer)
    }

    function getCombinations(chars) {
        let combinations = [];
        chars.forEach((char, i) => {
            let word = '';
            buildWord(word + char + ", ", [i], chars, combinations)
        });
        return combinations;
    }

    function buildWord(word, usedIndexes, chars, combinations) {
        combinations.push(word);
        chars.forEach((char, i) => {
            if (usedIndexes.indexOf(i) === -1) {
                let newUsedIndexesArray = Array.from(usedIndexes);
                newUsedIndexesArray.push(i);
                buildWord(word + char + ", ", newUsedIndexesArray, chars, combinations)
            }
        });
    }

    function checkAnswer() {
        setshowSaved(false)
        setdisableZapisz(false)
        setdisableUsun(false)

        let styleRightAnswer = document.getElementById("showCorrectAnswer")

        if (chceckButton !== "Sprawdź!") return randomWord()
        document.getElementById("word").style.pointerEvents = "none"

        let drawnWordArray = drawnWordStringAnswer.toLowerCase().split("; ")
        let AllCombination = getCombinations(drawnWordArray)
        AllCombination.forEach((valuse, i) => {
            AllCombination[i] = AllCombination[i].slice(0, -2)
        })

        let isGoodAnswer = AllCombination.includes(userAnswer.toLowerCase())
        console.log(isGoodAnswer);
        setshowCorrectAnswer(1)

        if (isGoodAnswer) {
            styleRightAnswer.style.color = "rgb(4, 173, 41)"
            if (leftRepetitionsNumber === 1 || leftRepetitionsNumber === "1") {
                setdisableUsun(true)
                setleftRepetitionsNumber(0)

                restWords.splice(rightWordIndex, 1)
                setlearnedWords(allWords.length - restWords.length)


            }
            else {
                console.log(">1");
                restWords[rightWordIndex][2] = restWords[rightWordIndex][2] - 1
                setleftRepetitionsNumber(restWords[rightWordIndex][2])

            }
        }
        else {
            setdisableUznaj(false)
            styleRightAnswer.style.color = "red"
            settemporaryValueForUznaj(restWords[rightWordIndex][2])

            restWords[rightWordIndex][2] = parseInt(restWords[rightWordIndex][2]) + parseInt(settings[1])
            if (restWords[rightWordIndex][2] > settings[0]) {
                restWords[rightWordIndex][2] = parseInt(settings[0])
            }
            setleftRepetitionsNumber(restWords[rightWordIndex][2])
        }
        if (updateStatus) {

            setupdateStatus(0)

            props.firebase.save((props.firebase.currentUser() + `/${exerciseNumber}`))
                .update({
                    angielski: restWords
                })
                .then(() => {
                    setupdateStatus(1)
                })
                .catch(error => {
                    setupdateStatus(1)
                    alert(error);
                });
        }

        setchceckButton("Dalej!")
    }

    function handleKeyPress(e) {

        if (e.keyCode === 13) {
            document.getElementById("nextWord").click()
        }

        if (exerciseNumber === "exercise1" ||
        exerciseNumber === "exercise2" ||
        exerciseNumber === "exercise3" ||
        exerciseNumber === "exercise4") return
        
        if (e.keyCode === 40) {

            audio(msg, restWords[rightWordIndex][1])
        }
    }
    function createSave() {
        if (!disableZapisz) {
            props.firebase.save((props.firebase.currentUser() + `/${exerciseNumber}`))
                .update({
                    angielski: restWords
                })
                .then(() => {
                    setshowSaved(true)
                    console.log("updateClick");
                })
                .catch(error => {
                    setshowSaved(true)
                    alert(error);
                });
        }
        setdisableZapisz(true)

    }
    function deleteWord() {

        setdisableUsun(true)
        setleftRepetitionsNumber(0)
        restWords.splice(rightWordIndex, 1)
        setlearnedWords(allWords.length - restWords.length)
        createSave()
        setbuttonNumber(false)
        setchceckButton("Dalej!")
        document.getElementById("word").style.pointerEvents = "none"


    }
    function uznajOdp() {
        restWords[rightWordIndex][2] = (parseInt(temporaryValueForUznaj) - 1)
        setdisableUznaj(true)
        setleftRepetitionsNumber(restWords[rightWordIndex][2])
        if (leftRepetitionsNumber === 1 || leftRepetitionsNumber === "1") {
            setdisableUsun(true)
            restWords.splice(rightWordIndex, 1)
            setlearnedWords(allWords.length - restWords.length)


        }
    }

    return (

        <div id="exerciseContent">
            { loadContent ? <div id="centerLoading"><CircularProgress /></div> :
                <div id="exercise">
                    <div id="infoBar">
                        <h1
                            onClick={() => {
                                console.log(restWords)
                            }}
                        >{exerciseTitle}</h1>
                        {
                            title ?
                                <div>
                                    Pozostało słówek w zapisie: <strong>{allWords.length}</strong>
                                </div>

                                :
                                <div>
                                    <div id="optionsButtons" className="blueBacground">
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            className="blueBacground"
                                            onClick={() => deleteWord()}
                                            disabled={disableUsun}

                                        >
                                            Usuń słówka z zapisu</Button>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            className="blueBacground"
                                            disabled={disableZapisz}
                                            onClick={() => createSave()}

                                        >
                                            Zapisz</Button>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            className="blueBacground"
                                            disabled={disableUznaj}
                                            onClick={() => uznajOdp()}
                                        >
                                            Uznaj odpowiedź</Button>
                                    </div>
                                    <div id="saveFeedback">{showSaved && <b>Zapisano!</b>}</div>
                                    <div>
                                        Zapamiętanych słówek <strong>{learnedWords}</strong> z <strong>{allWords.length}</strong>
                                    </div>
                                </div>
                        }
                        <div id="minHeight">
                            <div id="word">
                                {drawnWordString}
                            </div>

                            {!title && <div>
                                Pozostało powtórzeń: <strong>{leftRepetitionsNumber}</strong>
                            </div>}
                        </div>
                    </div>
                    {<div id="answer">
                        <div>
                            {textField && <TextField
                                onKeyDown={(e) => {
                                    handleKeyPress(e)
                                }}
                                onChange={() => {
                                    setbuttonNumber(false)
                                    setuserAnswer(document.getElementById("inputAnswer").value)
                                }}
                                autoComplete="off"
                                id="inputAnswer"
                                name="Tłumaczenie"
                                type="text"
                                placeholder="Wpisz tłumaczenie" />
                            }
                        </div>
                        <div id="showCorrectAnswer">
                            {showCorrectAnswer ? drawnWordStringAnswer : ""}
                        </div>
                        <Button type="submit" id="nextWord" onClick={() => checkAnswer()}
                            disabled={buttonNumber === true} variant="contained" color="primary">
                            {chceckButton}
                        </Button>
                    </div>}
                </div>}
            <div id="rules">
                <h2>
                    Zasady i uwagi:
                    </h2>
                <ul>
                    <li>Dla wygody klawisz <b>Enter</b> aktywuje przycisk, natomiast <b>strzałka w dół</b> uruchamia lektora.
                    Dzięki temu można szybko i sprawnie przechodzić miedzy pytaniami bez konieczności używania myszki.
                    </li>
                    <li>W sytuacji, gdy wylosowane słówko posiada więcej niż jedno tłumaczenie, wypisz ich <b>dowolną
                        ilość</b>, w dowolnej kolejności, <b>po przecinku</b>. Za poprawną odpowiedź uznawana jest dowolna kombinacja.
                    </li>
                    <li>Wielkość liter <b>nie ma znaczenia.</b></li>
                    <li>Znaki interpunkcyjne, oraz ogonki <b>mają znaczenie.</b></li>
                    <li>Uważaj na niepotrzebne spacje na początku i na końcu.</li>
                    <li>Po każdej udzielonej odpowiedzi w przypadku <b> aktywnego połączenia z internetem</b>,
                    wykonuje się automatyczny zapis. Dla pewności po zakończeniu nauki można wykonać zapis samemu
                    za pomocą przycisku <b>Zapisz</b>
                    </li>
                    <li>W przypadku gdy stwierdzimy, że słówko już zostało zapamiętane, lub że jednak nie chcemy się go
                            uczyć, możemy użyć przycisku <b>Usuń słówko z zapisu</b>, co spowoduje jego całkowite usunięcie z danego zapisu.
                        </li>

                </ul>
            </div>
        </div >
    )
}


export default withFirebase(Ex_3_4_7_8_Content)