import React from 'react';

const ProfessionalStyling: React.FC = () => {
  return (
    <style>{`
      /* Professional styling for Bangladesh freelance agency */
      .agency-gradient {
        background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      }
      
      .agency-card {
        transition: all 0.3s ease;
        border: 1px solid #e5e7eb;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }
      
      .agency-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      }
      
      .agency-button {
        transition: all 0.2s ease;
        font-weight: 600;
        letter-spacing: 0.025em;
      }
      
      .agency-button:hover {
        transform: translateY(-2px);
      }
      
      .agency-section {
        background-color: #f9fafb;
        border-radius: 0.5rem;
        padding: 2rem;
      }
      
      .agency-badge {
        background-color: #eff6ff;
        color: #1e40af;
        font-weight: 600;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
      }
      
      .agency-stat {
        font-size: 2rem;
        font-weight: 700;
        color: #1e3a8a;
      }
      
      /* Bangladesh flag accent */
      .bd-flag-accent {
        color: #f44336;
      }
      
      /* Professional animations */
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .fade-in-up {
        animation: fadeInUp 0.6s ease-out;
      }
    `}</style>
  );
};

export default ProfessionalStyling;