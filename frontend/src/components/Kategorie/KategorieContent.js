import React from 'react';
import '../../css/Kategorie.css'
import { withFirebase } from '../Firebase';
import "../../css/Kategorie.css"
import './Ikony/rozszrzeony.svg'
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from "react-router-dom";

class Kategorie extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
        };
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


    render() {
        return (
            <div id="kategorie">
                <div id='naglowekSlowekKategorii'>
                    <div id="naglowekKategorii" >
                        <h1>Słówka</h1>
                    </div>
                </div>

                {this.state.loading ? <div align="center"><CircularProgress /></div>
                    :
                    <div id="containerKategorie">

                        {this.state.categoryList.map((Kategoria) => (
                            <Link key={Kategoria} to={`/kategorie/${Kategoria}`} style={{ textDecoration: 'none' }}>
                                <div>
                                    <img src={require("./Ikony/" + Kategoria + ".svg")} alt={Kategoria} />
                                    <div><strong>{Kategoria}</strong></div>
                                </div>
                            </Link>
                        ))}
                    </div>
                }

            </div>
        );
    }
}

export default withFirebase(Kategorie);

