import Head from 'next/head';
import Image from 'next/image';
import { RecoilRoot } from 'recoil';
import HomePage from '../components/homePage';
import Nav from '../components/navbarComponent';
import TableDemo from '../components/tableComponent';
// import styles from '../styles/Home.module.css'

export default function Home() {
    return (
        <>
            <Head>
                <title>Home - DigiTruck Ethiopia</title>
            </Head>
            {/* <Nav /> */}
            <div className="p-10 bg-[#dffafe] min-h-[100vh]">
                <div className="px-8 py-14 mt-24 rounded-3xl drop-shadow-md bg-white">
                    <HomePage />
                </div>
            </div>
        </>
    );
}
