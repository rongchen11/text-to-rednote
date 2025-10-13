import { create } from 'zustand';

export type StepNumber = 1 | 2 | 3 | 4;

interface StepInfo {
  number: StepNumber;
  title: string;
  description: string;
}

interface StepStore {
  // 状态
  currentStep: StepNumber;
  stepHistory: StepNumber[];
  canProceedNext: boolean;
  canGoBack: boolean;
  
  // 步骤信息
  steps: StepInfo[];
  
  // Actions
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: StepNumber) => void;
  setCanProceed: (canProceed: boolean) => void;
  resetSteps: () => void;
  
  // 验证函数
  validateCurrentStep: () => boolean;
}

const STEPS: StepInfo[] = [
  { number: 1, title: 'Input Text', description: 'Enter or paste your text to convert' },
  { number: 2, title: 'AI Split', description: 'AI intelligently splits text content' },
  { number: 3, title: 'Generate Images', description: 'Select template and generate images' },
  { number: 4, title: 'Batch Download', description: 'Preview and download generated images' },
];

export const useStepStore = create<StepStore>((set, get) => ({
  // 初始状态
  currentStep: 1,
  stepHistory: [1],
  canProceedNext: false,
  canGoBack: false,
  steps: STEPS,
  
  // 前进到下一步
  nextStep: () => {
    const { currentStep, validateCurrentStep } = get();
    
    // 验证当前步骤是否可以前进
    if (!validateCurrentStep()) {
      return;
    }
    
    if (currentStep < 4) {
      const nextStep = (currentStep + 1) as StepNumber;
      set((state) => ({
        currentStep: nextStep,
        stepHistory: [...state.stepHistory, nextStep],
        canGoBack: true,
        canProceedNext: false, // 重置，需要新步骤验证
      }));
    }
  },
  
  // 返回上一步
  prevStep: () => {
    const { currentStep, stepHistory } = get();
    
    if (currentStep > 1 && stepHistory.length > 1) {
      const newHistory = [...stepHistory];
      newHistory.pop(); // 移除当前步骤
      const prevStep = newHistory[newHistory.length - 1];
      
      set({
        currentStep: prevStep,
        stepHistory: newHistory,
        canGoBack: prevStep > 1,
        canProceedNext: true, // 返回的步骤应该是已验证的
      });
    }
  },
  
  // 跳转到指定步骤
  goToStep: (step: StepNumber) => {
    const { stepHistory } = get();
    
    // 只能跳转到历史中存在的步骤或第一步
    if (step === 1 || stepHistory.includes(step)) {
      const newHistory = step === 1 ? [1] as StepNumber[] : stepHistory.slice(0, stepHistory.indexOf(step) + 1) as StepNumber[];
      
      set({
        currentStep: step,
        stepHistory: newHistory,
        canGoBack: step > 1,
        canProceedNext: step < 4, // 如果不是最后一步，可能可以前进
      });
    }
  },
  
  // 设置是否可以前进
  setCanProceed: (canProceed: boolean) => {
    set({ canProceedNext: canProceed });
  },
  
  // 重置步骤
  resetSteps: () => {
    set({
      currentStep: 1,
      stepHistory: [1],
      canProceedNext: false,
      canGoBack: false,
    });
  },
  
  // 验证当前步骤（这个函数会在各个步骤组件中被覆盖）
  validateCurrentStep: () => {
    const { canProceedNext } = get();
    return canProceedNext;
  },
}));