import Head from 'next/head';
import React, { useContext, useEffect, useState } from 'react';
// import CardComponent from '../../../components/card.js';
import Nav from '../../../components/navbarComponent';
import Cards from '../../../assets/cards.json';
import BatchesPage from '../../../components/batchesPage';

// export const getStaticProps = async (context) => {
//     const itemID = context.params?.id;
//     const data = await getData();
//     const foundItem = data.find((item) => itemID === item.id);

//     if (!foundItem) {
//         return {
//             props: { hasError: true }
//         };
//     }

//     return {
//         props: {
//             specificStarData: foundItem
//         }
//     };
// };

// async function getData() {
//     return Cards.data;
// }

// export const getStaticPaths = async () => {
//     const data = await getData();
//     const pathsWithParams = data.map((star) => ({ params: { id: star.id } }));

//     return {
//         paths: pathsWithParams,
//         fallback: true
//     };
// };

// export const getStaticProps = async (context) => {
//     const itemID = context.params?.id;
//     const data = await getData();
//     const foundItem = data.find((item) => itemID === item.id);

//     if (!foundItem) {
//         return {
//             props: { hasError: true }
//         };
//     }

//     const batches = foundItem.batches;
//     if (!batches) {
//         return {
//             props: { hasError: true }
//         };
//     }

//     return {
//         props: {
//             batches: batches,
//             region: foundItem
//         }
//     };
// };

// async function getData() {
//     return Cards.data;
// }

// export const getStaticPaths = async () => {
//     const data = await getData();
//     const pathsWithParams = data.map((star) => ({ params: { id: star.id } }));

//     return {
//         paths: pathsWithParams,
//         fallback: true
//     };
// };

const Region = () => {
    return (
        <>
            <Head>
                <title>Home - DigiTruck Ethiopia</title>
            </Head>
            <Nav />
            <div className="p-10 bg-[#dffafe] min-h-[100vh]">
                <div className="px-8 py-14 mt-24 rounded-3xl drop-shadow-md bg-white">
                    <BatchesPage />
                </div>
            </div>
        </>
    );
};

export default Region;
