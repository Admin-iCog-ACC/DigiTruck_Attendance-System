import BatchComponent from './batchComponent';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { baseURL } from '../constant';
const BatchesPage = () => {
    const router = useRouter();
    const { region } = router.query;
    const [batches, setbatches] = useState([]);
    const [zregion, setzregion] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchBatches = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${baseURL}/api/v1/students/${region}/all`);
                const data = await res.json();
                // console.log(data);
                setbatches(data.Batchs);
                setzregion(data.region);
                setLoading(false);

            } catch (err) {
                console.log(err);
            }
        };

        fetchBatches();
    }, [region]);
    return <BatchComponent loading={loading} batches={batches} region={zregion} />;
};

export default BatchesPage;
