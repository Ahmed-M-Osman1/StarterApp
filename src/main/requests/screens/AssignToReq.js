import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {yupResolver} from '@hookform/resolvers/yup';
import crashlytics from '@react-native-firebase/crashlytics';
import {useForm} from 'react-hook-form';
import * as Role from '../../../utils/constants/Role';
import * as yup from 'yup';
import Header from '../../../components/Header';
import AppText from '../../../components/AppText';
import WhiteSpace from '../../../components/WhiteSpace';
import AppButton from '../../../components/AppButton';
import Scrollable from '../../../components/Scrollable';
import AppDropDownController from '../../../components/controlled/AppDropDownController';
import {RequestType} from '../../../utils/constants/RequestType';
import useContacts from '../../../utils/hooks/useContacts';
import {mngmtHttp} from '../../../utils/http/Http';
import {AlertHelper} from '../../../utils/AlertHelper';
import {theme} from '../../../utils/design';
import {useQuery} from 'react-query';

const AssignToReq = ({route, navigation}) => {
  const {request} = route.params;

  const {t} = useTranslation();

  const contacts = useContacts(request.id || '');

  const [isLoading, setLoading] = useState(false);

  const mySchema = yup.object().shape({
    user_id: yup.string().required(t('assignReq.errorMultiSelect')),
  });

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      user_id: '',
    },
    resolver: yupResolver(mySchema),
  });

  const submit = async data => {
    try {
      setLoading(true);
      await mngmtHttp
        .put(`/requests/${request.id}/assign-staff`, data)
        .then(() => {
          setLoading(false);
          navigation.replace('ListRequests');
          // navigation.replace('ReqDetails', {request: request});
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

  let filterdContacts = {
    ...contacts,
    data: contacts?.data?.filter(
      c =>
        c.role !== 'CUSTOMER' &&
        c.role !== 'ADMIN' &&
        c.role !== 'OWNER' &&
        c.role !== 'SECURITY',
    ),
  };

  const query = useQuery(`Professionals-by-request-${request.id}`, () =>
    mngmtHttp.get(`/professional/by-request/${request.id}`).then(response => {
      return response.data.data;
    }),
  );

  return (
    <Scrollable>
      <Header name={t('assignReq.title')} navigation={navigation} />
      <View style={styles.body1}>
        <WhiteSpace variant={1} />
        <View style={{marginHorizontal: 10}}>
          <AppText
            // regular={true}
            fontSize={theme.s1.size}
            fontWeight={theme.s1.fontWeight}
            Tcolor={theme.blackColor}
            textAlign={'left'}>
            {t('assignReq.message')}{' '}
            {/* {Object.keys(RequestType).find(
              key => RequestType[key] === request.type,
            )} */}
          </AppText>
        </View>
        <WhiteSpace variant={1} />
        <AppDropDownController
          placeholder={t('assignReq.mutliSelect')}
          data={query}
          control={control}
          name="user_id"
          error={errors.user_id}
          noDataComponent={
            <View
              style={{
                marginHorizontal: 10,
                flex: 1,
                justifyContent: 'center',
                paddingHorizontal: 20,
              }}>
              <AppText
                regular={true}
                fontSize={theme.s1.size}
                fontWeight={theme.s1.fontWeight}
                Tcolor={theme.blackColor}
                textAlign={'center'}>
                {t('assignReq.noDataMessage')}
              </AppText>
              <View style={{height: 20}} />
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                  navigation.navigate('contactsTab', {
                    screen: 'ContactTypes',
                  });
                }}
                style={{
                  backgroundColor: theme.primaryColor,
                  borderRadius: 8,
                  paddingVertical: 8,
                }}>
                <AppText
                  regular={true}
                  fontSize={theme.s1.size}
                  fontWeight={theme.s1.fontWeight}
                  Tcolor={theme.whiteColor}
                  textAlign={'center'}>
                  {t('assignReq.takeMeToContact')}
                </AppText>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
      <View style={styles.body2}>
        <AppButton
          title={t('assignReq.assign')}
          onPress={handleSubmit(submit)}
          Bcolor={theme.primaryColor}
          rounded={8}
          Tcolor={theme.whiteColor}
          loading={isLoading}
        />
      </View>
    </Scrollable>
  );
};

export default AssignToReq;

const styles = StyleSheet.create({
  body1: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  body2: {
    justifyContent: 'center',
    marginVertical: 10,
  },
});
