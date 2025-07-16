import React, { useState } from 'react';
import { Users, Clock, TrendingUp, Settings, RefreshCw, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

const QueueManager = () => {
  const { state, dispatch } = useQueue();
  const [selectedIndustry, setSelectedIndustry] = useState(state.settings.industry);
  
  const waitingCustomers = state.items.filter(item => item.status === 'waiting');
  const servingCustomers = state.items.filter(item => item.status === 'called');
  const completedCustomers = state.items.filter(item => item.status === 'completed');
  const noShowCustomers = state.items.filter(item => item.status === 'no-show');
  
  const urgentCustomers = waitingCustomers.filter(c => c.customerType === 'urgent');
  const vipCustomers = waitingCustomers.filter(c => c.customerType === 'vip');
  const elderlyCustomers = waitingCustomers.filter(c => c.customerType === 'elderly');
  
  const handleIndustryChange = (industry: typeof selectedIndustry) => {
    setSelectedIndustry(industry);
    dispatch({ type: 'SET_INDUSTRY', payload: industry });
  };
  
  const handleUpdateWaitTimes = () => {
    dispatch({ type: 'UPDATE_WAIT_TIMES' });
  };
  
  const handleRemoveCustomer = (customerId: string) => {
    dispatch({ type: 'NO_SHOW', payload: { customerId } });
  };
  
  const getPriorityColor = (customerType: string) => {
    switch (customerType) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'vip': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'elderly': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Settings Panel */}
      <div className="bg-background-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base lg:text-lg font-semibold text-text-primary flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Queue Configuration
          </h3>
          <button
            onClick={handleUpdateWaitTimes}
            className="flex items-center space-x-2 bg-primary-600 text-white px-3 lg:px-4 py-2 text-sm lg:text-base rounded-lg hover:bg-primary-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh Wait Times</span>
            <span className="sm:hidden">Refresh</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div>
            <label className="block text-sm lg:text-base font-medium text-text-secondary mb-2">
              Industry Type
            </label>
            <select
              value={selectedIndustry}
              onChange={(e) => handleIndustryChange(e.target.value as typeof selectedIndustry)}
              className="w-full px-3 py-2 text-sm lg:text-base border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
            >
              <option value="healthcare">Healthcare</option>
              <option value="banking">Banking</option>
              <option value="retail">Retail</option>
              <option value="government">Government</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm lg:text-base font-medium text-text-secondary mb-2">
              Priority Weights
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs lg:text-sm">
              <div className="flex justify-between">
                <span className="text-warning-600">Urgent:</span>
                <span className="font-medium">{state.settings.priorityWeights.urgent}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-teal-600">VIP:</span>
                <span className="font-medium">{state.settings.priorityWeights.vip}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-600">Elderly:</span>
                <span className="font-medium">{state.settings.priorityWeights.elderly}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Regular:</span>
                <span className="font-medium">{state.settings.priorityWeights.regular}x</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Queue Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <div className="bg-background-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-text-muted">Total Waiting</p>
              <p className="text-lg lg:text-2xl font-bold text-text-primary">{waitingCustomers.length}</p>
            </div>
            <div className="w-8 h-8 lg:w-12 lg:h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 lg:w-6 lg:h-6 text-primary-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-background-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-text-muted">Urgent Cases</p>
              <p className="text-lg lg:text-2xl font-bold text-warning-600">{urgentCustomers.length}</p>
            </div>
            <div className="w-8 h-8 lg:w-12 lg:h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 lg:w-6 lg:h-6 text-warning-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-background-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-text-muted">Currently Serving</p>
              <p className="text-lg lg:text-2xl font-bold text-success-600">{servingCustomers.length}</p>
            </div>
            <div className="w-8 h-8 lg:w-12 lg:h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 lg:w-6 lg:h-6 text-success-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-background-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-text-muted">Completed Today</p>
              <p className="text-lg lg:text-2xl font-bold text-text-primary">{state.totalServed}</p>
            </div>
            <div className="w-8 h-8 lg:w-12 lg:h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 lg:w-6 lg:h-6 text-neutral-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Queue Management */}
      <div className="bg-background-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base lg:text-lg font-semibold text-text-primary">Queue Management</h3>
          <div className="hidden sm:flex items-center space-x-2 text-sm text-text-muted">
            <Clock className="w-4 h-4" />
            <span>Auto-refresh: ON</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Priority Sections */}
          {urgentCustomers.length > 0 && (
            <div className="border-l-4 border-warning-600 pl-4">
              <h4 className="text-sm lg:text-base font-medium text-warning-800 mb-3 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Urgent Cases ({urgentCustomers.length})
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {urgentCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-2 lg:p-3 bg-warning-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 lg:w-8 lg:h-8 bg-warning-100 rounded-full flex items-center justify-center">
                        <span className="text-xs lg:text-sm font-medium text-warning-800">{customer.ticketNumber.slice(-3)}</span>
                      </div>
                      <div>
                        <p className="text-sm lg:text-base font-medium text-text-primary">{customer.customerName}</p>
                        <p className="text-xs lg:text-sm text-text-muted">{customer.serviceType}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs lg:text-sm text-warning-600 font-medium">{customer.estimatedWait}m</span>
                      <button
                        onClick={() => handleRemoveCustomer(customer.id)}
                        className="p-1 text-warning-400 hover:text-warning-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {vipCustomers.length > 0 && (
            <div className="border-l-4 border-teal-600 pl-4">
              <h4 className="text-sm lg:text-base font-medium text-teal-800 mb-3">VIP Customers ({vipCustomers.length})</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {vipCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-2 lg:p-3 bg-teal-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 lg:w-8 lg:h-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <span className="text-xs lg:text-sm font-medium text-teal-800">{customer.ticketNumber.slice(-3)}</span>
                      </div>
                      <div>
                        <p className="text-sm lg:text-base font-medium text-text-primary">{customer.customerName}</p>
                        <p className="text-xs lg:text-sm text-text-muted">{customer.serviceType}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs lg:text-sm text-teal-600 font-medium">{customer.estimatedWait}m</span>
                      <button
                        onClick={() => handleRemoveCustomer(customer.id)}
                        className="p-1 text-teal-400 hover:text-teal-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {elderlyCustomers.length > 0 && (
            <div className="border-l-4 border-primary-600 pl-4">
              <h4 className="text-sm lg:text-base font-medium text-primary-800 mb-3">Elderly/Disabled ({elderlyCustomers.length})</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {elderlyCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-2 lg:p-3 bg-primary-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 lg:w-8 lg:h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-xs lg:text-sm font-medium text-primary-800">{customer.ticketNumber.slice(-3)}</span>
                      </div>
                      <div>
                        <p className="text-sm lg:text-base font-medium text-text-primary">{customer.customerName}</p>
                        <p className="text-xs lg:text-sm text-text-muted">{customer.serviceType}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs lg:text-sm text-primary-600 font-medium">{customer.estimatedWait}m</span>
                      <button
                        onClick={() => handleRemoveCustomer(customer.id)}
                        className="p-1 text-primary-400 hover:text-primary-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Regular Customers */}
          <div className="border-l-4 border-neutral-300 pl-4">
            <h4 className="text-sm lg:text-base font-medium text-neutral-800 mb-3">Regular Queue ({waitingCustomers.filter(c => c.customerType === 'regular').length})</h4>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {waitingCustomers.filter(c => c.customerType === 'regular').map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-2 lg:p-3 bg-background-light rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-neutral-100 rounded-full flex items-center justify-center">
                      <span className="text-xs lg:text-sm font-medium text-neutral-800">{customer.ticketNumber.slice(-3)}</span>
                    </div>
                    <div>
                      <p className="text-sm lg:text-base font-medium text-text-primary">{customer.customerName}</p>
                      <p className="text-xs lg:text-sm text-text-muted">{customer.serviceType}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs lg:text-sm text-neutral-600 font-medium">{customer.estimatedWait}m</span>
                    <button
                      onClick={() => handleRemoveCustomer(customer.id)}
                      className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {waitingCustomers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 lg:w-16 lg:h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-sm lg:text-base text-text-muted">No customers in queue</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueueManager;