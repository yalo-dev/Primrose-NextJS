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
  

  const emergencyMessages = data?.school?.schoolAdminSettings?.emergencyMessage;

  return (
    <div>
      {loading && <p>Loading...</p>}
      {!loading && error && <p>Error loading emergency message</p>}
      {!loading && !error && data && data.school && emergencyMessages && (
        <div className={`emergency-alert${dismissedAlerts.every(Boolean) ? '' : ' margin-top'}`}>
          {emergencyMessages.map((emergencyMessage: EmergencyMessage, index: number) => (
            !dismissedAlerts[index] && !isAlertExpired(emergencyMessage.expirationDate) && (
              <div key={index} className="emergency-message-container d-flex align-items-center m-5 p-4 border">
                {emergencyMessage.icon && (
                  <div className="icon-container">
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
                    <div className="divider-line" />
                  </div>
                )}
                {emergencyMessage.message && (
                  <div className="message flex-grow-1" dangerouslySetInnerHTML={{ __html: emergencyMessage.message }} />
                )}
                {emergencyMessage.button && (
                  <Button variant={emergencyMessage.button.buttonStyle} label={emergencyMessage.button.title} href={emergencyMessage.button.url} target={emergencyMessage.button.target} />
                )}
                <button className="dismiss-button" onClick={() => handleDismiss(index)}>
                  {/* X icon SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 30 30" fill="none">
                    <circle cx="15.1484" cy="15" r="9.75" transform="rotate(45 15.1484 15)" stroke="#5E6738" strokeWidth="1.5"/>
                    <rect x="17.875" y="11.3636" width="1.28571" height="9" transform="rotate(45 17.875 11.3636)" fill="#5E6738"/>
                    <rect x="11.5156" y="12.2726" width="1.28571" height="9" transform="rotate(-45 11.5156 12.2726)" fill="#5E6738"/>
                  </svg>
                </button>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default EmergencyAlert;