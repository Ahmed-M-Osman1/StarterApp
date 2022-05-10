export const RequestStatus = {
  // common requests
  New: 1,
  'In Progress': 2,
  Resolved: 3,
  Cancel: 5,
  // visit request
  'Checked In': 4,
  AwaitingManagerApproval: 6,
  ManagerNotApproved: 7,
  ManagerApproved: 8,
  AwaitingTenantApproval: 9,
  TenantNotApproved: 10,
  TenantApproved: 11,
  RequestCheckOut: 12,
  CheckOutNotApproved: 13,
  CheckOutApproved: 14,
  CheckedOut: 15,
  // service request
  OpenRequest: 16,
  DeclineRequest: 17,
  AcceptRequest: 18,
  TimedOutRequest: 19,
  Started: 20,
  RaiseQuote: 21,
  RejectedQuote: 22,
  AcceptedQuote: 23,
};
export const RequestStatusAsArray = Object.keys(RequestStatus);
