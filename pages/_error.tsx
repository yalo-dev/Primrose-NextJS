import FourPanels from "../app/components/modules/FourPanels/FourPanels";
import React from "react";

function Error({ statusCode, res, err }) {
    console.log("statusCode: ", statusCode)
    console.log("res: ", res)
    console.log("err: ", err)


    return (
        <div className='container col-lg-10 offset-lg-1 pt-4'>
            <h1>Oops!</h1>
            <h3>We couldn't find the page you were looking for.</h3>
            <div className='b4 pt-4'>Quick links:</div>
            <FourPanels/>
        </div>
    )
}


Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode, err, res }
}

export default Error