import FourPanels from "../modules/FourPanels/FourPanels";
import React, {useEffect} from "react";
import {useRouter} from "next/router";
import axios from "axios";

interface CustomErrorProps {
    statusCode: number
    message: string
}
export default function CustomError({statusCode, message}: CustomErrorProps) {
    const router = useRouter()
    useEffect(() => {
        // don't alert dev team in development environments or 404 errors
        if (statusCode !== 404 && process.env.NODE_ENV !== 'development') {
            axios.post(
                'https://hooks.slack.com/services/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',
                {text: `ERROR ${statusCode} ON PATH '${router.asPath}' MESSAGE -> ${message}`}
            ).then(function (response) {
                console.error("Development team has been notified of this error, and will be looking to resolve it as soon as possible")
            }).catch(function (error) {
                console.error("There was an error notifying the dev them")
            });
        }

    }, []);

    return (
        <div className='container col-lg-10 offset-lg-1 pt-4'>
            <h1>Oops!</h1>
            <h3>We couldn't find the page you were looking for.</h3>
            <div className='b4 pt-4'>Quick links:</div>
            <FourPanels/>
        </div>
    )
}