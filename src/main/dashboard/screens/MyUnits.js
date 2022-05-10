import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Text,
  Linking,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';
import config from 'react-native-ultimate-config';
import {useDispatch, useSelector} from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import AppText from '../../../components/AppText';
import NoData from '../../../components/NoData';
import AppButton from '../../../components/AppButton';
import {mngmtHttp} from '../../../utils/http/Http';
import {HP, theme, WP} from '../../../utils/design';
import {setLoading} from '../../../redux/misc';
import {RequestType} from '../../../utils/constants/RequestType';
import DashboardIconTextCard from '../../requests/components/DashboardIconTextCard';
import Announcements from '../../announcements/screens/Announcements';

const icons = [
  require('../../../../assets/images/images/maintenance-01.png'),
  require('../../../../assets/images/images/housecleaning-01.png'),
  require('../../../../assets/images/images/carcleaning-01.png'),
  require('../../../../assets/images/images/visitoraccess-01.png'),
  require('../../../../assets/images/images/atariconsnew-03.png'),
];
const colors = [
  '#E9FBFF',
  '#FDFBEB',
  '#FEF7F0',
  '#F3F9FF',
  '#F6F6FF',
  '#E9FBFF',
  '#FDFBEB',
  '#FEF7F0',
  '#F3F9FF',
  '#F6F6FF',
];

const RequestsCard = ({title, data, navigation, type}) => {
  const {t} = useTranslation();
  return (
    <View style={styles.paymentsContainer}>
      <View style={styles.titleContainer}>
        <AppText
          Tcolor={theme.primaryColor}
          textAlign={'center'}
          fontSize={theme.titleFontSize}>
          {title}
        </AppText>
      </View>
      <ScrollView showsHorizontalScrollIndicator={false} horizontal>
        <View style={styles.paymentsCardsContainer}>
          {Object.entries(RequestType)
            .filter(item => item[0] !== 'Complaint')
            .map((item, index) => (
              <DashboardIconTextCard
                key={index}
                prev={'NewRequest'}
                navigation={navigation}
                item={item}
                image={icons[index]}
                backgroundColor={colors[index]}
              />
            ))}
          <View style={{width: 20}} />
        </View>
      </ScrollView>
    </View>
  );
};

const Requests = ({title, data, navigation, type}) => {
  const {t} = useTranslation();

  return (
    <View style={styles.requestsContainer}>
      <View style={styles.titleContainer}>
        <AppText
          Tcolor={theme.primaryColor}
          textAlign={'center'}
          fontSize={theme.titleFontSize}>
          {title}
        </AppText>
      </View>
      <View style={styles.requestsCardsContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              type === 'Requests' ? 'NewRequest' : 'Complaints',
              {
                screen: 'CreateComplaint',
              },
            )
          }
          style={styles.requestsCardWithShadow}>
          <View style={[styles.iconContainer, styles.iconContainerWithShadow]}>
            <FontAwesome
              name={'plus'}
              color={theme.whiteColor}
              size={theme.iconSize + 10}
            />
          </View>
          <AppText
            Tcolor={theme.blackColor}
            textAlign={'center'}
            fontSize={theme.titleFontSize}>
            {t('myUnits.addNew')}
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Complaints', {screen: 'ListComplaints'})
          }
          style={styles.requestsCardNormal}>
          <AppText Tcolor={'#006584'} textAlign={'center'} fontSize={60}>
            {`${data}`}
          </AppText>
          <AppText
            Tcolor={'#006584'}
            textAlign={'center'}
            fontSize={theme.titleFontSize}>
            {t('myUnits.viewHistory')}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const MyLeases = ({query}) => {
  const {t} = useTranslation();
  return (
    <View>
      <View style={styles.titleContainer}>
        <AppText
          Tcolor={theme.primaryColor}
          textAlign={'center'}
          fontSize={theme.titleFontSize}>
          {t('myUnits.myLeases')}
        </AppText>
      </View>
      {query?.data.map((item, idx) => {
        return (
          <View key={idx}>
            <LeaseCard item={item} />
            {query?.data?.length != idx + 1 && <View style={{height: 20}} />}
          </View>
        );
      })}
      {/* <FlatList
        data={query.data}
        renderItem={({item}) => <LeaseCard item={item} />}
        keyExtractor={(item, idx) => idx}
        ItemSeparatorComponent={() => <View style={{height: 20}} />}
      /> */}
    </View>
  );
};

const LeaseCard = ({item}) => {
  const {t} = useTranslation();
  //TODO this should be fix and done on the backend side.
  const linkToClick = item?.lease?.contract?.url ?? '';

  return (
    <View style={styles.leaseCardContainer}>
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1}}>
          <AppText
            Tcolor={theme.greyColor}
            textAlign={'left'}
            fontSize={theme.subTitleFontSize}
            style={{
              fontFamily: null,
            }}>
            {t('properties.add_unit.unitNumber')}
          </AppText>
          <AppText Tcolor={theme.blackColor} textAlign={'left'} fontSize={16}>
            {`${item?.name}`}
          </AppText>
        </View>
        <View style={{flex: 1}}>
          <AppText
            Tcolor={theme.greyColor}
            textAlign={'right'}
            fontSize={theme.subTitleFontSize}>
            {`${item?.building?.name || ''}`}
          </AppText>
          <AppText Tcolor={theme.blackColor} textAlign={'right'} fontSize={16}>
            {`${item?.community?.name || ''}`}
          </AppText>
        </View>
      </View>
      <View style={{paddingTop: 16}}>
        <AppText
          Tcolor={theme.greyColor}
          textAlign={'left'}
          fontSize={theme.subTitleFontSize}
          style={{
            fontFamily: null,
          }}>
          {t('myUnits.location')}
        </AppText>
      </View>
      <View style={styles.locationContainer}>
        <FontAwesome
          name={'map-marker-alt'}
          color={theme.primaryColor}
          size={theme.iconSize}
        />
        <AppText
          style={{marginLeft: 10}}
          Tcolor={theme.blackColor}
          textAlign={'right'}
          fontSize={theme.titleFontSize}>
          {`${item?.city?.name}, ${item?.district?.name}`}
        </AppText>
      </View>
      <View style={styles.leaseInfoContainer}>
        <View style={{flex: 1}}>
          <View
            style={{
              justifyContent: 'space-evenly',
              flex: 1,
            }}>
            <AppText
              Tcolor={theme.greyColor}
              textAlign={'left'}
              fontSize={theme.subTitleFontSize}>
              {t('myUnits.startDate')}
            </AppText>
            <AppText
              Tcolor={'#2A3D47'}
              textAlign={'left'}
              fontSize={theme.titleFontSizetitleFontSize}>
              {`${item?.lease.start_date}`}
            </AppText>
          </View>
        </View>
        <View style={{flex: 1}}>
          <View
            style={{
              justifyContent: 'space-evenly',
              flex: 1,
            }}>
            <AppText
              Tcolor={theme.greyColor}
              textAlign={'left'}
              fontSize={theme.subTitleFontSize}>
              {t('myUnits.endDate')}
            </AppText>
            <AppText
              Tcolor={'#2A3D47'}
              textAlign={'left'}
              fontSize={theme.titleFontSize}>
              {`${item?.lease.end_date}`}
            </AppText>
          </View>
        </View>
        {/* <View style={{flex: 1}}>
                  <View
                    style={{
                      justifyContent: 'space-around',
                      flex: 1,
                    }}>
                    <AppText
                      Tcolor={'#2A3D47'}
                      textAlign={'left'}
                      fontSize={14}>
                      {`Period`}
                    </AppText>
                    <AppText
                      Tcolor={'#2A3D47'}
                      textAlign={'left'}
                      fontSize={13}>
                      {
                        PaymentCycle.find(
                          ({id}) => item.lease?.billing_cycle == id,
                        )?.name
                      }
                    </AppText>
                  </View>
                </View> */}
      </View>
      <View style={{flex: 1}}>
        <View style={styles.btnContainer}>
          <AppButton
            title={t('myUnits.viewContract')}
            Bcolor={linkToClick ? theme.primaryColor : '#7c7c7c'}
            Tcolor={theme.whiteColor}
            rounded={8}
            style={{
              width: WP(80),
              height: HP(5),
              alignSelf: 'center',
            }}
            onPress={() => linkToClick && Linking.openURL(linkToClick)}
          />
        </View>
      </View>
    </View>
  );
};

const PaymentCard = ({payment}) => {
  const {t} = useTranslation();

  const summaryItemColor = {
    paid: '#5FCA83',
    outstanding: '#F2A83F',
    overdue: '#EA3325',
  };
  const colorsData = {
    outstanding: {
      backgroudColor: '#FDFBEB',
      titleColor: '#2A3D47',
      badge: {
        borderColor: '#FFA412',
        textColor: '#FFA412',
      },
    },
    paid: {
      backgroudColor: '#EBFFF7',
      titleColor: '#2A3D47',
      badge: {
        borderColor: '#22AA6F',
        textColor: '#22AA6F',
      },
    },
    overdue: {
      backgroudColor: '#FEF0F0',
      titleColor: '#2A3D47',
      badge: {
        borderColor: '#FF0000',
        textColor: '#FF0000',
      },
    },
  };

  return (
    <View
      style={[
        styles.paymentCardContainer,
        {backgroundColor: colorsData[payment.type]?.backgroudColor ?? '#eee'},
      ]}>
      <View style={[styles.paymentCardTitle, {flexDirection: 'row'}]}>
        <View style={{width: 150}}>
          <AppText
            Tcolor={theme.primaryColor}
            textAlign={'left'}
            fontSize={theme.titleFontSize}>
            {`${payment.category.name}`}
          </AppText>
          <AppText
            Tcolor={theme.greyColor}
            textAlign={'left'}
            style={{fontFamily: null, fontWeight: '500'}}
            fontSize={theme.subTitleFontSize}>
            {`${payment.subcategory.name}`}
          </AppText>
        </View>
        <View>
          <View
            style={{
              // height: 20,
              marginHorizontal: 20,
              borderWidth: 1,
              borderRadius: 5,
              borderColor: colorsData[payment.type].badge.borderColor,
            }}>
            <AppText
              Tcolor={colorsData[payment.type].badge.textColor}
              textAlign={'left'}
              style={{
                fontFamily: null,
                // fontSize: 11,
                // marginVertical: 4,
                paddingVertical: 4,
                // paddingHorizontal: 10,
              }}
              fontSize={10}>
              {`${payment.type}`.toUpperCase()}
            </AppText>
          </View>
        </View>
      </View>
      <View style={styles.paymentCardDetails}>
        <View style={styles.paymentCardDetailsRow}>
          <AppText Tcolor={theme.greyColor} textAlign={'left'} fontSize={12}>
            {t('myUnits.invoice_amount')}
          </AppText>
          <AppText Tcolor={theme.blackColor} textAlign={'left'} fontSize={11}>
            {`${t('dashboard.sar')} ${payment.amount_fmt}`}
          </AppText>
        </View>
        <View style={styles.paymentCardDetailsRow}>
          <AppText Tcolor={theme.greyColor} textAlign={'left'} fontSize={12}>
            {t('myUnits.issuance_date')}
          </AppText>
          <AppText Tcolor={theme.blackColor} textAlign={'left'} fontSize={11}>
            {`${payment.created_at}`}
          </AppText>
        </View>
        <View style={styles.paymentCardDetailsRow}>
          <AppText Tcolor={theme.greyColor} textAlign={'left'} fontSize={12}>
            {t('myUnits.due_date')}
          </AppText>
          <AppText Tcolor={theme.blackColor} textAlign={'left'} fontSize={11}>
            {`${payment.due_on}`}
          </AppText>
        </View>
        <View style={styles.paymentCardDetailsRow}>
          <AppText Tcolor={theme.greyColor} textAlign={'left'} fontSize={12}>
            {t('myUnits.amount_remaining')}
          </AppText>
          <AppText Tcolor={theme.blackColor} textAlign={'left'} fontSize={11}>
            {`${t('dashboard.sar')} ${payment.left_fmt}`}
          </AppText>
        </View>
      </View>
      <View style={styles.paymentCardBtnContainer}>
        <TouchableOpacity
          style={{
            width: 110,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            borderColor: theme.primaryColor,
            borderWidth: 1,
          }}>
          <Text
            style={{
              color: theme.primaryColor,
              fontFamily: null,
              fontWeight: '500',
              fontSize: 12,
            }}>
            View Invoice
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: theme.primaryColor,
            width: 110,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
          }}>
          <Text
            style={{
              color: theme.whiteColor,
              fontFamily: null,
              fontWeight: '500',
              fontSize: 12,
            }}>
            Pay Now
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          activeOpacity={1}
          style={{
            width: '60%',
            height: 40,
            backgroundColor:
              payment.type == 'overdue'
                ? summaryItemColor.overdue
                : payment.type == 'paid'
                ? summaryItemColor.paid
                : summaryItemColor.outstanding,
            borderRadius: 6,
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          {payment.left > 0 ? (
            <AppText Tcolor={theme.whiteColor} fontSize={14}>
              {t('accounting.overdue')}
            </AppText>
          ) : (
            <AppText Tcolor={theme.whiteColor} fontSize={14}>
              {t('accounting.paid')}
            </AppText>
          )}
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const Payments = ({data}) => {
  const {t} = useTranslation();

  // const backgroudColor = ['#EBFFF7', '#EEEDFF', '#EBF3FA'];

  const renderItem = payment => {
    return <PaymentCard payment={payment} />;
  };
  // const renderItem = ({item}) => <Item title={item.title} />;
  const separator = () => <View style={{width: 20}} />;

  return (
    <View style={styles.paymentsContainer}>
      <View style={styles.titleContainer}>
        <AppText
          Tcolor={theme.primaryColor}
          textAlign={'center'}
          fontSize={theme.titleFontSize}>
          {t('myUnits.payments')}
        </AppText>
      </View>

      <View style={styles.paymentsCardsContainer}>
        {/* <PaymentCard item={0} /> */}
        {/* <PaymentCard item={1} /> */}
        {data.length ? (
          <FlatList
            horizontal
            data={data}
            ListHeaderComponent={separator}
            ListFooterComponent={separator}
            renderItem={({item}) => renderItem(item)}
            keyExtractor={(item, idx) => item.id + idx}
            ItemSeparatorComponent={separator}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <NoData />
        )}
      </View>
    </View>
  );
};

const PropertyManager = ({data}) => {
  const {t} = useTranslation();

  return (
    <View style={styles.propertyManagerContainer}>
      <View style={styles.titleContainer}>
        <AppText Tcolor={'#24B97F'} textAlign={'center'} fontSize={18}>
          {t('myUnits.myPropertyManager')}
        </AppText>
      </View>
      <View style={styles.propertyManagerCard}>
        <View style={styles.propertyManagerCardHeader}>
          <View style={styles.propertyManagerCardHeaderIconContainer}>
            <FontAwesome
              name={'user-alt'}
              // color={'#24B97F'}
              color={'#F5F5F5'}
              size={theme.iconSize + 5}
            />
          </View>
          <View>
            <AppText Tcolor={'#2A3D47'} textAlign={'left'} fontSize={16}>
              {`${data.name}`}
            </AppText>
            <View style={{height: 7}} />
            <AppText Tcolor={'#2A3D47'} textAlign={'left'} fontSize={14}>
              {`${data.company_name}`}
            </AppText>
          </View>
        </View>
        <View
          style={{
            height: 1,
            borderColor: '#18233210',
            borderWidth: 1,
            // marginVertical: 10,
          }}
        />
        <View style={styles.propertyManagerCardBody}>
          <View style={styles.propertyManagerCardBtn}>
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${data.phone_number}`)}
              style={{
                width: '45%',
                height: 40,
                backgroundColor: '#24B97F',
                borderRadius: 6,
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <FontAwesome
                name={'phone'}
                // color={'#24B97F'}
                color={'#F5F5F5'}
                size={theme.iconSize - 5}
              />
              <AppText Tcolor={theme.whiteColor} fontSize={12}>
                {t(`myUnits.call`)}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL(`sms:${data.phone_number}`)}
              style={{
                width: '45%',
                height: 40,
                backgroundColor: '#2C2790',
                borderRadius: 6,
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <FontAwesome
                name={'envelope'}
                // color={'#24B97F'}
                color={'#F5F5F5'}
                size={theme.iconSize - 5}
              />
              <AppText Tcolor={theme.whiteColor} fontSize={12}>
                {t('myUnits.message')}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const SecurityDeposits = data => {
  const {t} = useTranslation();

  return (
    <View style={styles.securityDepositsContainer}>
      <View style={styles.titleContainer}>
        <AppText Tcolor={'#24B97F'} textAlign={'center'} fontSize={18}>
          {t('myUnits.securityDeposit')}
        </AppText>
      </View>
      <View style={styles.securityDepositsContainerCard}>
        <AppText Tcolor={'#2B478B'} textAlign={'left'} fontSize={24}>
          {`${t('dashboard.sar')} ${Math.floor(
            data.data,
          ).toLocaleString('en-SA', {maximumFractionDigits: 0})}`}
        </AppText>
        <Image
          resizeMode={'contain'}
          style={styles.nodataImage}
          source={require('../../../../assets/images/images/dashboard-deposit.png')}
        />
      </View>
    </View>
  );
};

const MyUnits = ({navigation}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const userData = useSelector(state => state.user.data);

  const query = useQuery(`MyUnits`, () =>
    mngmtHttp.get(`/dashboard/my-units`).then(response => response.data.data),
  );
  const myOverview = useQuery('MyOverview', () =>
    mngmtHttp
      .get('/dashboard/tenant-overview')
      .then(response => response.data.data),
  );
  const myPayments = useQuery('MyPayments', () =>
    mngmtHttp
      .get('/dashboard/my-payments')
      .then(response => response.data.data),
  );
  const totalDeposit = useQuery('TotalDeposit', () =>
    mngmtHttp
      .get('/dashboard/my-total-deposit')
      .then(response => response.data.data),
  );
  useEffect(() => {
    dispatch(setLoading(query.isLoading));
    dispatch(setLoading(myOverview.isLoading));
    dispatch(setLoading(myPayments.isLoading));
    dispatch(setLoading(totalDeposit.isLoading));
  }, [
    query.isLoading,
    myOverview.isLoading,
    myPayments.isLoading,
    totalDeposit.isLoading,
  ]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // // Screen was focused
      // // dispatch(setLoading(true));
      if (
        !!query?.isFetched &&
        !!userData?.isFetched &&
        !!myOverview?.isFetched &&
        !!myPayments?.isFetched &&
        !!totalDeposit?.isFetched
      ) {
        query.refetch();
        userData.refetch();
        myOverview.refetch();
        myPayments.refetch();
        totalDeposit.refetch();
      }
      myOverview.refetch();
    });
  }, []);
  const propertyMngr = JSON.parse(userData.tenant_info[2]?.value || '{}');
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* <View style={styles.userCardContainer}>
          <View style={styles.cardNameContainer}>
            <AppText
              Tcolor={theme.whiteColor}
              textAlign={'left'}
              fontSize={theme.titleFontSize}>
              {t('myUnits.hello')},
            </AppText>
            <AppText
              Tcolor={theme.whiteColor}
              textAlign={'left'}
              fontSize={theme.superTitleFontSize * 1.5}>
              {`${userData?.name.split(' ')[0]}`}
            </AppText>
          </View>
          {/* <View style={styles.cardImageContainer}>
            <View style={styles.iconContainer}>
              <FontAwesome
                name={'user-alt'}
                color={theme.primaryColor}
                size={theme.iconSize + 10}
              />
            </View>
          </View> *
        </View> */}

        {/* <------- Annnouncement Headers -------> */}
        <View style={styles.headerContainer}>
          <AppText
            Tcolor={theme.primaryColor}
            regular={true}
            fontSize={theme.s1.size}
            fontWeight={theme.s1.fontWeight}
            textAlign={'left'}>
            {t('dashboard.announcements.title')}
          </AppText>
          <TouchableOpacity
            onPress={() => navigation.navigate('AllAnnouncements')}>
            <AppText
              Tcolor={theme.primaryColor}
              regular={true}
              fontSize={theme.s1.size}
              fontWeight={theme.s1.fontWeight}
              textAlign={'left'}>
              {t('dashboard.announcements.viewAll')}
            </AppText>
          </TouchableOpacity>
        </View>
        <Announcements />
        {query?.data?.length > 0 ? (
          <>
            <MyLeases query={query} />
            <View style={{height: 10}} />

            {myOverview?.data ? (
              <>
                <RequestsCard
                  title={t('myUnits.requests')}
                  data={myOverview.data?.requests_count}
                  navigation={navigation}
                  type={'Requests'}
                />
                <Requests
                  title={t('myUnits.complaints')}
                  data={myOverview.data?.complaints_count}
                  navigation={navigation}
                  type={'Complaints'}
                />
                <View style={{height: 30}} />

                {myPayments?.data && <Payments data={myPayments?.data} />}
                {/* <PropertyManager
                  data={
                    Object.keys(propertyMngr).length !== 0
                      ? propertyMngr
                      : myOverview.data.manager_details
                  }
                  // porpertyManager={{}}
                /> */}
                {/* <SecurityDeposits data={totalDeposit?.data} /> */}
                <View style={{height: 60}} />
              </>
            ) : (
              <NoData />
            )}
            {/* <Requests title={'Requests'} /> */}
            {/* <Payments /> */}
            {/* <PropertyManager /> */}
            {/* <Requests title={'Complaints'} /> */}
            {/* <SecurityDeposits /> */}
            {/* <View style={{height: 30}} /> */}
          </>
        ) : (
          <View
            style={{
              flex: 1,
              backgroudColor: 'pink',
              height: 300,
              width: '100%',
              justifyContent: 'center',
              alignContent: 'center',
            }}>
            <NoData />
          </View>
        )}

        {/* <AppText Tcolor={theme.blackColor} fontSize={theme.superTitleFontSize}>
        {t('dashboard.myUnits.personalInfo')}
      </AppText>
      <AppTextInput editable={false} defaultValue={userData?.name} />
      <AppTextInput editable={false} defaultValue={userData?.phone_number} />
      <AppTextInput
        editable={false}
        defaultValue={userData?.email ? userData?.email : '-'}
      />
      <AppText Tcolor={theme.blackColor} fontSize={theme.superTitleFontSize}>
        {t('dashboard.myUnits.title')}
      </AppText>
      {query.data?.length > 0 ? (
        <AppFlatList data={query.data} renderItem={UnitItem} />
      ) : (
        <NoData />
      )} */}
      </View>
    </ScrollView>
  );
};

export default MyUnits;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },
  userCardContainer: {
    backgroundColor: theme.primaryColor,
    height: HP(14),
    marginTop: HP(1),
    borderRadius: 10,
    marginHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignContent: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  cardNameContainer: {flex: 3},
  cardImageContainer: {flex: 1},
  iconContainer: {
    backgroundColor: '#f5f5f5',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    marginTop: HP(3),
    marginBottom: HP(2),
  },
  leaseCardContainer: {
    height: HP(28),
    marginHorizontal: 22,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingVertical: 18,
  },
  locationContainer: {
    // justifyContent:""
    flexDirection: 'row',
    paddingHorizontal: 20,
    // paddingVertical: 15,
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
  },
  leaseInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    marginBottom: 8,
  },
  btnContainer: {
    flex: 2,
    alignItems: 'flex-end',
  },
  requestsContainer: {
    marginHorizontal: 22,
  },
  requestsCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  requestsCardWithShadow: {
    width: '48%',
    height: 150,
    paddingBottom: 5,
    backgroundColor: '#EBFFF7',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerWithShadow: {
    backgroundColor: theme.primaryColor,
    marginBottom: 10,
    shadowColor: 'rgba(65, 201, 142, 0.3)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  },
  requestsCardNormal: {
    width: '48%',
    height: 150,
    backgroundColor: '#E2F8FF',
    borderRadius: 10,
    justifyContent: 'center',
  },
  paymentsContainer: {
    // marginHorizontal: 20,
  },
  paymentsCardsContainer: {
    flexDirection: 'row',
    height: 200,
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  paymentCardContainer: {
    height: 200,
    paddingVertical: 18,
    justifyContent: 'space-between',
    borderRadius: 10,
  },
  paymentCardTitle: {
    // height: '25%',
    justifyContent: 'space-between',
  },
  paymentCardDetails: {
    // height: '25%',
    justifyContent: 'space-between',
  },
  paymentCardDetailsRow: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  paymentCardBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  propertyManagerContainer: {
    marginHorizontal: 22,
  },
  propertyManagerCard: {
    height: 160,
    backgroundColor: '#F5F5F5',
    borderColor: '#D8DBDE',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 21,
    justifyContent: 'space-between',
  },
  propertyManagerCardHeader: {
    flexDirection: 'row',
    // justifyContent: 'center',
    // alignContent: 'center',
    alignItems: 'center',
  },
  propertyManagerCardHeaderIconContainer: {
    backgroundColor: '#24B97F',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  propertyManagerCardBtn: {
    justifyContent: 'space-evenly',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  securityDepositsContainer: {
    marginHorizontal: 20,
  },
  securityDepositsContainerCard: {
    backgroundColor: '#EBF3FA',
    height: 160,
    borderWidth: 1,
    borderColor: '#C0D8FB',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
  },
});
