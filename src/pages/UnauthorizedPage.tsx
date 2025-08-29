import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import Link from '@fuse/core/Link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '@auth/useUser';

/**
 * Enhanced Error 401 page with smart redirection handling.
 */
function UnauthorizedPage() {
    const { data: user } = useUser();
    const navigate = useNavigate();
    const isAuthenticated = !!user;

    // Handle navigation back to intended destination or home
    const handleGoBack = useCallback(() => {
        if (isAuthenticated) {
            navigate('/');
        } else {
            navigate('/sign-in');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="flex flex-1 flex-col items-center justify-center p-4">
            <div className="w-full max-w-5xl text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1, transition: { delay: 0.1 } }}
                >
                    <Box
                        component="svg"
                        width="100%"
                        height="100%"
                        viewBox="0 0 1075 585"
                        fill="none"
                        preserveAspectRatio="xMidYMax slice"
                        xmlns="http://www.w3.org/2000/svg"
                        sx={{ color: 'secondary.main' }}
                    >
                        <ellipse
                            cx="158"
                            cy="539.73152"
                            rx="158"
                            ry="12"
                            fill="#e6e6e6"
                        />
                        <path
                            d="M324.27227,296.55377c27.49676-11.6953,61.74442-4.28528,95.19092.85757.31124-6.228,4.08385-13.80782.132-18.15284-4.80115-5.2788-4.35917-10.82529-1.47008-16.40375,7.38788-14.265-3.1969-29.44375-13.88428-42.0647a23.66937,23.66937,0,0,0-19.75537-8.29179l-19.7975,1.41411A23.70939,23.70939,0,0,0,343.635,230.85851v0c-4.72724,6.42917-7.25736,12.84055-5.66438,19.21854-7.08065,4.83882-8.27029,10.67977-5.08851,17.2644,2.698,4.14592,2.66928,8.18161-.12275,12.1056a55.89079,55.89079,0,0,0-8.31011,16.5061Z"
                            transform="translate(-203.5 -174.13424)"
                            fill="#2f2e41"
                        />
                        <path
                            d="M977.70889,651.09727H417.29111A18.79111,18.79111,0,0,1,398.5,632.30616h0q304.727-35.41512,598,0h0A18.79111,18.79111,0,0,1,977.70889,651.09727Z"
                            transform="translate(-203.5 -174.13424)"
                            fill="#2f2e41"
                        />
                        <path
                            d="M996.5,633.41151l-598-1.10536,69.30611-116.61553.3316-.55268V258.13057a23.7522,23.7522,0,0,1,23.75418-23.75418H899.792a23.7522,23.7522,0,0,1,23.75418,23.75418V516.90649Z"
                            transform="translate(-203.5 -174.13424)"
                            fill="#3f3d56"
                        />
                        <path
                            d="M491.35028,250.95679a7.74623,7.74623,0,0,0-7.73753,7.73753V493.03073a7.74657,7.74657,0,0,0,7.73753,7.73752H903.64972a7.74691,7.74691,0,0,0,7.73753-7.73752V258.69432a7.74657,7.74657,0,0,0-7.73753-7.73753Z"
                            transform="translate(-203.5 -174.13424)"
                            fill="#fff"
                        />
                        <circle
                            cx="707.33457"
                            cy="77.37523"
                            r="77.37523"
                            fill="currentColor"
                        />
                        <path
                            d="M942.89,285.223H878.77911a4.42582,4.42582,0,0,1-4.42144-4.42145V242.11391a4.42616,4.42616,0,0,1,4.42144-4.42144H942.89a4.42616,4.42616,0,0,1,4.42144,4.42144v38.68761A4.42582,4.42582,0,0,1,942.89,285.223Zm-64.11091-43.10906v38.68761h64.11415L942.89,242.11391Z"
                            transform="translate(-203.5 -174.13424)"
                            fill="#fff"
                        />
                        <path
                            d="M930.73105,242.11391h-39.793V224.42814c0-12.80987,8.36792-22.10721,19.89649-22.10721s19.89648,9.29734,19.89648,22.10721Zm-35.37153-4.42144h30.95009V224.42814c0-10.413-6.36338-17.68576-15.475-17.68576s-15.47505,7.27281-15.47505,17.68576Z"
                            transform="translate(-203.5 -174.13424)"
                            fill="#fff"
                        />
                        <circle
                            cx="707.33457"
                            cy="86.21811"
                            r="4.42144"
                            fill="#fff"
                        />
                    </Box>
                </motion.div>
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 40
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.2 }
                    }}
                >
                    <Typography
                        variant="h1"
                        className="mt-12 text-center text-4xl font-extrabold leading-[1.25] tracking-tight sm:mt-24 md:text-7xl md:leading-none"
                    >
                        401
                    </Typography>
                </motion.div>
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 40
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.2 }
                    }}
                >
                    <Typography
                        variant="h5"
                        color="text.secondary"
                        className="mt-2 text-center text-lg font-medium tracking-tight md:text-xl"
                    >
                        You do not have permission to view this page.
                    </Typography>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
                    className="mt-8 flex flex-col items-center gap-4"
                >
                    {isAuthenticated ? (
                        <>
                            <div className="flex gap-4">
                                <Button
                                    variant="contained"
                                    onClick={handleGoBack}
                                    className="min-w-[120px]"
                                >
                                    Go Home
                                </Button>
                                <Link to="/">
                                    <Button variant="outlined">Home</Button>
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                className="text-center"
                            >
                                Please sign in to access this page
                            </Typography>
                            <div className="flex gap-4">
                                <Link to="/sign-in">
                                    <Button
                                        variant="contained"
                                        className="min-w-[120px]"
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                                <Link to="/">
                                    <Button variant="outlined">Home</Button>
                                </Link>
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

export default UnauthorizedPage;
