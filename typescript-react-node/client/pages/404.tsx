import React from 'react';
import Link from 'next/link';
import FormTitle from 'form/FormTitle';
import FormContainer from 'form/FormContainer';
import Meta from 'components/Meta';
import { INDEX_PAGE } from 'constants/client-pages';

const NotFound: React.FunctionComponent = () => {
  return (
    <FormContainer>
      <Meta title='Page not found' />
      <FormTitle>Oops! </FormTitle>
      <p>
        <strong>The requested page does not exist.</strong>
      </p>
      <p></p>
      <Link href={INDEX_PAGE}>Go to home page</Link>
    </FormContainer>
  );
};

export default NotFound;
