import React, { useEffect } from 'react';
import { message } from 'antd';
import { useAppStore } from '../../stores/useAppStore';
import { useStepStore } from '../../stores/useStepStore';
import { StepContainer } from '../Navigation/StepContainer';
import { validators } from '../../utils/validators';

// Import new components
import { HeroSection } from '../Home/HeroSection';
import { GlassInput } from '../Home/GlassInput';
import { InspirationPanel } from '../Home/InspirationPanel';
import { ProjectHistory } from '../Home/ProjectHistory';

export const InputStep: React.FC = () => {
  const { 
    inputText, 
    setInputText, 
    recentProjects, 
    loadRecentProject,
    clearRecentProjects 
  } = useAppStore();
  const { setCanProceed, nextStep } = useStepStore();
  
  // Validate if can proceed to next step
  useEffect(() => {
    setCanProceed(validators.isValidTextLength(inputText));
  }, [inputText, setCanProceed]);
  
  const handleHistoryClick = (projectId: string) => {
    loadRecentProject(projectId);
    message.success('History loaded successfully');
  };
  
  const handleClearHistory = () => {
    clearRecentProjects();
    message.success('History cleared successfully');
  };
  
  const handleNext = () => {
    if (validators.isValidTextLength(inputText)) {
      nextStep();
    }
  };
  
  return (
    <StepContainer
      title=""
      nextDisabled={!validators.isValidTextLength(inputText)}
      onNext={handleNext}
      showNavigation={false}
    >
      <div className="space-y-0">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Glass Input Area */}
        <GlassInput
          inputText={inputText}
          onTextChange={setInputText}
          onNext={handleNext}
        />
        
        {/* AI Inspiration Panel */}
        <InspirationPanel />
        
        {/* Project History */}
        <ProjectHistory
          projects={recentProjects}
          onProjectClick={handleHistoryClick}
          onClearHistory={handleClearHistory}
        />
      </div>
    </StepContainer>
  );
};