import React from 'react';
import SelectDropdown from '../../molecules/SelectDropdown/SelectDropdown';
import Customizations from '../../filters/Customizations';
import Button from '../../atoms/Button/Button';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';

interface OptionType {
    label: string;
    url: string;
    target?: string;
}
interface ClassroomSelectAndContentProps {
    accents: {
        accentOne?: {
            sourceUrl?: string;
        }
        accentTwo?: {
            sourceUrl?: string;
        }
    }
    leftColumn: {
        heading?: string;
        headingColor?: string;
        subheading?: string;
        subheadingColor?: string;
        button?: {
            target?: string;
            title?: string;
            url?: string;
        };
        buttonStyle?: 'primary' | 'secondary' | 'white'; 
        image?: {
            sourceUrl?: string;
            altText?: string;
        };
    };
    rightColumn: {
        heading?: string;
        headingColor?: string;
        subheading?: string;
        subheadingColor?: string;
        dropdown?: {
            option?: {
                target?: string;
                title?: string;
                url?: string;
            }[];
        };
    };
    customizations?: {
        topPaddingMobile?: string;
        topPaddingDesktop?: string;
        bottomPaddingMobile?: string;
        bottomPaddingDesktop?: string;
        backgroundColorLeft?: string;
        backgroundColorRight?: string;
    };
}

const ClassroomSelectAndContent: React.FC<ClassroomSelectAndContentProps> = ({ accents, leftColumn, rightColumn, customizations }) => {

    const colorMap: { [key: string]: string } = {
        Green: "#5E6738",
        White: "#FFFFFF",
        DarkGray: "#373A36",
        Gray: "#555F68",
        Teal: "#00A5B5",
        Blue: "#006BA6",
        Violet: "#814C9E",
        Orange: "#FF9E1B",
        Red: "#E03C31",
        NeutralOne : "#DFE2D3",
        NeutralTwo : "#E6E6E6",
        NeutralThree : "#F5F9FC",
        NeutralFour : "#F3E6D2",
        NeutralFive : "#FEF7F7",
        NeutralSix : "#F5FCFC",
        GrayOne : "#FFF",
        GrayTwo : "#FBFBFB",
        GrayThree : "#F1F1EF",
        GrayFour : "#E6E7E4",
        GrayFive : "#D2D3D1",
        GraySix : "#858783"
    };
    
    let dropdownOptions: OptionType[] = [];

    if (rightColumn.dropdown && Array.isArray(rightColumn.dropdown)) {
        dropdownOptions = rightColumn.dropdown.flatMap(dropItem => {
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
        <div className="container">
         <Customizations
            topPaddingMobile={customizations?.topPaddingMobile}
            topPaddingDesktop={customizations?.topPaddingDesktop}
            bottomPaddingMobile={customizations?.bottomPaddingMobile}
            bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
        >
            <div className="classroom-select-and-content">
                <div className="left-column col-12 col-lg-7" style={{ backgroundColor: colorMap[customizations?.backgroundColorLeft || ""] }}>
                    <div className='content-wrap'>
                        {leftColumn.heading && <Heading level='h2' className='green' color={leftColumn.headingColor}>{leftColumn.heading}</Heading>}
                        {leftColumn.subheading && <Subheading level='div' className='b3' color={leftColumn.subheadingColor}>{leftColumn.subheading}</Subheading>}
                        {leftColumn.button?.url && (
                            <Button variant={leftColumn.buttonStyle || 'primary'}  href={leftColumn.button.url} target={leftColumn.button.target || "_self"}>
                                {leftColumn.button.title}
                            </Button>
                        )}
                    </div>
                    {leftColumn.image?.sourceUrl && (
                        <img src={leftColumn.image.sourceUrl} alt={leftColumn.image.altText} />
                    )}
                </div>
                <div className="right-column col-12 col-lg-5" style={{ backgroundColor: colorMap[customizations?.backgroundColorRight || ""] }}>
                    {rightColumn.heading && <Heading level='h2' color={rightColumn.headingColor}>{rightColumn.heading}</Heading>}
                    {rightColumn.subheading && <Subheading level='div' className='b3' color={rightColumn.subheadingColor}>{rightColumn.subheading}</Subheading>}
                    {(dropdownOptions.length > 0) && (
                        <SelectDropdown options={dropdownOptions} />
                    )}
                    <div className='accent'>
                        <div className='accent-one'
                            style={{ backgroundImage: `url('${accents.accentOne?.sourceUrl}')` }} 
                        ></div>
                        <div className='accent-two'
                            style={{ backgroundImage: `url('${accents.accentTwo?.sourceUrl}')` }} 
                        ></div>
                    </div>
                </div>
            </div>
            </Customizations>
        </div>
    );
}

export default ClassroomSelectAndContent;
