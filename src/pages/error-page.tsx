import { Helmet } from "react-helmet";

const ErrorPage = () => (
    <>
        <Helmet>
            <meta property="og:title" content="Stránka nebyla nalezena | ZELDA COOK"/>
            <title>Stránka nebyla nalezena | ZELDA COOK</title>
        </Helmet>
        404 : Stránka nebyla nalezena
    </>
);



export default ErrorPage;