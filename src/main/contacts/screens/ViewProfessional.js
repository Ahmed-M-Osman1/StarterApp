import React, {useEffect, useState} from 'react';

import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import Header from '../../../components/Header';
import {theme} from '../../../utils/design';
import AppText from '../../../components/AppText';
import {CardWithShadow} from '../../../components/CardWithShadow';
import formatNumbers from '../../../utils/formatNumbers';
import {mngmtHttp} from '../../../utils/http/Http';
import {useQuery} from 'react-query';
import {AlertHelper} from '../../../utils/AlertHelper';
import Avatar from '../../../components/Avatar';
import RenderActionButtons from '../components/RenderActionButtons';

const PersonalInformation = ({t, item, type}) => {
  return (
    <>
      <AppText
        Tcolor={theme.primaryColor}
        regular={true}
        fontSize={theme.s1.size}
        fontWeight={theme.s1.fontWeight}
        textAlign={'left'}>
        {t('ViewProfessional.PersonalInformation.personalInformation')}
      </AppText>
      <View style={{height: 20}} />
      <CardWithShadow>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Avatar text={item?.name} />
          <View style={{flex: 1, paddingHorizontal: 20}}>
            <AppText
              Tcolor={theme.blackColor}
              regular={true}
              fontSize={theme.s1.size}
              fontWeight={theme.s1.fontWeight}
              textAlign={'left'}>
              {item?.name ?? ''}
            </AppText>
            <View style={{height: 5}} />
            <AppText
              Tcolor={theme.blackColor}
              regular={true}
              textTransform={'capitalize'}
              fontSize={theme.c1.size}
              fontWeight={theme.c1.fontWeight}
              textAlign={'left'}>
              {item?.role ?? ''}
            </AppText>
            <View style={{height: 10}} />
            <View
              style={{
                paddingVertical: 5,
                paddingHorizontal: 10,
                width: 70,
                backgroundColor: `${theme.primaryColor}20`,
                borderRadius: 4,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <AppText
                Tcolor={theme.blackColor}
                regular={true}
                fontSize={10}
                fontWeight={theme.c1.fontWeight}
                textAlign={'center'}>
                {t('ViewProfessional.PersonalInformation.offline')}
              </AppText>
            </View>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${item?.phone_number}`)}
              style={{
                paddingHorizontal: 15,
                paddingVertical: 5,
                backgroundColor: theme.primaryColor,
                borderRadius: 6,
              }}>
              <AppText
                Tcolor={theme.whiteColor}
                regular={true}
                fontSize={theme.c1.size}
                fontWeight={theme.c1.fontWeight}
                textAlign={'left'}>
                {t('ViewProfessional.PersonalInformation.call')}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{height: 20}} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <AppText
            Tcolor={theme.blackColor}
            regular={true}
            fontSize={theme.c1.size}
            fontWeight={theme.c1.fontWeight}
            textAlign={'left'}>
            {t('ViewProfessional.PersonalInformation.email')}
          </AppText>
          <AppText
            Tcolor={theme.blackColor}
            regular={true}
            fontSize={theme.c2.size}
            fontWeight={theme.c2.fontWeight}
            textAlign={'left'}>
            {item?.email ?? '-'}
          </AppText>
        </View>
        <View style={{height: 8}} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <AppText
            Tcolor={theme.blackColor}
            regular={true}
            fontSize={theme.c1.size}
            fontWeight={theme.c1.fontWeight}
            textAlign={'left'}>
            {t('ViewProfessional.PersonalInformation.accountCreationDate')}
          </AppText>
          <AppText
            Tcolor={theme.blackColor}
            regular={true}
            fontSize={theme.c2.size}
            fontWeight={theme.c2.fontWeight}
            textAlign={'left'}>
            {item?.account_creation_date ?? ''}
          </AppText>
        </View>
        <View style={{height: 8}} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <AppText
            Tcolor={theme.blackColor}
            regular={true}
            fontSize={theme.c1.size}
            fontWeight={theme.c1.fontWeight}
            textAlign={'left'}>
            {t('ViewProfessional.PersonalInformation.lastActive')}
          </AppText>
          <AppText
            Tcolor={theme.blackColor}
            regular={true}
            fontSize={theme.c2.size}
            fontWeight={theme.c2.fontWeight}
            textAlign={'left'}>
            {item?.last_active ?? '-'}
          </AppText>
        </View>
      </CardWithShadow>
    </>
  );
};

const WorkingSchedule = ({t, item, type}) => {
  const working_schedules = item?.working_schedules[0];
  const DAYS = Object.keys(working_schedules ?? {}).filter(i => i != 'slots');
  return (
    <>
      <AppText
        Tcolor={theme.primaryColor}
        regular={true}
        fontSize={theme.s1.size}
        fontWeight={theme.s1.fontWeight}
        textAlign={'left'}>
        {t('ViewProfessional.WorkingSchedule.workingSchedule')}
      </AppText>
      <View style={{height: 20}} />
      <CardWithShadow>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <AppText
            Tcolor={theme.blackColor}
            regular={true}
            fontSize={theme.c1.size}
            fontWeight={theme.c1.fontWeight}
            textAlign={'left'}>
            {t('ViewProfessional.WorkingSchedule.workingDays')}
          </AppText>
          <View style={{flexDirection: 'row'}}>
            {!!working_schedules ? (
              DAYS.map(d => (
                <AppText
                  key={d}
                  Tcolor={
                    working_schedules[d] ? theme.primaryColor : theme.greyColor
                  }
                  regular={true}
                  fontSize={theme.c2.size}
                  fontWeight={theme.c2.fontWeight}
                  textAlign={'left'}>
                  {`${d[0].toUpperCase()}`}
                </AppText>
              ))
            ) : (
              <></>
            )}
          </View>
        </View>
        <View style={{height: 8}} />
        {!!working_schedules ? (
          working_schedules?.slots?.map((slot, idx) => (
            <View
              key={idx}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}>
              <AppText
                Tcolor={theme.blackColor}
                regular={true}
                fontSize={theme.c1.size}
                fontWeight={theme.c1.fontWeight}
                textAlign={'left'}>
                {t('ViewProfessional.WorkingSchedule.workingHours')}
              </AppText>
              <AppText
                Tcolor={theme.blackColor}
                regular={true}
                fontSize={theme.c2.size}
                fontWeight={theme.c2.fontWeight}
                textAlign={'left'}>
                {`${slot.start ?? ''} - ${slot.end ?? ''}`}
              </AppText>
            </View>
          ))
        ) : (
          <></>
        )}
      </CardWithShadow>
    </>
  );
};

const AssingedProperties = ({t, item, type}) => {
  if (!item) {
    return <ActivityIndicator />;
  }

  return (
    <>
      <AppText
        Tcolor={theme.primaryColor}
        regular={true}
        fontSize={theme.s1.size}
        fontWeight={theme.s1.fontWeight}
        textAlign={'left'}>
        {t('ViewProfessional.AssignedProperties.assignedProperties')}
      </AppText>
      <View style={{height: 20}} />
      <CardWithShadow>
        {!!item?.AllProperty ? (
          <AppText
            Tcolor={theme.greyColor}
            regular={true}
            fontSize={theme.c1.size}
            fontWeight={theme.c1.fontWeight}
            textAlign={'left'}>
            {t('ViewProfessional.AssignedProperties.allProperties')}
          </AppText>
        ) : (
          <>
            <AppText
              Tcolor={theme.greyColor}
              regular={true}
              fontSize={theme.c1.size}
              fontWeight={theme.c1.fontWeight}
              textAlign={'left'}>
              {t('ViewProfessional.AssignedProperties.community')}
            </AppText>
            <View style={{height: 5}} />
            {item?.complexes?.map(complex => (
              <View
                key={complex}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <AppText
                  Tcolor={theme.blackColor}
                  regular={true}
                  fontSize={theme.c2.size}
                  fontWeight={theme.c2.fontWeight}
                  textAlign={'left'}>
                  {complex ?? ''}
                </AppText>
                <AppText
                  Tcolor={theme.blackColor}
                  regular={true}
                  fontSize={theme.c2.size}
                  fontWeight={theme.c2.fontWeight}
                  textAlign={'left'}>
                  {t('ViewProfessional.AssignedProperties.all')}
                </AppText>
              </View>
            ))}
            <View style={{height: 10}} />
            <AppText
              Tcolor={theme.greyColor}
              regular={true}
              fontSize={theme.c1.size}
              fontWeight={theme.c1.fontWeight}
              textAlign={'left'}>
              {t('ViewProfessional.AssignedProperties.building')}
            </AppText>
            <View style={{height: 5}} />
            {item?.buildings?.map(building => (
              <View
                key={building}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <AppText
                  Tcolor={theme.blackColor}
                  regular={true}
                  fontSize={theme.c2.size}
                  fontWeight={theme.c2.fontWeight}
                  textAlign={'left'}>
                  {building ?? ''}
                </AppText>
                <AppText
                  Tcolor={theme.blackColor}
                  regular={true}
                  fontSize={theme.c2.size}
                  fontWeight={theme.c2.fontWeight}
                  textAlign={'left'}>
                  {t('ViewProfessional.AssignedProperties.all')}
                </AppText>
              </View>
            ))}
            <View style={{height: 10}} />
            <AppText
              Tcolor={theme.greyColor}
              regular={true}
              fontSize={theme.c1.size}
              fontWeight={theme.c1.fontWeight}
              textAlign={'left'}>
              {t('ViewProfessional.AssignedProperties.unit')}
            </AppText>
            <View style={{height: 5}} />
            {item?.units?.map(unit => (
              <View
                key={unit}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <AppText
                  Tcolor={theme.blackColor}
                  regular={true}
                  fontSize={theme.c2.size}
                  fontWeight={theme.c2.fontWeight}
                  textAlign={'left'}>
                  {unit ?? ''}
                </AppText>
                <AppText
                  Tcolor={theme.blackColor}
                  regular={true}
                  fontSize={theme.c2.size}
                  fontWeight={theme.c2.fontWeight}
                  textAlign={'left'}>
                  {t('ViewProfessional.AssignedProperties.all')}
                </AppText>
              </View>
            ))}
          </>
        )}
      </CardWithShadow>
    </>
  );
};

const RequestsHistory = ({t, item = {}, type, onPress}) => {
  const {request_details} = item;
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <AppText
          Tcolor={theme.primaryColor}
          regular={true}
          fontSize={theme.s1.size}
          fontWeight={theme.s1.fontWeight}
          textAlign={'left'}>
          {t('ViewProfessional.RequestHistory.requestHistory')}
        </AppText>
        <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
          <AppText
            Tcolor={theme.primaryColor}
            regular={true}
            fontSize={theme.c2.size}
            fontWeight={theme.c2.fontWeight}
            textAlign={'left'}>
            {t('ViewProfessional.RequestHistory.viewAll')}
          </AppText>
        </TouchableOpacity>
      </View>
      <View style={{height: 20}} />
      <CardWithShadow>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <AppText
            Tcolor={theme.blackColor}
            regular={true}
            fontSize={theme.c1.size}
            fontWeight={theme.c1.fontWeight}
            textAlign={'left'}>
            {t('ViewProfessional.RequestHistory.requestsRecieved')}
          </AppText>
          <AppText
            Tcolor={theme.blackColor}
            regular={true}
            fontSize={theme.c2.size}
            fontWeight={theme.c2.fontWeight}
            textAlign={'left'}>
            {request_details?.request_recieved ?? 0}
          </AppText>
        </View>
        <View style={{height: 8}} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <AppText
            Tcolor={theme.blackColor}
            regular={true}
            fontSize={theme.c1.size}
            fontWeight={theme.c1.fontWeight}
            textAlign={'left'}>
            {t('ViewProfessional.RequestHistory.requestsDeclined')}
          </AppText>
          <AppText
            Tcolor={theme.blackColor}
            regular={true}
            fontSize={theme.c2.size}
            fontWeight={theme.c2.fontWeight}
            textAlign={'left'}>
            {request_details?.request_decline ?? 0}
          </AppText>
        </View>
        <View style={{height: 8}} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <AppText
            Tcolor={theme.blackColor}
            regular={true}
            fontSize={theme.c1.size}
            fontWeight={theme.c1.fontWeight}
            textAlign={'left'}>
            {t('ViewProfessional.RequestHistory.requestsAccepted')}
          </AppText>
          <AppText
            Tcolor={theme.blackColor}
            regular={true}
            fontSize={theme.c2.size}
            fontWeight={theme.c2.fontWeight}
            textAlign={'left'}>
            {request_details?.request_accept ?? 0}
          </AppText>
        </View>
        <View style={{height: 8}} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <AppText
            Tcolor={theme.blackColor}
            regular={true}
            fontSize={theme.c1.size}
            fontWeight={theme.c1.fontWeight}
            textAlign={'left'}>
            {t('ViewProfessional.RequestHistory.requestsCompleted')}
          </AppText>
          <AppText
            Tcolor={theme.blackColor}
            regular={true}
            fontSize={theme.c2.size}
            fontWeight={theme.c2.fontWeight}
            textAlign={'left'}>
            {request_details?.request_complete ?? 0}
          </AppText>
        </View>
      </CardWithShadow>
    </>
  );
};

const TotalEarnings = ({t, item, type, onPress}) => {
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <AppText
          Tcolor={theme.primaryColor}
          regular={true}
          fontSize={theme.s1.size}
          fontWeight={theme.s1.fontWeight}
          textAlign={'left'}>
          {t('ViewProfessional.TotalEarning.earningHistory')}
        </AppText>
        <TouchableOpacity activeOpacity={0.5} onPress={() => {}}>
          <AppText
            Tcolor={theme.primaryColor}
            regular={true}
            fontSize={theme.c2.size}
            fontWeight={theme.c2.fontWeight}
            textAlign={'left'}>
            {t('ViewProfessional.TotalEarning.viewAll')}
          </AppText>
        </TouchableOpacity>
      </View>
      <View style={{height: 20}} />
      <CardWithShadow>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View>
            <AppText
              Tcolor={theme.blackColor}
              regular={true}
              fontSize={theme.h6.size}
              fontWeight={theme.h6.fontWeight}
              textAlign={'left'}>
              {`${t('dashboard.sar')}`} {formatNumbers(item?.balanceOwed)}
            </AppText>
            <View style={{height: 8}} />
            <AppText
              Tcolor={theme.blackColor}
              regular={true}
              fontSize={theme.c2.size}
              fontWeight={theme.c2.fontWeight}
              textAlign={'left'}>
              {t('ViewProfessional.TotalEarning.last14Days')}
            </AppText>
          </View>
          <View>
            <TouchableOpacity
              onPress={onPress}
              style={{
                paddingHorizontal: 15,
                paddingVertical: 5,
                backgroundColor: theme.primaryColor,
                borderRadius: 6,
              }}>
              <AppText
                Tcolor={theme.whiteColor}
                regular={true}
                fontSize={theme.c1.size}
                fontWeight={theme.c1.fontWeight}
                textAlign={'left'}>
                {t('ViewProfessional.TotalEarning.collect').toUpperCase()}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </CardWithShadow>
    </>
  );
};

const RightIcon = ({t}) => {
  return (
    <AppText
      Tcolor={theme.green}
      regular={true}
      fontSize={theme.s1.size}
      fontWeight={theme.s1.fontWeight}
      textAlign={'left'}>
      {t('common.edit')}
    </AppText>
  );
};

const ViewProfessional = ({navigation, route}) => {
  const {t} = useTranslation();
  const {type, item} = route.params;
  const [isLoading, setIsLoading] = useState(true);

  const professionalDetails = useQuery('professionalDetails', () =>
    mngmtHttp
      .get(`/contacts/${item.id}/all-details?role=MAINTENANCE`)
      .then(resp => resp.data)
      .catch(e => {
        console.log(e);
        AlertHelper.showMessage('error', JSON.stringify(e.message));
      }),
  );
  const wallet = useQuery(`/professional_wallet_id=${item.id}`, () =>
    mngmtHttp
      .get(`/professional-wallet?professional_id=${item.id}`)
      .then(resp => resp.data)
      .catch(e => {
        console.log(e);
        AlertHelper.showMessage('error', JSON.stringify(e.message));
      }),
  );
  const professionalProperties = useQuery(
    `/professional_properties_id=${item.id}`,
    () =>
      mngmtHttp
        .get(`/professional-property?professional_id=${item.id}`)
        .then(resp => resp.data)
        .catch(e => {
          console.log(e);
          AlertHelper.showMessage('error', JSON.stringify(e.message));
        }),
  );
  const professionalCategories = useQuery(
    `/professional_categories_id=${item.id}`,
    () =>
      mngmtHttp
        .get(`/professional-category?professional_id=${item.id}`)
        .then(resp => resp.data)
        .catch(e => {
          console.log(e);
          AlertHelper.showMessage('error', JSON.stringify(e.message));
        }),
  );

  const deleteUser = () => {
    setIsLoading(true);
    mngmtHttp
      .delete(`contacts/${item.id}`)
      .then(response => console.log(response.data))
      .catch(e => {
        console.log(e);
        AlertHelper.showMessage('error', JSON.stringify(e.message));
      })
      .finally(() => {
        setIsLoading(true);
        navigation.goBack();
      });
  };

  useEffect(() => {
    setIsLoading(
      professionalDetails.isFetching ||
        wallet.isFetching ||
        professionalProperties.isFetching ||
        professionalCategories.isFetching,
    );
  }, [
    professionalDetails.isFetching,
    wallet.isFetching,
    professionalProperties.isFetching,
    professionalCategories.isFetching,
  ]);

  useEffect(() => {
    navigation.addListener('focus', () => {
      // Screen was focused
      // dispatch(setLoading(true));
      professionalDetails.refetch();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const collectWallet = () => {
    setIsLoading(true);
    mngmtHttp
      .post(`professional-wallet`, {
        type: '2',
        amount: +wallet?.data?.balanceOwed ?? 0,
        professional_id: item?.id,
      })
      .then(resp => {
        if (resp.status === 201 || resp.status === 200)
          AlertHelper.showMessage('success', t('common.success'));
      })
      .catch(e =>
        AlertHelper.showMessage('error', t('common.error'), e.message),
      )
      .finally(() => {
        setIsLoading(false);
        // professionalDetails.refetch();
        // professionalProperties.refetch();
        wallet.refetch();
      });
  };
  return (
    <View style={styles.container}>
      <Header
        name={t('common.details')}
        navigation={navigation}
        rightIcon={<RightIcon t={t} />}
        rightIconOnPress={() =>
          navigation.navigate('CreateProfessional', {
            user: professionalDetails.data.data,
            professionalProperties: professionalProperties.data,
          })
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          paddingTop: 20,
          marginHorizontal: 20,
        }}>
        {isLoading && !professionalDetails?.data?.data ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator />
          </View>
        ) : (
          <>
            <View style={{height: 20}} />
            <PersonalInformation
              t={t}
              item={professionalDetails?.data?.data}
              type={type}
            />
            <View style={{height: 20}} />
            <AssingedProperties
              t={t}
              item={professionalProperties?.data}
              type={type}
            />
            <View style={{height: 20}} />
            <WorkingSchedule
              t={t}
              item={professionalDetails?.data?.data}
              type={type}
            />
            <View style={{height: 20}} />
            <RequestsHistory
              t={t}
              item={professionalDetails?.data?.data}
              type={type}
              onPress={() => {}}
            />
            <View style={{height: 20}} />
            <TotalEarnings
              t={t}
              item={wallet.data}
              type={type}
              onPress={collectWallet}
            />
            <View style={{height: 50}} />
          </>
        )}
      </ScrollView>
      <RenderActionButtons
        text={t('common.delete')}
        callApiFunc={() => deleteUser()}
      />
    </View>
  );
};

export default ViewProfessional;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },
});
