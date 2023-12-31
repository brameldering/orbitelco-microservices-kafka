import React, { useState } from 'react';
import { NextPageContext } from 'next';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button } from '@mui/material';
import { TextNumField, CurrencyNumField } from 'form/FormComponents';
import FormContainer from 'form/FormContainer';
import FormTitle from 'form/FormTitle';
import { numField } from 'form/ValidationSpecs';
import Loader from 'components/Loader';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import { parseError } from 'utils/parse-error';
import ModalConfirmBox from 'components/ModalConfirmBox';
import { TITLE_EDIT_PRICE_CALC } from 'constants/form-titles';
import { PRICE_CALC_VIEW_PAGE } from 'constants/client-pages';
import { IPriceCalcSettingsAttrs } from '@orbitelco/common';
import { getPriceCalcSettings } from 'api/orders/get-price-calc-settings';
import { useUpdatePriceCalcSettingsMutation } from 'slices/priceCalcSettingsApiSlice';

interface IFormInput {
  vatPercentage: number;
  shippingFee: number;
  thresholdFreeShipping: number;
}

const schema = yup.object().shape({
  vatPercentage: numField().required('Required'),
  shippingFee: numField().required('Required'),
  thresholdFreeShipping: numField().required('Required'),
});

interface TPageProps {
  priceCalcSettings: IPriceCalcSettingsAttrs;
  error?: string[];
}

const PriceCalcSettingsEditScreen: React.FC<TPageProps> = ({
  priceCalcSettings,
  error,
}) => {
  const [
    updatePriceCalcSettings,
    { isLoading: updating, error: errorUpdating },
  ] = useUpdatePriceCalcSettingsMutation();

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { isDirty, errors },
  } = useForm<IFormInput>({
    defaultValues: {
      vatPercentage: priceCalcSettings.vatPercentage,
      shippingFee: priceCalcSettings.shippingFee,
      thresholdFreeShipping: priceCalcSettings.thresholdFreeShipping,
    },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const onSubmit = async () => {
    try {
      await updatePriceCalcSettings({
        vatPercentage: getValues('vatPercentage'),
        shippingFee: getValues('shippingFee'),
        thresholdFreeShipping: getValues('thresholdFreeShipping'),
      }).unwrap();
      toast.success('PriceCalcSettings updated');
      Router.push(PRICE_CALC_VIEW_PAGE);
    } catch (err: any) {
      // To avoid "Uncaught in promise" errors in console, errors are handled by RTK mutation
    }
  };

  const [showChangesModal, setShowChangesModal] = useState(false);
  const goBackWithoutSaving = () => {
    setShowChangesModal(false);
    Router.push(PRICE_CALC_VIEW_PAGE);
  };
  const cancelGoBack = () => setShowChangesModal(false);
  const goBackHandler = async () => {
    if (isDirty) {
      setShowChangesModal(true);
    } else {
      Router.push(PRICE_CALC_VIEW_PAGE);
    }
  };

  const loadingOrProcessing = updating;

  return (
    <>
      <Meta title={TITLE_EDIT_PRICE_CALC} />
      {error ? (
        <ErrorBlock error={error} />
      ) : (
        <>
          <ModalConfirmBox
            showModal={showChangesModal}
            title='Are you sure you want to go back?'
            body='All the new and changed info will be lost.'
            handleClose={cancelGoBack}
            handleConfirm={goBackWithoutSaving}
          />
          <FormContainer>
            <Box
              component='form'
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              sx={{ mt: 1 }}>
              <FormTitle>{TITLE_EDIT_PRICE_CALC}</FormTitle>
              {errorUpdating && <ErrorBlock error={errorUpdating} />}
              <TextNumField
                controlId='vatPercentage'
                label='VAT Percentage'
                register={register}
                error={errors.vatPercentage}
                setError={setError}
              />
              <CurrencyNumField
                controlId='shippingFee'
                label='Shipping Fee'
                register={register}
                error={errors.shippingFee}
                setError={setError}
              />
              <CurrencyNumField
                controlId='thresholdFreeShipping'
                label='Threshold Free Shipping'
                register={register}
                error={errors.thresholdFreeShipping}
                setError={setError}
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 3,
                  mb: 2,
                }}>
                <Button
                  id='BUTTON_update'
                  type='submit'
                  variant='contained'
                  disabled={loadingOrProcessing || !isDirty}>
                  Update
                </Button>
                <Button
                  variant='outlined'
                  onClick={goBackHandler}
                  disabled={loadingOrProcessing}>
                  Cancel
                </Button>
              </Box>
              {loadingOrProcessing && <Loader />}
            </Box>
          </FormContainer>
        </>
      )}
    </>
  );
};

// Fetch price calc settings
export const getServerSideProps = async (context: NextPageContext) => {
  try {
    // Call the corresponding API function to fetch price settings
    const priceCalcSettings = await getPriceCalcSettings(context);
    return {
      props: { priceCalcSettings },
    };
  } catch (error: any) {
    const parsedError = parseError(error);
    return {
      props: { priceCalcSettings: {}, error: parsedError },
    };
  }
};

export default PriceCalcSettingsEditScreen;
