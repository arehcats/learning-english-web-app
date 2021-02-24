import React, { useState, useEffect, useRef } from "react";
import { withStyles } from '@material-ui/core/styles';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import CircularProgress from '@material-ui/core/CircularProgress';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import '../../css/tableStyle.css'


const WyrazyKategori = ({ match }) => (
    <div>
        <WyrazyKategoriHOC match={match} />
    </div>
);


const WyrazyKategoriBase = (props) => {
    const category = props.match.params.categoryName
    const [isLoading, setIsLoading] = useState(true);
    const [slowaKategorii, setSlowaKategorii] = useState();
    const [isLogged, setisLogged] = useState();
    const [userWords, setUserWords] = useState();
    let starRowsPerPage = 20
    const [rowsPerPage, setrowsPerPage] = useState(20);
    const [actualPage, setactualPage] = useState(0);
    const [startRow, setstartRow] = useState(0);
    const [endRow, setendRow] = useState(20);
    const [pages, setpages] = useState(0);
    const [rows, setrows] = useState(0);
    const [pagesElements, setpagesElements] = useState(0);
    const [disableSelectedPage, setdisableSelectedPage] = useState(0);
    const didMountRef = useRef(false);
    let currentUser = props.firebase.currentUser()

    let msg = new SpeechSynthesisUtterance();
    let voices = window.speechSynthesis.getVoices();
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        msg.voice = voices[11]
    }
    else {
        msg.voice = voices[4]
    }
    msg.lang = 'en';

    useEffect(() => {
        console.log("how many??????????");
        setisLogged(props.firebase.currentUser())
        props.firebase
            .slowaKategorii(category).once('value', snapshot => {
                const kategoriaObject = snapshot.val();
                if (!kategoriaObject) return props.history.push("/kategorie");

                const kategoriaWords = Object.keys(kategoriaObject).map(key => ({
                    ang: key,
                    pl: kategoriaObject[key],
                }));
                console.log("download again");
                let pagesnumbers = Math.ceil(kategoriaWords.length / starRowsPerPage)
                let elements = [];
                for (let i = 0; i < pagesnumbers; i++) {
                    elements.push(<option key={i} value={i}>{i}</option>);
                }
                setrows(kategoriaWords.length)
                setSlowaKategorii(kategoriaWords)
                setpages(pagesnumbers)
                setpagesElements(elements)
            })


    }, [props.firebase, category, props.history, starRowsPerPage]);

    useEffect(() => {
        if (!didMountRef.current) {
            didMountRef.current = true;
            return
        }
        console.log("rowsPerPage use chagne1111");
        let pagesnumbers = Math.ceil(rows / rowsPerPage)

        let elements = [];
        for (let i = 0; i < pagesnumbers; i++) {
            elements.push(<option key={i} value={i}>{i}</option>);
        }

        let pagenumber = 0

        if (pagenumber === pagesnumbers || pagenumber === -1) return

        setstartRow(parseInt(pagenumber) * parseInt(rowsPerPage))
        setendRow(parseInt(pagenumber) * parseInt(rowsPerPage) + parseInt(rowsPerPage))
        setactualPage(pagenumber)
        setdisableSelectedPage(parseInt(pagenumber))

        // document.getElementById("selectPage").value = pagenumber

        setpages(pagesnumbers)
        setpagesElements(elements)


    }, [rowsPerPage, slowaKategorii, rows])

    useEffect(() => {

        if (isLogged) {
            props.firebase
                .user(props.firebase.currentUser()).on('value', snapshot => {
                    const userObject = snapshot.val();
                    if (!userObject) return setUserWords([]);

                    const userKeyWords = Object.keys(userObject)
                    setUserWords(userKeyWords)
                })
        }
        return () => props.firebase.user(currentUser).off()

    }, [props.firebase, isLogged, currentUser])

    useEffect(() => {

        if (slowaKategorii && userWords && isLogged) return setIsLoading(false)

    }, [userWords, slowaKategorii, isLogged])

    function akcja(kluczSlowa, slowo) {

        if (!isLogged) return <SimplePopover />

        let checing = userWords.some(element => {
            return element === kluczSlowa
        })
        if (checing) {
            return <Tooltip onClick={() => deleteWord(kluczSlowa)} title="Usuń">
                <StyledIconButton aria-label="delete">
                    <DeleteIcon />
                </StyledIconButton>
            </Tooltip>
        }
        else {
            return <StyledFab onClick={() => addWord(kluczSlowa, slowo)}
             color="primary" aria-label="add" title="Dodaj do moich słówek">
                <AddIcon />
            </StyledFab>
        }
    }

    function addWord(kluczSlowa, slowo) {
        props.firebase.user(props.firebase.currentUser()).update({
            [kluczSlowa]: slowo
        })
        .catch(error => {
            alert(error)
          });
    }

    function deleteWord(key) {
        props.firebase.user(props.firebase.currentUser()).child(key).remove()
        .catch(error => {
            alert(error)
          });
    }

    function audio(msg, word) {
        msg.text = word;
        speechSynthesis.speak(msg);
    }



    function pagination() {
        let actualePageInt = parseInt(actualPage)
        let pagination = []

        if (pages < 7) {
            for (let i = 0; i < pages; i++) {
                pagination.push(<button key={i} disabled={i === disableSelectedPage} onClick={() => updateCurrentPage(i)}>
                    {i}
                </button>)
            }
            return <div>
                <ArrowBackIosIcon onClick={() => updateCurrentPage(actualePageInt - 1)} color="primary" />
                {pagination}
                <ArrowForwardIosIcon onClick={() => updateCurrentPage(actualePageInt + 1)} color="primary" />
            </div >
        }
        else if (actualPage < 3) {
            for (let i = 0; i < 5; i++) {
                pagination.push(<button key={i} disabled={i === disableSelectedPage} onClick={() => updateCurrentPage(i)}>
                    {i}
                </button>)
            }
            return <div>
                <ArrowBackIosIcon onClick={() => updateCurrentPage(actualePageInt - 1)} color="primary" />
                {pagination}
                <ArrowForwardIosIcon onClick={() => updateCurrentPage(actualePageInt + 1)} color="primary" />
                <button onClick={() => updateCurrentPage(pages - 1)}>
                    {pages - 1}
                </button>
            </div >
        }
        else if (actualPage >= 3 && actualPage <= pages - 5) {
            for (let i = 0; i < 5; i++) {
                pagination.push(<button key={i} disabled={actualPage + i - 2 === disableSelectedPage} onClick={() => updateCurrentPage(actualPage + i - 2)}>
                    {actualPage + i - 2}
                </button>)
            }
            return <div>
                <button onClick={() => updateCurrentPage(0)}>
                    1
            </button>
                <ArrowBackIosIcon onClick={() => updateCurrentPage(actualePageInt - 1)} color="primary" />
                {pagination}
                <ArrowForwardIosIcon onClick={() => updateCurrentPage(actualePageInt + 1)} color="primary" />
                <button onClick={() => updateCurrentPage(pages - 1)}>
                    {pages - 1}
                </button>
            </div >
        }
        else {
            for (let i = 0; i < 6; i++) {
                pagination.push(<button key={i} disabled={pages + i - 6 === disableSelectedPage} onClick={() => updateCurrentPage(pages + i - 6)}>
                    {pages + i - 6}
                </button>)
            }
            return <div>
                <button onClick={() => updateCurrentPage(0)}>
                    1
            </button>
                <ArrowBackIosIcon onClick={() => updateCurrentPage(actualePageInt - 1)} color="primary" />
                {pagination}
                <ArrowForwardIosIcon onClick={() => updateCurrentPage(actualePageInt + 1)} color="primary" />
            </div >
        }
    }


    function updateCurrentPage(pagenumber) {
        let pagesnumbers = Math.ceil(rows / rowsPerPage)

        if (pagenumber === pagesnumbers || pagenumber === -1) return

        setstartRow(parseInt(pagenumber) * parseInt(rowsPerPage))
        setendRow(parseInt(pagenumber) * parseInt(rowsPerPage) + parseInt(rowsPerPage))
        setactualPage(pagenumber)
        setdisableSelectedPage(parseInt(pagenumber))

        document.getElementById("selectPage").value = pagenumber
    }

    function newPageUpdateAfterSelect(actualPageTest) {
        setstartRow(parseInt(actualPageTest) * parseInt(rowsPerPage))
        setendRow(parseInt(actualPageTest) * parseInt(rowsPerPage) + parseInt(rowsPerPage))
        setactualPage(parseInt(actualPageTest))
        updateCurrentPage(parseInt(actualPageTest))
    }


    return (
        <div id="kategorie">
            <div id='naglowekSlowekKategorii'>
                <div id="naglowekKategorii" >
                    <h1>{category}</h1>
                </div>
                <div id="PowrotDoKategorii" className="blueBacground">
                    <Button onClick={() => props.history.push("/kategorie")} variant="outlined" color="primary">
                        <strong>Wróć do kategorii</strong>
                    </Button>
                </div>
                <div className="nav__empty"></div>

            </div>
            {isLoading ? <div align="center"><CircularProgress /></div>
                :
                <table className="table">
                    <thead>
                        <tr>
                            <th>Angielski</th>
                            <th>Polski</th>
                            <th>Akcja</th>
                        </tr>
                    </thead>
                    <tbody>
                        {slowaKategorii.slice(startRow, endRow).map((slowaKategorii) => (
                            <tr key={slowaKategorii.ang}>
                                <th id="wysokoscKomorki" width="40%;" >
                                    <img onClick={() => audio(msg, slowaKategorii.ang)}
                                        id="audio" src={require("../../media/audio.svg")} alt="Audio" /> {slowaKategorii.ang}
                                </th>
                                <th id="wysokoscKomorki" width="45%;" >{slowaKategorii.pl}</th>
                                <th id="wysokoscKomorki" width="15%;"  >
                                    {akcja(slowaKategorii.ang, slowaKategorii.pl)}
                                </th>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colSpan="3">
                                <div id="paginationContent">
                                    <div id="rightpagination">
                                        {pagination()}
                                    </div>
                                    <div id="leftPagination">
                                        Wierszy na stronę: &nbsp;
                          <select
                                            name="rowsPerPage"
                                            value={rowsPerPage}
                                            onChange={e => setrowsPerPage(e.target.value)}
                                            type="number">
                                            <option value="10">10</option>
                                            <option value="20">20</option>
                                            <option value="30">30</option>
                                            <option value="40">40</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                            <option value="200">200</option>
                                            <option value="500">500</option>
                                            <option value="1000">1000</option>

                                        </select>
                          &nbsp;
                          Strona: &nbsp;
                          <select
                                            id="selectPage"
                                            name="actualPage"
                                            value={actualPage}
                                            onChange={e => newPageUpdateAfterSelect(e.target.value)}

                                            type="number">
                                            {pagesElements}
                                        </select>
                                    </div>
                                    <div id="rightpagination">
                                        {pagination()}
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </tfoot>
                </table>
            }
        </div>
    );
};

const StyledIconButton = withStyles((theme) => ({
    root: {
        minHeight: "0px",
        width: '20px',
        height: '20px',

    },
}))(IconButton);


const StyledFab = withStyles((theme) => ({
    root: {
        minHeight: "0px",
        width: '25px',
        height: '25px',

    },
}))(Fab);


const useStylesPopover = makeStyles((theme) => ({
    typography: {
        padding: theme.spacing(2),
    },
}));
function SimplePopover() {
    const classes = useStylesPopover();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div>
            <StyledFab onClick={handleClick} color="primary" aria-label="add">
                <AddIcon />
            </StyledFab>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Typography className={classes.typography}>Musisz się zalogować, aby wykonać akcje</Typography>
            </Popover>
        </div>
    );
}


const WyrazyKategoriHOC = compose(
    withRouter,
    withFirebase,
)(WyrazyKategoriBase);



const condition = authUser => !!authUser;


export default withAuthorization(condition)(WyrazyKategori)