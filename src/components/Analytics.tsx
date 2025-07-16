import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, Clock, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

const Analytics = () => {
  const { state } = useQueue();
  
  const completedToday = state.items.filter(item => item.status === 'completed');
  const noShowToday = state.items.filter(item => item.status === 'no-show');
  const urgentHandled = completedToday.filter(item => item.customerType === 'urgent');
  const vipHandled = completedToday.filter(item => item.customerType === 'vip');
  
  const averageServiceTime = state.staff.reduce((sum, staff) => sum + staff.averageServiceTime, 0) / state.staff.length;
  const totalServiceTime = completedToday.reduce((sum, item) => sum + (item.actualWait || 0), 0);
  const averageWaitTime = completedToday.length > 0 ? totalServiceTime / completedToday.length : 0;
  
  const efficiency = state.totalServed > 0 ? Math.round((completedToday.length / state.totalServed) * 100) : 0;
  const noShowRate = (noShowToday.length / (completedToday.length + noShowToday.length)) * 100;
  
  // Simulated hourly data for charts
  const hourlyData = [
    { hour: '9:00', customers: 18, wait: 12 },
    { hour: '10:00', customers: 25, wait: 18 },
    { hour: '11:00', customers: 32, wait: 22 },
    { hour: '12:00', customers: 38, wait: 28 },
    { hour: '13:00', customers: 29, wait: 20 },
    { hour: '14:00', customers: 35, wait: 24 },
    { hour: '15:00', customers: 42, wait: 32 },
    { hour: '16:00', customers: 31, wait: 18 },
  ];
  
  const customerTypeData = [
    { type: 'Regular', count: state.items.filter(i => i.customerType === 'regular').length, color: 'bg-neutral-500' },
    { type: 'VIP', count: state.items.filter(i => i.customerType === 'vip').length, color: 'bg-teal-500' },
    { type: 'Elderly', count: state.items.filter(i => i.customerType === 'elderly').length, color: 'bg-primary-500' },
    { type: 'Urgent', count: state.items.filter(i => i.customerType === 'urgent').length, color: 'bg-warning-500' },
  ];
  
  const staffPerformance = state.staff.map(staff => ({
    name: staff.name,
    served: staff.serviceCount,
    avgTime: staff.averageServiceTime,
    efficiency: Math.round((staff.serviceCount / (staff.serviceCount + 5)) * 100), // Simulated efficiency
  }));
  
  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <div className="bg-background-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs lg:text-sm font-medium text-text-muted">Total Served Today</h3>
            <CheckCircle className="w-5 h-5 text-success-500" />
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-lg lg:text-2xl font-bold text-text-primary">{state.totalServed}</p>
            <div className="flex items-center text-success-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-xs lg:text-sm">+12%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-background-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs lg:text-sm font-medium text-text-muted">Average Wait Time</h3>
            <Clock className="w-5 h-5 text-primary-500" />
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-lg lg:text-2xl font-bold text-text-primary">{averageWaitTime.toFixed(1)}m</p>
            <div className="flex items-center text-success-600">
              <TrendingDown className="w-4 h-4 mr-1" />
              <span className="text-xs lg:text-sm">-8%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-background-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs lg:text-sm font-medium text-text-muted">Service Efficiency</h3>
            <BarChart3 className="w-5 h-5 text-teal-500" />
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-lg lg:text-2xl font-bold text-text-primary">{efficiency}%</p>
            <div className="flex items-center text-success-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-xs lg:text-sm">+5%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-background-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs lg:text-sm font-medium text-text-muted">No-Show Rate</h3>
            <AlertTriangle className="w-5 h-5 text-warning-500" />
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-lg lg:text-2xl font-bold text-text-primary">{noShowRate.toFixed(1)}%</p>
            <div className="flex items-center text-warning-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-xs lg:text-sm">+2%</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Hourly Traffic */}
        <div className="bg-background-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-semibold text-text-primary mb-4">Hourly Traffic</h3>
          <div className="space-y-4">
            {hourlyData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-xs lg:text-sm text-text-muted w-12 lg:w-16">{data.hour}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-neutral-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: `${(data.customers / 45) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs lg:text-sm font-medium text-text-primary">{data.customers}</span>
                  <span className="text-xs text-text-muted ml-1 lg:ml-2">{data.wait}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Customer Types */}
        <div className="bg-background-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-semibold text-text-primary mb-4">Customer Distribution</h3>
          <div className="space-y-4">
            {customerTypeData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${data.color}`}></div>
                  <span className="text-xs lg:text-sm text-text-muted">{data.type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs lg:text-sm font-medium text-text-primary">{data.count}</span>
                  <span className="text-xs text-text-muted">
                    {((data.count / state.items.length) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Staff Performance */}
      <div className="bg-background-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-semibold text-text-primary mb-4">Staff Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left text-xs lg:text-sm font-medium text-text-muted py-2 lg:py-3">Staff Member</th>
                <th className="text-left text-xs lg:text-sm font-medium text-text-muted py-2 lg:py-3 hidden sm:table-cell">Customers Served</th>
                <th className="text-left text-xs lg:text-sm font-medium text-text-muted py-2 lg:py-3 hidden md:table-cell">Avg. Service Time</th>
                <th className="text-left text-xs lg:text-sm font-medium text-text-muted py-2 lg:py-3">Efficiency</th>
                <th className="text-left text-xs lg:text-sm font-medium text-text-muted py-2 lg:py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {staffPerformance.map((staff, index) => (
                <tr key={index} className="border-b border-neutral-100">
                  <td className="py-2 lg:py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 lg:w-8 lg:h-8 bg-neutral-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-neutral-600" />
                      </div>
                      <span className="text-xs lg:text-sm font-medium text-text-primary">{staff.name}</span>
                    </div>
                  </td>
                  <td className="py-2 lg:py-3 text-xs lg:text-sm text-text-muted hidden sm:table-cell">{staff.served}</td>
                  <td className="py-2 lg:py-3 text-xs lg:text-sm text-text-muted hidden md:table-cell">{staff.avgTime.toFixed(1)}m</td>
                  <td className="py-2 lg:py-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-12 lg:w-16 bg-neutral-200 rounded-full h-2">
                        <div 
                          className="bg-success-500 h-2 rounded-full"
                          style={{ width: `${staff.efficiency}%` }}
                        ></div>
                      </div>
                      <span className="text-xs lg:text-sm text-text-muted">{staff.efficiency}%</span>
                    </div>
                  </td>
                  <td className="py-2 lg:py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      state.staff[index].status === 'available' ? 'bg-success-100 text-success-800' :
                      state.staff[index].status === 'busy' ? 'bg-warning-100 text-warning-800' :
                      'bg-warning-100 text-warning-800'
                    }`}>
                      {state.staff[index].status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* AI Insights */}
      <div className="bg-background-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-semibold text-text-primary mb-4">AI Insights & Recommendations</h3>
        <div className="space-y-4">
          <div className="p-3 lg:p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <h4 className="text-sm lg:text-base font-medium text-primary-900 mb-2">Peak Time Optimization</h4>
            <p className="text-xs lg:text-sm text-primary-800">
              Your busiest period is 3:00-4:00 PM. Consider adding an extra staff member during this time to reduce wait times by an estimated 25%.
            </p>
          </div>
          
          <div className="p-3 lg:p-4 bg-success-50 border border-success-200 rounded-lg">
            <h4 className="text-sm lg:text-base font-medium text-success-900 mb-2">Efficiency Improvement</h4>
            <p className="text-xs lg:text-sm text-success-800">
              Your current efficiency is 12% higher than last week. The AI priority system has reduced urgent case wait times by 35%.
            </p>
          </div>
          
          <div className="p-3 lg:p-4 bg-warning-50 border border-warning-200 rounded-lg">
            <h4 className="text-sm lg:text-base font-medium text-warning-900 mb-2">Staff Allocation</h4>
            <p className="text-xs lg:text-sm text-warning-800">
              Emma Davis has the fastest service time (6.8m avg). Consider assigning her to elderly customers for optimal experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;