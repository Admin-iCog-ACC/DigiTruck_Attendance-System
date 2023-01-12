import Head from 'next/head';
import Image from 'next/image';
// import styles from '../styles/Home.module.css'
import LoginPage from '../components/loginPage';

export default function Home() {
    return (
        <div className='bg-[#dffafe] min-h-[100vh]'>
            <LoginPage />
        </div>
    );
}
