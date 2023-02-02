import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { InputText } from 'primereact/inputtext';
import { AutoComplete } from 'primereact/autocomplete';
import { baseURL } from '../constant';

function Nav() {
    // const [scrollState, setScrollState] = useState(false);
    const [students, setstudents] = useState(null);
    const [student, setstudent] = useState();
    const [studentSuggestions, setstudentSuggestions] = useState(null);

    const router = useRouter();
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                if (router.asPath !== '/') {
                    var res = await fetch(`${baseURL}/api/v1/students`);
                    var data = await res.json();
                    setstudents(data.students);
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchStudents();
    }, [router.asPath]);
    const filterStudent = function (e) {
        let results = students.filter((stud) => {
            if (stud.Name) return stud.Name.toLowerCase().startsWith(e.query.toLowerCase());
        });
        setstudentSuggestions(results);
    };

    return (
        <div className={`w-full top-0 z-10 h-24  bg-white shadow-lg ${router.asPath !== "/" ? "fixed": "hidden"}`}>
            <div className="max-w-[1225px] xl:mx-auto mx-5 flex justify-between items-center ">
                <div className={'h-24 w-1/2 relative  flex items-start '}>
                    <div className="hover:cursor-pointer flex items-center" onClick={() => router.replace('/home')}>
                        <Image src="/icon-icog.png" width={60} height={100} objectFit="contain" alt="logo" />
                        <span className="ml-5 font-semibold uppercase">Digitruck Attendance</span>
                    </div>
                </div>
                <div className="lg:flex text-base font-semibold hidden space-x-10 items-center w-1/2 justify-end">
                    <span className="p-input-icon-left">
                        <AutoComplete
                            className=""
                            placeholder="Search Student..."
                            value={student}
                            minLength={3}
                            suggestions={studentSuggestions}
                            field="Name"
                            onChange={(e) => setstudent(e.target.value)}
                            completeMethod={filterStudent}
                            onSelect={(e) => router.push({ pathname: `/region/${e.value.Region}/${e.value.Batch}`, query: { region: e.value.Region, batch: e.value.Batch } }, `/region/${e.value.Region}/${e.value.Batch}`)}
                        />
                    </span>
                    <span className="mr-1 cursor-pointer link link-underline link-underline-black" onClick={() => router.replace('/')}>
                        Logout
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Nav;
