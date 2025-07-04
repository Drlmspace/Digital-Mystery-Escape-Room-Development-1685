import React from 'react';

export default function PolicyFooter() {
  return (
    <div className="mt-8 pt-6 border-t border-mystery-700">
      <div className="text-center text-mystery-400 text-xs space-y-1">
        <p>Best experienced with headphones • Suitable for ages 12+ • Auto-save enabled</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a 
            href="https://app.getterms.io/view/HxaaZ/acceptable-use/en-us" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-mystery-300 transition-colors underline"
          >
            Acceptable Use Policy
          </a>
          <span>•</span>
          <a 
            href="https://app.getterms.io/view/HxaaZ/app-privacy/en-us" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-mystery-300 transition-colors underline"
          >
            Privacy Policy
          </a>
          <span>•</span>
          <a 
            href="https://app.getterms.io/view/HxaaZ/terms-of-service/en-us" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-mystery-300 transition-colors underline"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </div>
  );
}