import React from 'react';
import { useRouter } from 'next/router';

const BatchComponent = ({ batches, hasError, region, loading }) => {
    const router = useRouter();
    return (
        <>
            <div className="font-semibold text-2xl pl-5 uppercase">{region}</div>
            <div>
                {loading && <p>Loading...</p>}
                {!loading && (
                    <>
                        {hasError && <div>Error - Retrieving Information</div>}
                        {!hasError && batches.length === 0 && <div>No Bathces in this region</div>}
                        {!hasError &&
                            batches.length > 0 &&
                            batches.map(
                                (batch) =>
                                    batch._id && (
                                        <div
                                            className="px-14 py-14 mt-8 flex items-center justify-between rounded-3xl shadow-md bg-[#f2f2f2] w-full h-14 cursor-pointer hover:shadow-xl transition ease-in-out duration-300"
                                            key={batch.name}
                                            onClick={() => router.push({ pathname: `/region/${region}/${batch._id}`, query: { region: region, batch: batch._id } }, `/region/${region}/${batch._id}`)}
                                        >
                                            <div className="text-lg uppercase font-semibold">
                                                {batch._id}
                                                {/* <div className="text-sm italic mt-2 font-light">{'Thursday, Jan 12, 2023, 11:00 - 1:00 LT'}</div> */}
                                            </div>

                                            {/* {batch.completed && <p className="text-[#49c31c] text-sm mr-10 font-semibold">Taken</p>}
                                            {!batch.completed && <p className="text-[#9f1717] text-sm mr-10 font-semibold">Not Taken</p>} */}
                                        </div>
                                    )
                            )}
                    </>
                )}
            </div>
        </>
    );
};

export default BatchComponent;
