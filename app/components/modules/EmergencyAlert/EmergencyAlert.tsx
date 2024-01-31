import React, { useState, useRef } from 'react';
import { useQuery, gql } from '@apollo/client';
import Button from '../../atoms/Button/Button';
import { useRouter } from 'next/router';

const GET_SCHOOL_DETAILS = gql`
  query GetSchoolDetails($id: ID!) {
    school(id: $id, idType: URI) {
      id
      slug
      uri
      schoolAdminSettings {
        displayEmergencyAlert 
        emergencyMessage {
          icon
          message
          button {
            url
            title
          }
          expirationDate
        }
      }
    }
  }
`;

interface ImageComponent {
  image: {
    altText: string;
    sourceUrl: string;
  };
}

interface ButtonComponent {
  target: string;
  title: string;
  url: string;
  buttonStyle?: 'primary' | 'secondary' | 'white';
}


interface wysiwygComponent {
  wysiwyg: string;
}

type Component = ImageComponent | ButtonComponent | wysiwygComponent;

interface EmergencyMessage {
  icon?: ImageComponent;
  message?: string;
  button?: ButtonComponent;
  expirationDate?: string;
  components: Component[];
}

const EmergencyAlert = () => {
  const messageContainerRef = useRef(null);
  const router = useRouter();
  const schoolSlug = router.query.schoolSlug;

  const { data, loading, error } = useQuery(GET_SCHOOL_DETAILS, {
    variables: { id: schoolSlug },
    skip: !schoolSlug,
  });

  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  const handleDismiss = (index) => {
    const updatedDismissedAlerts = [...dismissedAlerts];
    updatedDismissedAlerts[index] = true;
    setDismissedAlerts(updatedDismissedAlerts);
  };

  const isAlertExpired = (expirationDate) => {
    if (!expirationDate) {
      return false; // No expiration date, not expired
    }

    const currentDate = new Date();
    const expirationDateTime = new Date(expirationDate);

    // Set the time part of both dates to midnight
    currentDate.setHours(0, 0, 0, 0);
    expirationDateTime.setHours(0, 0, 0, 0);

    // Check if the current time is after 11:59 pm on the expiration date
    const isAfterMidnight = currentDate.getTime() > expirationDateTime.getTime() && currentDate.getTime() > expirationDateTime.setHours(23, 59, 59, 999);

    return isAfterMidnight;
  };

  // Extract the display_emergency_alert field from ACF data
  const displayEmergencyAlert = data?.school?.schoolAdminSettings?.displayEmergencyAlert;

  const emergencyMessages = data?.school?.schoolAdminSettings?.emergencyMessage;

  // Conditionally render the component based on display_emergency_alert
  if (!displayEmergencyAlert) {
    return null; // Do not render the component
  }

  return (
    <div className="alert-module container">
      {loading && <p>Loading...</p>}
      {!loading && error && <p>Error loading emergency message</p>}
      {!loading && !error && data && data.school && emergencyMessages && (
        <div className={`emergency-alert${dismissedAlerts.every(Boolean) ? '' : ' margin-top'}`}>
          {emergencyMessages.map((emergencyMessage: EmergencyMessage, index: number) => (
            !dismissedAlerts[index] && !isAlertExpired(emergencyMessage.expirationDate) && (
              <div key={index} className="row mb-5">
                <div className="emergency col">
                  <div className="emergency-message-container d-flex align-items-center p-4 border">
                    {emergencyMessage.icon && (
                      <div className="icon-container mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                          <circle cx="20" cy="20" r="20" fill="#5E6738" />
                          <text
                            x="50%"
                            y="50%"
                            fontSize="31.65px"
                            textAnchor="middle"
                            fill="#FFF"
                            dy="2px"
                            dominantBaseline="middle"
                            style={{
                              fontFeatureSettings: "'clig' off, 'liga' off",
                              fontFamily: "Poppins",
                              fontStyle: "normal",
                              fontWeight: 600,
                              lineHeight: "51.431px",
                            }}
                          >
                            !
                          </text>
                        </svg>
                      </div>
                    )}
                    {emergencyMessage.icon && <div className="divider-line" />} {/* Render the divider line conditionally */}
                    <div className="message-container flex-grow-1">
                      {emergencyMessage.message && (
                        <div className="message mb-3" dangerouslySetInnerHTML={{ __html: emergencyMessage.message }} />
                      )}
                    </div>
                    {emergencyMessage.button && (
                      <div className="button-container">
                        <Button variant={emergencyMessage.button.buttonStyle} label={emergencyMessage.button.title} href={emergencyMessage.button.url} target={emergencyMessage.button.target} />
                      </div>
                    )}
                    <button className="dismiss-button" onClick={() => handleDismiss(index)}>
                      {/* X icon SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                        <circle cx="10.5" cy="10.5" r="9.75" stroke="#5E6738" stroke-width="1.5" />
                        <rect x="13.2266" y="6.86296" width="1.28571" height="9" transform="rotate(45 13.2266 6.86296)" fill="#5E6738" />
                        <rect x="6.86328" y="7.77239" width="1.28571" height="9" transform="rotate(-45 6.86328 7.77239)" fill="#5E6738" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default EmergencyAlert;