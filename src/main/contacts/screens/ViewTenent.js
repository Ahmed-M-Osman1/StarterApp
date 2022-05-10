import React, {useEffect, useState} from 'react';

import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import Header from '../../../components/Header';
import {theme} from '../../../utils/design';
import AppText from '../../../components/AppText';
import {CardWithShadow} from '../../../components/CardWithShadow';
import formatNumbers from '../../../utils/formatNumbers';
import NoData from '../../../components/NoData';
import {RequestTypeAsArray} from '../../../utils/constants/RequestType';
import {IssueTypeAsArray} from '../../../utils/constants/IssueType';
import {useQuery} from 'react-query';
import {mngmtHttp} from '../../../utils/http/Http';
import {RequestStatusAsArray} from '../../../utils/constants/RequestStatus';
import {Tenant} from '../../../utils/constants/Role';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Avatar from '../../../components/Avatar';
import {
  StatusBadge,
} from '../../requests/components/RenderActionButtonsAndStatus';

const cardImgPlaceHolder = [
  {
    img: require('../../../../assets/images/requests/1.png'),
    color: '#E9FBFF',
  },
  {
    img: require('../../../../assets/images/requests/2.png'),
    color: '#FDFBEB',
  },
  {
    img: require('../../../../assets/images/requests/3.png'),
    color: '#FEF7F0',
  },
  {
    img: require('../../../../assets/images/requests/4.png'),
    color: '#F3F9FF',
  },
  {},
  {
    img: require('../../../../assets/images/requests/5.png'),
    color: '#F6F6FF',
  },
];

const PersonalInformation = ({t, item, navigation}) => {
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <AppText
          Tcolor={theme.primaryColor}
          regular={true}
          fontSize={theme.s1.size}
          fontWeight={theme.s1.fontWeight}
          textAlign={'left'}>
          {item?.role === Tenant
            ? t('ViewTenant.tenantDetails')
            : t('ViewTenant.personalInformation')}
        </AppText>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('CreateTenant', {user: item});
          }}
          activeOpacity={0.5}
          style={{
            paddingHorizontal: 15,
            paddingVertical: 5,
            borderRadius: 6,
          }}>
          <AppText
            Tcolor={theme.primaryColor}
            regular={true}
            fontSize={theme.c1.size}
            fontWeight={theme.c1.fontWeight}
            textAlign={'left'}>
            {t('common.edit')}
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
              Tcolor={theme.greyColor}
              regular={true}
              fontSize={theme.c1.size}
              fontWeight={theme.c1.fontWeight}
              textAlign={'left'}>
              {item?.email ?? ''}
            </AppText>
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
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: 20,
                }}>
                <FontAwesome5Icon name="phone-alt" color={theme.whiteColor} />
                <AppText
                  Tcolor={theme.whiteColor}
                  regular={true}
                  fontSize={theme.c1.size}
                  fontWeight={theme.c1.fontWeight}
                  textAlign={'left'}>
                  {t('common.call')}
                </AppText>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </CardWithShadow>
    </>
  );
};

const LeaseCardItem = ({t, item, type, navigation}) => {
  return (
    <TouchableOpacity
      onPress={
        () => {}
        // navigation.navigate('propertiesTab', {
        //   screen: 'EditLease',
        //   params: {
        //     item: item,
        //   },
        // })
      }
      style={{width: 300}}
      activeOpacity={0.8}>
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
            {t('ViewTenant.status')}
          </AppText>
          <View
            style={{
              backgroundColor: `${
                !!item?.status ? theme.primaryColor : theme.red
              }20`,
              paddingHorizontal: 10,
              borderRadius: 4,
              paddingVertical: 4,
            }}>
            <AppText
              Tcolor={!!item?.status ? theme.primaryColor : theme.red}
              regular={true}
              fontSize={theme.c2.size}
              fontWeight={theme.c2.fontWeight}
              textAlign={'left'}>
              {!!item?.status
                ? t('ViewTenant.active')
                : t('ViewTenant.inactive')}
            </AppText>
          </View>
        </View>
        <View style={{height: 10}} />
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
            {t('ViewTenant.communityName')}
          </AppText>
          <AppText
            Tcolor={theme.blackColor}
            regular={true}
            fontSize={theme.c2.size}
            fontWeight={theme.c2.fontWeight}
            textAlign={'left'}>
            {item?.community?.name ?? ''}
          </AppText>
        </View>
        <View style={{height: 10}} />
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
            {t('ViewTenant.buildingNumber')}
          </AppText>
          <AppText
            Tcolor={theme.blackColor}
            regular={true}
            fontSize={theme.c2.size}
            fontWeight={theme.c2.fontWeight}
            textAlign={'left'}>
            {item?.building?.name ?? ''}
          </AppText>
        </View>
        <View style={{height: 10}} />
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
            {t('ViewTenant.unitNumber')}
          </AppText>
          <AppText
            Tcolor={theme.blackColor}
            regular={true}
            fontSize={theme.c2.size}
            fontWeight={theme.c2.fontWeight}
            textAlign={'left'}>
            {item?.name || ''}
          </AppText>
        </View>
        <View style={{height: 10}} />
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
            {t('ViewTenant.startDate')}
          </AppText>
          <AppText
            Tcolor={theme.blackColor}
            regular={true}
            fontSize={theme.c2.size}
            fontWeight={theme.c2.fontWeight}
            textAlign={'left'}>
            {item?.lease?.start_date ?? ''}
          </AppText>
        </View>
        <View style={{height: 10}} />
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
            {t('ViewTenant.endDate')}
          </AppText>
          <AppText
            Tcolor={theme.blackColor}
            regular={true}
            fontSize={theme.c2.size}
            fontWeight={theme.c2.fontWeight}
            textAlign={'left'}>
            {item?.lease?.end_date ?? ''}
          </AppText>
        </View>
        <View style={{height: 15}} />
        <View
          style={{
            height: 30,
            borderColor: theme.primaryColor,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.whiteColor,
            borderRadius: 6,
          }}>
          <AppText
            regular
            fontSize={theme.p2.size}
            fontWeight={theme.p2.fontWeight}
            Tcolor={theme.primaryColor}
            textAlign={'center'}>
            {t('ViewTenant.viewDetails')}
          </AppText>
        </View>
      </CardWithShadow>
    </TouchableOpacity>
  );
};

const RequestCardItem = ({t, item, type}) => {
  return (
    <TouchableOpacity style={{width: 300}} activeOpacity={0.8}>
      <CardWithShadow>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <View
              style={{
                backgroundColor:
                  cardImgPlaceHolder[item?.type - 1]?.color ?? '#fff',
                width: 70,
                height: 80,
                alignContent: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
              }}>
              <Image
                resizeMode={'contain'}
                style={{
                  width: '70%',
                  height: '70%',
                }}
                source={cardImgPlaceHolder[item?.type - 1]?.img}
              />
            </View>
          </View>

          <View
            style={{
              flex: 1,
              marginLeft: 12,
              justifyContent: 'flex-start',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <AppText
                fontSize={theme.c1.size}
                fontWeight={theme.c1.fontWeight}
                regular
                Tcolor={theme.greyColor}
                textAlign={'left'}>
                {`${t('requests.requestType')}`}
              </AppText>
              {!!item?.is_urgent && (
                <View
                  style={{
                    backgroundColor: 'rgba(255,0,0,0.06)',
                    width: 60,
                    height: 20,
                    borderRadius: 4,
                    justifyContent: 'center',
                    // transform: [{scale: 0.8}],
                  }}>
                  <AppText
                    fontSize={10}
                    fontWeight={theme.c1.fontWeight}
                    regular
                    Tcolor={theme.red}
                    textAlign={'center'}>
                    {t('requests.urgent')}
                  </AppText>
                </View>
              )}
            </View>
           

            <AppText
              fontSize={theme.s2.size}
              fontWeight={theme.s2.fontWeight}
              regular
              Tcolor={theme.blackColor}
              textAlign={'left'}>
              {t(`requestsCategories.${RequestTypeAsArray[item?.type - 1]}`)}
            </AppText>

            <View style={{height: 3}} />

            {item?.subtype && (
              <AppText
                Tcolor={theme.blackColor}
                fontSize={theme.c1.size}
                fontWeight={theme.c1.fontWeight}
                regular
                textAlign={'left'}>
                {IssueTypeAsArray[item?.subtype - 1]}
              </AppText>
            )}

            <View style={{height: 10}} />

            <AppText
              fontSize={theme.c1.size}
              fontWeight={theme.c1.fontWeight}
              regular
              Tcolor={theme.greyColor}
              textAlign={'left'}>
              {`${t('requests.status')}`}
            </AppText>

            <View style={{height: 5}} />
            <StatusBadge request={item} regular={true} />
            <View style={{height: 3}} />

          </View>
        </View>
        <View style={{height: 15}} />
        <View
          style={{
            height: 30,
            borderColor: theme.primaryColor,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.whiteColor,
            borderRadius: 6,
          }}>
          <AppText
            regular
            fontSize={theme.p2.size}
            fontWeight={theme.p2.fontWeight}
            Tcolor={theme.primaryColor}
            textAlign={'center'}>
            {t('ViewTenant.viewDetails')}
          </AppText>
        </View>
      </CardWithShadow>
    </TouchableOpacity>
  );
};

const TransactionCardItem = ({t, item, type}) => {
  return (
    <TouchableOpacity style={{width: 300}} activeOpacity={0.8}>
      <CardWithShadow>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-start',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <AppText
              fontSize={theme.c2.size}
              fontWeight={theme.c2.fontWeight}
              regular
              Tcolor={theme.blackColor}
              textAlign={'left'}>
              {item?.category?.name ?? ''}
            </AppText>
            <View
              style={{
                backgroundColor: `${
                  item?.type == 'overdue'
                    ? theme.red
                    : item?.type == 'outstanding'
                    ? theme.orange
                    : theme.green
                }20`,
                // width: 60,
                height: 20,
                borderRadius: 4,
                justifyContent: 'center',
                // transform: [{scale: 0.8}],
              }}>
              <AppText
                fontSize={10}
                fontWeight={theme.c1.fontWeight}
                regular
                Tcolor={
                  item?.type == 'overdue'
                    ? theme.red
                    : item?.type == 'outstanding'
                    ? theme.orange
                    : theme.green
                }
                textAlign={'center'}>
                {t(`accounting.${item?.type}`, {defaultValue: item?.type}) ??
                  ''}
              </AppText>
            </View>
          </View>

          <AppText
            fontSize={theme.c1.size}
            fontWeight={theme.c1.fontWeight}
            regular
            Tcolor={theme.greyColor}
            textAlign={'left'}>
            {t('createTransaction.due_on')} {item?.due_on ?? ''}
          </AppText>

          <View style={{height: 10}} />

          <AppText
            fontSize={theme.h6.size}
            fontWeight={theme.h6.fontWeight}
            regular
            Tcolor={theme.blackColor}
            textAlign={'left'}>
            {t('dashboard.sar')} {formatNumbers(item?.amount)}
          </AppText>
          <AppText
            fontSize={theme.c1.size}
            fontWeight={theme.c1.fontWeight}
            regular
            numberOfLines={2}
            Tcolor={theme.greyColor}
            textAlign={'left'}>
            {t(`myUnits.remainingAmount`)} {t('dashboard.sar')}{' '}
            {formatNumbers(item?.left)}
          </AppText>
        </View>
        <View style={{height: 15}} />
        <View
          style={{
            height: 30,
            borderColor: theme.primaryColor,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.whiteColor,
            borderRadius: 6,
          }}>
          <AppText
            regular
            fontSize={theme.p2.size}
            fontWeight={theme.p2.fontWeight}
            Tcolor={theme.primaryColor}
            textAlign={'center'}>
            {t('ViewTenant.viewDetails')}
          </AppText>
        </View>
      </CardWithShadow>
    </TouchableOpacity>
  );
};

const ComplaintCardItem = ({t, item, type}) => {
  return (
    <TouchableOpacity style={{width: 300}} activeOpacity={0.8}>
      <CardWithShadow>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-start',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <AppText
              fontSize={theme.c2.size}
              fontWeight={theme.c2.fontWeight}
              regular
              Tcolor={theme.blackColor}
              textAlign={'left'}>
              {`${t('Service Related')}`}
            </AppText>
            <View
              style={{
                backgroundColor:
                  item?.status === 1
                    ? `${theme.red}20`
                    : item?.status === 2
                    ? `${theme.orange}20`
                    : `${theme.primaryColor}20`,
                width: 60,
                height: 20,
                borderRadius: 4,
                justifyContent: 'center',
                // transform: [{scale: 0.8}],
              }}>
              <AppText
                fontSize={10}
                fontWeight={theme.c1.fontWeight}
                regular
                Tcolor={
                  item?.status === 1
                    ? `${theme.red}`
                    : item?.status === 2
                    ? `${theme.orange}`
                    : `${theme.primaryColor}`
                }
                textAlign={'center'}>
                {RequestStatusAsArray[item?.status - 1]}
              </AppText>
            </View>
          </View>

          <AppText
            fontSize={theme.c1.size}
            fontWeight={theme.c1.fontWeight}
            regular
            Tcolor={theme.greyColor}
            textAlign={'left'}>
            {item?.date ?? ''}
          </AppText>

          <View style={{height: 10}} />

          <AppText
            fontSize={theme.c1.size}
            fontWeight={theme.c1.fontWeight}
            regular
            numberOfLines={2}
            Tcolor={theme.greyColor}
            textAlign={'left'}>
            {item?.description ?? ''}
          </AppText>
        </View>
        <View style={{height: 15}} />
        <View
          style={{
            height: 30,
            borderColor: theme.primaryColor,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.whiteColor,
            borderRadius: 6,
          }}>
          <AppText
            regular
            fontSize={theme.p2.size}
            fontWeight={theme.p2.fontWeight}
            Tcolor={theme.primaryColor}
            textAlign={'center'}>
            {t('ViewTenant.viewDetails')}
          </AppText>
        </View>
      </CardWithShadow>
    </TouchableOpacity>
  );
};

const LeaseDetails = ({t, item, type, navigation}) => {
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: 20,
        }}>
        <AppText
          Tcolor={theme.primaryColor}
          regular={true}
          fontSize={theme.s1.size}
          fontWeight={theme.s1.fontWeight}
          textAlign={'left'}>
          {t('ViewTenant.Leases Details')}
        </AppText>
        {/* <TouchableOpacity
          onPress={() => {}}
          activeOpacity={0.5}
          style={{
            paddingHorizontal: 15,
            paddingVertical: 5,
            borderRadius: 6,
          }}>
          <AppText
            Tcolor={theme.primaryColor}
            regular={true}
            fontSize={theme.c1.size}
            fontWeight={theme.c1.fontWeight}
            textAlign={'left'}>
            {'View History'}
          </AppText>
        </TouchableOpacity> */}
      </View>
      <View style={{height: 20}} />
      <FlatList
        data={item?.rented_units || []}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={{width: item?.rented_units.length ? 20 : 0}} />
        )}
        ItemSeparatorComponent={() => (
          <View style={{width: item?.rented_units.length ? 20 : 0}} />
        )}
        renderItem={({item, index}) => (
          <LeaseCardItem
            key={item?.id}
            t={t}
            item={item}
            type={type}
            navigation={navigation}
          />
        )}
        keyExtractor={item => item?.id}
        ListEmptyComponent={
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              // width: '100%',
              width: Dimensions.get('window').width,
            }}>
            <NoData />
          </View>
        }
        ListFooterComponent={() => (
          <View style={{width: item?.rented_units.length ? 20 : 0}} />
        )}
      />
    </>
  );
};

const ActiveRequests = ({t, item, type, navigation}) => {
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: 20,
        }}>
        <AppText
          Tcolor={theme.primaryColor}
          regular={true}
          fontSize={theme.s1.size}
          fontWeight={theme.s1.fontWeight}
          textAlign={'left'}>
          {t('ViewTenant.Active Requests')}
        </AppText>
        <TouchableOpacity
          onPress={() => navigation.navigate('TenantRequestList', {
            item: item,
            type: type
          })}
          activeOpacity={0.5}
          style={{
            paddingHorizontal: 15,
            paddingVertical: 5,
            borderRadius: 6,
          }}>
          {!!item?.active_requests?.length && (
            <AppText
              Tcolor={theme.primaryColor}
              regular={true}
              fontSize={theme.c1.size}
              fontWeight={theme.c1.fontWeight}
              textAlign={'left'}>
              {t('ViewTenant.viewAll')} 
            </AppText>
          )}
        </TouchableOpacity>
      </View>
      <View style={{height: 20}} />
      <FlatList
        data={item?.active_requests ?? []}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={{width: item?.active_requests.length ? 20 : 0}} />
        )}
        ItemSeparatorComponent={() => (
          <View style={{width: item?.active_requests.length ? 20 : 0}} />
        )}
        renderItem={({item, index}) => (
          <RequestCardItem key={item?.id} t={t} item={item} type={type} />
        )}
        keyExtractor={item => item?.id}
        ListEmptyComponent={
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: Dimensions.get('window').width,
            }}>
            <NoData />
          </View>
        }
        ListFooterComponent={() => (
          <View style={{width: item?.active_requests.length ? 20 : 0}} />
        )}
      />
    </>
  );
};

const Transactions = ({t, item, type}) => {
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: 20,
        }}>
        <AppText
          Tcolor={theme.primaryColor}
          regular={true}
          fontSize={theme.s1.size}
          fontWeight={theme.s1.fontWeight}
          textAlign={'left'}>
          {t('ViewTenant.Transactions')}
        </AppText>
        <TouchableOpacity
          onPress={() => {}}
          activeOpacity={0.5}
          style={{
            paddingHorizontal: 15,
            paddingVertical: 5,
            borderRadius: 6,
          }}>
          {!!item?.transaction?.length && (
            <AppText
              Tcolor={theme.primaryColor}
              regular={true}
              fontSize={theme.c1.size}
              fontWeight={theme.c1.fontWeight}
              textAlign={'left'}>
              {t('common.viewHistory')}
            </AppText>
          )}
        </TouchableOpacity>
      </View>
      <View style={{height: 20}} />
      <FlatList
        data={item?.transaction ?? []}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={{width: item?.transaction.length ? 20 : 0}} />
        )}
        ItemSeparatorComponent={() => (
          <View style={{width: item?.transaction.length ? 20 : 0}} />
        )}
        renderItem={({item, index}) => (
          <TransactionCardItem key={item?.id} t={t} item={item} type={type} />
        )}
        keyExtractor={item => item?.id}
        ListEmptyComponent={
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: Dimensions.get('window').width,
            }}>
            <NoData />
          </View>
        }
        ListFooterComponent={() => (
          <View style={{width: item?.transaction.length ? 20 : 0}} />
        )}
      />
    </>
  );
};

const ActiveComplaints = ({t, item, type, navigation}) => {
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: 20,
        }}>
        <AppText
          Tcolor={theme.primaryColor}
          regular={true}
          fontSize={theme.s1.size}
          fontWeight={theme.s1.fontWeight}
          textAlign={'left'}>
          {t('ViewTenant.Active Complaints')}
        </AppText>
        <TouchableOpacity
          onPress={() => navigation.navigate('TenantComplaintLists', {
            item: item,
            type: type
          })}
          activeOpacity={0.5}
          style={{
            paddingHorizontal: 15,
            paddingVertical: 5,
            borderRadius: 6,
          }}>
          {!!item?.complains.length && (
            <AppText
              Tcolor={theme.primaryColor}
              regular={true}
              fontSize={theme.c1.size}
              fontWeight={theme.c1.fontWeight}
              textAlign={'left'}>
              {t('ViewTenant.complaints.viewAll')}
            </AppText>
          )}
        </TouchableOpacity>
      </View>
      <View style={{height: 20}} />
      <FlatList
        data={item?.complains ?? []}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={{width: item?.complains.length ? 20 : 0}} />
        )}
        ItemSeparatorComponent={() => (
          <View style={{width: item?.complains.length ? 20 : 0}} />
        )}
        renderItem={({item, index}) => (
          <ComplaintCardItem key={item?.id} t={t} item={item} type={type} />
        )}
        keyExtractor={item => item?.id}
        ListEmptyComponent={
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: Dimensions.get('window').width,
            }}>
            <NoData />
          </View>
        }
        ListFooterComponent={() => (
          <View style={{width: item?.complains.length ? 20 : 0}} />
        )}
      />
    </>
  );
};

const ViewTenent = ({navigation, route}) => {
  const {t} = useTranslation();
  const {type, item} = route.params;
  const query = useQuery('contact-details', () =>
    mngmtHttp
      .get(`/contacts/${item?.id}/all-details?role=CUSTOMER`)
      .then(response => response.data)
      .catch(e => console.log(e)),
  );
  useEffect(() => {
    navigation.addListener('focus', () => {
      // Screen was focused
      query.refetch();
    });
  }, []);

  return (
    <View style={styles.container}>
      <Header name={t('common.details')} navigation={navigation} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          paddingTop: 20,
        }}>
        <View style={{marginHorizontal: 20}}>
          <View style={{height: 20}} />
          <PersonalInformation
            t={t}
            item={query?.data?.data}
            type={type}
            navigation={navigation}
          />

          <View style={{height: 20}} />
        </View>
        {query.isFetching ? (
          <ActivityIndicator />
        ) : (
          <>
            <LeaseDetails
              t={t}
              item={query?.data?.data}
              type={type}
              navigation={navigation}
            />
            <View style={{height: 20}} />
            <ActiveRequests
              t={t}
              item={query?.data?.data}
              type={type}
              navigation={navigation}
            />
            <View style={{height: 20}} />
            <ActiveComplaints
              t={t}
              item={query?.data?.data}
              type={type}
              navigation={navigation}
            />
            <View style={{height: 20}} />
            <Transactions
              t={t}
              item={query?.data?.data}
              type={type}
              navigation={navigation}
            />
            <View style={{height: 20}} />
          </>
        )}
        {/* 
        <WorkingHours t={t} item={item} type={type} />
        <View style={{height: 20}} />
        <RequestsHistory t={t} item={item} type={type} onPress={() => {}} />
        <View style={{height: 20}} />
        <TotalEarnings t={t} item={item} type={type} onPress={() => {}} /> */}
        <View style={{height: 50}} />
      </ScrollView>
    </View>
  );
};

export default ViewTenent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },
});
