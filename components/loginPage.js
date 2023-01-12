// import getConfig from 'next/config';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { baseURL } from '../constant';

const LoginPage = () => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [checked, setChecked] = useState(false);
    const [error, seterror] = useState('');
    const [passwordShown, setPasswordShown] = useState(false);
    const router = useRouter();

    const login = async () => {
        try {
            seterror('');
            const res = await fetch(`${baseURL}/api/v1/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.status === 'success') {
                router.push('/home');
            } else seterror(data.message);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="">
            <Head>
                <title>Login - DigiTruck Ethiopia</title>
            </Head>
            <div className="flex flex-col items-center justify-center">
                <div className="p-5">
                    <Image alt="logo" src="/icon-icog.png" objectFit="contain" width={115} height={115} />
                </div>

                <div className="rounded-[3rem] w-2/5 p-1 bg-gradient-to-b from-[#178c9f] via-white to-white">
                    <div className="w-full bg-white rounded-[3rem] p-6 sm:px-8 flex flex-col">
                        {error && (
                            <div className="px-8 text-red-500 capitalize flex items-center">
                                <i className="pi pi-exclamation-triangle mr-3" />
                                {error}
                            </div>
                        )}
                        <div className="p-8">
                            <label htmlFor="email" className="block text-900 text-md font-medium mb-2">
                                Email
                            </label>
                            <input id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Email address" className="w-full p-4 py-3 text-sm rounded-md border-2 border-black/20 mb-7" />

                            <label htmlFor="password" className="block text-900 font-medium text-md mb-2">
                                Password
                            </label>
                            <div className="relative w-full mb-7">
                                <div className="absolute right-0 mt-4 pr-4">
                                    {passwordShown && (
                                        <Image
                                            alt="hide password"
                                            src="/hide.png"
                                            width={17}
                                            height={17}
                                            className="cursor-pointer "
                                            onClick={() => {
                                                setPasswordShown(false);
                                            }}
                                        />
                                    )}
                                    {!passwordShown && (
                                        <Image
                                            alt="hide password"
                                            width={17}
                                            height={17}
                                            src="/show.png"
                                            className="cursor-pointer"
                                            onClick={() => {
                                                setPasswordShown(true);
                                            }}
                                        />
                                    )}
                                </div>

                                <input
                                    id="password"
                                    name="password"
                                    type={passwordShown ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="w-full p-4 py-3 text-sm rounded-md border-2 border-black/20 mb-4"
                                ></input>
                            </div>

                            {/* <div className="flex align-items-center justify-between mb-7 gap-5 text-sm">
                                <div className="flex align-items-center cursor-pointer" onChange={(e) => setChecked(e.checked)}>
                                    <input id="rememberme" type="checkbox" checked={checked} onChange={(e) => setChecked(e.checked)} className="opacity-0 cursor-pointer absolute mr-2 h-5 w-5 rounded-full border-[#178c9f] bg-[#178c9f]"></input>
                                    <div className="bg-white border-2 rounded-md border-[#178c9f] w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-white">
                                        <svg className="fill-current hidden w-3 h-3 text-white pointer-events-none" version="1.1" viewBox="0 0 17 12" xmlns="http://www.w3.org/2000/svg">
                                            <g fill="none" fillRule="evenodd">
                                                <g transform="translate(-9 -11)" fill="white" fillRule="nonzero">
                                                    <path d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z" />
                                                </g>
                                            </g>
                                        </svg>
                                    </div>
                                    <label htmlFor="rememberme" className='cursor-pointer'>Remember me</label>
                                </div>
                                <a className="font-medium no-underline ml-2 text-right cursor-pointer text-[#178c9f]">Forgot password?</a>
                            </div> */}
                            <button label="login" className="w-full p-3 text-xl bg-[#178c9f] text-white rounded-md hover:bg-[#126e7c] transition ease-in-out duration-200" onClick={login}>
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
