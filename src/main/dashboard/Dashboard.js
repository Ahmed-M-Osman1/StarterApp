import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useFocusEffect} from '@react-navigation/core';
import {useSelector} from 'react-redux';
import Header from '../../components/Header';
import AppSwiper from '../../components/AppSwiper';
import RequiresAttention from './screens/RequiresAttention';
import MoneyIn from './screens/MoneyIn';
import MoneyOut from './screens/MoneyOut';
import ServiceRequests from './screens/ServiceRequests';
import Contracts from './screens/Contracts';
import ProfitLoss from './screens/ProfitLoss';
import MyUnits from './screens/MyUnits';
import {Admin, Owner, Tenant} from '../../utils/constants/Role';
import {theme} from '../../utils/design';
import {VIEW, CREATE, EDIT} from '../../utils/constants/PermissionAction';
import {DASHBOARD} from '../../utils/constants/PermissionSubject';
import {AbilityContext} from '../../utils/Can';
import {useAbility} from '@casl/react';

const Dashboard = ({navigation}) => {
  const {t} = useTranslation();
  const ref = useRef();
  const role = useSelector(state => state.user.data.role);
  const ability = useAbility(AbilityContext);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (ref) {
  //       ref.current.scrollTo(1, true);
  //       ref.current.scrollTo(0, true);
  //     }
  //   }, []),
  // );

  return (
    <View style={styles.container}>
      <Header name={t('dashboardTab')} navigation={navigation} tabs={true} />
      {/*tenant*/}
      {role === Tenant && (
        <MyUnits navigation={navigation} />
        // <AppSwiper ref={swiper => (ref.current = swiper)}>
        //   <MyLeases />
        // </AppSwiper>
      )}
      {/*admin, owner*/}
      {role !== Tenant &&
        role === Admin &&
        (ability.can(VIEW, DASHBOARD) ||
          ability.can(EDIT, DASHBOARD) ||
          ability.can(CREATE, DASHBOARD)) && (
          <AppSwiper ref={swiper => (ref.current = swiper)}>
            <RequiresAttention navigation={navigation} />
            <MoneyIn navigation={navigation} />
            <MoneyOut navigation={navigation} />
            <ProfitLoss navigation={navigation} />
            <ServiceRequests navigation={navigation} />
            <Contracts />
          </AppSwiper>
        )}
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.whiteColor,
  },
});
