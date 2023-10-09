import React, { useState } from 'react';
import Image from 'next/image';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';
import { useSpring, animated } from 'react-spring';

interface HorizontalTabProps {
  tabs: {
    label: string;
    content: {
      image?: {
        sourceUrl?: string;
      };
      heading?: string;
      subheading?: string;
      list?: {
        icon: {
          sourceUrl: string;
        };
        text: string;
      }[];
    };
  }[];
}

const HorizontalTab: React.FC<HorizontalTabProps> = ({ tabs }) => {
  const [expandedTab, setExpandedTab] = useState<number | null>(0);

  const slideAnimationProps = useSpring({
    opacity: expandedTab !== null ? 1 : 0,
    transform: expandedTab !== null ? 'scaleY(1)' : 'scaleY(0)',
    from: {
      opacity: 0,
      transform: 'scaleY(0)'
    },
    config: { tension: 280, friction: 60 }
  });

  const fadeInAnimationProps = useSpring({
    opacity: expandedTab !== null ? 1 : 0,
    from: {
      opacity: 0
    }
  });

  const handleTabClick = (index: number) => {
    if (expandedTab === index) {
      setExpandedTab(null);
    } else {
      setExpandedTab(index);
    }
  };
  return (
    <div className="container">
      <div className="general-horizontal-tabs pt-4 pb-4">
        <div className="inner">
          {tabs.map((tab, index) => (
            <div key={index}>
              <button
                onClick={() => handleTabClick(index)}
                className={expandedTab === index ? 'expanded' : ''}
              >
                <h5>{tab.label}
                  <div id="button">
                    <span></span>
                    <span></span>
                  </div>
                </h5>
              </button>

              {/* Mobile: Content rendered right below the label */}
              <div className="d-lg-none">
                {expandedTab === index && (
                  <animated.div style={slideAnimationProps} className="tab-content">
                    {tab.content.image?.sourceUrl && (
                      <div className='image-wrapper'>
                        <Image src={tab.content.image.sourceUrl} alt="Tab Image" width={200} height={200} />
                      </div>
                    )}
                    <div className='content-wrapper'>
                      {tab.content.heading && <Heading level='h2' className='d-none d-lg-block'>{tab.content.heading}</Heading>}
                      {tab.content.subheading && <Subheading level='div' className='b3'>{tab.content.subheading}</Subheading>}
                      <ul>
                        {tab.content.list?.map((item, idx) => (
                          <li key={idx}>
                            <Image src={item.icon.sourceUrl} alt="List Icon" width={30} height={30} />
                            {item.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </animated.div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Content rendered outside the loop in a designated area */}

        <div className='desktop-content d-none d-lg-block'>
          {expandedTab !== null && (
            <animated.div style={fadeInAnimationProps} className="tab-content d-flex">

              {tabs[expandedTab].content.image?.sourceUrl && (
                <div className='image-wrapper'>
                  <Image src={tabs[expandedTab].content.image.sourceUrl} alt="Tab Image" width={200} height={200} />
                </div>
              )}
              <div className='content-wrapper'>
                {tabs[expandedTab].content.heading && <Heading level='h3'>{tabs[expandedTab].content.heading}</Heading>}
                {tabs[expandedTab].content.subheading && <Subheading level='div' className='b3'>{tabs[expandedTab].content.subheading}</Subheading>}
                <ul>
                  {tabs[expandedTab].content.list?.map((item, idx) => (
                    <li key={idx}>
                      <Image src={item.icon.sourceUrl} alt="List Icon" width={30} height={30} />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </animated.div>
          )}
        </div>

      </div>
    </div>
  );
}

export default HorizontalTab;
