import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import Heading from '../../atoms/Heading/Heading';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Customizations from '../../filters/Customizations';

interface Accordion {
  questionColor: string | undefined;
  answerColor: string | undefined;
  question: string;
  answer: string;
}

interface StandardAccordionListProps {
  heading?: string;
  headingColor?: string;
  footnote: string;
  footnoteColor?: string;
  accordion: Accordion[];
  questionColor: string;
  answerColor: string; 
  accent?: { sourceUrl: string }; 
  customizations?: {
		topPaddingMobile?: string;
		topPaddingDesktop?: string;
		bottomPaddingMobile?: string;
		bottomPaddingDesktop?: string;
    backgroundColor?: string;
	};
}

const StandardAccordionList: React.FC<StandardAccordionListProps> = ({ heading, headingColor, accordion, footnote, footnoteColor, customizations, accent }) => {
  const [expandedAccordionIndex, setExpandedAccordionIndex] = useState<number | null>(null);

  const handleQuestionClick = (index: number) => {
    setExpandedAccordionIndex(prevIndex => (prevIndex === index ? null : index));
  };

  return (
    <div className="container jumbo">
		<Customizations
		   topPaddingMobile={customizations?.topPaddingMobile}
		   topPaddingDesktop={customizations?.topPaddingDesktop}
		   bottomPaddingMobile={customizations?.bottomPaddingMobile}
		   bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
		   colorLabel={customizations?.backgroundColor} 
	   >
      <div className='standard-accordion-list'>
        <div className='inner col-lg-11 offset-lg-1'>
          <div className='row text-left'>
            {heading && <Heading level='h2' className='green pt-3 pb-3' color={headingColor}>{heading}</Heading>}
          </div>
          <div className='row accordions'>
            {accordion.map((accordion, index) => {
              const fadeIn = useSpring({
                opacity: expandedAccordionIndex === index ? 1 : 0,
                maxHeight: expandedAccordionIndex === index ? "1000px" : "0px",
                overflow: 'hidden'
              });

              return (
                <div key={index} className='accordion pt-5 pb-4 pb-xl-5'>
                  <Paragraph
                    className={`question b4 m-0  pb-4 pt-lg-0 pb-lg-0 ${expandedAccordionIndex === index ? 'expanded' : ''}`}
                    onClick={() => handleQuestionClick(index)}
                    color={accordion.questionColor}
                >
                    {accordion.question}
                    <button id="button">
                        <span></span>
                        <span></span>
                    </button>
                </Paragraph>
                  {accordion.answer && (
                    <animated.div style={fadeIn}>
                       <Paragraph 
                          className='answer b3 m-0 pt-lg-5' 
                          color={accordion.answerColor}
                      >
                          {accordion.answer}
                      </Paragraph>
                    </animated.div>
                  )}
                </div>
              );
            })}
          </div>
          {footnote && (
            <div className='footnote d-flex flex-column flex-lg-row pt-4'>
              <Paragraph className='b3' color={footnoteColor}><i>{footnote}</i></Paragraph>
            </div>
          )}
        <div className='accent'
             style={{ backgroundImage: `url('${accent?.sourceUrl}')` }} 
        ></div>
        </div>
      </div>
      </Customizations>
    </div>
  );
};

export default StandardAccordionList;
