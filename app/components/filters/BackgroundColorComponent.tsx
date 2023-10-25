import React from 'react';

const colorMap = {
    Green: '#5E6738',
    White: '#fff',
    DarkGray: '#373A36',
    Gray: '#555F68',
    Teal: '#00A5B5',
    Blue: '#006BA6',
    Violet: '#814C9E',
    Orange: '#FF9E1B',
    Red: '#E03C31',
    NeutralOne: '#DFE2D3',
    NeutralTwo: '#E6E6E6',
    NeutralThree: '#F5F9FC',
    NeutralFour: '#F3E6D2',
    NeutralFive: '#FEF7F7',
    NeutralSix: '#F5FCFC',
    GrayOne: '#FFF',
    GrayTwo: '#FBFBFB',
    GrayThree: '#F1F1EF',
    GrayFour: '#E6E7E4',
    GrayFive: '#D2D3D1',
    GraySix: '#858783'
};

export const BackgroundColorComponent = ({ color, children, ...props }) => {
    const colorValue = colorMap[color];
    return <div style={{ backgroundColor: colorValue }} {...props}>{children}</div>;
};

export default BackgroundColorComponent;
