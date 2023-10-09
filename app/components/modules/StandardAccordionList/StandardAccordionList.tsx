import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import Heading from '../../atoms/Heading/Heading';

interface Accordion {
  question: string;
  answer: string;
}

interface StandardAccordionListProps {
  heading: string;
  footnote: string;
  accordion: Accordion[];
}

const StandardAccordionList: React.FC<StandardAccordionListProps> = ({ heading, accordion, footnote }) => {
  const [expandedAccordionIndex, setExpandedAccordionIndex] = useState<number | null>(null);

  const handleQuestionClick = (index: number) => {
    setExpandedAccordionIndex(prevIndex => (prevIndex === index ? null : index));
  };

  return (
    <div className='container p-4 ps-8'>
      <div className='standard-accordion-list'>
        <div className='inner col-lg-9 offset-lg-3 p-4'>
          <div className='row text-left'>
            {heading && <Heading level='h2' className='green'>{heading}</Heading>}
          </div>
          <div className='row accordions p-2'>
            {accordion.map((accordion, index) => {
              const fadeIn = useSpring({
                opacity: expandedAccordionIndex === index ? 1 : 0,
                maxHeight: expandedAccordionIndex === index ? "1000px" : "0px",
                overflow: 'hidden'
              });

              return (
                <div key={index} className='accordion pt-5 pb-4 pb-xl-5'>
                  <p
                    className={`question b4 m-0 pt-5 pb-4 pt-lg-0 pb-lg-0 ${expandedAccordionIndex === index ? 'expanded' : ''}`}
                    onClick={() => handleQuestionClick(index)}
                  >
                    {accordion.question}
                    <button id="button">
                      <span></span>
                      <span></span>
                    </button>
                  </p>
                  {/* Animated answer */}
                  <animated.div style={fadeIn}>
                    <p className='answer b3 m-0 pt-5'>{accordion.answer}</p>
                  </animated.div>
                </div>
              );
            })}
          </div>
          {footnote && (
            <div className='footnote d-flex flex-column flex-lg-row pt-4'>
              <div className='icon pe-lg-4'>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="Group 1663">
                    <circle id="Ellipse 172" cx="9" cy="9" r="8.5" stroke="#555F68" strokeDasharray="2 2" />
                    <circle id="Ellipse 173" cx="9" cy="9" r="2" fill="#555F68" />
                  </g>
                </svg>
              </div>
              <p className='b3 ps-lg-4'>{footnote}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default StandardAccordionList;
