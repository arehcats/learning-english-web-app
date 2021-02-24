import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useHistory } from 'react-router-dom';



const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));



function CustomizedMenus() {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const history = useHistory()

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="blueBacground" id="loadSaveButtton">
            <Button
                aria-controls="customized-menu"
                aria-haspopup="true"
                variant="outlined"
                color="primary"
                onClick={handleClick}
            >
                Wczytaj zapis
            </Button>
            <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => history.push("/nauka/exercise1")}>
                    <ListItemText primary="Ćwiczenie 1 - Wybierz angielskie znaczenie" />
                </MenuItem>
                <MenuItem onClick={() => history.push("/nauka/exercise2")}>
                    <ListItemText primary="Ćwiczenie 2 - Wybierz polskie znaczenie" />
                </MenuItem>
                <MenuItem onClick={() => history.push("/nauka/exercise3")}>
                    <ListItemText primary="Ćwiczenie 3 - Wpisz angielskie znaczenie" />
                </MenuItem>
                <MenuItem onClick={() => history.push("/nauka/exercise4")}>
                    <ListItemText primary="Ćwiczenie 4 - Wpisz polskie znaczenie" />
                </MenuItem>
                <MenuItem onClick={() => history.push("/nauka/exercise5")}>
                    <ListItemText primary="Ćwiczenie 5 - Wybierz angielskie znaczenie ze słuchu" />
                </MenuItem>
                <MenuItem onClick={() => history.push("/nauka/exercise6")}>
                    <ListItemText primary="Ćwiczenie 6 - Wybierz polskie znaczenie ze słuchu" />
                </MenuItem>
                <MenuItem onClick={() => history.push("/nauka/exercise7")}>
                    <ListItemText primary="Ćwiczenie 7 - Wpisz angielskie znaczenie ze słuchu" />
                </MenuItem>
                <MenuItem onClick={() => history.push("/nauka/exercise8")}>
                    <ListItemText primary="Ćwiczenie 8 - Wpisz polskie znaczenie ze słuchu" />
                </MenuItem>

            </StyledMenu>
        </div>
    );
}

export default CustomizedMenus