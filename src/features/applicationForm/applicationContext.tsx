import React, {
  createContext,
  useReducer,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';

export interface PersonalInfo {
  name: string;
  nationalId: string;
  dob: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
}

export interface FamilyInfo {
  maritalStatus: string;
  dependents: number;
  employmentStatus: string;
  monthlyIncome: number;
  housingStatus: string;
}

export interface SituationInfo {
  currentFinancial: string;
  employmentCircumstances: string;
  reason: string;
}

export interface ApplicationData {
  personal: PersonalInfo;
  family: FamilyInfo;
  situation: SituationInfo;
}

export interface ApplicationContextProps {
  step: number;
  data: ApplicationData;
  nextStep: () => void;
  prevStep: () => void;
  updatePersonal: (info: Partial<PersonalInfo>) => void;
  updateFamily: (info: Partial<FamilyInfo>) => void;
  updateSituation: (info: Partial<SituationInfo>) => void;
  resetApplication: () => void;
}

const initialData: ApplicationData = {
  personal: {
    name: '',
    nationalId: '',
    dob: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    country: '',
    phone: '',
    email: '',
  },
  family: {
    maritalStatus: '',
    dependents: 0,
    employmentStatus: '',
    monthlyIncome: 0,
    housingStatus: '',
  },
  situation: {
    currentFinancial: '',
    employmentCircumstances: '',
    reason: '',
  },
};

type State = {
  step: number;
  data: ApplicationData;
};

type Action =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'UPDATE_PERSONAL'; payload: Partial<PersonalInfo> }
  | { type: 'UPDATE_FAMILY'; payload: Partial<FamilyInfo> }
  | { type: 'UPDATE_SITUATION'; payload: Partial<SituationInfo> }
  | { type: 'RESET_ALL' };

// Reducer: single source of truth for state transitions
function appReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'NEXT_STEP':
      return { ...state, step: Math.min(state.step + 1, 3) };
    case 'PREV_STEP':
      return { ...state, step: Math.max(state.step - 1, 1) };
    case 'UPDATE_PERSONAL':
      return {
        ...state,
        data: {
          ...state.data,
          personal: { ...state.data.personal, ...action.payload },
        },
      };
    case 'UPDATE_FAMILY':
      return {
        ...state,
        data: {
          ...state.data,
          family: { ...state.data.family, ...action.payload },
        },
      };
    case 'UPDATE_SITUATION':
      return {
        ...state,
        data: {
          ...state.data,
          situation: { ...state.data.situation, ...action.payload },
        },
      };
    case 'RESET_ALL':
      return { step: 1, data: initialData };
    default:
      return state;
  }
}

// Create context
export const ApplicationContext = createContext<ApplicationContextProps>(
  {} as ApplicationContextProps
);

export const ApplicationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize from localStorage if available, otherwise default state
  const stored = localStorage.getItem('applicationForm');
  const initialState: State = stored
    ? JSON.parse(stored)
    : { step: 1, data: initialData };

  const [state, dispatch] = useReducer(appReducer, initialState);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('applicationForm', JSON.stringify(state));
  }, [state]);

  // Navigation functions
  const nextStep = useCallback(() => dispatch({ type: 'NEXT_STEP' }), []);
  const prevStep = useCallback(() => dispatch({ type: 'PREV_STEP' }), []);

  // Update functions
  const updatePersonal = useCallback(
    (info: Partial<PersonalInfo>) =>
      dispatch({ type: 'UPDATE_PERSONAL', payload: info }),
    []
  );
  const updateFamily = useCallback(
    (info: Partial<FamilyInfo>) =>
      dispatch({ type: 'UPDATE_FAMILY', payload: info }),
    []
  );
  const updateSituation = useCallback(
    (info: Partial<SituationInfo>) =>
      dispatch({ type: 'UPDATE_SITUATION', payload: info }),
    []
  );

  // Reset application
  const resetApplication = useCallback(() => {
    dispatch({ type: 'RESET_ALL' });
    localStorage.removeItem('applicationForm');
  }, []);

  return (
    <ApplicationContext.Provider
      value={{
        step: state.step,
        data: state.data,
        nextStep,
        prevStep,
        updatePersonal,
        updateFamily,
        updateSituation,
        resetApplication,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};