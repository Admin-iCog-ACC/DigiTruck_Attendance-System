import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import Cards from '../assets/cards.json';
import RegionComponent from './regionsComponent';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { baseURL } from '../constant';

const HomePage = () => {
    const [regions, setregions] = useState([]);
    const [regionCount, setregionCount] = useState(0);
    const [loading, setloading] = useState(false);

    const fetchRegions = async () => {
        try {
            const res = await fetch(`${baseURL}/api/v1/regions/`);
            const data = await res.json();
            setregions(data.regions);
            setregionCount(data.total);
        } catch (err) {
            console.log(err);
        }
    };
    const refreshRegions = async () => {
        try {
            setloading(true);
            const res = await fetch(`${baseURL}/api/v1/regions/refresh/all`);
            const data = await res.json();
            // await fetchRegions();
            setregions(data.regions);
            setregionCount(data.total);
            setloading(false);
        } catch (err) {
            console.log(err);
        }
        // setregion(emptyregion);
        // }
    };

    useEffect(() => {
        fetchRegions();
    }, []);

    return (
        <>
            <div className="flex items-center justify-between px-5">
                <div className="font-semibold text-2xl uppercase pl-5 mb-2">Regions</div>
                <Button icon={`pi ${loading ? 'pi-spin pi-spinner' : 'pi-refresh'}`} label={loading ? 'Refreshing' : 'Refresh Regions'} className="p-button p-button-success" onClick={refreshRegions} />
            </div>
            <div className="grid gap-x-10 gap-y-0 grid-cols-3 place-items-start px-10">
                {regions === null && <p>Loading...</p>}
                {regions !== null && regions.map((data) => <RegionComponent key={data.regionName} region={data} />)}
            </div>
        </>
    );
};

export default HomePage;
