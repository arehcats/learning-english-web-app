import React from 'react';
import '../../css/mojeSlowka.css'
import '../../css/tableStyle.css'
import { withFirebase } from '../Firebase';
import AddWord from './addWord'
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

class MojeSlowkaContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      user: [],
      rowsPerPage: 20,
      actualPage: 0,
      startRow: 0,
      endRow: 20,
      pages: 0,
      rows: 0,
      pagesElements: [],
      disableSelectedPage: 0,
      currentUser: this.props.firebase.currentUser()

    };
    this.deleteWord = this.deleteWord.bind(this);
  }
  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase
      .user(this.props.firebase.currentUser()).on('value', snapshot => {
        const userObject = snapshot.val();
        if (!userObject) return this.setState({ loading: false });
        const userWords = Object.keys(userObject).map(key => ({
          ang: key,
          pl: userObject[key],
        }));

        let pagesnumbers = Math.ceil(userWords.length / this.state.rowsPerPage)
        let elements = [];
        for (let i = 0; i < pagesnumbers; i++) {
          elements.push(<option key={i} value={i}>{i}</option>);
        }

        this.setState({
          user: userWords,
          loading: false,
          rows: userWords.length,
          pages: pagesnumbers,
          pagesElements: elements,
        });
      })
  }

  componentWillUnmount() {
    this.props.firebase.user(this.state.currentUser).off();
  }

  deleteWord(key) {
    this.props.firebase.user(this.props.firebase.currentUser()).child(key).remove()
      .then(() => {
        // update paginations state if after delete last page disappear
        const { rowsPerPage, actualPage } = this.state;
        let pagesnumbers = Math.ceil(this.state.rows / this.state.rowsPerPage)
        if (parseInt(actualPage) === pagesnumbers) {
          this.setState({
            startRow: parseInt(pagesnumbers - 1) * parseInt(rowsPerPage),
            endRow: parseInt(pagesnumbers - 1) * parseInt(rowsPerPage) + parseInt(rowsPerPage),
            actualPage: actualPage - 1
          }, () => {
            document.getElementById("selectPage").value = pagesnumbers - 1
            this.updateCurrentPage(actualPage - 1)
          })
        }
      })
      .catch(error => {
        alert(error);
    });


  }
  audio = (msg, word) => {
    msg.text = word;
    speechSynthesis.speak(msg);
  }


  updateCurrentPage = (pagenumber) => {
    const { rowsPerPage } = this.state;
    let pagesnumbers = Math.ceil(this.state.rows / this.state.rowsPerPage)

    if (pagenumber === pagesnumbers || pagenumber === -1) return
    this.setState({
      startRow: parseInt(pagenumber) * parseInt(rowsPerPage),
      endRow: parseInt(pagenumber) * parseInt(rowsPerPage) + parseInt(rowsPerPage),
      actualPage: pagenumber,
      disableSelectedPage: parseInt(pagenumber)
    }, () => {
      document.getElementById("selectPage").value = pagenumber
    })
  }

  pagination = () => {
    const { actualPage, pages } = this.state
    let pagination = []

    let actualePageInt = parseInt(actualPage)
    if (pages < 7) {
      for (let i = 0; i < this.state.pages; i++) {
        pagination.push(<button key={i} disabled={i === this.state.disableSelectedPage} 
        onClick={() => this.updateCurrentPage(i)}>
          {i}
        </button>)
      }
      return <div>
        <ArrowBackIosIcon onClick={() => this.updateCurrentPage(actualePageInt - 1)} color="primary" />
        {pagination}
        <ArrowForwardIosIcon onClick={() => this.updateCurrentPage(actualePageInt + 1)} color="primary" />
      </div >
    }
    else
      if (actualPage < 3) {
        for (let i = 0; i < 5; i++) {
          pagination.push(<button key={i} disabled={i === this.state.disableSelectedPage} onClick={() => this.updateCurrentPage(i)}>
            {i}
          </button>)
        }
        return <div>
          <ArrowBackIosIcon onClick={() => this.updateCurrentPage(actualePageInt - 1)} color="primary" />
          {pagination}
          <ArrowForwardIosIcon onClick={() => this.updateCurrentPage(actualePageInt + 1)} color="primary" />
          <button onClick={() => this.updateCurrentPage(pages - 1)}>
            {pages - 1}
          </button>
        </div >
      }
      else if (actualPage >= 3 && actualPage <= pages - 5) {
        for (let i = 0; i < 5; i++) {
          pagination.push(<button key={i} disabled={actualPage + i - 2 === this.state.disableSelectedPage} onClick={() => this.updateCurrentPage(actualPage + i - 2)}>
            {actualPage + i - 2}
          </button>)
        }
        return <div>
          <button onClick={() => this.updateCurrentPage(0)}>
            1
        </button>
          <ArrowBackIosIcon onClick={() => this.updateCurrentPage(actualePageInt - 1)} color="primary" />
          {pagination}
          <ArrowForwardIosIcon onClick={() => this.updateCurrentPage(actualePageInt + 1)} color="primary" />
          <button onClick={() => this.updateCurrentPage(pages - 1)}>
            {pages - 1}
          </button>
        </div >
      }
      else {
        for (let i = 0; i < 6; i++) {
          pagination.push(<button key={i} disabled={pages + i - 6 === this.state.disableSelectedPage} onClick={() => this.updateCurrentPage(pages + i - 6)}>
            {pages + i - 6}
          </button>)
        }
        return <div>
          <button onClick={() => this.updateCurrentPage(0)}>
            1
        </button>
          <ArrowBackIosIcon onClick={() => this.updateCurrentPage(actualePageInt - 1)} color="primary" />
          {pagination}
          <ArrowForwardIosIcon onClick={() => this.updateCurrentPage(actualePageInt + 1)} color="primary" />
        </div >
      }
  }

  newPageUpdateAfterSelect = (event) => {
    this.setState({ [event.target.name]: event.target.value }, () => {

      const { rowsPerPage, actualPage } = this.state;
      this.setState({
        startRow: parseInt(actualPage) * parseInt(rowsPerPage),
        endRow: parseInt(actualPage) * parseInt(rowsPerPage) + parseInt(rowsPerPage),
        actualPage: parseInt(actualPage),
      }, () => {
        this.updateCurrentPage(parseInt(actualPage))
      })
    })
  }

  rowsPerPageUpdate = (event) => {
    this.setState({ [event.target.name]: event.target.value }, () => {
      const { rowsPerPage } = this.state;

      // counting the new number of pages, and creating new list \/
      let pagesnumbers = Math.ceil(this.state.rows / this.state.rowsPerPage)
      let elements = [];
      for (let i = 0; i < pagesnumbers; i++) {
        elements.push(<option key={i} value={i}>{i}</option>);
      }
      
      this.updateCurrentPage(0)

      // reset state of pagiantion
      this.setState({
        startRow: 0,
        endRow: rowsPerPage,
        pagesElements: elements, // set new numbers of pages
        actualPage: 0, // 
        pages: pagesnumbers
      })
    })
  }





  render() {
    const { user, loading, startRow, endRow } = this.state;
    let msg = new SpeechSynthesisUtterance();
    let voices = window.speechSynthesis.getVoices();
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      msg.voice = voices[11]
    }
    else {
      msg.voice = voices[4]
    }

    msg.lang = 'en';

    return (
      <div id="mojeSlowka">
        <AddWord />
        <table className="table">
          <thead>
            <tr>
              <th>Angielski</th>
              <th>Polski</th>
              <th>Akcja</th>
            </tr>
          </thead>
          <tbody>
            {user.slice(startRow, endRow).map((user) => (
              <tr key={user.ang}>
                <th className="cell" width="40%;" >
                  <img onClick={() => this.audio(msg, user.ang)}
                    id="audio" src={require("../../media/audio.svg")} alt="Audio" /> {user.ang}
                </th>
                <th className="cell" width="45%;" >{user.pl}</th>
                <th className="cell" width="15%;"  >
                  <Tooltip onClick={() => this.deleteWord(user.ang)} title="Usuń">
                    <StyledIconButton aria-label="delete">
                      <DeleteIcon />
                    </StyledIconButton>
                  </Tooltip>
                </th>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan="3">
                <div id="paginationContent">
                <div id="rightpagination">
                    {this.pagination()}
                  </div>
                  <div id="leftPagination">
                    Wierszy na stronę: &nbsp;
                    <select
                      name="rowsPerPage"
                      value={this.state.rowsPerPage}
                      onChange={this.rowsPerPageUpdate}
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
                      value={this.state.actualPage}
                      onChange={this.newPageUpdateAfterSelect}
                      type="number">
                      {this.state.pagesElements}
                    </select>
                  </div>
                  <div id="rightpagination">
                    {this.pagination()}
                  </div>
                </div>
              </th>
            </tr>
          </tfoot>
        </table>

        { loading && <div align="center"><CircularProgress /></div>}
        {/* <UserList user={user} deleteWord={this.deleteWord} /> */}

      </div >
    );
  }
}
const StyledIconButton = withStyles((theme) => ({
  root: {
    minHeight: "0px",
    width: '20px',
    height: '20px',

  },
}))(IconButton);


export default withFirebase(MojeSlowkaContent);
