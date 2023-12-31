import React, { useState } from 'react';
import { NextPageContext } from 'next';
import Router from 'next/router';
import { useForm, Resolver, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Grid,
  Button,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import FormContainer from 'form/FormContainer';
import FormTitle from 'form/FormTitle';
import { TextNumField, SelectField } from 'form/FormComponents';
import { textField } from 'form/ValidationSpecs';
import Loader from 'components/Loader';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import { parseError } from 'utils/parse-error';
import ModalConfirmBox from 'components/ModalConfirmBox';
import { TITLE_CREATE_API_ACCESS } from 'constants/form-titles';
import { API_ACCESS_LIST_PAGE } from 'constants/client-pages';
import { CURRENT_MICROSERVICES } from '@orbitelco/common';
import { getRoles } from 'api/roles/get-roles';
import { useCreateApiAccessMutation } from 'slices/apiAccessApiSlice';

interface IFormInput {
  microservice: string;
  apiName: string;
  allowedRoles: string[];
}

const schema = yup.object().shape({
  microservice: yup.string().required('Required'),
  apiName: textField().max(40).required('Required'),
  allowedRoles: yup.array().of(yup.string()),
});

interface TPageProps {
  roles: Array<{ role: string; roleDisplay: string }>;
  error?: string[];
}

const ApiAccessCreateScreen: React.FC<TPageProps> = ({ roles, error }) => {
  const [createApiAccess, { isLoading: creating, error: errorCreating }] =
    useCreateApiAccessMutation();

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setError,
    formState: { isDirty, errors },
  } = useForm<IFormInput>({
    defaultValues: {
      microservice: '',
      apiName: '',
      allowedRoles: [],
    },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema) as Resolver<IFormInput>,
  });

  const onSubmit = async () => {
    try {
      // console.log('getValues(allowedRoles)', getValues('allowedRoles'));
      await createApiAccess({
        microservice: getValues('microservice'),
        apiName: getValues('apiName'),
        allowedRoles: getValues('allowedRoles'),
      }).unwrap();
      toast.success('Api Access created');
      Router.push(API_ACCESS_LIST_PAGE);
    } catch (err: any) {
      // To avoid "Uncaught in promise" errors in console, errors are handled by RTK mutation
    }
  };

  const [showChangesModal, setShowChangesModal] = useState(false);
  const goBackWithoutSaving = () => {
    setShowChangesModal(false);
    Router.push(API_ACCESS_LIST_PAGE);
  };
  const cancelGoBack = () => setShowChangesModal(false);
  const goBackHandler = async () => {
    if (isDirty) {
      setShowChangesModal(true);
    } else {
      Router.push(API_ACCESS_LIST_PAGE);
    }
  };
  // --------------------------------------------------
  const microservices = [
    { label: 'Select microservice', value: '' },
    ...CURRENT_MICROSERVICES.map((ms) => ({
      label: ms,
      value: ms,
    })),
  ];

  const loadingOrProcessing = creating;

  return (
    <>
      <Meta title={TITLE_CREATE_API_ACCESS} />
      <ModalConfirmBox
        showModal={showChangesModal}
        title='Are you sure you want to go back?'
        body='All the new and changed info will be lost.'
        handleClose={cancelGoBack}
        handleConfirm={goBackWithoutSaving}
      />
      <FormContainer>
        <Box component='form' onSubmit={handleSubmit(onSubmit)}>
          <FormTitle>{TITLE_CREATE_API_ACCESS}</FormTitle>
          {error ? (
            <ErrorBlock error={error} />
          ) : (
            <>
              <SelectField
                controlId='microservice'
                options={microservices}
                control={control}
                error={errors.microservice}
                setError={setError}
              />
              <TextNumField
                controlId='apiName'
                label='API Name'
                register={register}
                error={errors.apiName}
                setError={setError}
              />
              <FormControl component='fieldset'>
                <FormLabel component='legend'>Allowed Roles</FormLabel>
                <FormGroup>
                  <Grid container spacing={2}>
                    {roles.map((role, index) => (
                      <Grid item xs={12} sm={6} key={role.role}>
                        <FormControlLabel
                          control={
                            <Controller
                              name={`allowedRoles.${index}`}
                              control={control}
                              render={({ field }) => (
                                <Checkbox {...field} value={role.role} />
                              )}
                            />
                          }
                          label={role.roleDisplay}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </FormControl>
              {errorCreating && <ErrorBlock error={errorCreating} />}
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                mt={3}>
                <Button
                  id='BUTTON_update'
                  type='submit'
                  variant='contained'
                  color='primary'
                  disabled={loadingOrProcessing || !isDirty}>
                  Update
                </Button>
                <Button
                  variant='outlined'
                  onClick={goBackHandler}
                  color='secondary'
                  disabled={loadingOrProcessing}>
                  Cancel
                </Button>
              </Box>
            </>
          )}
          {loadingOrProcessing && <Loader />}
        </Box>
      </FormContainer>
    </>
  );
};

// Fetch Roles (to generate list of checkboxes)
export const getServerSideProps = async (context: NextPageContext) => {
  try {
    const roles = await getRoles(context);
    return {
      props: { roles },
    };
  } catch (error: any) {
    const parsedError = parseError(error);
    return {
      props: { roles: [], error: parsedError },
    };
  }
};

export default ApiAccessCreateScreen;
