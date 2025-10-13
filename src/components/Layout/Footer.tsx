import React from 'react';

interface FooterProps {
  onShowPrivacyPolicy?: () => void;
  onShowTermsOfService?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onShowPrivacyPolicy,
  onShowTermsOfService,
}) => {
  return (
    <footer className="bg-white border-t border-gray-200 py-3">
      <div className="max-w-6xl mx-auto px-6">
        {/* Desktop layout - three columns horizontal */}
        <div className="hidden sm:flex justify-between items-center">
          {/* Left: copyright and legal links */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              © 2025 • Text to RedNote • All rights reserved.
            </div>
            <div className="flex items-center gap-3 text-sm">
              <button
                onClick={onShowPrivacyPolicy}
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                Privacy Policy
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={onShowTermsOfService}
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                Terms of Service
              </button>
            </div>
          </div>
          
          {/* Center: empty space */}
          <div></div>
          
          {/* Right: brand */}
          <div className="text-sm text-gray-500">
            Powered by AI Product Uncle Huang
          </div>
        </div>
        
        {/* Mobile layout - vertical centered */}
        <div className="sm:hidden flex flex-col items-center gap-2 text-center">
          <div className="text-sm text-gray-500">
            © 2025 • Text to RedNote • All rights reserved.
          </div>
          
          {/* Mobile legal links */}
          <div className="flex items-center gap-3 text-sm">
            <button
              onClick={onShowPrivacyPolicy}
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              Privacy Policy
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={onShowTermsOfService}
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              Terms of Service
            </button>
          </div>
          
          
          <div className="text-sm text-gray-500">
            Powered by AI Product Uncle Huang
          </div>
        </div>
      </div>
    </footer>
  );
};