import React from 'react';
import { useRouter } from 'next/router';

const RegionComponent = ({ region }) => {
    const router = useRouter();
    return (
        <div className="px-8 py-14 mt-8 rounded-3xl drop-shadow-xl bg-[#f2f2f2] w-72 h-80 cursor-pointer hover:shadow-xl transition ease-in-out duration-300" onClick={() => router.push(`/region/${region._id}`)}>
            <div className="h-3/4 w-full">
                <p className='text-xl uppercase font-semibold'>{region._id}</p>
            </div>
        </div>
    );
};

export default RegionComponent;
