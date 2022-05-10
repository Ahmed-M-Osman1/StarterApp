import React, {useEffect, useCallback} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {useQuery} from 'react-query';
import {useFocusEffect} from '@react-navigation/core';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import Header from '../../../../components/Header';
import AppText from '../../../../components/AppText';
import AppButton from '../../../../components/AppButton';
import {HP, theme, WP} from '../../../../utils/design';
import {mngmtHttp} from '../../../../utils/http/Http';
import {PaymentCycle} from '../../../../utils/constants/PaymentCycle';
import {setLoading} from '../../../../redux/misc';
import {AlertHelper} from '../../../../utils/AlertHelper';

const EditForm = ({route, navigation}) => {
  const {id, variant, prev} = route.params;
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const {fromParent} = route?.params;

  const query = useQuery(`PROPERTY`, () =>
    mngmtHttp
      .get(variant == 'Community' ? `/complexes/${id}` : `/properties/${id}`)
      .then(response => response.data.data),
  );

  useFocusEffect(
    useCallback(() => {
      query.refetch();
    }, []),
  );

  useEffect(() => {
    dispatch(setLoading(query.isLoading));
  }, [query.isLoading]);

  const handlePress = type => {
    navigation.navigate('EditLease', {
      id: id,
      lease: query.data.lease,
      type: type,
    });
  };

  const deleteProperty = () => {
    Alert.alert(
      `${t('common.sureDelete')} ${
        variant === 'Community'
          ? t('properties.community')
          : variant === 'Building'
          ? t('properties.building')
          : t('properties.unit')
      } '${query.data?.name}'?`,
      '',
      [
        {
          text: t('property.no'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: t('property.yes'),
          onPress: async () => {
            try {
              dispatch(setLoading(true));
              await mngmtHttp
                .delete(
                  `${
                    variant === 'Community'
                      ? `complexes/${id}`
                      : `properties/${id}`
                  }`,
                )
                .then(() => {
                  dispatch(setLoading(false));
                  navigation.goBack();
                });
            } catch (error) {
              dispatch(setLoading(false));
              if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                AlertHelper.show('error', t('common.error'), error);
              }
            }
          },
        },
      ],
    );
  };

  const HeaderField = ({title}) => {
    return (
      <View
        style={{
          marginBottom: 20,
          justifyContent: 'center',
          // alignContent: 'center',
        }}>
        <AppText
          Tcolor={'#7c7c7c'}
          textAlign={'center'}
          fontSize={theme.titleFontSize}>
          {title}
        </AppText>
      </View>
    );
  };

  const InputBtnField = ({inputValue, withIcon, onPress}) => {
    return (
      <TouchableOpacity style={{marginHorizontal: 20}} onPress={onPress}>
        <View
          style={{
            borderRadius: 8,
            borderColor: withIcon ? theme.primaryColor : '#BDBDBD',
            height: 45,
            borderWidth: 1,
            // paddingRight: 15,
            alignContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{flex: 1}}>
            <AppText
              Tcolor={withIcon ? '#1E8E5B' : '#232D3540'}
              textAlign={'left'}
              fontSize={theme.subTitleFontSize}>
              {inputValue}
            </AppText>
          </View>
          {withIcon ? (
            <View style={styles.icon}>
              <FontAwesome
                name={'edit'}
                color={theme.primaryColor}
                size={theme.iconSize}
              />
            </View>
          ) : (
            <View>
              <AppText
                Tcolor={withIcon ? '#7c7c7c' : '#232D3570'}
                textAlign={'center'}
                style={{marginLeft: 0, marginRight: WP(2.5)}}
                fontSize={theme.subTitleFontSize}>
                {t('editForm.assign')}
              </AppText>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const GeneralInfo = () => {
    return (
      <View style={{paddingVertical: 20}}>
        <HeaderField title={t('editForm.general')} />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-evenly',
          }}>
          <View
            style={{
              width: '40%',
              borderColor: '#BDBDBD',
              borderWidth: 1,
              height: 40,
              marginBottom: 20,
              borderRadius: 200,
              justifyContent: 'center',
            }}>
            <AppText Tcolor={'#7c7c7c'} textAlign={'left'} fontSize={12}>
              {`${t('editForm.city')}: ${query.data?.city.name}`}
            </AppText>
          </View>
          <View
            style={{
              width: '40%',
              borderColor: '#BDBDBD',
              borderWidth: 1,
              height: 40,
              marginBottom: 20,
              borderRadius: 200,
              justifyContent: 'center',
            }}>
            <AppText Tcolor={'#7c7c7c'} textAlign={'left'} fontSize={12}>
              {`${t('editForm.year')}: ${query.data?.year_built || '-'}`}
            </AppText>
          </View>
          <View
            style={{
              width: '40%',
              borderColor: '#BDBDBD',
              borderWidth: 1,
              height: 40,
              // marginBottom: 20,
              borderRadius: 200,
              justifyContent: 'center',
            }}>
            <AppText Tcolor={'#7c7c7c'} textAlign={'left'} fontSize={12}>
              {`Type: ${variant}`}
            </AppText>
          </View>
          <View
            style={{
              width: '40%',
              borderColor: '#BDBDBD',
              borderWidth: 1,
              height: 40,
              // marginBottom: 20,
              borderRadius: 200,
              justifyContent: 'center',
            }}>
            <AppText Tcolor={'#7c7c7c'} textAlign={'left'} fontSize={12}>
              {`${variant == 'Unit' ? 'Unit' : 'Name'}: ${query.data?.name}`}
            </AppText>
          </View>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() =>
              navigation.navigate(
                variant == 'Unit' ? 'NewUnitForm' : 'NewProperty',
                {
                  variant:
                    variant === 'Community'
                      ? 0
                      : variant === 'Building'
                      ? 1
                      : 2,
                  prev: prev,
                  oldProperty: query.data,
                  type: query?.data?.unit_type,
                  sub_type: query?.data?.unit_sub_type,
                  fromParent: fromParent
                },
              )
            }
            style={{
              width: '86%',
              height: 40,
              backgroundColor: theme.primaryColor,
              justifyContent: 'center',
              borderRadius: 8,
            }}>
            <Text style={{textAlign: 'center', color: theme.whiteColor}}>
              {`${t('editForm.edit')} ${t('editForm.general')}`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={deleteProperty}
            style={{
              marginTop: HP(1),
              width: '86%',
              height: 40,
              backgroundColor: 'red',
              justifyContent: 'center',
              borderRadius: 8,
              alignSelf: 'center',
            }}>
            <Text style={{textAlign: 'center', color: theme.whiteColor}}>
              {t('common.delete')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const CommunityInfo = () => {
    return (
      <View style={{paddingVertical: 20}}>
        <HeaderField title={t('editForm.communityInfo')} />
        {query.data?.community == null ? (
          <InputBtnField
            inputValue={t('editForm.noCommunity')}
            onPress={() =>
              navigation.navigate('AssignCommunity', {
                id: id,
                unit: query.data,
              })
            }
            withIcon={false}
          />
        ) : (
          <InputBtnField
            inputValue={query.data?.community?.name}
            withIcon={true}
            onPress={() =>
              navigation.navigate('AssignCommunity', {
                id: id,
                unit: query.data,
              })
            }
          />
        )}
      </View>
    );
  };

  const BuildingInfo = () => {
    return (
      <View style={{paddingVertical: 20}}>
        <HeaderField title={t('editForm.buildingInfo')} />
        {query.data?.building == null ? (
          <InputBtnField
            inputValue={t('editForm.noBuilding')}
            onPress={() =>
              navigation.navigate('AssignBuilding', {
                id: id,
                unit: query?.data,
              })
            }
            withIcon={false}
          />
        ) : (
          <InputBtnField
            inputValue={query.data?.building?.name}
            withIcon={true}
            onPress={() =>
              navigation.navigate('AssignBuilding', {
                id: id,
                unit: query?.data,
              })
            }
          />
        )}
      </View>
    );
  };

  const OwnerInfo = () => {
    return (
      <View style={{paddingVertical: 20}}>
        <HeaderField title={t('editForm.ownerInfo')} />
        {query.data?.owner == null ? (
          <InputBtnField
            inputValue={t('editForm.noOwner')}
            withIcon={false}
            onPress={() =>
              navigation.navigate('AssignOwner', {
                id: id,
                owner: query.data?.owner,
                property: query.data,
              })
            }
          />
        ) : (
          <InputBtnField
            inputValue={query.data?.owner?.name}
            withIcon={true}
            onPress={() =>
              navigation.navigate('AssignOwner', {
                id: id,
                owner: query.data?.owner,
                property: query.data,
              })
            }
          />
        )}
      </View>
    );
  };

  const TenantInfo = () => {
    return (
      <View style={{paddingVertical: 20}}>
        <HeaderField title={t('editForm.tenantInfo')} />
        {query.data?.tenant == null ? (
          <InputBtnField
            inputValue={t('editForm.noTenant')}
            withIcon={false}
            onPress={() =>
              navigation.navigate('AssignTenant', {
                id: id,
                tenant: query.data?.tenant,
                lease: query.data.lease,
              })
            }
          />
        ) : (
          <InputBtnField
            inputValue={query.data?.tenant?.name}
            withIcon={true}
            style={query.data?.tenant && {borderColor: '#'}}
            onPress={() =>
              navigation.navigate('AssignTenant', {
                id: id,
                tenant: query.data?.tenant,
                lease: query.data.lease,
              })
            }
          />
        )}
      </View>
    );
  };
  const LeaseInfo = () => {
    return (
      <View style={{paddingVertical: 20}}>
        <HeaderField title={t('editForm.leaseInfo')} />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-evenly',
          }}>
          <View
            style={{
              width: '40%',
              borderColor: '#BDBDBD',
              borderWidth: 1,
              height: 40,
              marginBottom: 20,
              borderRadius: 200,
              justifyContent: 'center',
            }}>
            <AppText Tcolor={'#7c7c7c'} textAlign={'left'} fontSize={12}>
              {`${query.data?.lease?.start_date}`}
            </AppText>
          </View>
          <View
            style={{
              width: '40%',
              borderColor: '#BDBDBD',
              borderWidth: 1,
              height: 40,
              marginBottom: 20,
              borderRadius: 200,
              justifyContent: 'center',
            }}>
            <AppText Tcolor={'#7c7c7c'} textAlign={'left'} fontSize={12}>
              {`${query.data?.lease?.end_date}`}
            </AppText>
          </View>
          <View
            style={{
              width: '40%',
              borderColor: '#BDBDBD',
              borderWidth: 1,
              height: 40,
              borderRadius: 200,
              justifyContent: 'center',
            }}>
            <AppText Tcolor={'#7c7c7c'} textAlign={'left'} fontSize={12}>
              {`${query.data?.lease?.annual_rent}`}
            </AppText>
          </View>
          <View
            style={{
              width: '40%',
              borderColor: '#BDBDBD',
              borderWidth: 1,
              height: 40,
              borderRadius: 200,
              justifyContent: 'center',
            }}>
            <AppText Tcolor={'#7c7c7c'} textAlign={'left'} fontSize={12}>
              {`Num. of payments ${
                PaymentCycle.find(
                  ({id}) => query.data?.lease?.payments_count == id,
                ).name
              }`}
            </AppText>
          </View>
        </View>
        <View style={{marginTop: 20}}>
          <AppButton
            title={t('editForm.newLease')}
            onPress={() => {
              handlePress('renew');
            }}
            Bcolor={theme.primaryColor}
            Tcolor={theme.whiteColor}
            rounded={8}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header name={`${query.data?.name}`} navigation={navigation} />
      <ScrollView>
        <View style={styles.generalInfo}>
          <GeneralInfo />
        </View>
        <View style={styles.communityInfo}>
          {variant !== 'Community' && <CommunityInfo />}
        </View>
        <View style={styles.buildingInfo}>
          {variant == 'Unit' && <BuildingInfo />}
        </View>
        {variant == 'Unit' && (
          <>
            <View style={styles.ownerInfo}>
              <OwnerInfo />
            </View>
            <View style={styles.tenantInfo}>
              <TenantInfo />
            </View>
            <View style={styles.atarListing}>
              {query.data?.lease && <LeaseInfo />}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default EditForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
    paddingTop: 20,
  },
  generalInfo: {
    flex: 1,
  },
  communityInfo: {
    flex: 1,
  },
  buildingInfo: {
    flex: 1,
  },
  ownerInfo: {
    flex: 1,
  },
  tenantInfo: {
    flex: 1,
  },
  atarListing: {
    flex: 1,
  },
  icon: {
    marginRight: WP(2),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0,0,0,0.12)',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: HP('0.5'),
      width: 0.5,
    },
  },
});
