import './Navigation.scss';
import navicon from '../../assets/navicon.svg';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Navigation() {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    return (
        <nav className={ `navigation ${ showMenu ? 'show-menu' : '' }` }>
            <img src={ navicon } className='navigation__icon'
            onClick={ () => { setShowMenu(!showMenu) }} />
            {/* data-testid behövs för att testa navigation mellan vyer (User Story 5) */}
            <a href="#" className={ `navigation__link ${ showMenu ? '' : 'hide' }` } 
            onClick={ () => { navigate('/') }} data-testid="nav-booking">Booking</a>
            <a href="#" className={ `navigation__link ${ showMenu ? '' : 'hide' }` } 
            onClick={ () => { navigate('/confirmation') }} data-testid="nav-confirmation">Confirmation</a>
        </nav>
    )
}

export default Navigation;