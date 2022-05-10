import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {View, ScrollView, StyleSheet} from 'react-native';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {AlertHelper} from '../../../utils/AlertHelper';
import Header from '../../../components/Header';
import {theme} from '../../../utils/design';
import {useForm} from 'react-hook-form';
import UserDetailsForm from '../components/UserDetailsForm';
import {mngmtHttp} from '../../../utils/http/Http';
import NoData from '../../../components/NoData';
import {ProgressBar} from 'react-native-paper';
import AppButton from '../../../components/AppButton';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const CreateOwner = ({navigation, route}) => {
  const {t} = useTranslation();
  const {user: oldUser} = route.params;

  const [progress, setProgress] = useState(0.8);
  const steps = 1;
  const [currentStep, setCurrentStep] = useState(1);
  const [invite, setInvite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(oldUser || null);

  //
  const mySchemaWithEmail = yup.object().shape({
    name: yup.string().required(t('signUp.errorName')),
    phone_number: yup.string().matches(phoneRegExp, t('signUp.errorMobile')),
    email: yup.string().email(t('signUp.errorEmail')),
  });

  const {
    control,
    handleSubmit,
    formState: {errors},
    setError,
  } = useForm({
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone_number: user?.phone_number ?? '',
      phone_country_code: {
        id: user?.phone_country_code ?? 'SA',
      },
      role: 'OWNER',
      invite: invite,
    },
    resolver: yupResolver(mySchemaWithEmail),
  });

  const step1Func = data => {
    const isDataTouched =
      data.name !== oldUser?.name ||
      data.phone_number !== oldUser?.phone_number ||
      data.phone_country_code.id !== oldUser?.phone_country_code ||
      data.email !== (oldUser?.email || '');

    !user
      ? mngmtHttp
          .post(`/contacts`, {...data})
          .then(response => {
            if (response.status == 201) {
              setUser(response.data.data);
              AlertHelper.showMessage('success', `New user has been created`);
              navigation.goBack();
            } else {
            }
          })
          .catch(e => {
            AlertHelper.showMessage('error', e.response.data.message);
            Object.keys(e.response.data.errors).forEach(field => {
              setError(
                field,
                {type: 'focus', message: e.response.data.errors[field][0]},
                {shouldFocus: true},
              );
            });
          })
          .finally(() => {
            setIsLoading(false);
          })
      : isDataTouched
      ? mngmtHttp
          .put(`contacts/${user.id}`, {...data})
          .then(response => {
            if (response.status == 201 || response.status == 200) {
              setUser(response.data.data);
              AlertHelper.showMessage('success', `New user has been updated`);
              navigation.goBack();
              //   incremnetStep();
            } else {
            }
          })
          .catch(e => {
            AlertHelper.showMessage('error', e.response.data.message);
            Object.keys(e.response.data.errors).forEach(field => {
              setError(
                field,
                {type: 'focus', message: e.response.data.errors[field][0]},
                {shouldFocus: true},
              );
            });
          })
          .finally(() => {
            setIsLoading(false);
          })
      : navigation.goBack();
  };

  const submit = async data => {
    if (currentStep === 1) {
      step1Func(data);
    } else if (currentStep === 2) {
      //   step2Func(data);
    } else if (currentStep === 3) {
      //   step3Func(data);
    } else if (currentStep === 4) {
      //   step4Func(data);
    } else {
      incremnetStep();
    }
  };

  const incremnetStep = () => {
    if (currentStep <= steps) {
      setCurrentStep(currentStep + 1);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setProgress(0.25 * currentStep);
  }, [currentStep]);

  const stepsElements = [
    <NoData />,
    <UserDetailsForm
      control={control}
      errors={errors}
      t={t}
      invite={invite}
      setInvite={setInvite}
      userType={'Owner'}
    />,
  ];

  return (
    <View style={styles.container}>
      <Header
        name={t(
          !oldUser ? 'CreateOwner.AddNewOwner' : 'CreateOwner.UpdateOwner',
        )}
        navigation={navigation}
      />
      <View style={{marginHorizontal: 20, marginTop: 20}}>
        <View
          style={{
            height: 5,
            backgroundColor: `${theme.primaryColor}20`,
            borderRadius: 99,
          }}>
          <ProgressBar
            progress={progress}
            color={theme.primaryColor}
            style={{borderRadius: 99}}
          />
        </View>
        <View style={{height: 15}} />
      </View>
      <ScrollView
        keyboardDismissMode={'on-drag'}
        style={
          {
            // paddingHorizontal: 20,
          }
        }>
        {stepsElements[currentStep]}
        <View style={{height: 15}} />
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: currentStep !== 1 ? 'space-between' : 'center',
          alignItems: 'center',
          marginHorizontal: 20,
        }}>
        {currentStep !== 1 && (
          <AppButton
            half={true}
            title={t('common.previous')}
            onPress={() => setCurrentStep(currentStep - 1)}
            // Bcolor={'#7C7C7C'}
            style={{borderColor: theme.primaryColor, borderWidth: 1}}
            Tcolor={theme.primaryColor}
            rounded={8}
            customMargin={0}
          />
        )}
        <AppButton
          half={currentStep !== 1}
          title={
            currentStep !== steps ? t('common.next') : t('common.complete')
          }
          // onPress={incremnetStep}
          onPress={handleSubmit(submit)}
          Bcolor={theme.primaryColor}
          rounded={8}
          Tcolor={theme.whiteColor}
          loading={isLoading}
          customMargin={0}
        />
      </View>
      <View style={{height: 15}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },
});

export default CreateOwner;
