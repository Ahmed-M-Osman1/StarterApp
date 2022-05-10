import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Modal, Pressable} from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import {useTranslation} from 'react-i18next';
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

const AssignCommunity = ({route, navigation}) => {
  const {id, unit} = route.params;

  const {t} = useTranslation();
  const [isLoading, setLoading] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const query = useQuery('complexes', () =>
    mngmtHttp.get(`/complexes/lite-list`).then(response => response.data.data),
  );

  const {control, handleSubmit, form} = useForm({
    defaultValues: {
      community: unit?.community?.id,
    },
  });
  const remove = async () => {
    const updatedDataToSend = {
      name: unit.name,
      year_built: unit.year_built,
      district: {id: unit.district.id},
      complex_id: null,
    };
    // setModalVisible(true);
    setModalVisible(!modalVisible);
    try {
      await mngmtHttp.put(`/properties/${id}/`, updatedDataToSend).then(() => {
        setLoading(false);
        navigation.goBack();
      });
    } catch (error) {
      setLoading(false);
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        // AlertHelper.show('error', t('common.error'), error);
      }
    }
  };
  const submit = async ({community}) => {
    const dataToSend = {complex_id: community};
    try {
      await mngmtHttp
        .post(`/properties/${id}/assign-to-complex`, dataToSend)
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
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <Pressable
              style={styles.centeredView}
              onPress={() => setModalVisible(false)}>
              <Pressable onPress={() => {}} style={styles.modalView}>
                <View style={{marginBottom: 20}}>
                  <AppText
                    fontSize={theme.superTitleFontSize}
                    Tcolor={theme.primaryColor}
                    textAlign={'center'}>
                    {t('warning.removeCommunity')}
                  </AppText>
                </View>
                <View style={{marginBottom: 20}}>
                  <AppText
                    fontSize={theme.subTitleFontSize}
                    Tcolor={'#7c7c7c'}
                    textAlign={'center'}>
                    {t('warning.removeCommunityMsg')}
                  </AppText>
                </View>
                <AppButton
                  title={t('common.continue')}
                  onPress={handleSubmit(remove)}
                  Bcolor={'#7c7c7c'}
                  half
                  Tcolor={theme.whiteColor}
                  loading={isLoading}
                  rounded={8}
                />
              </Pressable>
            </Pressable>
          </Modal>
          <View style={styles.titleContainer}>
            <AppText
              fontSize={theme.superTitleFontSize}
              Tcolor={theme.primaryColor}
              textAlign={'center'}>
              {t('editForm.communityInfo')}
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
                name="community"
                placeholder={t('properties.community')}
                data={{data: query?.data}}
                control={control}
                // error={errors.duration?.id}
              />
            </View>
            <View style={styles.formRowContainer}></View>
          </View>
        </Scrollable>
      </ScrollView>
      {unit.community && (
        <View style={styles.btnContainer}>
          <AppButton
            title={t('common.remove')}
            onPress={() => setModalVisible(true)}
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

export default AssignCommunity;

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
    paddingVertical: 10,
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
  },
  formRowContainer: {
    paddingVertical: 5,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#33333380',
  },

  modalView: {
    margin: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: theme.blackColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
