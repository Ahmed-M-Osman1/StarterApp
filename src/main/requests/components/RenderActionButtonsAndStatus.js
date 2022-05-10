import React from 'react';
import AppButton from '../../../components/AppButton';
import {theme} from '../../../utils/design';
import {useSelector} from 'react-redux';
import i18n from 'i18next';
import {View} from 'react-native';
import AppText from '../../../components/AppText';
import {Admin, Management, Tenant} from '../../../utils/constants/Role';

export const ActionButtonA = ({
  text,
  onPress,
  isFullWidth = false,
  isLoading = false,
  isCard,
}) => {
  return (
    <AppButton
      customWidth={isFullWidth ? '100%' : '48%'}
      customHeight={isCard ? 30 : null}
      rounded={8}
      customMargin={0}
      fontSize={theme.s2.size}
      fontWeight={theme.s2.fontWeight}
      title={i18n.t(text)}
      onPress={onPress}
      Bcolor={theme.primaryColor}
      Tcolor={theme.whiteColor}
      loading={isLoading}
      loaderColor={theme.whiteColor}
    />
  );
};

export const ActionButtonB = ({
  text,
  onPress,
  isFullWidth = false,
  isLoading = false,
  isCard,
}) => {
  return (
    <AppButton
      customWidth={isFullWidth ? '100%' : '48%'}
      customHeight={isCard ? 30 : null}
      rounded={8}
      customMargin={0}
      fontSize={theme.s2.size}
      fontWeight={theme.s2.fontWeight}
      title={i18n.t(text)}
      onPress={onPress}
      loaderColor={theme.blackColor}
      style={{borderColor: theme.primaryColor, borderWidth: 1}}
      Tcolor={theme.primaryColor}
      loading={isLoading}
    />
  );
};

export const StatusBadge = ({request, regular = false}) => {
  const role = useSelector(state => state.user.data.role);

  return (
    <View
      style={{
        backgroundColor: regular ? 'transparent' : `${
          STATUS_COLORS[request?.status ?? theme.greyColor]
        }18`,
        width: '100%',
        height: regular ? 15 : 25,
        borderRadius: 4,
        justifyContent: 'center',
      }}>
      <AppText
        fontSize={regular ? theme.s2.size : theme.label.size}
        fontWeight={regular ? theme.s1.fontWeight : theme.c1.fontWeight}
        regular
        Tcolor={regular ? theme.blackColor : STATUS_COLORS[request?.status ?? theme.greyColor]}
        textAlign={regular ? 'left' : 'center'}>
        {i18n.t(
          !!request?.assignee &&
            (role === Management || role === Admin) &&
            request.status === 1
            ? 'requestsStatus.sent'
            : renderActionButtonsAndStatusObj[role][request?.type ?? 1][
                request?.status ?? 1
              ].status,
        )}
      </AppText>
    </View>
  );
};

export default RenderActionButtonsAndStatus = ({
  request,
  isLoading,
  isCard = false,
  updateRequestStatus,
}) => {
  const role = useSelector(state => state.user.data.role);

  if (!renderActionButtonsAndStatusObj.hasOwnProperty(role)) {
    console.log('no role');
    return null;
  }
  if (!request?.type) {
    console.log('no request?.type');
    return null;
  }
  if (!renderActionButtonsAndStatusObj[role].hasOwnProperty(request?.type)) {
    console.log('no request.type');
    return null;
  }
  if (
    !renderActionButtonsAndStatusObj[role][request?.type].hasOwnProperty(
      request?.status,
    )
  ) {
    console.log('no request.status');
    return null;
  }
  //
  return (
    <View style={{marginTop: isCard ? 0 : 20}}>
      {!!request?.type && !!request?.type && request?.status && !!role && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: isCard ? 0 : 20,
          }}>
          {!!renderActionButtonsAndStatusObj[role][request?.type][
            request?.status
          ].actionButtonB && (
            <ActionButtonB
              text={
                renderActionButtonsAndStatusObj[role][request?.type][
                  request?.status
                ].actionButtonB
              }
              onPress={() =>
                updateRequestStatus(
                  request,
                  renderActionButtonsAndStatusObj[role][request?.type][
                    request?.status
                  ].codeB,
                )
              }
              isLoading={isLoading}
              isFullWidth={
                !renderActionButtonsAndStatusObj[role][request?.type][
                  request?.status
                ].actionButtonA
              }
              isCard={isCard}
            />
          )}
          {!!renderActionButtonsAndStatusObj[role][request?.type][
            request?.status
          ].actionButtonA && (
            <ActionButtonA
              text={
                !!request?.assignee && (role === Management || role === Admin)
                  ? 'requestActions.reAssign'
                  : renderActionButtonsAndStatusObj[role][request?.type][
                      request?.status
                    ].actionButtonA
              }
              onPress={() =>
                updateRequestStatus(
                  request,
                  !!request?.assignee && (role === Management || role === Admin)
                    ? null
                    : renderActionButtonsAndStatusObj[role][request?.type][
                        request?.status
                      ].codeA,
                )
              }
              isLoading={isLoading}
              isFullWidth={
                !renderActionButtonsAndStatusObj[role][request?.type][
                  request?.status
                ].actionButtonB
              }
              isCard={isCard}
            />
          )}
        </View>
      )}
    </View>
  );
};

// this object for rending the request action buttons
// the first element of the object is the role of the current user,
// the second object represents the request type
// the third object is the status of the request
export const renderActionButtonsAndStatusObj = {
  CUSTOMER: {
    1: {
      1: {
        //   new
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.new',
        codeA: null,
        codeB: 5,
      },
      2: {
        //   in progress
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: 5,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   canceled
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
      16: {
        //    OpenRequest
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: 5,
      },
      17: {
        //   DeclineRequest
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: 5,
      },
      18: {
        //   AcceptRequest
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.accepted',
        codeA: null,
        codeB: 5,
      },
      19: {
        //   TimedOutRequest
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: 5,
      },
      20: {
        //   Started
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.started',
        codeA: null,
        codeB: null,
      },
      21: {
        //   RaiseQuote
        actionButtonA: 'requestActions.acceptQuote',
        actionButtonB: 'requestActions.rejectQuote',
        status: 'requestsStatus.quoteReceived',
        codeA: 23,
        codeB: 22,
      },
      22: {
        //   RejectedQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteRejected',
        codeA: null,
        codeB: null,
      },
      23: {
        //   AcceptedQuote
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.quoteAccepted',
        codeA: null,
        codeB: null,
      },
    },
    2: {
      1: {
        //   new
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.new',
        codeA: null,
        codeB: 5,
      },
      2: {
        //   in progress
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: 5,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   canceled
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
      16: {
        //    OpenRequest
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: 5,
      },
      17: {
        //   DeclineRequest
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: 5,
      },
      18: {
        //   AcceptRequest
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.accepted',
        codeA: null,
        codeB: 5,
      },
      19: {
        //   TimedOutRequest
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: 5,
      },
      20: {
        //   Started
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.started',
        codeA: null,
        codeB: 5,
      },
      21: {
        //   RaiseQuote
        actionButtonA: 'requestActions.acceptQuote',
        actionButtonB: 'requestActions.rejectQuote',
        status: 'requestsStatus.quoteReceived',
        codeA: 23,
        codeB: 22,
      },
      22: {
        //   RejectedQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteRejected',
        codeA: null,
        codeB: 5,
      },
      23: {
        //   AcceptedQuote
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.quoteAccepted',
        codeA: null,
        codeB: null,
      },
    },
    3: {
      1: {
        //   new
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.new',
        codeA: null,
        codeB: 5,
      },
      2: {
        //   in progress
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: 5,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   canceled
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
      16: {
        //    OpenRequest
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: 5,
      },
      17: {
        //   DeclineRequest
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: 5,
      },
      18: {
        //   AcceptRequest
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.accepted',
        codeA: null,
        codeB: 5,
      },
      19: {
        //   TimedOutRequest
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: 5,
      },
      20: {
        //   Started
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.started',
        codeA: null,
        codeB: 5,
      },
      21: {
        //   RaiseQuote
        actionButtonA: 'requestActions.acceptQuote',
        actionButtonB: 'requestActions.rejectQuote',
        status: 'requestsStatus.quoteReceived',
        codeA: 23,
        codeB: 22,
      },
      22: {
        //   RejectedQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteRejected',
        codeA: null,
        codeB: 5,
      },
      23: {
        //   AcceptedQuote
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.quoteAccepted',
        codeA: null,
        codeB: null,
      },
    },
    4: {
      1: {
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.New',
        codeA: null,
        codeB: 5,
      },
      2: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: null,
      },
      3: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      4: {
        actionButtonA: 'requestActions.requestCheckOut',
        actionButtonB: null,
        status: 'requestsStatus.CheckedIn',
        codeA: 12,
        codeB: null,
      },
      5: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
      6: {
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.AwaitingManagerApproval',
        codeA: null,
        codeB: 5,
      },
      7: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.ManagerNotApproved',
        codeA: null,
        codeB: null,
      },
      8: {
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.ManagerApproved',
        codeA: null,
        codeB: 5,
      },
      9: {
        actionButtonA: 'requestActions.approve',
        actionButtonB: 'requestActions.decline',
        status: 'requestsStatus.AwaitingTenantApproval',
        codeA: 11,
        codeB: 10,
      },
      10: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.TenantNotApproved',
        codeA: null,
        codeB: null,
      },
      11: {
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.TenantApproved',
        codeA: null,
        codeB: 5,
      },
      12: {
        actionButtonA: null,
        actionButtonB: 'requestActions.cancelCheckOut',
        status: 'requestsStatus.RequestCheckOut',
        codeA: null,
        codeB: 5,
      },
      13: {
        actionButtonA: 'requestActions.requestCheckOut',
        actionButtonB: null,
        status: 'requestsStatus.CheckOutNotApproved',
        codeA: 12,
        codeB: null,
      },
      14: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.CheckOutApproved',
        codeA: null,
        codeB: null,
      },
      15: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.CheckedOut',
        codeA: null,
        codeB: null,
      },
    },
    5: {
      1: {
        //   new
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.New',
        codeA: null,
        codeB: 5,
      },
      2: {
        //   in progress
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: 5,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.resolved',
        codeA: null,
        codeB: null,
      },
    },
    6: {
      1: {
        //   new
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.New',
        codeA: null,
        codeB: 5,
      },
      2: {
        //   in progress
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: 5,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
    },
  },
  MANAGEMENT: {
    1: {
      1: {
        //   new
        actionButtonA: 'requestActions.assign',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.new',
        codeA: null,
        codeB: 5,
      },
      2: {
        //   in progress
        actionButtonA: 'requestActions.reAssign',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: 5,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   canceled
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
      16: {
        //    OpenRequest
        actionButtonA: 'requestActions.assign',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.sent',
        codeA: null,
        codeB: 5,
      },
      17: {
        //   DeclineRequest
        actionButtonA: 'requestActions.reAssign',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.notAccepted',
        codeA: null,
        codeB: 5,
      },
      18: {
        //   AcceptRequest
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.assigned',
        codeA: null,
        codeB: 5,
      },
      19: {
        //   TimedOutRequest
        actionButtonA: 'requestActions.reAssign',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.timedOut',
        codeA: null,
        codeB: 5,
      },
      20: {
        //   Started
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.started',
        codeA: null,
        codeB: 5,
      },
      21: {
        //   RaiseQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteRaised',
        codeA: null,
        codeB: 5,
      },
      22: {
        //   RejectedQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteRejected',
        codeA: null,
        codeB: 5,
      },
      23: {
        //   AcceptedQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteAccepted',
        codeA: null,
        codeB: 5,
      },
    },
    2: {
      1: {
        //   new
        actionButtonA: 'requestActions.assign',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.New',
        codeA: null,
        codeB: 5,
      },
      2: {
        //   in progress
        actionButtonA: 'requestActions.reAssign',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: 5,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   canceled
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
      16: {
        //    OpenRequest
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.sent',
        codeA: null,
        codeB: 5,
      },
      17: {
        //   DeclineRequest
        actionButtonA: 'requestActions.reAssign',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.notAccepted',
        codeA: null,
        codeB: 5,
      },
      18: {
        //   AcceptRequest
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.assigned',
        codeA: null,
        codeB: 5,
      },
      19: {
        //   TimedOutRequest
        actionButtonA: 'requestActions.reAssign',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.timedOut',
        codeA: null,
        codeB: 5,
      },
      20: {
        //   Started
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.started',
        codeA: null,
        codeB: 5,
      },
      21: {
        //   RaiseQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteRaised',
        codeA: null,
        codeB: 5,
      },
      22: {
        //   RejectedQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteRejected',
        codeA: null,
        codeB: 5,
      },
      23: {
        //   AcceptedQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteAccepted',
        codeA: null,
        codeB: 5,
      },
    },
    3: {
      1: {
        //   new
        actionButtonA: 'requestActions.assign',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.New',
        codeA: null,
        codeB: 5,
      },
      2: {
        //   in progress
        actionButtonA: 'requestActions.reAssign',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: 5,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   canceled
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
      16: {
        //    OpenRequest
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.sent',
        codeA: null,
        codeB: 5,
      },
      17: {
        //   DeclineRequest
        actionButtonA: 'requestActions.reAssign',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.notAccepted',
        codeA: null,
        codeB: 5,
      },
      18: {
        //   AcceptRequest
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.assigned',
        codeA: null,
        codeB: 5,
      },
      19: {
        //   TimedOutRequest
        actionButtonA: 'requestActions.reAssign',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.timedOut',
        codeA: null,
        codeB: 5,
      },
      20: {
        //   Started
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.started',
        codeA: null,
        codeB: 5,
      },
      21: {
        //   RaiseQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteRaised',
        codeA: null,
        codeB: 5,
      },
      22: {
        //   RejectedQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteRejected',
        codeA: null,
        codeB: 5,
      },
      23: {
        //   AcceptedQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteAccepted',
        codeA: null,
        codeB: 5,
      },
    },
    4: {
      1: {
        actionButtonA: 'requestActions.checkIn',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.New',
        codeA: 4,
        codeB: 5,
      },
      2: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: null,
      },
      3: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      4: {
        actionButtonA: 'requestActions.checkOut',
        actionButtonB: null,
        status: 'requestsStatus.CheckedIn',
        codeA: 15,
        codeB: null,
      },
      5: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
      6: {
        actionButtonA: 'requestActions.approve',
        actionButtonB: 'requestActions.decline',
        status: 'requestsStatus.AwaitingManagerApproval',
        codeA: 8,
        codeB: 7,
      },
      7: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.ManagerNotApproved',
        codeA: null,
        codeB: null,
      },
      8: {
        actionButtonA: 'requestActions.checkIn',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.ManagerApproved',
        codeA: 4,
        codeB: 5,
      },
      9: {
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.AwaitingTenantApproval',
        codeA: null,
        codeB: 5,
      },
      10: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.TenantNotApproved',
        codeA: null,
        codeB: null,
      },
      11: {
        actionButtonA: 'requestActions.checkIn',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.TenantApproved',
        codeA: 4,
        codeB: 5,
      },
      12: {
        actionButtonA: 'requestActions.approveCheckOut',
        actionButtonB: 'requestActions.declineCheckOut',
        status: 'requestsStatus.RequestCheckOut',
        codeA: 14,
        codeB: 13,
      },
      13: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.CheckOutNotApproved',
        codeA: null,
        codeB: null,
      },
      14: {
        actionButtonA: 'requestActions.checkOut',
        actionButtonB: null,
        status: 'requestsStatus.CheckOutApproved',
        codeA: 15,
        codeB: null,
      },
      15: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.CheckedOut',
        codeA: null,
        codeB: null,
      },
    },
    5: {
      1: {
        //   new
        actionButtonA: 'requestActions.resolve',
        actionButtonB: null,
        status: 'requestsStatus.pending',
        codeA: 3,
        codeB: null,
      },
      2: {
        //   in progress
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: 5,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.resolved',
        codeA: null,
        codeB: null,
      },
    },
    6: {
      1: {
        //   new
        actionButtonA: 'requestActions.assign',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.New',
        codeA: null,
        codeB: 5,
      },
      2: {
        //   in progress
        actionButtonA: 'requestActions.complete',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: 3,
        codeB: 5,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
    },
  },
  ADMIN: {
    1: {
      1: {
        //   new
        actionButtonA: 'requestActions.assign',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.New',
        codeA: null,
        codeB: 5,
      },
      2: {
        //   in progress
        actionButtonA: 'requestActions.reAssign',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: 5,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   canceled
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
      16: {
        //    OpenRequest
        actionButtonA: 'requestActions.reAssign',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.sent',
        codeA: null,
        codeB: 5,
      },
      17: {
        //   DeclineRequest
        actionButtonA: 'requestActions.reAssign',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.notAccepted',
        codeA: null,
        codeB: 5,
      },
      18: {
        //   AcceptRequest
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.assigned',
        codeA: null,
        codeB: 5,
      },
      19: {
        //   TimedOutRequest
        actionButtonA: 'requestActions.reAssign',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.timedOut',
        codeA: null,
        codeB: 5,
      },
      20: {
        //   Started
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.started',
        codeA: null,
        codeB: 5,
      },
      21: {
        //   RaiseQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteRaised',
        codeA: null,
        codeB: 5,
      },
      22: {
        //   RejectedQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteRejected',
        codeA: null,
        codeB: 5,
      },
      23: {
        //   AcceptedQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteAccepted',
        codeA: null,
        codeB: 5,
      },
    },
    2: {
      1: {
        //   new
        actionButtonA: 'requestActions.assign',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.New',
        codeA: null,
        codeB: 5,
      },
      2: {
        //   in progress
        actionButtonA: 'requestActions.reAssign',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: 5,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   canceled
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
      16: {
        //    OpenRequest
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.sent',
        codeA: null,
        codeB: 5,
      },
      17: {
        //   DeclineRequest
        actionButtonA: 'requestActions.reAssign',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.notAccepted',
        codeA: null,
        codeB: 5,
      },
      18: {
        //   AcceptRequest
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.assigned',
        codeA: null,
        codeB: 5,
      },
      19: {
        //   TimedOutRequest
        actionButtonA: 'requestActions.reAssign',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.timedOut',
        codeA: null,
        codeB: 5,
      },
      20: {
        //   Started
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.started',
        codeA: null,
        codeB: 5,
      },
      21: {
        //   RaiseQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteRaised',
        codeA: null,
        codeB: 5,
      },
      22: {
        //   RejectedQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteRejected',
        codeA: null,
        codeB: 5,
      },
      23: {
        //   AcceptedQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteAccepted',
        codeA: null,
        codeB: 5,
      },
    },
    3: {
      1: {
        //   new
        actionButtonA: 'requestActions.assign',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.New',
        codeA: null,
        codeB: 5,
      },
      2: {
        //   in progress
        actionButtonA: 'requestActions.reAssign',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: 5,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   canceled
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
      16: {
        //    OpenRequest
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.sent',
        codeA: null,
        codeB: 5,
      },
      17: {
        //   DeclineRequest
        actionButtonA: 'requestActions.reAssign',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.notAccepted',
        codeA: null,
        codeB: 5,
      },
      18: {
        //   AcceptRequest
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.assigned',
        codeA: null,
        codeB: 5,
      },
      19: {
        //   TimedOutRequest
        actionButtonA: 'requestActions.reAssign',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.timedOut',
        codeA: null,
        codeB: 5,
      },
      20: {
        //   Started
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.started',
        codeA: null,
        codeB: 5,
      },
      21: {
        //   RaiseQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteRaised',
        codeA: null,
        codeB: 5,
      },
      22: {
        //   RejectedQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteRejected',
        codeA: null,
        codeB: 5,
      },
      23: {
        //   AcceptedQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteAccepted',
        codeA: null,
        codeB: 5,
      },
    },
    4: {
      1: {
        actionButtonA: 'requestActions.checkIn',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.New',
        codeA: 4,
        codeB: 5,
      },
      2: {
        actionButtonA: null,
        actionButtonB: null,
        status: null,
        codeA: null,
        codeB: null,
      },
      3: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      4: {
        actionButtonA: 'requestActions.checkOut',
        actionButtonB: null,
        status: 'requestsStatus.CheckedIn',
        codeA: 15,
        codeB: null,
      },
      5: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
      6: {
        actionButtonA: 'requestActions.approve',
        actionButtonB: 'requestActions.decline',
        status: 'requestsStatus.AwaitingManagerApproval',
        codeA: 8,
        codeB: 7,
      },
      7: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.ManagerNotApproved',
        codeA: null,
        codeB: null,
      },
      8: {
        actionButtonA: 'requestActions.checkIn',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.ManagerApproved',
        codeA: 4,
        codeB: 5,
      },
      9: {
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.AwaitingTenantApproval',
        codeA: null,
        codeB: 5,
      },
      10: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.TenantNotApproved',
        codeA: null,
        codeB: null,
      },
      11: {
        actionButtonA: 'requestActions.checkIn',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.TenantApproved',
        codeA: 4,
        codeB: 5,
      },
      12: {
        actionButtonA: 'requestActions.approveCheckOut',
        actionButtonB: 'requestActions.declineCheckOut',
        status: 'requestsStatus.RequestCheckOut',
        codeA: 14,
        codeB: 13,
      },
      13: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.CheckOutNotApproved',
        codeA: null,
        codeB: null,
      },
      14: {
        actionButtonA: 'requestActions.checkOut',
        actionButtonB: null,
        status: 'requestsStatus.CheckOutApproved',
        codeA: 15,
        codeB: null,
      },
      15: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.CheckedOut',
        codeA: null,
        codeB: null,
      },
    },
    5: {
      1: {
        //   new
        actionButtonA: 'requestActions.resolve',
        actionButtonB: null,
        status: 'requestsStatus.pending',
        codeA: 3,
        codeB: null,
      },
      2: {
        //   in progress
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: null,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.resolved',
        codeA: null,
        codeB: null,
      },
    },
    6: {
      1: {
        //   new
        actionButtonA: 'requestActions.assign',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.New',
        codeA: null,
        codeB: 5,
      },
      2: {
        //   in progress
        actionButtonA: 'requestActions.complete',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: 3,
        codeB: 5,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
    },
  },
  MAINTENANCE: {
    1: {
      1: {
        //   new
        actionButtonA: 'requestActions.accept',
        actionButtonB: 'requestActions.reject',
        status: 'requestsStatus.new',
        codeA: 18,
        codeB: 17,
      },
      2: {
        //   in progress
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: null,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   canceled
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
      16: {
        //    OpenRequest
        actionButtonA: 'requestActions.accept',
        actionButtonB: 'requestActions.decline',
        status: 'requestsStatus.new',
        codeA: 18,
        codeB: 17,
      },
      17: {
        //   DeclinedRequest
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.declined',
        codeA: null,
        codeB: null,
      },
      18: {
        //   AcceptRequest
        actionButtonA: 'requestActions.start',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.accepted',
        codeA: 20,
        codeB: 1,
      },
      19: {
        //   TimedOutRequest
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.timedOut',
        codeA: null,
        codeB: null,
      },
      20: {
        //   Started
        actionButtonA: 'requestActions.raiseQuote',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteReceived',
        codeA: 21,
        codeB: 1,
      },
      21: {
        //   RaiseQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancelQuote',
        status: 'requestsStatus.quoteRaised',
        codeA: null,
        codeB: 20,
      },
      22: {
        //   RejectedQuote
        actionButtonA: 'requestActions.raiseQuote',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteRejected',
        codeA: 21,
        codeB: 1,
      },
      23: {
        //   AcceptedQuote
        actionButtonA: 'requestActions.complete',
        actionButtonB: null,
        status: 'requestsStatus.quoteAccepted',
        codeA: 3,
        codeB: null,
      },
    },
    2: {
      1: {
        //   new
        actionButtonA: 'requestActions.accept',
        actionButtonB: 'requestActions.reject',
        status: 'requestsStatus.new',
        codeA: 18,
        codeB: 17,
      },
      2: {
        //   in progress
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: null,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   canceled
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
      16: {
        //    OpenRequest
        actionButtonA: 'requestActions.accept',
        actionButtonB: 'requestActions.decline',
        status: 'requestsStatus.new',
        codeA: 18,
        codeB: 17,
      },
      17: {
        //   DeclinedRequest
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.declined',
        codeA: null,
        codeB: null,
      },
      18: {
        //   AcceptRequest
        actionButtonA: 'requestActions.start',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.accepted',
        codeA: 20,
        codeB: 1,
      },
      19: {
        //   TimedOutRequest
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.timedOut',
        codeA: null,
        codeB: null,
      },
      20: {
        //   Started
        actionButtonA: 'requestActions.raiseQuote',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: 21,
        codeB: 1,
      },
      21: {
        //   RaiseQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancelQuote',
        status: 'requestsStatus.quoteRaised',
        codeA: null,
        codeB: 20,
      },
      22: {
        //   RejectedQuote
        actionButtonA: 'requestActions.raiseQuote',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteRejected',
        codeA: 21,
        codeB: 1,
      },
      23: {
        //   AcceptedQuote
        actionButtonA: 'requestActions.complete',
        actionButtonB: null,
        status: 'requestsStatus.quoteAccepted',
        codeA: 3,
        codeB: null,
      },
    },
    3: {
      1: {
        //   new
        actionButtonA: 'requestActions.accept',
        actionButtonB: 'requestActions.reject',
        status: 'requestsStatus.new',
        codeA: 18,
        codeB: 17,
      },
      2: {
        //   in progress
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: null,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   canceled
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
      16: {
        //    OpenRequest
        actionButtonA: 'requestActions.accept',
        actionButtonB: 'requestActions.decline',
        status: 'requestsStatus.new',
        codeA: 18,
        codeB: 17,
      },
      17: {
        //   DeclinedRequest
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.declined',
        codeA: null,
        codeB: null,
      },
      18: {
        //   AcceptRequest
        actionButtonA: 'requestActions.start',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.accepted',
        codeA: 20,
        codeB: 1,
      },
      19: {
        //   TimedOutRequest
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.timedOut',
        codeA: null,
        codeB: null,
      },
      20: {
        //   Started
        actionButtonA: 'requestActions.raiseQuote',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: 21,
        codeB: 1,
      },
      21: {
        //   RaiseQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancelQuote',
        status: 'requestsStatus.quoteRaised',
        codeA: null,
        codeB: 20,
      },
      22: {
        //   RejectedQuote
        actionButtonA: 'requestActions.raiseQuote',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteRejected',
        codeA: 21,
        codeB: 1,
      },
      23: {
        //   AcceptedQuote
        actionButtonA: 'requestActions.complete',
        actionButtonB: null,
        status: 'requestsStatus.quoteAccepted',
        codeA: 3,
        codeB: null,
      },
    },
    4: {
      1: {
        actionButtonA: 'requestActions.checkIn',
        actionButtonB: 'common.cancel',
        status: 'requestsStatus.New',
        codeA: 4,
        codeB: 5,
      },
      2: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: null,
      },
      3: {
        actionButtonA: null,
        actionButtonB: null,
        status: null,
        codeA: null,
        codeB: null,
      },
      4: {
        actionButtonA: 'requestActions.checkOut',
        actionButtonB: null,
        status: 'requestsStatus.CheckedIn',
        codeA: 15,
        codeB: null,
      },
      5: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.Cancel',
        codeA: null,
        codeB: null,
      },
      6: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.AwaitingManagerApproval',
        codeA: null,
        codeB: null,
      },
      7: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.ManagerNotApproved',
        codeA: null,
        codeB: null,
      },
      8: {
        actionButtonA: 'requestActions.checkIn',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.ManagerApproved',
        codeA: 4,
        codeB: 5,
      },
      9: {
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.AwaitingTenantApproval',
        codeA: null,
        codeB: 5,
      },
      10: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.TenantNotApproved',
        codeA: null,
        codeB: null,
      },
      11: {
        actionButtonA: 'requestActions.checkIn',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.TenantApproved',
        codeA: 4,
        codeB: 5,
      },
      12: {
        actionButtonA: 'requestActions.approveCheckOut',
        actionButtonB: 'requestActions.declineCheckOut',
        status: 'requestsStatus.RequestCheckOut',
        codeA: 14,
        codeB: 13,
      },
      13: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.CheckOutNotApproved',
        codeA: null,
        codeB: null,
      },
      14: {
        actionButtonA: 'requestActions.checkOut',
        actionButtonB: null,
        status: 'requestsStatus.CheckOutApproved',
        codeA: null,
        codeB: null,
      },
      15: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.CheckedOut',
        codeA: null,
        codeB: null,
      },
    },
    6: {
      1: {
        //   new
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.New',
        codeA: null,
        codeB: 5,
      },
      2: {
        //   in progress
        actionButtonA: 'requestActions.complete',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: 5,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
    },
  },
  HOME_CLEANER: {
    1: {
      1: {
        //   new
        actionButtonA: 'requestActions.accept',
        actionButtonB: 'requestActions.reject',
        status: 'requestsStatus.new',
        codeA: 18,
        codeB: 17,
      },
      2: {
        //   in progress
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: null,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   canceled
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
      16: {
        //    OpenRequest
        actionButtonA: 'requestActions.accept',
        actionButtonB: 'requestActions.decline',
        status: 'requestsStatus.new',
        codeA: 18,
        codeB: 17,
      },
      17: {
        //   DeclinedRequest
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.declined',
        codeA: null,
        codeB: null,
      },
      18: {
        //   AcceptRequest
        actionButtonA: 'requestActions.start',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.accepted',
        codeA: 20,
        codeB: 1,
      },
      19: {
        //   TimedOutRequest
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.timedOut',
        codeA: null,
        codeB: null,
      },
      20: {
        //   Started
        actionButtonA: 'requestActions.raiseQuote',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: 21,
        codeB: 1,
      },
      21: {
        //   RaiseQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancelQuote',
        status: 'requestsStatus.quoteRaised',
        codeA: null,
        codeB: 20,
      },
      22: {
        //   RejectedQuote
        actionButtonA: 'requestActions.raiseQuote',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteRejected',
        codeA: 21,
        codeB: 1,
      },
      23: {
        //   AcceptedQuote
        actionButtonA: 'requestActions.complete',
        actionButtonB: null,
        status: 'requestsStatus.TenantApproved',
        codeA: 3,
        codeB: null,
      },
    },
    2: {
      1: {
        //   new
        actionButtonA: 'requestActions.accept',
        actionButtonB: 'requestActions.reject',
        status: 'requestsStatus.new',
        codeA: 18,
        codeB: 17,
      },
      2: {
        //   in progress
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: null,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   canceled
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
      16: {
        //    OpenRequest
        actionButtonA: 'requestActions.accept',
        actionButtonB: 'requestActions.decline',
        status: 'requestsStatus.new',
        codeA: 18,
        codeB: 17,
      },
      17: {
        //   DeclinedRequest
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.declined',
        codeA: null,
        codeB: null,
      },
      18: {
        //   AcceptRequest
        actionButtonA: 'requestActions.start',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.accepted',
        codeA: 20,
        codeB: 1,
      },
      19: {
        //   TimedOutRequest
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.timedOut',
        codeA: null,
        codeB: null,
      },
      20: {
        //   Started
        actionButtonA: 'requestActions.raiseQuote',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: 21,
        codeB: 1,
      },
      21: {
        //   RaiseQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancelQuote',
        status: 'requestsStatus.quoteRaised',
        codeA: null,
        codeB: 20,
      },
      22: {
        //   RejectedQuote
        actionButtonA: 'requestActions.raiseQuote',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteRejected',
        codeA: 21,
        codeB: 1,
      },
      23: {
        //   AcceptedQuote
        actionButtonA: 'requestActions.complete',
        actionButtonB: null,
        status: 'requestsStatus.quoteAccepted',
        codeA: 3,
        codeB: null,
      },
    },
    3: {
      1: {
        //   new
        actionButtonA: 'requestActions.accept',
        actionButtonB: 'requestActions.reject',
        status: 'requestsStatus.new',
        codeA: 18,
        codeB: 17,
      },
      2: {
        //   in progress
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: null,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   canceled
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
      16: {
        //    OpenRequest
        actionButtonA: 'requestActions.accept',
        actionButtonB: 'requestActions.decline',
        status: 'requestsStatus.new',
        codeA: 18,
        codeB: 17,
      },
      17: {
        //   DeclinedRequest
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.declined',
        codeA: null,
        codeB: null,
      },
      18: {
        //   AcceptRequest
        actionButtonA: 'requestActions.start',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.accepted',
        codeA: 20,
        codeB: 1,
      },
      19: {
        //   TimedOutRequest
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.timedOut',
        codeA: null,
        codeB: null,
      },
      20: {
        //   Started
        actionButtonA: 'requestActions.raiseQuote',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: 21,
        codeB: 1,
      },
      21: {
        //   RaiseQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancelQuote',
        status: 'requestsStatus.quoteRaised',
        codeA: null,
        codeB: 20,
      },
      22: {
        //   RejectedQuote
        actionButtonA: 'requestActions.raiseQuote',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteRejected',
        codeA: 21,
        codeB: 1,
      },
      23: {
        //   AcceptedQuote
        actionButtonA: 'requestActions.complete',
        actionButtonB: null,
        status: 'requestsStatus.quoteAccepted',
        codeA: 3,
        codeB: null,
      },
    },
    4: {
      1: {
        actionButtonA: 'requestActions.checkIn',
        actionButtonB: 'common.cancel',
        status: 'requestsStatus.New',
        codeA: 4,
        codeB: 5,
      },
      2: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: null,
      },
      3: {
        actionButtonA: null,
        actionButtonB: null,
        status: null,
        codeA: null,
        codeB: null,
      },
      4: {
        actionButtonA: 'requestActions.checkOut',
        actionButtonB: null,
        status: 'requestsStatus.CheckedIn',
        codeA: 15,
        codeB: null,
      },
      5: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.Cancel',
        codeA: null,
        codeB: null,
      },
      6: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.AwaitingManagerApproval',
        codeA: null,
        codeB: null,
      },
      7: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.ManagerNotApproved',
        codeA: null,
        codeB: null,
      },
      8: {
        actionButtonA: 'requestActions.checkIn',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.ManagerApproved',
        codeA: 4,
        codeB: 5,
      },
      9: {
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.AwaitingTenantApproval',
        codeA: null,
        codeB: 5,
      },
      10: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.TenantNotApproved',
        codeA: null,
        codeB: null,
      },
      11: {
        actionButtonA: 'requestActions.checkIn',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.TenantApproved',
        codeA: 4,
        codeB: 5,
      },
      12: {
        actionButtonA: 'requestActions.approveCheckOut',
        actionButtonB: 'requestActions.declineCheckOut',
        status: 'requestsStatus.RequestCheckOut',
        codeA: 14,
        codeB: 13,
      },
      13: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.CheckOutNotApproved',
        codeA: null,
        codeB: null,
      },
      14: {
        actionButtonA: 'requestActions.checkOut',
        actionButtonB: null,
        status: 'requestsStatus.CheckOutApproved',
        codeA: null,
        codeB: null,
      },
      15: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.CheckedOut',
        codeA: null,
        codeB: null,
      },
    },
    6: {
      1: {
        //   new
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.New',
        codeA: null,
        codeB: 5,
      },
      2: {
        //   in progress
        actionButtonA: 'requestActions.complete',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: 5,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
    },
  },
  CAR_CLEANER: {
    1: {
      1: {
        //   new
        actionButtonA: 'requestActions.accept',
        actionButtonB: 'requestActions.reject',
        status: 'requestsStatus.new',
        codeA: 18,
        codeB: 17,
      },
      2: {
        //   in progress
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: null,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   canceled
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
      16: {
        //    OpenRequest
        actionButtonA: 'requestActions.accept',
        actionButtonB: 'requestActions.decline',
        status: 'requestsStatus.new',
        codeA: 18,
        codeB: 17,
      },
      17: {
        //   DeclinedRequest
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.declined',
        codeA: null,
        codeB: null,
      },
      18: {
        //   AcceptRequest
        actionButtonA: 'requestActions.start',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.accepted',
        codeA: 20,
        codeB: 1,
      },
      19: {
        //   TimedOutRequest
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.timedOut',
        codeA: null,
        codeB: null,
      },
      20: {
        //   Started
        actionButtonA: 'requestActions.raiseQuote',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: 21,
        codeB: 1,
      },
      21: {
        //   RaiseQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancelQuote',
        status: 'requestsStatus.quoteRaised',
        codeA: null,
        codeB: 20,
      },
      22: {
        //   RejectedQuote
        actionButtonA: 'requestActions.raiseQuote',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteRejected',
        codeA: 21,
        codeB: 1,
      },
      23: {
        //   AcceptedQuote
        actionButtonA: 'requestActions.complete',
        actionButtonB: null,
        status: 'requestsStatus.quoteAccepted',
        codeA: 3,
        codeB: null,
      },
    },
    2: {
      1: {
        //   new
        actionButtonA: 'requestActions.accept',
        actionButtonB: 'requestActions.reject',
        status: 'requestsStatus.new',
        codeA: 18,
        codeB: 17,
      },
      2: {
        //   in progress
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: null,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   canceled
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
      16: {
        //    OpenRequest
        actionButtonA: 'requestActions.accept',
        actionButtonB: 'requestActions.decline',
        status: 'requestsStatus.new',
        codeA: 18,
        codeB: 17,
      },
      17: {
        //   DeclinedRequest
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.declined',
        codeA: null,
        codeB: null,
      },
      18: {
        //   AcceptRequest
        actionButtonA: 'requestActions.start',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.accepted',
        codeA: 20,
        codeB: 1,
      },
      19: {
        //   TimedOutRequest
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.timedOut',
        codeA: null,
        codeB: null,
      },
      20: {
        //   Started
        actionButtonA: 'requestActions.raiseQuote',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: 21,
        codeB: 1,
      },
      21: {
        //   RaiseQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancelQuote',
        status: 'requestsStatus.quoteRaised',
        codeA: null,
        codeB: 20,
      },
      22: {
        //   RejectedQuote
        actionButtonA: 'requestActions.raiseQuote',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteRejected',
        codeA: 21,
        codeB: 1,
      },
      23: {
        //   AcceptedQuote
        actionButtonA: 'requestActions.complete',
        actionButtonB: null,
        status: 'requestsStatus.quoteAccepted',
        codeA: 3,
        codeB: null,
      },
    },
    3: {
      1: {
        //   new
        actionButtonA: 'requestActions.accept',
        actionButtonB: 'requestActions.reject',
        status: 'requestsStatus.new',
        codeA: 18,
        codeB: 17,
      },
      2: {
        //   in progress
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: null,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   canceled
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
      16: {
        //    OpenRequest
        actionButtonA: 'requestActions.accept',
        actionButtonB: 'requestActions.decline',
        status: 'requestsStatus.new',
        codeA: 18,
        codeB: 17,
      },
      17: {
        //   DeclinedRequest
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.declined',
        codeA: null,
        codeB: null,
      },
      18: {
        //   AcceptRequest
        actionButtonA: 'requestActions.start',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.accepted',
        codeA: 20,
        codeB: 1,
      },
      19: {
        //   TimedOutRequest
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.timedOut',
        codeA: null,
        codeB: null,
      },
      20: {
        //   Started
        actionButtonA: 'requestActions.raiseQuote',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: 21,
        codeB: 1,
      },
      21: {
        //   RaiseQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancelQuote',
        status: 'requestsStatus.quoteRaised',
        codeA: null,
        codeB: 20,
      },
      22: {
        //   RejectedQuote
        actionButtonA: 'requestActions.raiseQuote',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteRejected',
        codeA: 21,
        codeB: 1,
      },
      23: {
        //   AcceptedQuote
        actionButtonA: 'requestActions.complete',
        actionButtonB: null,
        status: 'requestsStatus.quoteAccepted',
        codeA: 3,
        codeB: null,
      },
    },
    4: {
      1: {
        actionButtonA: 'requestActions.checkIn',
        actionButtonB: 'common.cancel',
        status: 'requestsStatus.New',
        codeA: 4,
        codeB: 5,
      },
      2: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: null,
      },
      3: {
        actionButtonA: null,
        actionButtonB: null,
        status: null,
        codeA: null,
        codeB: null,
      },
      4: {
        actionButtonA: 'requestActions.checkOut',
        actionButtonB: null,
        status: 'requestsStatus.CheckedIn',
        codeA: 15,
        codeB: null,
      },
      5: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.Cancel',
        codeA: null,
        codeB: null,
      },
      6: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.AwaitingManagerApproval',
        codeA: null,
        codeB: null,
      },
      7: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.ManagerNotApproved',
        codeA: null,
        codeB: null,
      },
      8: {
        actionButtonA: 'requestActions.checkIn',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.ManagerApproved',
        codeA: 4,
        codeB: 5,
      },
      9: {
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.AwaitingTenantApproval',
        codeA: null,
        codeB: 5,
      },
      10: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.TenantNotApproved',
        codeA: null,
        codeB: null,
      },
      11: {
        actionButtonA: 'requestActions.checkIn',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.TenantApproved',
        codeA: 4,
        codeB: 5,
      },
      12: {
        actionButtonA: 'requestActions.approveCheckOut',
        actionButtonB: 'requestActions.declineCheckOut',
        status: 'requestsStatus.RequestCheckOut',
        codeA: 14,
        codeB: 13,
      },
      13: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.CheckOutNotApproved',
        codeA: null,
        codeB: null,
      },
      14: {
        actionButtonA: 'requestActions.checkOut',
        actionButtonB: null,
        status: 'requestsStatus.CheckOutApproved',
        codeA: null,
        codeB: null,
      },
      15: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.CheckedOut',
        codeA: null,
        codeB: null,
      },
    },
    6: {
      1: {
        //   new
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.New',
        codeA: null,
        codeB: 5,
      },
      2: {
        //   in progress
        actionButtonA: 'requestActions.complete',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: 5,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
    },
  },
  CLEANING: {
    1: {
      1: {
        //   new
        actionButtonA: 'requestActions.accept',
        actionButtonB: 'requestActions.reject',
        status: 'requestsStatus.new',
        codeA: 18,
        codeB: 17,
      },
      2: {
        //   in progress
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: null,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   canceled
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
      16: {
        //    OpenRequest
        actionButtonA: 'requestActions.accept',
        actionButtonB: 'requestActions.decline',
        status: 'requestsStatus.new',
        codeA: 18,
        codeB: 17,
      },
      17: {
        //   DeclinedRequest
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.declined',
        codeA: null,
        codeB: null,
      },
      18: {
        //   AcceptRequest
        actionButtonA: 'requestActions.start',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.accepted',
        codeA: 20,
        codeB: 1,
      },
      19: {
        //   TimedOutRequest
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.timedOut',
        codeA: null,
        codeB: null,
      },
      20: {
        //   Started
        actionButtonA: 'requestActions.raiseQuote',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: 21,
        codeB: 1,
      },
      21: {
        //   RaiseQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancelQuote',
        status: 'requestsStatus.quoteRaised',
        codeA: null,
        codeB: 20,
      },
      22: {
        //   RejectedQuote
        actionButtonA: 'requestActions.raiseQuote',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteRejected',
        codeA: 21,
        codeB: 1,
      },
      23: {
        //   AcceptedQuote
        actionButtonA: 'requestActions.complete',
        actionButtonB: null,
        status: 'requestsStatus.quoteAccepted',
        codeA: 3,
        codeB: null,
      },
    },
    2: {
      1: {
        //   new
        actionButtonA: 'requestActions.accept',
        actionButtonB: 'requestActions.reject',
        status: 'requestsStatus.new',
        codeA: 18,
        codeB: 17,
      },
      2: {
        //   in progress
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: null,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   canceled
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
      16: {
        //    OpenRequest
        actionButtonA: 'requestActions.accept',
        actionButtonB: 'requestActions.decline',
        status: 'requestsStatus.new',
        codeA: 18,
        codeB: 17,
      },
      17: {
        //   DeclinedRequest
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.declined',
        codeA: null,
        codeB: null,
      },
      18: {
        //   AcceptRequest
        actionButtonA: 'requestActions.start',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.accepted',
        codeA: 20,
        codeB: 1,
      },
      19: {
        //   TimedOutRequest
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.timedOut',
        codeA: null,
        codeB: null,
      },
      20: {
        //   Started
        actionButtonA: 'requestActions.raiseQuote',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: 21,
        codeB: 1,
      },
      21: {
        //   RaiseQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancelQuote',
        status: 'requestsStatus.quoteRaised',
        codeA: null,
        codeB: 20,
      },
      22: {
        //   RejectedQuote
        actionButtonA: 'requestActions.raiseQuote',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteRejected',
        codeA: 21,
        codeB: 1,
      },
      23: {
        //   AcceptedQuote
        actionButtonA: 'requestActions.complete',
        actionButtonB: null,
        status: 'requestsStatus.quoteAccepted',
        codeA: 3,
        codeB: null,
      },
    },
    3: {
      1: {
        //   new
        actionButtonA: 'requestActions.accept',
        actionButtonB: 'requestActions.reject',
        status: 'requestsStatus.new',
        codeA: 18,
        codeB: 17,
      },
      2: {
        //   in progress
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: null,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   canceled
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
      16: {
        //    OpenRequest
        actionButtonA: 'requestActions.accept',
        actionButtonB: 'requestActions.decline',
        status: 'requestsStatus.new',
        codeA: 18,
        codeB: 17,
      },
      17: {
        //   DeclinedRequest
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.declined',
        codeA: null,
        codeB: null,
      },
      18: {
        //   AcceptRequest
        actionButtonA: 'requestActions.start',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.accepted',
        codeA: 20,
        codeB: 1,
      },
      19: {
        //   TimedOutRequest
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.timedOut',
        codeA: null,
        codeB: null,
      },
      20: {
        //   Started
        actionButtonA: 'requestActions.raiseQuote',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: 21,
        codeB: 1,
      },
      21: {
        //   RaiseQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancelQuote',
        status: 'requestsStatus.quoteRaised',
        codeA: null,
        codeB: 20,
      },
      22: {
        //   RejectedQuote
        actionButtonA: 'requestActions.raiseQuote',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteRejected',
        codeA: 21,
        codeB: 1,
      },
      23: {
        //   AcceptedQuote
        actionButtonA: 'requestActions.complete',
        actionButtonB: null,
        status: 'requestsStatus.quoteAccepted',
        codeA: 3,
        codeB: null,
      },
    },
    4: {
      1: {
        actionButtonA: 'requestActions.checkIn',
        actionButtonB: 'common.cancel',
        status: 'requestsStatus.New',
        codeA: 4,
        codeB: 5,
      },
      2: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: null,
      },
      3: {
        actionButtonA: null,
        actionButtonB: null,
        status: null,
        codeA: null,
        codeB: null,
      },
      4: {
        actionButtonA: 'requestActions.checkOut',
        actionButtonB: null,
        status: 'requestsStatus.CheckedIn',
        codeA: 15,
        codeB: null,
      },
      5: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.Cancel',
        codeA: null,
        codeB: null,
      },
      6: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.AwaitingManagerApproval',
        codeA: null,
        codeB: null,
      },
      7: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.ManagerNotApproved',
        codeA: null,
        codeB: null,
      },
      8: {
        actionButtonA: 'requestActions.checkIn',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.ManagerApproved',
        codeA: 4,
        codeB: 5,
      },
      9: {
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.AwaitingTenantApproval',
        codeA: null,
        codeB: 5,
      },
      10: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.TenantNotApproved',
        codeA: null,
        codeB: null,
      },
      11: {
        actionButtonA: 'requestActions.checkIn',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.TenantApproved',
        codeA: 4,
        codeB: 5,
      },
      12: {
        actionButtonA: 'requestActions.approveCheckOut',
        actionButtonB: 'requestActions.declineCheckOut',
        status: 'requestsStatus.RequestCheckOut',
        codeA: 14,
        codeB: 13,
      },
      13: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.CheckOutNotApproved',
        codeA: null,
        codeB: null,
      },
      14: {
        actionButtonA: 'requestActions.checkOut',
        actionButtonB: null,
        status: 'requestsStatus.CheckOutApproved',
        codeA: null,
        codeB: null,
      },
      15: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.CheckedOut',
        codeA: null,
        codeB: null,
      },
    },
    6: {
      1: {
        //   new
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.New',
        codeA: null,
        codeB: 5,
      },
      2: {
        //   in progress
        actionButtonA: 'requestActions.complete',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: 5,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
    },
  },
  SECURITY: {
    1: {
      1: {
        //   new
        actionButtonA: 'requestActions.accept',
        actionButtonB: 'requestActions.reject',
        status: 'requestsStatus.new',
        codeA: 18,
        codeB: 17,
      },
      2: {
        //   in progress
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: null,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   canceled
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
      16: {
        //    OpenRequest
        actionButtonA: 'requestActions.accept',
        actionButtonB: 'requestActions.decline',
        status: 'requestsStatus.new',
        codeA: 18,
        codeB: 17,
      },
      17: {
        //   DeclinedRequest
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.declined',
        codeA: null,
        codeB: null,
      },
      18: {
        //   AcceptRequest
        actionButtonA: 'requestActions.start',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.accepted',
        codeA: 20,
        codeB: 1,
      },
      19: {
        //   TimedOutRequest
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.timedOut',
        codeA: null,
        codeB: null,
      },
      20: {
        //   Started
        actionButtonA: 'requestActions.raiseQuote',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: 21,
        codeB: 1,
      },
      21: {
        //   RaiseQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancelQuote',
        status: 'requestsStatus.quoteRaised',
        codeA: null,
        codeB: 20,
      },
      22: {
        //   RejectedQuote
        actionButtonA: 'requestActions.raiseQuote',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteRejected',
        codeA: 21,
        codeB: 1,
      },
      23: {
        //   AcceptedQuote
        actionButtonA: 'requestActions.complete',
        actionButtonB: null,
        status: 'requestsStatus.quoteAccepted',
        codeA: 3,
        codeB: null,
      },
    },
    2: {
      1: {
        //   new
        actionButtonA: 'requestActions.accept',
        actionButtonB: 'requestActions.reject',
        status: 'requestsStatus.new',
        codeA: 18,
        codeB: 17,
      },
      2: {
        //   in progress
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: null,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   canceled
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
      16: {
        //    OpenRequest
        actionButtonA: 'requestActions.accept',
        actionButtonB: 'requestActions.decline',
        status: 'requestsStatus.new',
        codeA: 18,
        codeB: 17,
      },
      17: {
        //   DeclinedRequest
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.declined',
        codeA: null,
        codeB: null,
      },
      18: {
        //   AcceptRequest
        actionButtonA: 'requestActions.start',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.accepted',
        codeA: 20,
        codeB: 1,
      },
      19: {
        //   TimedOutRequest
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.timedOut',
        codeA: null,
        codeB: null,
      },
      20: {
        //   Started
        actionButtonA: 'requestActions.raiseQuote',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: 21,
        codeB: 1,
      },
      21: {
        //   RaiseQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancelQuote',
        status: 'requestsStatus.quoteRaised',
        codeA: null,
        codeB: 20,
      },
      22: {
        //   RejectedQuote
        actionButtonA: 'requestActions.raiseQuote',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteRejected',
        codeA: 21,
        codeB: 1,
      },
      23: {
        //   AcceptedQuote
        actionButtonA: 'requestActions.complete',
        actionButtonB: null,
        status: 'requestsStatus.quoteAccepted',
        codeA: 3,
        codeB: null,
      },
    },
    3: {
      1: {
        //   new
        actionButtonA: 'requestActions.accept',
        actionButtonB: 'requestActions.reject',
        status: 'requestsStatus.new',
        codeA: 18,
        codeB: 17,
      },
      2: {
        //   in progress
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: null,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   canceled
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
      16: {
        //    OpenRequest
        actionButtonA: 'requestActions.accept',
        actionButtonB: 'requestActions.decline',
        status: 'requestsStatus.new',
        codeA: 18,
        codeB: 17,
      },
      17: {
        //   DeclinedRequest
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.declined',
        codeA: null,
        codeB: null,
      },
      18: {
        //   AcceptRequest
        actionButtonA: 'requestActions.start',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.accepted',
        codeA: 20,
        codeB: 1,
      },
      19: {
        //   TimedOutRequest
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.timedOut',
        codeA: null,
        codeB: null,
      },
      20: {
        //   Started
        actionButtonA: 'requestActions.raiseQuote',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: 21,
        codeB: 1,
      },
      21: {
        //   RaiseQuote
        actionButtonA: null,
        actionButtonB: 'requestActions.cancelQuote',
        status: 'requestsStatus.quoteRaised',
        codeA: null,
        codeB: 20,
      },
      22: {
        //   RejectedQuote
        actionButtonA: 'requestActions.raiseQuote',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.quoteRejected',
        codeA: 21,
        codeB: 1,
      },
      23: {
        //   AcceptedQuote
        actionButtonA: 'requestActions.complete',
        actionButtonB: null,
        status: 'requestsStatus.quoteAccepted',
        codeA: 3,
        codeB: null,
      },
    },
    4: {
      1: {
        actionButtonA: 'requestActions.checkIn',
        actionButtonB: 'common.cancel',
        status: 'requestsStatus.New',
        codeA: 4,
        codeB: 5,
      },
      2: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: null,
      },
      3: {
        actionButtonA: null,
        actionButtonB: null,
        status: null,
        codeA: null,
        codeB: null,
      },
      4: {
        actionButtonA: 'requestActions.checkOut',
        actionButtonB: null,
        status: 'requestsStatus.CheckedIn',
        codeA: 15,
        codeB: null,
      },
      5: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.Cancel',
        codeA: null,
        codeB: null,
      },
      6: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.AwaitingManagerApproval',
        codeA: null,
        codeB: null,
      },
      7: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.ManagerNotApproved',
        codeA: null,
        codeB: null,
      },
      8: {
        actionButtonA: 'requestActions.checkIn',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.ManagerApproved',
        codeA: 4,
        codeB: 5,
      },
      9: {
        actionButtonA: null,
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.AwaitingTenantApproval',
        codeA: null,
        codeB: 5,
      },
      10: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.TenantNotApproved',
        codeA: null,
        codeB: null,
      },
      11: {
        actionButtonA: 'requestActions.checkIn',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.TenantApproved',
        codeA: 4,
        codeB: 5,
      },
      12: {
        actionButtonA: 'requestActions.approveCheckOut',
        actionButtonB: 'requestActions.declineCheckOut',
        status: 'requestsStatus.RequestCheckOut',
        codeA: 14,
        codeB: 13,
      },
      13: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.CheckOutNotApproved',
        codeA: null,
        codeB: null,
      },
      14: {
        actionButtonA: 'requestActions.checkOut',
        actionButtonB: null,
        status: 'requestsStatus.CheckOutApproved',
        codeA: null,
        codeB: null,
      },
      15: {
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.CheckedOut',
        codeA: null,
        codeB: null,
      },
    },
    6: {
      1: {
        //   new
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.New',
        codeA: null,
        codeB: 5,
      },
      2: {
        //   in progress
        actionButtonA: 'requestActions.complete',
        actionButtonB: 'requestActions.cancel',
        status: 'requestsStatus.inProgress',
        codeA: null,
        codeB: 5,
      },
      3: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.completed',
        codeA: null,
        codeB: null,
      },
      5: {
        //   completed / resolved
        actionButtonA: null,
        actionButtonB: null,
        status: 'requestsStatus.canceled',
        codeA: null,
        codeB: null,
      },
    },
  },
};

export const STATUS_COLORS = {
  1: theme.blue,
  2: theme.yellow,
  3: theme.green,
  4: theme.greyColor,
  5: theme.red,
  6: theme.orange,
  7: theme.orange,
  8: theme.orange,
  9: theme.orange,
  10: theme.orange,
  11: theme.orange,
  12: theme.orange,
  13: theme.orange,
  14: theme.orange,
  15: theme.orange,
  16: theme.orange,
  17: theme.orange,
  18: theme.orange,
  19: theme.orange,
  20: theme.orange,
  21: theme.orange,
  22: theme.red,
  23: theme.green,
};
