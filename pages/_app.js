import '../styles/globals.css';
import '../styles/DataTableDemo.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import Nav from '../components/navbarComponent';

export default function App({ Component, pageProps }) {
    return (
        <>
            <Nav />
            <Component {...pageProps} />
        </>
    );
}
