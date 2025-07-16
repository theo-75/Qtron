import React from 'react';
import { Users, Clock, TrendingUp, AlertTriangle, CheckCircle, UserCheck, Activity, BarChart3 } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

const Dashboard = () => {
  const { state } = useQueue();
  
  const waitingCustomers = state.items.filter(item => item.status === 'waiting');
  const servingCustomers = state.items.filter(item => item.status === 'called');
  const completedToday = state.items.filter(item => item.status === 'completed');
  const urgentCustomers = waitingCustomers.filter(item => item.customerType === 'urgent');
  const availableStaff = state.staff.filter(staff => staff.status === 'available');
  
  const averageWaitTime = waitingCustomers.length > 0 
    ? Math.round(waitingCustomers.reduce((sum, item) => sum + item.estimatedWait, 0) / waitingCustomers.length)
    : 0;
  
  const efficiency = state.totalServed > 0 ? Math.round((completedToday.length / state.totalServed) * 100) : 0;
  
  const stats = [
    {
      label: 'Customers Waiting',
      value: waitingCustomers.length,
      icon: Users,
      color: 'bg-primary-600',
      trend: waitingCustomers.length > 10 ? 'high' : 'normal'
    },
    {
      label: 'Currently Serving',
      value: servingCustomers.length,
      icon: UserCheck,
      color: 'bg-success-600',
      trend: 'normal'
    },
    {
      label: 'Avg. Wait Time',
      value: `${averageWaitTime}m`,
      icon: Clock,
      color: 'bg-warning-600',
      trend: averageWaitTime > 15 ? 'high' : 'normal'
    },
    {
      label: 'Completed Today',
      value: state.totalServed,
      icon: CheckCircle,
      color: 'bg-teal-600',
      trend: 'normal'
    },
    {
      label: 'Urgent Cases',
      value: urgentCustomers.length,
      icon: AlertTriangle,
      color: 'bg-warning-600',
      trend: urgentCustomers.length > 0 ? 'high' : 'normal'
    },
    {
      label: 'Staff Available',
      value: availableStaff.length,
      icon: Activity,
      color: 'bg-teal-600',
      trend: availableStaff.length < 2 ? 'low' : 'normal'
    },
    {
      label: 'Efficiency',
      value: `${efficiency}%`,
      icon: TrendingUp,
      color: 'bg-primary-600',
      trend: efficiency > 85 ? 'high' : 'normal'
    },
    {
      label: 'No-Shows',
      value: state.items.filter(item => item.status === 'no-show').length,
      icon: BarChart3,
      color: 'bg-neutral-600',
      trend: 'normal'
    }
  ];
  
  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg lg:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`w-8 h-8 lg:w-12 lg:h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
            {stat.trend === 'high' && (
              <div className="mt-3 flex items-center text-warning-600">
                <AlertTriangle className="w-4 h-4 mr-1" />
                <span className="text-xs lg:text-sm">Attention needed</span>
              </div>
            )}
            {stat.trend === 'low' && (
              <div className="mt-3 flex items-center text-warning-600">
                <AlertTriangle className="w-4 h-4 mr-1" />
                <span className="text-xs lg:text-sm">Low capacity</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Current Queue Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg lg:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Queue</h3>
          <div className="space-y-3">
            {waitingCustomers.slice(0, 8).map((customer, index) => (
              <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-medium ${
                    customer.customerType === 'urgent' ? 'bg-warning-100 dark:bg-warning-900 text-warning-800 dark:text-warning-200' :
                    customer.customerType === 'vip' ? 'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200' :
                    customer.customerType === 'elderly' ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200' :
                    'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm lg:text-base font-medium text-gray-900 dark:text-white">{customer.customerName}</p>
                    <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">{customer.ticketNumber} • {customer.serviceType}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs lg:text-sm font-medium text-gray-900 dark:text-white">{customer.estimatedWait}m</p>
                  <p className={`text-xs ${
                    customer.customerType === 'urgent' ? 'text-warning-600 dark:text-warning-400' :
                    customer.customerType === 'vip' ? 'text-teal-600 dark:text-teal-400' :
                    customer.customerType === 'elderly' ? 'text-primary-600 dark:text-primary-400' :
                    'text-gray-600 dark:text-gray-400'
                  }`}>
                    {customer.customerType.toUpperCase()}
                  </p>
                </div>
              </div>
            ))}
            {waitingCustomers.length === 0 && (
              <p className="text-center text-gray-600 dark:text-gray-400 py-6 lg:py-8 text-sm lg:text-base">No customers waiting</p>
            )}
            {waitingCustomers.length > 8 && (
              <div className="text-center pt-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  +{waitingCustomers.length - 8} more customers in queue
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg lg:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-4">Staff Status</h3>
          <div className="space-y-3">
            {state.staff.map((staff) => (
              <div key={staff.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center ${
                    staff.status === 'available' ? 'bg-success-100 dark:bg-success-900' :
                    staff.status === 'busy' ? 'bg-warning-100 dark:bg-warning-900' :
                    staff.status === 'break' ? 'bg-warning-100 dark:bg-warning-900' :
                    'bg-gray-100 dark:bg-gray-600'
                  }`}>
                    <UserCheck className={`w-4 h-4 lg:w-5 lg:h-5 ${
                      staff.status === 'available' ? 'text-success-600 dark:text-success-400' :
                      staff.status === 'busy' ? 'text-warning-600 dark:text-warning-400' :
                      staff.status === 'break' ? 'text-warning-600 dark:text-warning-400' :
                      'text-gray-600 dark:text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm lg:text-base font-medium text-gray-900 dark:text-white">{staff.name}</p>
                    <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Counter {staff.counter}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xs lg:text-sm font-medium ${
                    staff.status === 'available' ? 'text-success-600 dark:text-success-400' :
                    staff.status === 'busy' ? 'text-warning-600 dark:text-warning-400' :
                    staff.status === 'break' ? 'text-warning-600 dark:text-warning-400' :
                    'text-gray-600 dark:text-gray-400'
                  }`}>
                    {staff.status.toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{staff.serviceCount} served</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Alerts */}
      {(urgentCustomers.length > 0 || averageWaitTime > 20 || availableStaff.length < 2) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg lg:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 text-warning-600 mr-2" />
            System Alerts
          </h3>
          <div className="space-y-3">
            {urgentCustomers.length > 0 && (
              <div className="p-3 bg-warning-50 dark:bg-warning-900 border border-warning-200 dark:border-warning-700 rounded-lg">
                <p className="text-sm lg:text-base text-warning-800 dark:text-warning-200 font-medium">Urgent cases waiting: {urgentCustomers.length}</p>
                <p className="text-warning-600 dark:text-warning-400 text-xs lg:text-sm">Consider prioritizing these customers immediately</p>
              </div>
            )}
            {averageWaitTime > 20 && (
              <div className="p-3 bg-warning-50 dark:bg-warning-900 border border-warning-200 dark:border-warning-700 rounded-lg">
                <p className="text-sm lg:text-base text-warning-800 dark:text-warning-200 font-medium">High wait times detected</p>
                <p className="text-warning-600 dark:text-warning-400 text-xs lg:text-sm">Average wait time is {averageWaitTime} minutes</p>
              </div>
            )}
            {availableStaff.length < 2 && (
              <div className="p-3 bg-primary-50 dark:bg-primary-900 border border-primary-200 dark:border-primary-700 rounded-lg">
                <p className="text-sm lg:text-base text-primary-800 dark:text-primary-200 font-medium">Low staff availability</p>
                <p className="text-primary-600 dark:text-primary-400 text-xs lg:text-sm">Consider calling additional staff members</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;