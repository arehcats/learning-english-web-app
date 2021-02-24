import React from 'react';
import '../../css/Kategorie.css'
import { withFirebase } from '../Firebase';
import "../../css/Kategorie.css"
import './Ikony/rozszrzeony.svg'
import WyborFormyNauki from "./WyborFormyNauki"
import LoadSave from "./LoadSave"
import CircularProgress from '@material-ui/core/CircularProgress';

class Kategorie extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            category: "1",
            user: "",
            step: "",
            loading: true,
        };
        this.loadWords = this.loadWords.bind(this);
        this.backToCategory = this.backToCategory.bind(this);
    }

    componentDidMount() {
        this.props.firebase
            .categoryList().once('value', snapshot => {
                const categoryListObject = snapshot.val();
                if (!categoryListObject) return this.setState({ loading: false });
                this.setState({
                    categoryList: categoryListObject,
                    loading: false,
                });
            })
    }

    backToCategory() {
        this.setState({ step: 0 })
    }

    loadWords(category) {
        this.setState({ category: category }, () => {
            this.setState({ step: 1 })
        })
    }

    render() {
        return (
            <div id="kategorie">
                <div id='naglowekSlowekKategorii'>
                    <div id="naglowekKategorii" >
                        <h1>Nauka</h1>
                    </div>
                    <div id="loadSave">
                            <LoadSave />
                    </div>
                    <div className="nav__empty"></div>
                </div>
                <div id="progressBar">
                </div>
                { !this.state.step &&
                    <div>
                        <div id="h1SelectKategory">
                            <h1>Wybierz kategorie słówek do nauki</h1>
                        </div>
                        {this.state.loading ? <div align="center"><CircularProgress /></div>
                            :
                            <div id="containerSelectCategory">
                                <div onClick={() => this.loadWords("Moje słówka")}>
                                        <img src={require("../Kategorie/Ikony/Moje słówka.svg")} alt={"Moje słówka"} />
                                        <div><strong>"Moje słówka</strong></div>
                                </div>
                                {this.state.categoryList.map((Kategoria) => (
                                    <div key={Kategoria} onClick={() => this.loadWords(Kategoria)}>
                                            <img src={require("../Kategorie/Ikony/" + Kategoria + ".svg")} alt={Kategoria} />
                                            <div><strong>{Kategoria}</strong></div>
                                        </div>
                                ))}
                            </div>
                        }
                    </div>
                }
                { this.state.step && <WyborFormyNauki category={this.state.category} backToCategory={this.backToCategory} />}
            </div>
        );
    }
}

// const DisplayKateogire = ({ name, loadWords }) => (
//     <div onClick={() => loadWords(name)}>
//         <img src={require("../Kategorie/Ikony/" + name + ".svg")} alt={name} />
//         <div><strong>{name}</strong></div>
//     </div>
// )


export default withFirebase(Kategorie);
