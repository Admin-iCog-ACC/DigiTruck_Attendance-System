import { useRouter } from 'next/router';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Cards from '../assets/cards.json';
import RegionComponent from './regionsComponent';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { baseURL } from '../constant';
import { Toast } from 'primereact/toast';

const HomePage = () => {
    const [regions, setregions] = useState([]);
    const [regionCount, setregionCount] = useState(0);
    const [loading, setloading] = useState(false);
    const toast = useRef(null);
    const inputFile = useRef(null);
    const fetchRegions = async () => {
        try {
            const res = await fetch(`${baseURL}/api/v1/students/regions`);
            const data = await res.json();
            setregions(data.regions);
            setregionCount(data.total);
        } catch (err) {
            console.log(err);
        }
    };
    const addFromCSV = async (e) => {
        try {
            setloading(true);
            const formData = new FormData();
            Object.entries({ file: e.target.files[0] }).forEach(([key, value]) => {
                formData.append(key, value);
            });
            const res = await fetch(`${baseURL}/api/v1/students/upload`, {
                method: 'POST',
                headers: {},
                body: formData
            });
            const data = await res.json();
            // await fetchRegions();
            // setregions(data.regions);
            // setregionCount(data.total);
            setloading(false);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Students Uploaded', life: 3000 });
            await fetchRegions();
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
            <Toast ref={toast} />

            <div className="flex items-center justify-between px-5">
                <div className="font-semibold text-2xl uppercase pl-5 mb-2 ">Regions</div>
                {/* <input type="file" icon={`pi ${loading ? 'pi-spin pi-spinner' : 'pi-plus'}`} label={loading ? 'Adding Students' : 'Add Students (from CSV)'} className="p-button p-button-success" onChange={refreshRegions} /> */}
                {/* <input type="file" onChange={refreshRegions} /> */}
                <Button
                    icon={`pi ${loading ? 'pi-spin pi-spinner' : 'pi-plus'}`}
                    label={loading ? 'Adding Students' : 'Add Students (from CSV)'}
                    className="p-button p-button-success"
                    onClick={() => {
                        inputFile.current.click();
                    }}
                ></Button>
                <input type="file" id="exampleInput" className="hidden" accept=".csv" ref={inputFile} onChange={addFromCSV} />
            </div>
            <div className="grid gap-x-10 gap-y-0 grid-cols-3 place-items-start px-10">
                {regions === null && <p>Loading...</p>}
                {regions !== null && regions.map((data) => <RegionComponent key={data.regionName} region={data} />)}
            </div>
        </>
    );
};

export default HomePage;
