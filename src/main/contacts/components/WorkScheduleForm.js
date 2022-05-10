import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {theme} from '../../../utils/design';
import AppText from '../../../components/AppText';
import AppTextInputController from '../../../components/controlled/AppTextInputController';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TimeSelectOverlay from '../../../drawer/settings/components/TimeSelectOverlay';

//

const moment = require('moment');

const HOURS = [
  {id: 0, name: '12 AM'},
  {id: 1, name: '01 AM'},
  {id: 2, name: '02 AM'},
  {id: 3, name: '03 AM'},
  {id: 4, name: '04 AM'},
  {id: 5, name: '05 AM'},
  {id: 6, name: '06 AM'},
  {id: 7, name: '07 AM'},
  {id: 8, name: '08 AM'},
  {id: 9, name: '09 AM'},
  {id: 10, name: '10 AM'},
  {id: 11, name: '11 AM'},
  {id: 12, name: '12 PM'},
  {id: 13, name: '01 PM'},
  {id: 14, name: '02 PM'},
  {id: 15, name: '03 PM'},
  {id: 16, name: '04 PM'},
  {id: 17, name: '05 PM'},
  {id: 18, name: '06 PM'},
  {id: 19, name: '07 PM'},
  {id: 20, name: '08 PM'},
  {id: 21, name: '09 PM'},
  {id: 22, name: '10 PM'},
  {id: 23, name: '11 PM'},
];

const TimeElement = ({time = '', onPress = () => {}}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(time)}
      style={{
        borderBottomWidth: 0.2,
        borderBottomColor: theme.greyColor,
        paddingVertical: 10,
      }}>
      <AppText
        regular
        fontSize={theme.s1.size}
        fontWeight={theme.s1.fontWeight}
        Tcolor={theme.blackColor}
        textAlign={'center'}>
        {time}
      </AppText>
    </TouchableOpacity>
  );
};

const DayItem = ({day, setSelectedDays, selectedDays}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => {
        const updatedDays = {...selectedDays};
        updatedDays[day] = !updatedDays[day];
        setSelectedDays({...updatedDays});
      }}
      style={{
        height: 40,
        width: 80,
        marginRight: 7,
        backgroundColor: selectedDays[day] ? theme.primaryColor : '#F4FBF9',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#DBF5EE',
        marginVertical: 4,
      }}>
      <AppText
        style={{
          color: selectedDays[day] ? theme.whiteColor : theme.primaryColor,
          fontWeight: theme.s1.fontWeight,
          fontSize: theme.s1.size,
        }}>
        {day.toUpperCase().slice(0, 3)}
      </AppText>
    </TouchableOpacity>
  );
};

const WorkScheduleForm = ({
  control,
  t,
  selectedDays,
  setSelectedDays,
  fields,
  append,
  setValue,
  oldStartTime = '',
  oldEndTime = '',
}) => {
  const [availableHours, setAvailableHours] = useState([...HOURS]);
  const [startTimeModalVisible, setStartTimeModalVisible] = useState(false);
  const [endTimeModalVisible, setEndTimeModalVisible] = useState(false);
  const [startTime, setStartTime] = useState(oldStartTime);
  const [endTime, setEndTime] = useState(oldEndTime);

  useEffect(() => {
    setValue(`startTime`, startTime);
    setStartTimeModalVisible(false);
    if (
      HOURS.find(h => h.name === startTime)?.id >
      HOURS.find(h => h.name === endTime)?.id
    ) {
      setEndTime(null);
    }
    startTime &&
      setAvailableHours(
        HOURS.filter(
          h => h.id > HOURS.find(item => item.name === startTime)?.id,
        ),
      );
  }, [startTime]);

  // const handleAddFiled = () => {
  //   append({
  //     start: '08:00',
  //     end: '12:00',
  //   });
  // };

  useEffect(() => {
    setValue('endTime', endTime);
    setEndTimeModalVisible(false);
  }, [endTime]);

  return (
    <>
      {/*  */}
      <View style={{paddingHorizontal: 20}}>
        <AppText
          regular
          fontSize={theme.h6.size}
          fontWeight={theme.h6.fontWeight}
          Tcolor={theme.primaryColor}
          textAlign={'left'}>
          {t('CreateProfessional.WorkSchedule.title')}
        </AppText>
        <View style={{height: 10}} />
        <AppText
          regular
          fontSize={theme.p2.size}
          fontWeight={theme.p2.fontWeight}
          Tcolor={theme.blackColor}
          textAlign={'left'}>
          {t('CreateProfessional.WorkSchedule.subtitle')}
        </AppText>
      </View>
      <View style={{height: 15}} />
      <View style={{marginHorizontal: 20}}>
        <AppText
          regular
          fontSize={theme.s1.size}
          fontWeight={theme.s1.fontWeight}
          Tcolor={theme.blackColor}
          textAlign={'left'}>
          {t('CreateProfessional.WorkSchedule.workingDays')}
        </AppText>
        <View style={{height: 20}} />
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            marginBottom: 20,
          }}>
          {Object.keys(selectedDays).map((day, idx) => (
            <DayItem
              key={day}
              day={day}
              selectedDays={selectedDays}
              setSelectedDays={setSelectedDays}
            />
          ))}
        </View>
      </View>
      <View style={{marginHorizontal: 20}}>
        <AppText
          regular
          fontSize={theme.s1.size}
          fontWeight={theme.s1.fontWeight}
          Tcolor={theme.blackColor}
          textAlign={'left'}>
          {t('CreateProfessional.WorkSchedule.workingHours')}
        </AppText>
        <View style={{height: 20}} />
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
          <View style={{width: 140}}>
            <TouchableOpacity
              onPress={() => setStartTimeModalVisible(true)}
              activeOpacity={0.5}>
              <View pointerEvents="none">
                <AppTextInputController
                  name={`startTime`}
                  keyboardType={'decimal-pad'}
                  control={control}
                  placeholder={t('settings.visitorRequestSettings.startTime')}
                  // error={errors.visiting_start_time}
                  customMargin={0}
                  customWidth={'100%'}
                  disabledTitle
                  value={startTime}
                  style={{height: 35, borderRadius: 6}}
                  textColor={theme.blackColor}
                  backgroundColor={theme.whiteColor}
                  placeholderTextColor={theme.greyColor}
                  icon={'clock'}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              justifyContent: 'center',
              marginHorizontal: 10,
              flex: 1,
              alignItems: 'center',
            }}>
            <AppText
              regular
              fontSize={theme.p2.size}
              fontWeight={theme.p2.fontWeight}
              Tcolor={theme.blackColor}
              textAlign={'left'}>
              {t('settings.maintenanceSettings.to')}
            </AppText>
          </View>
          <View style={{width: 140}}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => setEndTimeModalVisible(true)}>
              <View pointerEvents="none">
                <AppTextInputController
                  name={`endTime`}
                  keyboardType={'decimal-pad'}
                  control={control}
                  placeholder={t('settings.visitorRequestSettings.endTime')}
                  // error={errors.visiting_end_time}
                  customMargin={0}
                  value={endTime}
                  customWidth={'100%'}
                  disabledTitle
                  style={{height: 35, borderRadius: 6}}
                  textColor={theme.blackColor}
                  backgroundColor={theme.whiteColor}
                  placeholderTextColor={theme.greyColor}
                  icon={'clock'}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/* <TouchableOpacity
          onPress={handleAddFiled}
          activeOpacity={0.5}
          style={{
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <MaterialIcons
            name={'add'}
            color={theme.primaryColor}
            size={theme.h5.size}
          />
          <AppText
            regular
            fontSize={theme.p2.size}
            fontWeight={theme.p2.fontWeight}
            Tcolor={theme.primaryColor}
            textAlign={'left'}>
            {t('settings.visitorRequestSettings.addMore')}
          </AppText>
        </TouchableOpacity> */}
      </View>
      {/*  */}
      <TimeSelectOverlay
        modalVisible={startTimeModalVisible}
        setModalVisible={setStartTimeModalVisible}
        timeType={t('CreateProfessional.WorkSchedule.startingHour')}>
        {HOURS?.map(h => (
          <TimeElement key={h.name} time={h.name} onPress={setStartTime} />
        ))}
      </TimeSelectOverlay>
      <TimeSelectOverlay
        modalVisible={endTimeModalVisible}
        setModalVisible={setEndTimeModalVisible}
        timeType={t('CreateProfessional.WorkSchedule.endingHour')}>
        {availableHours?.map(h => (
          <TimeElement key={h.name} time={h.name} onPress={setEndTime} />
        ))}
      </TimeSelectOverlay>
    </>
  );
};

export default WorkScheduleForm;
