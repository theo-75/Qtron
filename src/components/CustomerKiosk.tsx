import React, { useState } from 'react';
import { User, Heart, Users, Clock, CheckCircle, ArrowRight, Ticket } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

const CustomerKiosk = () => {
  const { state, dispatch } = useQueue();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    customerType: 'regular' as const,
    serviceType: '',
    phone: ''
  });
  const [generatedTicket, setGeneratedTicket] = useState<string | null>(null);
  
  const industryServices = {
    healthcare: [
      'General Consultation',
      'Emergency Care',
      'Specialist Appointment',
      'Diagnostic Tests',
      'Follow-up Visit'
    ],
    banking: [
      'Account Opening',
      'Loan Application',
      'Investment Consultation',
      'Customer Support',
      'Foreign Exchange'
    ],
    retail: [
      'Product Return',
      'Customer Service',
      'Technical Support',
      'Warranty Claim',
      'General Inquiry'
    ],
    government: [
      'Document Processing',
      'License Renewal',
      'Permit Application',
      'Public Services',
      'Information Request'
    ]
  };
  
  const customerTypes = [
    {
      id: 'regular',
      label: 'Regular Service',
      description: 'Standard queue priority',
      icon: User,
      color: 'bg-primary-100 text-primary-800 border-primary-200'
    },
    {
      id: 'urgent',
      label: 'Urgent/Emergency',
      description: 'Immediate attention required',
      icon: Heart,
      color: 'bg-warning-100 text-warning-800 border-warning-200'
    },
    {
      id: 'elderly',
      label: 'Elderly/Disabled',
      description: 'Priority assistance',
      icon: Users,
      color: 'bg-success-100 text-success-800 border-success-200'
    },
    {
      id: 'vip',
      label: 'VIP Service',
      description: 'Premium customer service',
      icon: CheckCircle,
      color: 'bg-teal-100 text-teal-800 border-teal-200'
    }
  ];
  
  const handleSubmit = () => {
    if (formData.name && formData.serviceType) {
      dispatch({
        type: 'ADD_CUSTOMER',
        payload: {
          customerName: formData.name,
          customerType: formData.customerType,
          serviceType: formData.serviceType,
          estimatedWait: 0,
          status: 'waiting'
        }
      });
      
      setGeneratedTicket(`A${state.currentTicketNumber + 1}`);
      setStep(3);
    }
  };
  
  const resetForm = () => {
    setStep(1);
    setFormData({
      name: '',
      customerType: 'regular',
      serviceType: '',
      phone: ''
    });
    setGeneratedTicket(null);
  };
  
  const waitingCustomers = state.items.filter(item => item.status === 'waiting');
  const nextCustomer = waitingCustomers[0];
  const estimatedWait = waitingCustomers.length > 0 
    ? Math.round(waitingCustomers.reduce((sum, item) => sum + item.estimatedWait, 0) / waitingCustomers.length)
    : 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-primary-600 to-teal-600 rounded-2xl flex items-center justify-center">
              <Ticket className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome to Qtron</h1>
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">Smart Queue Management System</p>
        </div>
        
        {/* Current Queue Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6 mb-6 lg:mb-8">
          <div className="grid grid-cols-3 gap-3 lg:gap-6">
            <div className="text-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-2 lg:mb-3">
                <Users className="w-5 h-5 lg:w-6 lg:h-6 text-primary-600" />
              </div>
              <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">{waitingCustomers.length}</p>
              <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">People Waiting</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-success-100 dark:bg-success-900 rounded-full flex items-center justify-center mx-auto mb-2 lg:mb-3">
                <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-success-600" />
              </div>
              <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">{estimatedWait}m</p>
              <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Estimated Wait</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mx-auto mb-2 lg:mb-3">
                <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-teal-600" />
              </div>
              <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">{nextCustomer?.ticketNumber || 'None'}</p>
              <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Now Serving</p>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-8">
          {step === 1 && (
            <div className="space-y-4 lg:space-y-6">
              <div className="text-center">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2">Get Your Ticket</h2>
                <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">Please select your service type and priority</p>
              </div>
              
              <div>
                <label className="block text-sm lg:text-base font-medium text-gray-700 dark:text-gray-300 mb-2 lg:mb-3">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm lg:text-base font-medium text-gray-700 dark:text-gray-300 mb-2 lg:mb-3">
                  Service Type
                </label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select a service</option>
                  {industryServices[state.settings.industry].map((service) => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm lg:text-base font-medium text-gray-700 dark:text-gray-300 mb-2 lg:mb-3">
                  Priority Level
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {customerTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFormData({ ...formData, customerType: type.id as any })}
                      className={`p-3 lg:p-4 border-2 rounded-lg transition-all ${
                        formData.customerType === type.id
                          ? type.color
                          : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <type.icon className="w-5 h-5 lg:w-6 lg:h-6" />
                        <div className="text-left">
                          <p className="text-sm lg:text-base font-medium">{type.label}</p>
                          <p className="text-xs lg:text-sm opacity-75">{type.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={!formData.name || !formData.serviceType}
                  className="w-full bg-gradient-to-r from-primary-600 to-teal-600 text-white py-3 lg:py-4 px-4 lg:px-6 rounded-lg text-sm lg:text-base font-medium hover:from-primary-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
                >
                  <span>Get My Ticket</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="text-center space-y-4 lg:space-y-6">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-success-100 dark:bg-success-900 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 lg:w-10 lg:h-10 text-success-600" />
              </div>
              
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2">Ticket Generated!</h2>
                <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">Your ticket has been successfully created</p>
              </div>
              
              <div className="bg-gradient-to-r from-primary-600 to-teal-600 text-white p-6 lg:p-8 rounded-xl lg:rounded-2xl">
                <p className="text-xs lg:text-sm opacity-90 mb-2">Your Ticket Number</p>
                <p className="text-3xl lg:text-4xl font-bold mb-3 lg:mb-4">{generatedTicket}</p>
                <p className="text-xs lg:text-sm opacity-90">Please keep this number for reference</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 lg:p-6">
                <h3 className="text-sm lg:text-base font-semibold text-gray-900 dark:text-white mb-3">Service Details</h3>
                <div className="space-y-2 text-xs lg:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Name:</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Service:</span>
                    <span className="font-medium">{formData.serviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Priority:</span>
                    <span className="font-medium capitalize">{formData.customerType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Estimated Wait:</span>
                    <span className="font-medium">{estimatedWait} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Position:</span>
                    <span className="font-medium">{waitingCustomers.findIndex(c => c.customerName === formData.name) + 1 || waitingCustomers.length + 1} of {waitingCustomers.length + 1}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={resetForm}
                className="w-full bg-gray-600 text-white py-2 lg:py-3 px-4 lg:px-6 rounded-lg text-sm lg:text-base font-medium hover:bg-gray-700 transition-colors"
              >
                Get Another Ticket
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerKiosk;