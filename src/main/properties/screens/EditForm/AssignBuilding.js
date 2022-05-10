import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useTranslation} from 'react-i18next';
import crashlytics from '@react-native-firebase/crashlytics';
import {useForm} from 'react-hook-form';
import {useQuery} from 'react-query';
import AppButton from '../../../../components/AppButton';
import Header from '../../../../components/Header';
import AppText from '../../../../components/AppText';
import Scrollable from '../../../../components/Scrollable';
import AppDropDownController from '../../../../components/controlled/AppDropDownController';
import {theme} from '../../../../utils/design';
import {mngmtHttp} from '../../../../utils/http/Http';
import {AlertHelper} from '../../../../utils/AlertHelper';

const AssignBuilding = ({route, navigation}) => {
  const {id, unit} = route.params;
  const {t} = useTranslation();
  const [isLoading, setLoading] = useState();

  const query = useQuery('building', () =>
    mngmtHttp
      .get(`/multi-units/lite-list`)
      .then(response => response.data.data),
  );

  const communityBuildings = useQuery('communityBuildings', () =>
    mngmtHttp
      .get(`/complexes/${unit.community?.id}/multi-units`)
      .then(response => response.data.data),
  );

  const {control, handleSubmit, form} = useForm({
    defaultValues: {
      building: unit?.building?.id,
    },
  });
  const remove = async () => {
    const updatedDataToSend = {
      complex_id: unit.community.id,
    };

    try {
      await mngmtHttp
        .post(`/properties/${unit.id}/assign-to-complex`, updatedDataToSend)
        .then(() => {
          setLoading(false);
          navigation.goBack();
        });
    } catch (error) {
      setLoading(false);
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        AlertHelper.show('error', t('common.error'), error);
      }
    }
  };

  const submit = async ({building}) => {
    const dataToSend = {multi_unit_id: building};
    try {
      await mngmtHttp
        .post(`/properties/${id}/assign-to-multi`, dataToSend)
        .then(() => {
          setLoading(false);
          navigation.goBack();
        });
    } catch (error) {
      crashlytics().recordError(error);
      setLoading(false);
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        AlertHelper.show('error', t('common.error'), error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Header name={t('property.title')} navigation={navigation} />
      <ScrollView
        contentContainerStyle={{backgroundColor: theme.whiteColor}}
        style={styles.container}
        showsVerticalScrollIndicator={false}>
        <Scrollable>
          <View style={styles.titleContainer}>
            <AppText
              fontSize={theme.superTitleFontSize}
              Tcolor={theme.primaryColor}
              textAlign={'center'}>
              {t('editForm.buildingInfo')}
            </AppText>
            {/* <AppText fontSize={theme.subTitleFontSize} Tcolor={'#2A3D47'}>
              {t('assignToProperty.subTitle')}
            </AppText> */}
          </View>
          <View style={styles.formContainer}>
            <View style={styles.formRowContainer}>
              {/* here should be a selector */}
              <AppDropDownController
                half={false}
                name="building"
                placeholder={t('properties.buildings')}
                data={{
                  data: unit.community ? communityBuildings.data : query?.data,
                }}
                control={control}
                // error={errors.duration?.id}
              />
            </View>
            <View style={styles.formRowContainer}></View>
          </View>
        </Scrollable>
      </ScrollView>
      {unit.building && (
        <View style={styles.btnContainer}>
          <AppButton
            title={t('common.remove')}
            onPress={handleSubmit(remove)}
            Bcolor={'#dc3545'}
            Tcolor={theme.whiteColor}
            loading={isLoading}
            rounded={8}
          />
        </View>
      )}
      <View style={styles.btnContainer}>
        <AppButton
          title={t('common.save')}
          onPress={handleSubmit(submit)}
          Bcolor={theme.primaryColor}
          Tcolor={theme.whiteColor}
          loading={isLoading}
          rounded={8}
        />
      </View>
    </View>
  );
};

export default AssignBuilding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },
  titleContainer: {
    flex: 1,
    alignContent: 'center',
    alignContent: 'center',
    justifyContent: 'space-evenly',
    marginHorizontal: 40,
  },
  formContainer: {
    flex: 2,
    marginTop: 10,
  },
  btnContainer: {
    backgroundColor: theme.whiteColor,
    paddingBottom: 10,
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
  },
  formRowContainer: {
    paddingVertical: 5,
  },
});
