import { useEffect, useState } from 'react';
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';

// Navigation Components
import { StepIndicator } from './components/Navigation/StepIndicator';

// Step Components
import { InputStep } from './components/Steps/InputStep';
import { SplitStep } from './components/Steps/SplitStep';
import { GenerateStep } from './components/Steps/GenerateStep';
import { DownloadStep } from './components/Steps/DownloadStep';

// Modal Components
import { SettingsModal } from './components/Settings/SettingsModal';
import { TemplateModal } from './components/Template/TemplateModal';
import { CreditsModal } from './components/Credits';
import { PrivacyPolicyModal, TermsOfServiceModal } from './components/Legal';

// Layout Components
import { Footer } from './components/Layout/Footer';

// Auth Components
import { AuthButton } from './components/Auth';

// Stores
import { useAppStore } from './stores/useAppStore';
import { useTemplateStore } from './stores/useTemplateStore';
import { useStepStore } from './stores/useStepStore';
import { useAuthStore } from './stores/useAuthStore';

// Services
import { doubaoAPI } from './services/apiClient';
import { aiService } from './services/aiService';

// Utils
import { storage } from './utils/storage';


function App() {
  // App Store
  const {
    imageSize,
    setImageSize,
    watermarkEnabled,
    setWatermarkEnabled,
    selectedTemplateId,
    setSelectedTemplateId,
    initializeApp,
  } = useAppStore();

  // Template Store
  const {
    templates,
    loadTemplates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    setTemplateModalOpen,
    isTemplateModalOpen,
  } = useTemplateStore();

  // Step Store
  const { currentStep } = useStepStore();

  // Auth Store
  const { initializeAuth, isAuthenticated, user } = useAuthStore();

  // Local State
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [creditsModalVisible, setCreditsModalVisible] = useState(false);
  const [privacyPolicyModalVisible, setPrivacyPolicyModalVisible] = useState(false);
  const [termsOfServiceModalVisible, setTermsOfServiceModalVisible] = useState(false);

  // Initialize
  useEffect(() => {
    initializeApp();
    loadTemplates();
    initializeAuth(); // Initialize auth state
  }, []);

  // Handle template selection
  useEffect(() => {
    // If no templates, auto-show template creation dialog
    if (templates.length === 0 && currentStep === 3) {
      setTemplateModalOpen(true);
    } else if (!selectedTemplateId && templates.length > 0) {
      // Check if there's a saved template selection
      const savedTemplateId = storage.getSelectedTemplateId();
      
      if (savedTemplateId && templates.find(t => t.id === savedTemplateId)) {
        // Use saved selection
        setSelectedTemplateId(savedTemplateId);
      } else {
        // Default select huangshu template (if exists), otherwise select first one
        const huangshuTemplate = templates.find(t => t.id === 'preset_huangshu_blue');
        setSelectedTemplateId(huangshuTemplate ? huangshuTemplate.id : templates[0].id);
      }
    }
  }, [templates, selectedTemplateId, currentStep]);

  // Configure API client settings
  useEffect(() => {
    // Only use environment variables to configure API Key
    const apiKey = import.meta.env.VITE_DOUBAO_API_KEY;
    
    console.log('🔧 Configuring API service:', {
      apiKeyStatus: apiKey ? 'configured' : 'not configured',
      imageSize,
      watermarkEnabled
    });
    
    if (apiKey) {
      doubaoAPI.setApiKey(apiKey);
      doubaoAPI.setImageSize(imageSize);
      doubaoAPI.setWatermarkEnabled(watermarkEnabled);
      
      // Also set API Key for AI splitting service
      aiService.setApiKey(apiKey);
      console.log('✅ AI splitting service configured');
    } else {
      console.warn('⚠️ VITE_DOUBAO_API_KEY environment variable not found');
    }
  }, [imageSize, watermarkEnabled]);


  const handleSaveSettings = (settings: {
    imageSize: string;
    watermarkEnabled: boolean;
  }) => {
    setImageSize(settings.imageSize);
    setWatermarkEnabled(settings.watermarkEnabled);
    doubaoAPI.setImageSize(settings.imageSize);
    doubaoAPI.setWatermarkEnabled(settings.watermarkEnabled);
  };


  // Render current step component
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <InputStep />;
      case 2:
        return <SplitStep />;
      case 3:
        return <GenerateStep />;
      case 4:
        return <DownloadStep />;
      default:
        return <InputStep />;
    }
  };

  return (
    <ConfigProvider locale={enUS}>
      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white shadow-sm px-6 py-3 flex justify-between items-center">
          <div className="text-xl font-semibold">
            🌸 Text to RedNote
          </div>
          <div className="flex items-center space-x-3">
            {/* User credits display and entry */}
            {isAuthenticated && user && (
              <button
                onClick={() => setCreditsModalVisible(true)}
                className="flex items-center px-3 py-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                💎 {user.credits} credits
              </button>
            )}
            
            {/* Pricing button */}
            <button
              onClick={() => setCreditsModalVisible(true)}
              className="px-3 py-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              💰 Pricing
            </button>
            
            <button
              onClick={() => setSettingsModalVisible(true)}
              className="px-3 py-1 text-gray-600 hover:text-gray-900"
            >
              ⚙️ Settings
            </button>
            <a
              href="mailto:support@rednotewriter.com"
              className="px-3 py-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              📧 Contact Us
            </a>
            
            {/* Auth button */}
            <AuthButton onOpenSettings={() => setSettingsModalVisible(true)} />
          </div>
        </div>
        
        {/* Step Indicator */}
        <StepIndicator />
        
        {/* Step Content */}
        <div className="flex-1 overflow-auto">
          {renderStepContent()}
        </div>
        
        {/* Footer */}
        <Footer 
          onShowPrivacyPolicy={() => setPrivacyPolicyModalVisible(true)}
          onShowTermsOfService={() => setTermsOfServiceModalVisible(true)}
        />
        
        {/* Modals */}
        <SettingsModal
          visible={settingsModalVisible}
          imageSize={imageSize}
          watermarkEnabled={watermarkEnabled}
          onClose={() => setSettingsModalVisible(false)}
          onSave={handleSaveSettings}
        />
        
        <TemplateModal
          visible={isTemplateModalOpen}
          templates={templates}
          onClose={() => setTemplateModalOpen(false)}
          onAdd={addTemplate}
          onUpdate={updateTemplate}
          onDelete={deleteTemplate}
        />
        
        <CreditsModal
          visible={creditsModalVisible}
          onClose={() => setCreditsModalVisible(false)}
        />
        
        <PrivacyPolicyModal
          visible={privacyPolicyModalVisible}
          onClose={() => setPrivacyPolicyModalVisible(false)}
        />
        
        <TermsOfServiceModal
          visible={termsOfServiceModalVisible}
          onClose={() => setTermsOfServiceModalVisible(false)}
        />
      </div>
    </ConfigProvider>
  );
}

export default App;