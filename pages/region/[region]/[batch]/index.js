import Head from 'next/head';
import React, { useContext, useEffect, useState } from 'react';
// import CardComponent from '../../components/card.js';
import Nav from '../../../../components/navbarComponent';
import Cards from '../../../../assets/cards.json';
import TableComponent from '../../../../components/tableComponent.js';
import { useRouter } from 'next/router';

// export const getStaticProps = async (context) => {
//     const itemID = context.params?.batch;
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
//             batches: batches
//         }
//     };
// };

// async function getData() {
//     return Cards.data;
// }

// export const getStaticPaths = async () => {
//     console.log(rou);
//     const data = await getData();
//     const pathsWithParams = data.map((star) => ({ params: { batch: star.id } }));

//     return {
//         paths: pathsWithParams,
//         fallback: true
//     };
// };

const TablePage = () => {
    // const router = useRouter();
    return (
        <>
            <Head>
                <title>Table - DigiTruck Ethiopia</title>
            </Head>
            <Nav />
            <div className="p-10 bg-[#dffafe] min-h-[100vh]">
                <div className="px-8 py-14 mt-24 rounded-3xl drop-shadow-md bg-white">
                    <TableComponent />
                </div>
            </div>
        </>
    );
};

export default TablePage;
