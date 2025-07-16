import React from 'react';
import { User, Clock, Phone, CheckCircle, X, AlertTriangle, Play, Pause } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

const StaffPanel = () => {
  const { state, dispatch } = useQueue();
  
  const availableStaff = state.staff.filter(staff => staff.status === 'available');
  const busyStaff = state.staff.filter(staff => staff.status === 'busy');
  const waitingCustomers = state.items.filter(item => item.status === 'waiting');
  const servingCustomers = state.items.filter(item => item.status === 'called');
  
  const handleCallNext = (staffId: string, counterId: number) => {
    dispatch({
      type: 'CALL_NEXT',
      payload: { staffId, counterId }
    });
  };
  
  const handleCompleteService = (customerId: string) => {
    const serviceTime = Math.floor(Math.random() * 10) + 5; // 5-15 minutes
    dispatch({
      type: 'COMPLETE_SERVICE',
      payload: { customerId, serviceTime }
    });
  };
  
  const handleNoShow = (customerId: string) => {
    dispatch({
      type: 'NO_SHOW',
      payload: { customerId }
    });
  };
  
  const handleStaffStatus = (staffId: string, status: 'available' | 'busy' | 'break' | 'offline') => {
    dispatch({
      type: 'UPDATE_STAFF',
      payload: { staffId, status }
    });
  };
  
  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Quick Actions */}
      <div className="bg-background-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          <button
            onClick={() => {
              if (availableStaff.length > 0 && waitingCustomers.length > 0) {
                handleCallNext(availableStaff[0].id, availableStaff[0].counter);
              }
            }}
            disabled={availableStaff.length === 0 || waitingCustomers.length === 0}
            className="flex items-center justify-center space-x-2 bg-success-600 text-white px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base rounded-lg hover:bg-success-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Play className="w-4 h-4 lg:w-5 lg:h-5" />
            <span>Call Next Customer</span>
          </button>
          
          <button
            onClick={() => {
              const urgentCustomers = waitingCustomers.filter(c => c.customerType === 'urgent');
              if (urgentCustomers.length > 0 && availableStaff.length > 0) {
                const staff = availableStaff[0];
                const customer = urgentCustomers[0];
                handleCallNext(staff.id, staff.counter);
              }
            }}
            disabled={waitingCustomers.filter(c => c.customerType === 'urgent').length === 0 || availableStaff.length === 0}
            className="flex items-center justify-center space-x-2 bg-warning-600 text-white px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base rounded-lg hover:bg-warning-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5" />
            <span>Call Urgent</span>
          </button>
          
          <button
            onClick={() => dispatch({ type: 'UPDATE_WAIT_TIMES' })}
            className="flex items-center justify-center space-x-2 bg-primary-600 text-white px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base rounded-lg hover:bg-primary-700 transition-colors sm:col-span-2 lg:col-span-1"
          >
            <Clock className="w-4 h-4 lg:w-5 lg:h-5" />
            <span>Update Wait Times</span>
          </button>
        </div>
      </div>
      
      {/* Staff Status */}
      <div className="bg-background-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-semibold text-text-primary mb-4">Staff Management</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {state.staff.map((staff) => (
            <div key={staff.id} className="border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center ${
                    staff.status === 'available' ? 'bg-success-100' :
                    staff.status === 'busy' ? 'bg-warning-100' :
                    staff.status === 'break' ? 'bg-warning-100' :
                    'bg-neutral-100'
                  }`}>
                    <User className={`w-4 h-4 lg:w-5 lg:h-5 ${
                      staff.status === 'available' ? 'text-success-600' :
                      staff.status === 'busy' ? 'text-warning-600' :
                      staff.status === 'break' ? 'text-warning-600' :
                      'text-neutral-600'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm lg:text-base font-medium text-text-primary">{staff.name}</p>
                    <p className="text-xs lg:text-sm text-text-muted">Counter {staff.counter}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  staff.status === 'available' ? 'bg-success-100 text-success-800' :
                  staff.status === 'busy' ? 'bg-warning-100 text-warning-800' :
                  staff.status === 'break' ? 'bg-warning-100 text-warning-800' :
                  'bg-neutral-100 text-neutral-800'
                }`}>
                  {staff.status.toUpperCase()}
                </span>
              </div>
              
              <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-text-muted mb-4">
                <div className="flex justify-between">
                  <span>Today's Count:</span>
                  <span className="font-medium">{staff.serviceCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg. Service Time:</span>
                  <span className="font-medium">{staff.averageServiceTime.toFixed(1)}m</span>
                </div>
                <div className="flex justify-between">
                  <span>Expertise:</span>
                  <span className="font-medium text-right">{staff.expertise.join(', ')}</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                {staff.status === 'available' && waitingCustomers.length > 0 && (
                  <button
                    onClick={() => handleCallNext(staff.id, staff.counter)}
                    className="flex-1 bg-primary-600 text-white text-xs lg:text-sm py-2 px-3 rounded hover:bg-primary-700 transition-colors"
                  >
                    Call Next
                  </button>
                )}
                
                {staff.status === 'available' && (
                  <button
                    onClick={() => handleStaffStatus(staff.id, 'break')}
                    className="flex-1 bg-warning-600 text-white text-xs lg:text-sm py-2 px-3 rounded hover:bg-warning-700 transition-colors"
                  >
                    Take Break
                  </button>
                )}
                
                {staff.status === 'break' && (
                  <button
                    onClick={() => handleStaffStatus(staff.id, 'available')}
                    className="flex-1 bg-success-600 text-white text-xs lg:text-sm py-2 px-3 rounded hover:bg-success-700 transition-colors"
                  >
                    Return
                  </button>
                )}
                
                {staff.status === 'busy' && (
                  <button
                    onClick={() => handleStaffStatus(staff.id, 'available')}
                    className="flex-1 bg-neutral-600 text-white text-xs lg:text-sm py-2 px-3 rounded hover:bg-neutral-700 transition-colors"
                  >
                    Force Available
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Current Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="bg-background-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-semibold text-text-primary mb-4">Currently Serving</h3>
          <div className="space-y-3">
            {servingCustomers.map((customer) => {
              const staff = state.staff.find(s => s.id === customer.staffId);
              return (
                <div key={customer.id} className="border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm lg:text-base font-medium text-text-primary">{customer.customerName}</p>
                      <p className="text-xs lg:text-sm text-text-muted">{customer.ticketNumber} • Counter {customer.counter}</p>
                      <p className="text-xs lg:text-sm text-text-muted">Staff: {staff?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs lg:text-sm font-medium ${
                        customer.customerType === 'urgent' ? 'text-warning-600' :
                        customer.customerType === 'vip' ? 'text-teal-600' :
                        customer.customerType === 'elderly' ? 'text-primary-600' :
                        'text-neutral-600'
                      }`}>
                        {customer.customerType.toUpperCase()}
                      </p>
                      <p className="text-xs text-text-muted">
                        {customer.callTime ? `Called ${Math.floor((Date.now() - customer.callTime.getTime()) / 60000)}m ago` : ''}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={() => handleCompleteService(customer.id)}
                      className="flex-1 bg-success-600 text-white text-xs lg:text-sm py-2 px-3 rounded hover:bg-success-700 transition-colors flex items-center justify-center space-x-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Complete</span>
                    </button>
                    <button
                      onClick={() => handleNoShow(customer.id)}
                      className="flex-1 bg-warning-600 text-white text-xs lg:text-sm py-2 px-3 rounded hover:bg-warning-700 transition-colors flex items-center justify-center space-x-1"
                    >
                      <X className="w-4 h-4" />
                      <span>No Show</span>
                    </button>
                  </div>
                </div>
              );
            })}
            {servingCustomers.length === 0 && (
              <p className="text-center text-text-muted py-6 lg:py-8 text-sm lg:text-base">No customers currently being served</p>
            )}
          </div>
        </div>
        
        <div className="bg-background-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-semibold text-text-primary mb-4">Next in Queue</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {waitingCustomers.slice(0, 10).map((customer, index) => (
              <div key={customer.id} className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs lg:text-sm font-medium ${
                      index === 0 ? 'bg-success-100 text-success-800' : 'bg-neutral-100 text-neutral-800'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm lg:text-base font-medium text-text-primary">{customer.customerName}</p>
                      <p className="text-xs lg:text-sm text-text-muted">{customer.ticketNumber} • {customer.serviceType}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs lg:text-sm font-medium ${
                      customer.customerType === 'urgent' ? 'text-warning-600' :
                      customer.customerType === 'vip' ? 'text-teal-600' :
                      customer.customerType === 'elderly' ? 'text-primary-600' :
                      'text-neutral-600'
                    }`}>
                      {customer.customerType.toUpperCase()}
                    </p>
                    <p className="text-xs text-text-muted">{customer.estimatedWait}m wait</p>
                  </div>
                </div>
              </div>
            ))}
            {waitingCustomers.length === 0 && (
              <p className="text-center text-text-muted py-6 lg:py-8 text-sm lg:text-base">No customers waiting</p>
            )}
            {waitingCustomers.length > 10 && (
              <div className="text-center pt-3 border-t border-neutral-200">
                <p className="text-sm text-text-muted">
                  +{waitingCustomers.length - 10} more in queue
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffPanel;