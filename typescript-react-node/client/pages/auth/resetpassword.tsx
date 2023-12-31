import React from 'react';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button } from '@mui/material';
import FormContainer from 'form/FormContainer';
import FormTitle from 'form/FormTitle';
import { TextNumField } from 'form/FormComponents';
import { textField } from 'form/ValidationSpecs';
import Meta from 'components/Meta';
import Loader from 'components/Loader';
import ErrorBlock from 'components/ErrorBlock';
import { TITLE_RESET_PASSWORD } from 'constants/form-titles';
import { RESET_PASSWORD_CONFIRM_PAGE } from 'constants/client-pages';
import { useResetPasswordMutation } from 'slices/usersApiSlice';

interface IFormInput {
  email: string;
}

const schema = yup.object().shape({
  email: textField().required('Required').email('Invalid email address'),
});

const PasswordResetScreen = () => {
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { isDirty, errors },
  } = useForm<IFormInput>({
    defaultValues: { email: '' },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const [
    resetPassword,
    { isLoading: isProcessing, error: errorResettingPassword },
  ] = useResetPasswordMutation();
  const onSubmit = async () => {
    const email = getValues('email');
    try {
      await resetPassword({ email }).unwrap();
      Router.push(RESET_PASSWORD_CONFIRM_PAGE);
    } catch (err: any) {
      // To avoid "Uncaught in promise" errors in console, errors are handled by RTK mutation
    }
  };

  const onError = (error: any) => {
    console.error('ERROR:::', error);
  };

  return (
    <>
      <Meta title={TITLE_RESET_PASSWORD} />
      <FormContainer>
        <Box component='form' onSubmit={handleSubmit(onSubmit, onError)}>
          <FormTitle>{TITLE_RESET_PASSWORD}</FormTitle>
          <TextNumField
            controlId='email'
            label='Your email address as known to us'
            register={register}
            error={errors.email}
            setError={setError}
          />
          {errorResettingPassword && (
            <ErrorBlock error={errorResettingPassword} />
          )}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 3,
            }}>
            <Button
              id='BUTTON_reset_password'
              type='submit'
              variant='contained'
              disabled={isProcessing || !isDirty}>
              Reset Password
            </Button>
          </Box>
          {isProcessing && <Loader />}
        </Box>
      </FormContainer>
    </>
  );
};

export default PasswordResetScreen;
