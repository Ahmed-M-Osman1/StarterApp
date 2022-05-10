import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {theme} from '../../../utils/design';
import {useTranslation} from 'react-i18next';
import Header from '../../../components/Header';
import {useForm} from 'react-hook-form';
import {ProgressBar} from 'react-native-paper';
import AppButton from '../../../components/AppButton';
import NoData from '../../../components/NoData';
import {mngmtHttp} from '../../../utils/http/Http';
import * as yup from 'yup';
import {AlertHelper} from '../../../utils/AlertHelper';
import UserDetailsForm from '../components/UserDetailsForm';
import AssignPermissionForm from '../components/AssignPermissionForm';
import PERMISSION_OBJ from '../../../utils/constants/Permissions';
import AssignPropertiesForm from '../components/AssignPropertiesForm';
import {useQuery} from 'react-query';

const CreateManager = ({navigation, route}) => {
  const {t} = useTranslation();
  const {user: oldUser, professionalProperties} = route.params;
  const [progress, setProgress] = useState(0.25);
  const steps = 4;
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [invite, setInvite] = useState(false);
  const [convertToAdmin, setConvertToAdmin] = useState(false);
  const [allProperties, setAllProperties] = useState(true);
  const [permissionCategories, setPermissionCategories] = useState({
    ...PERMISSION_OBJ,
  });
  const [permissions, setPermissions] = useState({
    DASHBOARD: [],
    PROPERTY: [],
    LEASING: [],
    MAINTENANCE_REQUEST: [],
    HOME_CLEANING_REQUEST: [],
    CAR_CLEANING_REQUEST: [],
    VISITOR_ACCESS_REQUEST: [],
    TRANSACTIONS: [],
    TRANSACTION_PAYMENTS: [],
    ADMIN: [],
    MANAGER: [],
    TENANT: [],
    SECURITY: [],
    MAINTENANCE: [],
    CLEANING: [],
    COMPLAINTS: [],
    VISITOR_SETTINGS: [],
  });
  const [user, setUser] = useState(oldUser);
  useEffect(() => {
    //  })
  }, [permissions]);

  const unitQuery = useQuery(`ListOfUnitsInRequest`, () =>
    mngmtHttp
      .get(`/single-units/lite-list`)
      .then(response => response.data.data),
  );
  const buildingQuery = useQuery(`ListOfBuildingInRequest`, () =>
    mngmtHttp
      .get(`/multi-units/lite-list`)
      .then(response => response.data.data),
  );
  const communityQuery = useQuery(`ListOfCommunityInRequest`, () =>
    mngmtHttp.get(`/complexes/lite-list`).then(response => response.data.data),
  );

  const updateOldUserPermissions = () => {
    let tempPerm = {...permissions};
    Object.keys(tempPerm).forEach(item => {
      let oldPer = oldUser?.permissions?.filter(p => p.subject === item);
      tempPerm[item] = oldPer?.map(i => i.action);
    });
    setPermissions(tempPerm);
  };

  useEffect(() => {
    if (!!oldUser) {
      updateOldUserPermissions();
    }
  }, []);
  //
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const mySchema = yup.object().shape({
    name: yup.string().required(t('signUp.errorName')),
    phone_number: yup.string().matches(phoneRegExp, t('signUp.errorMobile')),
  });

  const mySchemaWithEmail = yup.object().shape({
    name: yup.string().required(t('signUp.errorName')),
    phone_number: yup.string().matches(phoneRegExp, t('signUp.errorMobile')),
    email: yup.string().email().required(t('signUp.errorEmail')),
  });
  //
  const incremnetStep = () => {
    if (currentStep <= steps) {
      setCurrentStep(currentStep + 1);
      setIsLoading(false);
    }
  };

  const {
    control,
    handleSubmit,
    watch,
    setValue,
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
      role: convertToAdmin ? 'ADMIN' : 'MANAGEMENT',
      invite: invite,
      community: '',
      building: '',
      unit: '',
    },
    // resolver: yupResolver(mySchema),
  });

  useEffect(() => {
    if (!!professionalProperties) {
      setAllProperties(
        !professionalProperties?.complexes &&
          !professionalProperties?.buildings &&
          !professionalProperties?.units,
      );
    }
  }, []);

  useEffect(() => {
    if (!!professionalProperties?.AllProperty) {
      setAllProperties(true);
    } else {
      if (!!professionalProperties?.complexes) {
        setValue(
          'community',
          communityQuery?.data?.find(
            c => c?.name === professionalProperties?.complexes[0],
          )?.id || '',
        );
      }
      if (!!professionalProperties?.buildings) {
        setValue(
          'building',
          buildingQuery?.data?.find(
            b => b?.name === professionalProperties?.buildings[0],
          )?.id || '',
        );
      }
      if (!!professionalProperties?.units) {
        setValue(
          'unit',
          unitQuery?.data?.find(
            u => u?.name === professionalProperties?.units[0],
          )?.id || '',
        );
      }
    }
  }, []);

  const step1Func = data => {
    const isDataTouched =
      data.name !== oldUser?.name ||
      data.phone_number !== oldUser?.phone_number ||
      data.phone_country_code.id !== oldUser?.phone_country_code ||
      data.email !== (oldUser?.email || '');

    !user
      ? mngmtHttp
          .post(`/contacts`, {...data, invite: invite})
          .then(response => {
            if (response.status == 201) {
              setUser(response.data.data);
              AlertHelper.showMessage('success', `New user has been created`);
              incremnetStep();
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
            // AlertHelper.showMessage('success', `The user has been created`);
          })
      : isDataTouched
      ? mngmtHttp
          .put(`contacts/${user.id}`, {...data, role: oldUser.role})
          .then(response => {
            if (response.status == 201 || response.status == 200) {
              setUser(response.data.data);
              AlertHelper.showMessage('success', `New user has been updated`);
              oldUser.role === 'ADMIN' ? navigation.goBack() : incremnetStep();
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

            // AlertHelper.showMessage('success', `The user has been created`);
          })
      : oldUser.role === 'ADMIN'
      ? navigation.goBack()
      : incremnetStep();
  };

  const step2Func = data => {
    let objToSend = {
      subjects: Object.keys(permissions)
        .map(item => ({
          name: item,
          actions: [...permissions[item]],
        }))
        .filter(item => item.actions.length !== 0),
    };
    if (convertToAdmin) {
      mngmtHttp
        .put(`/contacts/${user.id ?? oldUser.id}/`, {...data, role: 'ADMIN'})
        .then(response => {
          if (response.status == 200 || response.status == 201) {
            incremnetStep();
            AlertHelper.showMessage('success', 'User role has been updated');
          } else {
            console.log(response);
            return null;
          }
        })
        .catch(e => {
          console.log(e.response.data);
          AlertHelper.showMessage('error', JSON.stringify(e.message));
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      mngmtHttp
        .post(`/contacts/${user.id}/attach-permissions`, objToSend)
        .then(response => {
          if (response.status == 200 || response.status == 201) {
            incremnetStep();
          } else {
            console.log(response);
            return null;
          }
        })
        .catch(e => {
          console.log(e);
          AlertHelper.showMessage('error', JSON.stringify(e.message));
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const step3Func = data => {
    const dataToSend = {
      professional_id: user?.id ?? '',
      locations: [],
    };
    if (allProperties) {
      dataToSend.locations = [
        ...dataToSend.locations,
        {
          location_type: '4',
        },
      ];
    } else {
      if (!!data?.community)
        dataToSend.locations = [
          ...dataToSend.locations,
          {
            location_type: '1',
            location_id: data.community,
          },
        ];
      if (!!data?.building)
        dataToSend.locations = [
          ...dataToSend.locations,
          {
            location_type: '2',
            location_id: data.building,
          },
        ];
      if (!!data?.unit)
        dataToSend.locations = [
          ...dataToSend.locations,
          {
            location_type: '3',
            location_id: data.unit,
          },
        ];
    }

    mngmtHttp
      .post(`/professional-property`, {...dataToSend})
      .then(response => {
        if (response.status == 200) {
          incremnetStep();
          AlertHelper.showMessage('success', `Properties has been assigned`);
          navigation.goBack();
        } else {
        }
      })
      .catch(e => {
        AlertHelper.showMessage('error', JSON.stringify(e.message));
      })
      .finally(() => {
        setIsLoading(false);
        // AlertHelper.showMessage('success', `The user has been created`);
      });
  };

  const submit = async data => {
    // data;
    setIsLoading(true);
    if (currentStep === 1) {
      step1Func(data);
    } else if (currentStep === 2 && oldUser?.role !== 'ADMIN') {
      step2Func(data);
    } else if (currentStep === 3 && oldUser?.role !== 'ADMIN') {
      step3Func(data);
    }
  };
  //

  useEffect(() => {
    setProgress(0.33 * currentStep);
  }, [currentStep]);

  const stepsElements = [
    <NoData />,
    <UserDetailsForm
      control={control}
      errors={errors}
      t={t}
      invite={invite}
      setInvite={setInvite}
      userType={'Manager'}
    />,
    oldUser?.role !== 'ADMIN' ? (
      <AssignPermissionForm
        control={control}
        errors={errors}
        t={t}
        permissionCategories={permissionCategories}
        setPermissionCategories={setPermissionCategories}
        onPress={setConvertToAdmin}
        enabled={convertToAdmin}
        permissions={permissions}
        setPermissions={setPermissions}
      />
    ) : (
      <></>
    ),
    oldUser?.role !== 'ADMIN' ? (
      <AssignPropertiesForm
        control={control}
        errors={errors}
        t={t}
        allProperties={allProperties}
        setAllProperties={setAllProperties}
        unitQuery={unitQuery}
        buildingQuery={buildingQuery}
        communityQuery={communityQuery}
      />
    ) : (
      <></>
    ),
  ];

  //
  return (
    <View style={styles.container}>
      <Header name={t('CreateManager.AddNewManager')} navigation={navigation} />
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
      <ScrollView keyboardDismissMode={'on-drag'} style={{}}>
        {stepsElements[currentStep]}
        <View style={{height: 15}} />
        {/*  */}
        {/*  */}
        {/*  */}
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

export default CreateManager;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },
});
