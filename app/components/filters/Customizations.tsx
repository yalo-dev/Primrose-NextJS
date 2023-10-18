import React, { ReactElement, useEffect, useState } from 'react';

interface CustomizationsProps {
    colorLabel?: string;
    topPaddingMobile?: string;
    topPaddingDesktop?: string;
    bottomPaddingMobile?: string;
    bottomPaddingDesktop?: string;
    topMarginMobile?: string;
    topMarginDesktop?: string;
    bottomMarginMobile?: string;
    bottomMarginDesktop?: string;
    children: ReactElement;
}

const Customizations: React.FC<CustomizationsProps> = ({
    colorLabel,
    topPaddingMobile,
    topPaddingDesktop,
    bottomPaddingMobile,
    bottomPaddingDesktop,
    topMarginMobile,
    topMarginDesktop,
    bottomMarginMobile,
    bottomMarginDesktop,
    children
}) => {
    
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    
    const isMobile = windowWidth <= 767;

    const mapPaddingValue = (mobilePadding: string | undefined, desktopPadding: string | undefined, isMobile: boolean) => {
        const paddingLabel = isMobile ? mobilePadding : desktopPadding;
        const paddingMap: { [key: string]: string } = {
            None: '0px',
            Small: isMobile ? '20px' : '24px',
            Medium: isMobile ? '20px' : '60px',
            Large: isMobile ? '30px' : '80px',
        };

        return paddingLabel ? paddingMap[paddingLabel] : undefined;
    };

    const mapMarginValue = (mobileMargin: string | undefined, desktopMargin: string | undefined, isMobile: boolean) => {
        const marginLabel = isMobile ? mobileMargin : desktopMargin;
        const marginMap: { [key: string]: string } = {
            None: '0px',
            Small: isMobile ? '20px' : '24px',
            Medium: isMobile ? '20px' : '60px',
            Large: isMobile ? '30px' : '80px',
        };

        return marginLabel ? marginMap[marginLabel] : undefined;
    };
    
    const paddings = { 
        paddingTop: mapPaddingValue(topPaddingMobile, topPaddingDesktop, isMobile), 
        paddingBottom: mapPaddingValue(bottomPaddingMobile, bottomPaddingDesktop, isMobile) 
    };

    const margins = { 
        marginTop: mapMarginValue(topMarginMobile, topMarginDesktop, isMobile), 
        marginBottom: mapMarginValue(bottomMarginMobile, bottomMarginDesktop, isMobile) 
    };

    const mapColorToHex = (colorLabel: string | undefined) => {
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
        return colorMap[colorLabel || ""] || "";
    };

    const backgroundColor = mapColorToHex(colorLabel);

    return (
        <div style={{ ...paddings, ...margins }}>
            {React.cloneElement(children, {
                style: {
                    ...children.props.style,
                    backgroundColor: backgroundColor,
                }
            })}
        </div>
    );
};

export default Customizations;
