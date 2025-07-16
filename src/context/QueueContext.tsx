import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface QueueItem {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerType: 'regular' | 'vip' | 'elderly' | 'urgent';
  serviceType: string;
  priority: number;
  estimatedWait: number;
  actualWait?: number;
  status: 'waiting' | 'called' | 'serving' | 'completed' | 'no-show';
  joinTime: Date;
  callTime?: Date;
  serviceTime?: Date;
  completionTime?: Date;
  counter?: number;
  staffId?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  counter: number;
  status: 'available' | 'busy' | 'break' | 'offline';
  currentCustomer?: string;
  serviceCount: number;
  averageServiceTime: number;
  expertise: string[];
}

export interface QueueState {
  items: QueueItem[];
  staff: StaffMember[];
  counters: number;
  totalServed: number;
  averageWaitTime: number;
  currentTicketNumber: number;
  settings: {
    industry: 'healthcare' | 'banking' | 'retail' | 'government';
    maxWaitTime: number;
    priorityWeights: {
      urgent: number;
      vip: number;
      elderly: number;
      regular: number;
    };
  };
}

type QueueAction = 
  | { type: 'ADD_CUSTOMER'; payload: Omit<QueueItem, 'id' | 'ticketNumber' | 'joinTime' | 'priority'> }
  | { type: 'CALL_NEXT'; payload: { counterId: number; staffId: string } }
  | { type: 'COMPLETE_SERVICE'; payload: { customerId: string; serviceTime: number } }
  | { type: 'UPDATE_STAFF'; payload: { staffId: string; status: StaffMember['status'] } }
  | { type: 'NO_SHOW'; payload: { customerId: string } }
  | { type: 'UPDATE_WAIT_TIMES' }
  | { type: 'SET_INDUSTRY'; payload: QueueState['settings']['industry'] };

const QueueContext = createContext<{
  state: QueueState;
  dispatch: React.Dispatch<QueueAction>;
} | null>(null);

const calculatePriority = (customerType: QueueItem['customerType'], settings: QueueState['settings']) => {
  const weights = settings.priorityWeights;
  const baseTime = Date.now();
  
  switch (customerType) {
    case 'urgent':
      return weights.urgent * 1000;
    case 'vip':
      return weights.vip * 1000;
    case 'elderly':
      return weights.elderly * 1000;
    default:
      return weights.regular * 1000;
  }
};

const generateWaitTime = (queuePosition: number, customerType: QueueItem['customerType'], avgServiceTime: number = 8) => {
  const baseWait = queuePosition * avgServiceTime;
  const variation = Math.random() * 3 - 1.5; // ±1.5 minutes variation
  const typeMultiplier = customerType === 'urgent' ? 0.3 : customerType === 'vip' ? 0.5 : 1;
  
  return Math.max(1, Math.round(baseWait * typeMultiplier + variation));
};

const initialState: QueueState = {
  items: [],
  staff: [
    { id: '1', name: 'Dr. Sarah Johnson', counter: 1, status: 'available', serviceCount: 28, averageServiceTime: 6.5, expertise: ['general', 'urgent'] },
    { id: '2', name: 'Dr. Michael Chen', counter: 2, status: 'busy', serviceCount: 24, averageServiceTime: 8.2, expertise: ['vip', 'complex'] },
    { id: '3', name: 'Dr. Emma Davis', counter: 3, status: 'available', serviceCount: 35, averageServiceTime: 5.8, expertise: ['general', 'elderly'] },
    { id: '4', name: 'Dr. James Wilson', counter: 4, status: 'available', serviceCount: 22, averageServiceTime: 7.1, expertise: ['urgent', 'complex'] },
    { id: '5', name: 'Dr. Lisa Rodriguez', counter: 5, status: 'available', serviceCount: 19, averageServiceTime: 6.9, expertise: ['elderly', 'general'] },
    { id: '6', name: 'Dr. Kevin Park', counter: 6, status: 'break', serviceCount: 16, averageServiceTime: 7.8, expertise: ['vip', 'urgent'] },
  ],
  counters: 6,
  totalServed: 312,
  averageWaitTime: 12.5,
  currentTicketNumber: 1025,
  settings: {
    industry: 'healthcare',
    maxWaitTime: 30,
    priorityWeights: {
      urgent: 10,
      vip: 7,
      elderly: 5,
      regular: 1
    }
  }
};

// Add some initial queue items
const sampleCustomers: Omit<QueueItem, 'id' | 'ticketNumber' | 'joinTime' | 'priority'>[] = [
  // Urgent Cases (High Priority)
  { customerName: 'John Smith', customerType: 'urgent', serviceType: 'Emergency Care', estimatedWait: 2, status: 'waiting' },
  { customerName: 'Sarah Martinez', customerType: 'urgent', serviceType: 'Emergency Consultation', estimatedWait: 3, status: 'waiting' },
  { customerName: 'Michael Thompson', customerType: 'urgent', serviceType: 'Urgent Treatment', estimatedWait: 4, status: 'waiting' },
  
  // VIP Customers
  { customerName: 'Maria Garcia', customerType: 'vip', serviceType: 'Premium Service', estimatedWait: 6, status: 'waiting' },
  { customerName: 'James Wilson', customerType: 'vip', serviceType: 'VIP Consultation', estimatedWait: 8, status: 'waiting' },
  { customerName: 'Elizabeth Chen', customerType: 'vip', serviceType: 'Executive Health Check', estimatedWait: 10, status: 'waiting' },
  { customerName: 'Robert Anderson', customerType: 'vip', serviceType: 'Premium Care', estimatedWait: 12, status: 'waiting' },
  
  // Elderly/Disabled Priority
  { customerName: 'Dorothy Johnson', customerType: 'elderly', serviceType: 'Senior Care', estimatedWait: 14, status: 'waiting' },
  { customerName: 'Harold Davis', customerType: 'elderly', serviceType: 'Geriatric Consultation', estimatedWait: 16, status: 'waiting' },
  { customerName: 'Margaret White', customerType: 'elderly', serviceType: 'Mobility Assessment', estimatedWait: 18, status: 'waiting' },
  { customerName: 'Frank Miller', customerType: 'elderly', serviceType: 'Senior Health Check', estimatedWait: 20, status: 'waiting' },
  { customerName: 'Ruth Taylor', customerType: 'elderly', serviceType: 'Elderly Care', estimatedWait: 22, status: 'waiting' },
  
  // Regular Customers
  { customerName: 'Lisa Wong', customerType: 'regular', serviceType: 'General Consultation', estimatedWait: 24, status: 'waiting' },
  { customerName: 'David Miller', customerType: 'regular', serviceType: 'Routine Checkup', estimatedWait: 26, status: 'waiting' },
  { customerName: 'Jennifer Brown', customerType: 'regular', serviceType: 'Follow-up Visit', estimatedWait: 28, status: 'waiting' },
  { customerName: 'Kevin Rodriguez', customerType: 'regular', serviceType: 'Health Screening', estimatedWait: 30, status: 'waiting' },
  { customerName: 'Amanda Lee', customerType: 'regular', serviceType: 'General Service', estimatedWait: 32, status: 'waiting' },
  { customerName: 'Christopher Moore', customerType: 'regular', serviceType: 'Consultation', estimatedWait: 34, status: 'waiting' },
  { customerName: 'Jessica Clark', customerType: 'regular', serviceType: 'Routine Service', estimatedWait: 36, status: 'waiting' },
  { customerName: 'Daniel Lewis', customerType: 'regular', serviceType: 'Health Check', estimatedWait: 38, status: 'waiting' },
  { customerName: 'Michelle Walker', customerType: 'regular', serviceType: 'General Care', estimatedWait: 40, status: 'waiting' },
  { customerName: 'Ryan Hall', customerType: 'regular', serviceType: 'Consultation', estimatedWait: 42, status: 'waiting' },
  { customerName: 'Nicole Young', customerType: 'regular', serviceType: 'Routine Visit', estimatedWait: 44, status: 'waiting' },
  { customerName: 'Brandon King', customerType: 'regular', serviceType: 'Health Service', estimatedWait: 46, status: 'waiting' },
  { customerName: 'Stephanie Wright', customerType: 'regular', serviceType: 'General Checkup', estimatedWait: 48, status: 'waiting' },
  { customerName: 'Tyler Green', customerType: 'regular', serviceType: 'Consultation', estimatedWait: 50, status: 'waiting' },
];

// Initialize with sample data
initialState.items = sampleCustomers.map((customer, index) => ({
  ...customer,
  id: `customer-${index + 1}`,
  ticketNumber: `A${1001 + index}`,
  joinTime: new Date(Date.now() - (index * 120000)), // 2 minutes apart for more realistic timing
  priority: calculatePriority(customer.customerType, initialState.settings)
}));

function queueReducer(state: QueueState, action: QueueAction): QueueState {
  switch (action.type) {
    case 'ADD_CUSTOMER': {
      const newCustomer: QueueItem = {
        ...action.payload,
        id: `customer-${Date.now()}`,
        ticketNumber: `A${state.currentTicketNumber + 1}`,
        joinTime: new Date(),
        priority: calculatePriority(action.payload.customerType, state.settings)
      };
      
      const waitingCustomers = state.items.filter(item => item.status === 'waiting');
      const queuePosition = waitingCustomers.length + 1;
      newCustomer.estimatedWait = generateWaitTime(queuePosition, action.payload.customerType);
      
      return {
        ...state,
        items: [...state.items, newCustomer].sort((a, b) => b.priority - a.priority),
        currentTicketNumber: state.currentTicketNumber + 1
      };
    }
    
    case 'CALL_NEXT': {
      const { counterId, staffId } = action.payload;
      const nextCustomer = state.items.find(item => item.status === 'waiting');
      
      if (!nextCustomer) return state;
      
      const updatedItems = state.items.map(item => 
        item.id === nextCustomer.id 
          ? { ...item, status: 'called' as const, callTime: new Date(), counter: counterId, staffId }
          : item
      );
      
      const updatedStaff = state.staff.map(staff => 
        staff.id === staffId 
          ? { ...staff, status: 'busy' as const, currentCustomer: nextCustomer.id }
          : staff
      );
      
      return {
        ...state,
        items: updatedItems,
        staff: updatedStaff
      };
    }
    
    case 'COMPLETE_SERVICE': {
      const { customerId, serviceTime } = action.payload;
      const customer = state.items.find(item => item.id === customerId);
      
      if (!customer) return state;
      
      const updatedItems = state.items.map(item => 
        item.id === customerId 
          ? { 
              ...item, 
              status: 'completed' as const, 
              completionTime: new Date(),
              actualWait: serviceTime
            }
          : item
      );
      
      const updatedStaff = state.staff.map(staff => 
        staff.id === customer.staffId 
          ? { 
              ...staff, 
              status: 'available' as const, 
              currentCustomer: undefined,
              serviceCount: staff.serviceCount + 1,
              averageServiceTime: (staff.averageServiceTime + serviceTime) / 2
            }
          : staff
      );
      
      return {
        ...state,
        items: updatedItems,
        staff: updatedStaff,
        totalServed: state.totalServed + 1
      };
    }
    
    case 'UPDATE_STAFF': {
      const { staffId, status } = action.payload;
      const updatedStaff = state.staff.map(staff => 
        staff.id === staffId ? { ...staff, status } : staff
      );
      
      return {
        ...state,
        staff: updatedStaff
      };
    }
    
    case 'NO_SHOW': {
      const { customerId } = action.payload;
      const updatedItems = state.items.map(item => 
        item.id === customerId 
          ? { ...item, status: 'no-show' as const }
          : item
      );
      
      return {
        ...state,
        items: updatedItems
      };
    }
    
    case 'UPDATE_WAIT_TIMES': {
      const waitingCustomers = state.items.filter(item => item.status === 'waiting');
      const updatedItems = state.items.map(item => {
        if (item.status === 'waiting') {
          const position = waitingCustomers.findIndex(c => c.id === item.id) + 1;
          return {
            ...item,
            estimatedWait: generateWaitTime(position, item.customerType)
          };
        }
        return item;
      });
      
      return {
        ...state,
        items: updatedItems
      };
    }
    
    case 'SET_INDUSTRY': {
      const industryWeights = {
        healthcare: { urgent: 10, vip: 7, elderly: 5, regular: 1 },
        banking: { vip: 10, elderly: 7, urgent: 5, regular: 1 },
        retail: { vip: 8, elderly: 6, urgent: 4, regular: 1 },
        government: { elderly: 8, urgent: 6, vip: 4, regular: 1 }
      };
      
      return {
        ...state,
        settings: {
          ...state.settings,
          industry: action.payload,
          priorityWeights: industryWeights[action.payload]
        }
      };
    }
    
    default:
      return state;
  }
}

export function QueueProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(queueReducer, initialState);
  
  // Auto-update wait times every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'UPDATE_WAIT_TIMES' });
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <QueueContext.Provider value={{ state, dispatch }}>
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
}