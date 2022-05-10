import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {theme} from '../../../utils/design';
import {useTranslation} from 'react-i18next';
import Header from '../../../components/Header';
import {useForm} from 'react-hook-form';
import {ProgressBar} from 'react-native-paper';
import AppButton from '../../../components/AppButton';
import NoData from '../../../components/NoData';
import {useQuery} from 'react-query';
import {mngmtHttp} from '../../../utils/http/Http';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {AlertHelper} from '../../../utils/AlertHelper';
import UserDetailsForm from '../components/UserDetailsForm';
import AssignPropertiesForm from '../components/AssignPropertiesForm';
import AssignCategoriesForm from '../components/AssignCategoriesForm';
import WorkScheduleForm from '../components/WorkScheduleForm';

const moment = require('moment');
const _ = require('lodash');
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const ConvertTimeTo24 = timeAsString => {
  return moment(timeAsString, ['h:mm A']).format('HH:mm');
};

const ConvertTimeTo12 = timeAsString => {
  return moment(timeAsString, ['hh:mm']).format('h:mm A');
};

const CreateProfessional = ({navigation, route}) => {
  const {user: oldUser, professionalProperties} = route.params;
  const {t} = useTranslation();
  const [progress, setProgress] = useState(0.25);
  const steps = 4;
  const [currentStep, setCurrentStep] = useState(1);
  const [invite, setInvite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allProperties, setAllProperties] = useState(true);
  // const tempCat = {};
  // IssueTypeAsArray.forEach(i => (tempCat[i] = false));
  const [categories, setCategories] = useState([]);
  const [selectedDays, setSelectedDays] = useState({
    sunday: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
  });
  const [user, setUser] = useState(oldUser || null);
  //
  const mySchema = yup.object().shape({
    name: yup.string().required(t('signUp.errorName')),
    phone_number: yup.string().matches(phoneRegExp, t('signUp.errorMobile')),
  });

  const mySchemaWithEmail = yup.object().shape({
    name: yup.string().required(t('signUp.errorName')),
    phone_number: yup.string().matches(phoneRegExp, t('signUp.errorMobile')),
    email: yup.string().email(t('signUp.errorEmail')),
  });
  //
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
  //
  const categoriesQuery = useQuery(`ListOfCategories`, () =>
    mngmtHttp
      .get(`/request-category`)
      .then(response => response.data)
      .catch(e => console.log(e)),
  );
  const professionalCategories = useQuery(
    `ProfessionalCatgories_${oldUser?.id ?? ''}`,
    !!oldUser
      ? () =>
          mngmtHttp
            .get(`/professional-category?professional_id=${oldUser?.id}`)
            .then(response => response.data)
            .catch(e => console.log(e))
      : () => {},
  );

  useEffect(() => {
    if (!!professionalProperties) {
      setAllProperties(
        !professionalProperties?.complexes &&
          !professionalProperties?.buildings &&
          !professionalProperties?.units,
      );
    }
  }, []);

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
      role: 'MAINTENANCE',
      invite: invite,
      startTime: '08 AM',
      endTime: '04 PM',
      // slots: [
      //   {
      //   },
      // ],
      community: '',
      building: '',
      unit: '',
      categories: [],
    },
    resolver: yupResolver(mySchemaWithEmail),
  });

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

  useEffect(() => {
    if (!!oldUser && !!oldUser?.working_schedules[0]) {
      setSelectedDays(_.omit(oldUser?.working_schedules[0], 'slots'));
      // setValue(
      //   'startTime',
      //   `${ConvertTimeTo24(oldUser?.working_schedules[0].slots[0].start)}`,
      // );
      // setValue(
      //   'endTime',
      //   `${ConvertTimeTo24(oldUser?.working_schedules[0].slots[0].end)}`,
      // );
    }
  }, [oldUser?.working_schedules]);

  // unitQuery?.data?.find(i => i.name === professionalProperties?.unit[0])?.id,
  // 'found it',
  // create User ==== step 1
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
          .put(`contacts/${user.id}`, {...data})
          .then(response => {
            if (response.status == 201 || response.status == 200) {
              setUser(response.data.data);
              AlertHelper.showMessage('success', `New user has been updated`);
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
      : incremnetStep();
  };

  const step2Func = data => {
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

  const step3Func = data => {
    mngmtHttp
      .post(`/professional-category`, {
        professional_id: user.id,
        categories: [...categories],
      })
      .then(response => {
        if (response.status == 200 || response.status == 201) {
          AlertHelper.showMessage('success', `Category Has been assigned`);
          incremnetStep();
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

  const step4Func = data => {
    let workingHoursShifts = {};
    Object.keys(selectedDays).forEach(
      d => (workingHoursShifts[d] = selectedDays[d]),
    );
    workingHoursShifts['slots'] = [
      {
        start: ConvertTimeTo24(data.startTime),
        end: ConvertTimeTo24(data.endTime),
      },
    ];
    if (!user) {
      AlertHelper.showMessage(
        'error',
        'Something went wrong, please try again',
      );
    } else {
      mngmtHttp
        .post(`/contacts/${user.id}/attach-working-hours`, workingHoursShifts)
        .then(response => {
          AlertHelper.showMessage('success', `Working hours has been attached`);
          navigation.goBack();
        })
        .catch(e => {
          AlertHelper.showMessage('error', e.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const submit = async data => {
    // data;
    // setIsLoading(true);
    // step3Func();
    if (currentStep === 1) {
      step1Func(data);
    } else if (currentStep === 2) {
      step2Func(data);
    } else if (currentStep === 3) {
      step3Func(data);
    } else if (currentStep === 4) {
      step4Func(data);
    } else {
      incremnetStep();
    }
  };
  //
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
      userType={'Professional'}
    />,
    <AssignPropertiesForm
      control={control}
      errors={errors}
      t={t}
      allProperties={allProperties}
      setAllProperties={setAllProperties}
      unitQuery={unitQuery}
      buildingQuery={buildingQuery}
      communityQuery={communityQuery}
    />,
    <AssignCategoriesForm
      control={control}
      errors={errors}
      t={t}
      categories={categories}
      setCategories={setCategories}
      allCategories={categoriesQuery?.data?.data}
      professionalCategories={professionalCategories.data}
    />,
    <WorkScheduleForm
      selectedDays={selectedDays}
      setSelectedDays={setSelectedDays}
      control={control}
      errors={errors}
      t={t}
      setValue={setValue}
      oldStartTime={ConvertTimeTo12(
        oldUser?.working_schedules[0]?.slots[0]?.start ??
          moment().utc('3').format('HH'),
      )}
      oldEndTime={ConvertTimeTo12(
        oldUser?.working_schedules[0]?.slots[0]?.end ??
          moment().utc('3').add('hours', 8).format('HH'),
      )}
    />,
  ];
  //
  return (
    <View style={styles.container}>
      <Header
        name={t(
          !oldUser
            ? 'CreateProfessional.AddNewProfessional'
            : 'CreateProfessional.UpdateProfessional',
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

export default CreateProfessional;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },
});
