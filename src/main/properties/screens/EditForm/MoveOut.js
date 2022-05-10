import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import crashlytics from '@react-native-firebase/crashlytics';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import Header from '../../../../components/Header';
import AppText from '../../../../components/AppText';
import AppButton from '../../../../components/AppButton';
import {theme} from '../../../../utils/design';
import {mngmtHttp} from '../../../../utils/http/Http';
import {AlertHelper} from '../../../../utils/AlertHelper';
import CalendarInputController from '../../../../components/controlled/CalendarInputController';

const MoveOut = ({route, navigation}) => {
  const {id} = route.params;
  const fields = ['moved_out_at'];
  const {t} = useTranslation();

  const [showCalendar, setShowCalendar] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const mySchema = yup.object().shape({
    moved_out_at: yup.string().required(t('tenant.errorMoveOut')),
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      moved_out_at: '',
    },
    resolver: yupResolver(mySchema),
  });

  const handlePress = async data => {
    setLoading(true);
    try {
      await mngmtHttp
        .post(`/properties/${id}/unassign-tenant`, data)
        .then(() => {
          setLoading(false);
          navigation.goBack();
          navigation.goBack();
        });
    } catch (error) {
      crashlytics().recordError(error);
      setLoading(false);
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        AlertHelper.show('error', t('common.error'), error, fields);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Header name={' '} navigation={navigation} />
      <View style={styles.body1}>
        <View style={styles.titleContainer}>
          <AppText
            fontSize={theme.superTitleFontSize}
            Tcolor={theme.primaryColor}
            textAlign={'center'}>
            {t('editForm.moveOut')}
          </AppText>
          <AppText
            fontSize={theme.titleFontSize}
            Tcolor={theme.greyColor}
            textAlign={'center'}>
            {`${t('assignToProperty.from')} ${`#${id}`}`}
          </AppText>
        </View>
        <CalendarInputController
          name="moved_out_at"
          control={control}
          title={t('editForm.date')}
          placeholder={t('editForm.date')}
          // state={[showCalendar, setShowCalendar]}
          error={errors.moved_out_at}
        />
      </View>
      <View style={styles.body2}>
        <AppButton
          title={t('common.complete')}
          onPress={handleSubmit(handlePress)}
          Bcolor={'#7c7c7c'}
          Tcolor={theme.whiteColor}
          loading={isLoading}
          rounded={8}
        />
      </View>
    </View>
  );
};

export default MoveOut;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },
  body1: {
    flex: 0.8,
  },
  body2: {
    flex: 0.2,
    justifyContent: 'center',
  },
  titleContainer: {
    alignContent: 'center',
    alignContent: 'center',
    justifyContent: 'space-evenly',
    marginHorizontal: 40,
    height: 50,
  },
});
