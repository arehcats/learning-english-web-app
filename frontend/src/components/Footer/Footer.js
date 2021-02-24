import React from 'react';
import '../../css/Footer.css'

function Footer() {

    return (
        <footer>
            <div className = "flexFooter">
                <div>
                    Stworzone przez:
                </div>
                <div>
                    Dawid Stachera
                </div>
            </div>
            <div className = "flexFooter">
                <div>
                    W przypadku wykrycia błędów, lub w razie uwag zapraszam do konatku mailowego:
                </div>
                <div>
                    arehcats@gmail.com
                </div>
            </div>
            <div className = "flexFooter">
                <div>
                Ikony stworzone przez 
                </div>
                <div>
                <a href="https://www.flaticon.com/authors/freepik"title="Freepik">
                    Freepik</a><span> z </span><a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
                </div>
            </div>
        </footer >
    );
}

export default Footer;