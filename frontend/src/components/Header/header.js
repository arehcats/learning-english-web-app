import React from 'react';
import '../../css/Header.css'
import { NavLink } from "react-router-dom";
import SignOutButton from '../SignOut/SignOut';
import { AuthUserContext } from '../Session';
import logo from '../../media/logo.svg'
import Paper from '@material-ui/core/Paper';

const Header = () => (
    <div>
        <Paper>
            <AuthUserContext.Consumer>
                {authUser =>
                    authUser ? <NavigationAuth /> : <NavigationNonAuth />
                }
            </AuthUserContext.Consumer>
        </Paper>
    </div>
);

const NavigationAuth = () => (
    <header>
        <div id="centerLogo">
            <NavLink to="/MojeSlowka" style={{ textDecoration: 'none' }}>
                <img src={logo} alt="Icon book PNG icon" />
            </NavLink>
        </div>
        <div>
            <NavLink activeClassName="selected" to="/MojeSlowka" style={{ textDecoration: 'none' }}>
                <div>
                    <strong>Moje słówka</strong>
                </div>
            </NavLink>
        </div>
        <div>
            <NavLink activeClassName="selected" to="/kategorie" style={{ textDecoration: 'none' }}>
                <div>
                    <strong>Słówka</strong>
                </div>
            </NavLink>
        </div>
        <div>
            <NavLink activeClassName="selected" to="/nauka" style={{ textDecoration: 'none' }}>
                <div>
                    <strong>Nauka</strong>
                </div>
            </NavLink>
        </div>
        <div>
            <SignOutButton />
        </div>
    </header>
);

const NavigationNonAuth = () => (
    <header>
        <div id="centerLogo">
            <NavLink to="/" style={{ textDecoration: 'none' }}>
                <img src={logo} alt="Icon book PNG icon" />
            </NavLink>
        </div>
        <div>
            <NavLink to="/" style={{ textDecoration: 'none' }}>
                <div>
                    <strong>Moje słówka</strong>
                </div>
            </NavLink>

        </div>
        <div>
            <NavLink activeClassName="selected" to="/kategorie" style={{ textDecoration: 'none' }}>
                <div>
                    <strong>Słówka</strong>
                </div>
            </NavLink>
        </div>
        <div>
            <NavLink to="/" style={{ textDecoration: 'none' }}>
                <div>
                    <strong>Nauka</strong>
                </div>
            </NavLink>
        </div>
        <div>
            <NavLink exact={true} activeClassName="selected" to="/" style={{ textDecoration: 'none' }}>
                <div>
                    <strong>Zaloguj</strong>
                </div>
            </NavLink>
        </div>
    </header>
);


// function Header() {
//     return (
//         <header>
//             <div>
//                 Logo
//             </div>
//             <div>
//                 <Link to="/MojeSlowka" style={{ textDecoration: 'none' }}>
//                     <Button variant="contained" color="primary">
//                         Moje słówka
//                 </Button>
//                 </Link>

//             </div>
//             <div>
//                 <Link to="/kategorie" style={{ textDecoration: 'none' }}>
//                     <Button variant="contained" color="primary">
//                         Kategorie
//                 </Button>
//                 </Link>
//             </div>
//             <div>
//                 <Link to="/nauka" style={{ textDecoration: 'none' }}>
//                     <Button variant="contained" color="primary">
//                         Nauka
//                 </Button>
//                 </Link>
//             </div>
//             <div>
//                 <SignOutButton />
//             </div>
//         </header>
//     );
// }

export default Header;