import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, Dimensions} from 'react-native';
// import {Picker} from '@react-native-picker/picker';
import {useTranslation} from 'react-i18next';
import Header from '../../../components/Header';
import AppText from '../../../components/AppText';
// import WhiteSpace from '../../../components/WhiteSpace';
import AppButton from '../../../components/AppButton';
import Scrollable from '../../../components/Scrollable';
import {theme} from '../../../utils/design';
import {mngmtHttp} from '../../../utils/http/Http';
import {AlertHelper} from '../../../utils/AlertHelper';
import {uploadImage} from '../../../utils/uploadImage';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ActivityIndicator} from 'react-native-paper';
import * as Role from '../../../utils/constants/Role';

const moment = require('moment');

const ReqTimeDate = ({route, navigation}) => {
  const {type, subtype, data, media, visitData} = route.params;
  const {t} = useTranslation();
  // const hoursArr = Array(12).keys();
  // const minArr = Array(6).keys();

  const [isLoading, setLoading] = useState(false);
  const [availableHours, setAvailableHours] = useState([
    '9 AM',
    '10 AM',
    '11 AM',
    '12 PM',
    '4 PM',
    '5 PM',
    '6 PM',
    '7 PM',
    '8 PM',
    '9 PM',
    '10 PM',
    '',
  ]);

  const [selectedTime, setSelectedTime] = useState(availableHours[0]);
  // const [hourType, setHourType] = useState('PM');
  // const [hour, setHour] = useState('9');
  // const [min, setMin] = useState('00');
  const [day, setDay] = useState(0);

  const getDaysArray = function (start, end) {
    for (
      var arr = [], dt = new Date(start);
      dt <= end;
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(new Date(dt));
    }
    return arr;
  };

  const today = new Date();
  const tomorrow = new Date(today);
  const end = new Date(today);
  tomorrow.setDate(tomorrow.getDate());
  end.setDate(end.getDate() + 6);
  const dayslist = getDaysArray(tomorrow, end);

  const convertHour24 = hour => {
    let hourType = hour.split(' ')[1];
    hour = hour.split(' ')[0];
    if (hourType == 'PM') {
      if (hour < 12) return +hour + 12;
      else return hour;
    } else if (hourType == 'AM') {
      if (hour == 12) return '00';
      else if (hour < 10) return `0${hour}`;
      else return hour;
    }
  };

  const handlePress = async () => {
    const moment = require('moment');
    const hour24 = convertHour24(selectedTime);
    setLoading(true);

    try {
      // for visit request
      if (!!visitData) {
        setLoading(true);

        for (let i = 0; i < visitData.visitor.length; i++) {
          const visitor = visitData.visitor[i];
          await mngmtHttp.post('/requests', {
            // ...data,
            type: type,
            date: visitData?.is_urgent
              ? `${moment(today).format('YYYY-MM-DD')} ${moment(today).format(
                  'HH',
                )}:00`
              : `${moment(dayslist[day]).format('YYYY-MM-DD')} ${hour24}:00`,
            first_name: visitor?.fName,
            last_name: visitor?.lName,
            phone_number: visitor?.mobile,
            national_id: visitor?.nationalID,
            model_id: visitData?.model_id,
            terms_and_conditions: true,
            model_type:
              visitData?.model_type === 'COMMUNITY' ? 'community' : 'property',
          });
        }
        AlertHelper.showMessage('success', 'Request Submitted');
        setLoading(false);
        if (!Role.Tenant) {
          navigation.replace('ListRequests');
        }else if(Role.Management){
          navigation.navigate('ListRequests')
        } else {
          navigation.goBack();
          navigation.goBack();
        }
        //
      } else {
        // if the request is not visit request
        await mngmtHttp
          .post('/requests', {
            ...data,
            type: type,
            date: data?.is_urgent
              ? `${moment(today).format('YYYY-MM-DD')} ${moment(today).format(
                  'HH',
                )}:00`
              : `${moment(dayslist[day]).format('YYYY-MM-DD')} ${hour24}:00`,
            subtype: subtype,
            first_name: visitData?.fName,
            last_name: visitData?.lName,
            phone_number: visitData?.mobile,
            national_id: visitData?.nationalID,
            model_id: data?.model_id || visitData?.model_id,
            model_type:
              data?.model_type === 'COMMUNITY' ? 'community' : 'property',
            ...visitData,
          })
          .then(async response => {
            if (!!media?.length) {
              uploadImage(media, 'request', response.data.data.id, () => {
                setLoading(false);
                route.params?.dashboard
                  ? navigation.replace('Dashboard')
                  : navigation.replace('ListRequests');
              });
            } else {
              setLoading(false);
              route.params?.dashboard
                ? navigation.replace('Dashboard')
                : navigation.replace('ListRequests');
            }
          });
      }
    } catch (error) {
      setLoading(false);
      // crashlytics().recordError(error);
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        AlertHelper.show('error', t('common.error'), error);
      }
    }
  };

  const TimeItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => !!item && setSelectedTime(item)}
        style={{
          height: 40,
          width: (Dimensions.get('window').width + 12) / 5,
          backgroundColor:
            selectedTime == item ? theme.primaryColor : '#F4FBF9',
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: '#DBF5EE',
          marginVertical: 4,
          marginRight: (index + 1) % 4 !== 0 ? 8 : 0,
        }}>
        <Text
          style={{
            color: selectedTime == item ? theme.whiteColor : theme.primaryColor,
            fontWeight: theme.s1.fontWeight,
            fontSize: theme.s1.size,
          }}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const DateItem = ({item, index}) => {
    let date = item.toString().split(' ');
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            setDay(index);
          }}
          style={{
            height: 80,
            width: 90,
            borderRadius: 16,
            backgroundColor: day == index ? theme.primaryColor : '#F4FBF9',
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: '#DBF5EE',
            // borderWidth: day != index ? 1 : 0,
            // shadowColor: '#14935C',
            // shadowOffset: {width: 0, height: 2},
            // shadowOpacity: day == index && 0.29,
            // shadowRadius: 5,
          }}>
          <Text
            style={{
              marginVertical: 1,
              color: day == index ? theme.whiteColor : theme.primaryColor,
              fontWeight: theme.s1.fontWeight,
              fontSize: theme.h6.size,
            }}>
            {t(`dates.${date[0]}`).toUpperCase()}
          </Text>
          <Text
            style={{
              marginVertical: 1,
              color: day == index ? theme.whiteColor : theme.greyColor,
              fontWeight: theme.p1.fontWeight,
              fontSize: theme.p2.size,
            }}>
            {date[2]} {date[1]}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const AppDate = () => {
    return (
      <View style={{}}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={dayslist}
          contentContainerStyle={{
            alignItems: 'center',
          }}
          renderItem={DateItem}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={() => <View style={{width: 20}} />}
          ListFooterComponent={() => <View style={{width: 20}} />}
          ItemSeparatorComponent={() => <View style={{width: 15}} />}
        />
      </View>
    );
  };

  const AppTime = () => {
    return (
      <View
        style={{
          flexWrap: 'wrap',
          flexDirection: 'row',
          justifyContent: 'flex-start',
        }}>
        {availableHours.map((item, idx) => (
          <TimeItem key={idx} item={item} index={idx} />
        ))}
      </View>
    );
  };

  useEffect(() => {
    data?.is_urgent ? handlePress() : null;
  }, []);
  //
  useEffect(() => {
    let allHours = [];
    for (let index = 0; index < 24; index++) {
      const element = 24;
      allHours = [...allHours, moment(`${index}:00`, ['HH:mm']).format('h A')];
    }
    if (day == 0) {
      allHours = allHours.slice(allHours.indexOf(moment().format('h A')) + 1);
    }
    setAvailableHours([...allHours]);
  }, [day]);

  // this is for the vi
  if (data?.is_urgent) {
    return (
      <Scrollable>
        <Header name={t('reqTimeDate.title')} navigation={navigation} />
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <ActivityIndicator animating={true} color={theme.primaryColor} />
        </View>
      </Scrollable>
    );
  }
  return (
    <Scrollable>
      <Header name={t('reqTimeDate.title')} navigation={navigation} />
      <View style={styles.body}>
        <View style={styles.titleContainer}>
          <AppText
            regular
            fontSize={theme.subTitleFontSize}
            Tcolor={theme.blackColor}
            style={{alignSelf: 'center'}}
            textAlign={'center'}>
            {type !== 4
              ? t('reqTimeDate.message')
              : t('reqTimeDate.messageVisit')}
          </AppText>
        </View>
        <View style={styles.timeDateContainer}>
          <View style={styles.dateContainer}>
            <View style={{marginHorizontal: 20}}>
              <AppText
                regular
                fontSize={theme.p1.size}
                fontWeight={theme.p1.fontWeight}
                Tcolor={theme.blackColor}
                textAlign={'left'}>
                {t('reqTimeDate.date')}
              </AppText>
            </View>
            <View style={{height: 20}} />
            <AppDate />
          </View>

          <View style={styles.dateContainer}>
            <View style={{marginHorizontal: 20}}>
              <AppText
                regular
                fontSize={theme.p1.size}
                fontWeight={theme.p1.fontWeight}
                Tcolor={theme.blackColor}
                textAlign={'left'}>
                {t('reqTimeDate.time')}
              </AppText>

              <View style={{height: 20}} />

              <AppTime />
            </View>
          </View>
        </View>
        <View style={styles.btnContainer}>
          <AppButton
            title={t('reqTimeDate.submit')}
            onPress={handlePress}
            Bcolor={theme.primaryColor}
            Tcolor={theme.whiteColor}
            loading={isLoading}
            rounded={8}
          />
        </View>
      </View>
    </Scrollable>
  );
};

export default ReqTimeDate;

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  titleContainer: {
    marginHorizontal: 40,
    paddingVertical: 20,
    justifyContent: 'center',
  },
  dateContainer: {
    justifyContent: 'center',
    paddingVertical: 20,
  },
  timeContainer: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
  timeDateContainer: {
    flex: 3,
    justifyContent: 'center',
    alignContent: 'center',
  },
  btnContainer: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
});
