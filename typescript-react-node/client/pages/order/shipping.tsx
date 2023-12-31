import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button } from '@mui/material';
import FormTitle from 'form/FormTitle';
import { TextNumField } from 'form/FormComponents';
import FormContainer from 'form/FormContainer';
import { textField } from 'form/ValidationSpecs';
import Meta from 'components/Meta';
import CheckoutSteps from 'components/CheckoutSteps';
import { TITLE_SHIPPING } from 'constants/form-titles';
import { PAYMENT_INFO_PAGE } from 'constants/client-pages';
import { saveShippingAddress } from 'slices/cartSlice';
import type { RootState } from 'slices/store';

const ShippingScreen = () => {
  const dispatch = useDispatch();

  const cart = useSelector((state: RootState) => state.cart);
  const { shippingAddress } = cart;

  interface IFormInput {
    address: string;
    postalCode: string;
    city: string;
    country: string;
  }

  const schema = yup.object().shape({
    address: textField().max(80).required('Required'),
    postalCode: textField().max(12).required('Required'),
    city: textField().max(40).required('Required'),
    country: textField().max(40).required('Required'),
  });

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      address: shippingAddress?.address || '',
      postalCode: shippingAddress?.postalCode || '',
      city: shippingAddress?.city || '',
      country: shippingAddress?.country || '',
    },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const onSubmit = async () => {
    const address = getValues('address');
    const postalCode = getValues('postalCode');
    const city = getValues('city');
    const country = getValues('country');
    dispatch(saveShippingAddress({ address, postalCode, city, country }));
    Router.push(PAYMENT_INFO_PAGE);
  };

  return (
    <>
      <Meta title={TITLE_SHIPPING} />
      <CheckoutSteps currentStep={1} />
      <FormContainer>
        <FormTitle>{TITLE_SHIPPING}</FormTitle>
        <Box component='form' onSubmit={handleSubmit(onSubmit)}>
          <TextNumField
            controlId='address'
            label='Address'
            register={register}
            error={errors.address}
            setError={setError}
          />
          <TextNumField
            controlId='postalCode'
            label='Postal Code'
            register={register}
            error={errors.postalCode}
            setError={setError}
          />
          <TextNumField
            controlId='city'
            label='City'
            register={register}
            error={errors.city}
            setError={setError}
          />
          <TextNumField
            controlId='country'
            label='Country'
            register={register}
            error={errors.country}
            setError={setError}
          />
          <Button
            id='BUTTON_continue'
            type='submit'
            variant='contained'
            color='primary'
            sx={{ mt: 2 }}>
            Continue
          </Button>
        </Box>
      </FormContainer>
    </>
  );
};

export default ShippingScreen;
