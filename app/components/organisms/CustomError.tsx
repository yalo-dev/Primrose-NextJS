import Head from "next/head";
import FourPanels from "../modules/FourPanels/FourPanels";

interface CustomErrorProps {
  statusCode: number;
  message: string;
}
export default function CustomError({ statusCode, message }: CustomErrorProps) {
  return (
    <div className="container col-lg-10 offset-lg-1 pt-4">
      <Head>
        <title>Page Not Found</title>
        <meta name="robots" content="noindex" />
      </Head>
      <h1>Oops!</h1>
      <h3>We couldn't find the page you were looking for.</h3>
      <div className="b4 pt-4">Quick links:</div>
      <FourPanels />
    </div>
  );
}
