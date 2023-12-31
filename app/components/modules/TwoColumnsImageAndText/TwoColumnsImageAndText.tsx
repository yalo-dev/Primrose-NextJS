import React from 'react';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';
import Button from '../../atoms/Button/Button';
import Customizations from '../../filters/Customizations';
import ColorComponent from '../../filters/ColorComponent';
import BackgroundColorComponent from '../../filters/BackgroundColorComponent';
import SelectDropdown from '../../molecules/SelectDropdown/SelectDropdown';

interface OptionType {
    label: string;
    url: string;
    target?: string;
}

interface TwoColumnsImageAndTextProps {
    switchColumnOrderOnDesktop?: boolean;
    centerModule?: boolean;
    rightColumn?: {
        heading?: string;
        subheading?: string;
        blurb?: string;
        button?: {
            target?: string;
            title?: string;
            url?: string;
        };
        options?: {
            option?: {
                target?: string;
                title?: string;
                url?: string;
            }[];
        };
    };
    leftColumn?: {
        imageDesktop?: {
            sourceUrl?: string;
            altText?: string;
        };
        imageMobile?: {
            sourceUrl?: string;
            altText?: string;
        };
        video?: {
            target?: string;
            title?: string;
            url?: string;
        };
        imageOrVideo?: 'Image' | 'Video';
        announcement?: {
            backgroundColor?: string;
            bottomLine?: string;
            midLine?: string;
            topLine?: string;
            bottomLineColor?: string;
            midLineColor?: string;
            topLineColor?: string;
        };
        showAnnouncementTile?: boolean;
    };
    customizations?: {
		topPaddingMobile?: string;
		topPaddingDesktop?: string;
		bottomPaddingMobile?: string;
		bottomPaddingDesktop?: string;
	};
}

const TwoColumnsImageAndText: React.FC<TwoColumnsImageAndTextProps> = ({ leftColumn, rightColumn, switchColumnOrderOnDesktop, centerModule, customizations }) => {
    const className = `two-columns-image-and-text ${switchColumnOrderOnDesktop ? 'reverse-column' : ''} ${centerModule ? 'center' : ''}`;

    const mobileImageUrl = leftColumn?.imageMobile?.sourceUrl || leftColumn?.imageDesktop?.sourceUrl;
    const desktopImageUrl = leftColumn?.imageDesktop?.sourceUrl;
  
    const renderMedia = () => {
        if (leftColumn?.imageOrVideo === 'Image') {
            return (
                <>
                    {leftColumn.imageMobile?.sourceUrl && 
                        <img 
                            className='d-block d-lg-none' 
                            src={desktopImageUrl} 
                            alt={leftColumn.imageMobile.altText || ''} 
                        />
                    }
                    {leftColumn.imageDesktop?.sourceUrl && 
                        <img 
                            className='d-none d-lg-block' 
                            src={mobileImageUrl} 
                            alt={leftColumn.imageDesktop.altText || ''} 
                        />
                    }
                </>
            );
        } else if (leftColumn?.imageOrVideo === 'Video') {
            return leftColumn?.video?.url && (
                <div className='video-wrapper'>
                    <video 
                    className='d-block w-100'
                    src={leftColumn.video.url} 
                    autoPlay 
                    muted 
                    loop 
                    />
                </div>
            );
        }
        return null;
    };


    let dropdownOptions: OptionType[] = [];

    if (rightColumn?.options && Array.isArray(rightColumn.options)) {
        dropdownOptions = rightColumn.options.flatMap(dropItem => {
            if (dropItem.option) {
                return {
                    label: dropItem.option.title || "", 
                    url: dropItem.option.url || "", 
                    target: dropItem.option.target || "_self"
                };
            }
            return [];
        });
    }

   return (
        <div className='container'>
             <Customizations
                topPaddingMobile={customizations?.topPaddingMobile}
                topPaddingDesktop={customizations?.topPaddingDesktop}
                bottomPaddingMobile={customizations?.bottomPaddingMobile}
                bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
                >
            <div className={className}>
               
                <div className='left-column col-12 col-lg-5 offset-lg-1'>
                    {renderMedia()}
                    {leftColumn?.showAnnouncementTile && leftColumn?.announcement && (
                        <BackgroundColorComponent color={leftColumn.announcement.backgroundColor} className='announcement'>
                            {leftColumn.announcement.topLine && 
                                <div className='b4'>
                                    <ColorComponent color={leftColumn.announcement.topLineColor}>
                                    {leftColumn.announcement.topLine}
                                    </ColorComponent>
                                </div>
                                }
                                {leftColumn.announcement.midLine && <ColorComponent color={leftColumn.announcement.midLineColor}><div className='b7 mb-1 mt-1'>{leftColumn.announcement.midLine}</div></ColorComponent>}
                                {leftColumn.announcement.bottomLine && <ColorComponent color={leftColumn.announcement.bottomLineColor}><div className='b3'>{leftColumn.announcement.bottomLine}</div></ColorComponent>}
                        </BackgroundColorComponent>
                    )}
                </div>
       
                <div className='right-column col-12 c col-lg-5 offset-lg-1'>
                    {rightColumn?.heading && <Heading level='h2'>{rightColumn.heading}</Heading>}
                    {rightColumn?.subheading && <Subheading level='h5'>{rightColumn.subheading}</Subheading>}
                    {rightColumn?.blurb && <div className='blurb' dangerouslySetInnerHTML={{ __html: rightColumn.blurb }} />}
                    <div className='d-lg-flex'>  
                        {rightColumn?.button?.url && rightColumn?.button?.title && (
                            <Button href={rightColumn.button.url} target={rightColumn.button.target} label={rightColumn.button.title}>
                                {rightColumn.button.title}
                            </Button>
                        )}
                        {(dropdownOptions.length > 0) && (
                            <SelectDropdown options={dropdownOptions} placeholder='Explore Classrooms' />
                        )}
                    </div>
                </div>
            </div>
            </Customizations>
        </div>
    );
}

export default TwoColumnsImageAndText;
