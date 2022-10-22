import React from 'react'
import { Alert } from '@chakra-ui/react';

interface Page404Props {

}

const Page404: React.FC<Page404Props> = ({}) => {
        return (
            <>
                <h1>Error 404</h1>
                <Alert status="info">
                    <i className="fal fa-times-circle"></i> Sorry, page not found.
                </Alert>
                <br />
                <a className="bt" href="/app/home">Back to home <i className="fal fa-home"></i></a>
            </>
        );
}

export default Page404;