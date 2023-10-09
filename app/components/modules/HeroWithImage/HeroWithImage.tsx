import React from 'react';
import Image from 'next/image';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Button from '../../atoms/Button/Button';

interface HeroWithImageProps {
    accent?: {
        sourceUrl?: string;
    };
    switchColumnOrderOnDesktop?: boolean;
    leftColumn?: {
      image?: {
        sourceUrl?: string;
      };
    };
    rightColumn?: {
        heading?: string;
        subheading?: string;
        blurb?: string;
        button?: {
            target?: string;
            title?: string;
            url?: string;
        };
    };
}

const HeroWithImage: React.FC<HeroWithImageProps> = ({ accent, switchColumnOrderOnDesktop, leftColumn, rightColumn }) => {
    const className = `hero-with-image ${switchColumnOrderOnDesktop ? 'reverse-column' : ''}`;
    const style = accent?.sourceUrl ? { backgroundImage: `url(${accent.sourceUrl})` } : {};

    return (
        <div className='container'>
            <div className={className} style={style}>
                {leftColumn?.image?.sourceUrl && (
                    <div className='left-column col-12 col-lg-6'>
                        <Image src={leftColumn.image.sourceUrl} alt="Hero Image" layout="fill" objectFit="cover" sizes='large' />
                    </div>
                )}
                <div className='right-column col-12 col-lg-6'>
                    {rightColumn?.heading && <Heading level='h1' className='green'>{rightColumn.heading}</Heading>}
                    {rightColumn?.subheading && <Subheading level='h5' className='green'>{rightColumn.subheading}</Subheading>}
                    {rightColumn?.blurb && <Paragraph className='b2'>{rightColumn.blurb}</Paragraph>}
                    {rightColumn?.button?.url && (
                        <Button href={rightColumn.button.url} target={rightColumn.button.target} label={rightColumn.button.title}>
                            {rightColumn.button.title}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HeroWithImage;



