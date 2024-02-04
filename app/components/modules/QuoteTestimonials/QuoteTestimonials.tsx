import React, { useEffect, useRef, useState } from 'react';
import Heading from '../../atoms/Heading/Heading';
import Customizations from '../../filters/Customizations';
import ColorComponent from '../../filters/ColorComponent';

interface QuoteTestimonialsProps {
	customizations?: {
		topPaddingMobile: string;
		topPaddingDesktop: string;
		bottomPaddingMobile: string;
		bottomPaddingDesktop: string;
		backgroundColor: string;
	};
	tabs: {
		avatar: {
			sourceUrl: string;
			altText: string;
		};
		name: string;
		nameColor: string;
		position: string;
		positionColor: string;
		content: {
			heading: string;
			headingColor: string;
			blurb: string;
			blurbColor: string;
		};
	}[];
	heading?: string;
	headingColor?: string;
}
const QuoteTestimonials: React.FC<QuoteTestimonialsProps> = ({
	tabs,
	customizations,
	heading,
	headingColor,
}) => {

	const [expandedTabQT, setExpandedTabQT] = useState<number | null>(0);
	const buttonRefsQT = useRef<(HTMLButtonElement | null)[]>([]);
	const contentRefsQT = useRef<(HTMLDivElement | null)[]>([]);
	const containerRefQT = useRef<HTMLDivElement | null>(null);
	const contentHeightRefQT = useRef<number | null>(null);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const calculateHeight = (index: number) => {
		const contentElement = contentRefsQT.current[index];
		if (contentElement) {
			const height = contentElement.scrollHeight;
			console.log("Calculated Height:", height);
			contentHeightRefQT.current = height;
		}
	};

	const handleLabelClick = (index: number) => {
		if (expandedTabQT === index) {
			setExpandedTabQT(null);
			contentHeightRefQT.current = null;

			setTimeout(() => {
				window.scrollBy(0, -contentHeightRefQT.current!);
			}, 50);
		} else {
			calculateHeight(index);
			setExpandedTabQT(index);
		}
	};


	return (
		<Customizations
			topPaddingMobile={customizations?.topPaddingMobile}
			topPaddingDesktop={customizations?.topPaddingDesktop}
			bottomPaddingMobile={customizations?.bottomPaddingMobile}
			bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
			colorLabelOuter={customizations?.backgroundColor}
		>
			<div className='container' ref={containerRefQT}>
				<div className="quote-testimonials">
					{/* Main Heading and Subheading */}
					<div className="heading-wrapper d-lg-none">
						<Heading level='h2'><ColorComponent color={headingColor}>{heading}</ColorComponent></Heading>
					</div>


					{/* Mobile layout */}
					<div className="mobile-layout d-block d-lg-none">
						{tabs.map((tab, index) => (
							<div key={index} className="mobile-tab">
								<button
                                    ref={(el) => buttonRefsQT.current[index] = el}
                                    onClick={() => handleLabelClick(index)}
                                    className={`tab-button ${expandedTabQT === index ? 'active' : ''}`}
                                >
                                   
								   <img
										src={tab.avatar?.sourceUrl || '/assets/default-avatar.svg'}
										alt="Avatar" 
										width={65} 
										height={65} 
										className={`avatar ${!tab.avatar?.sourceUrl ? 'default' : ''}`}
									/>

                                 
                                    <div className='text-wrap'>
                                    {tab.name && 
                                        <div className="name" style={{color: tab.nameColor}}>
                                            {tab.name}
                                        </div>
                                    }
                                    {tab.position && 
                                        <div className="position" style={{color: tab.positionColor}}>
                                            {tab.position}
                                        </div>
                                    }
                                    </div>
                                    <div id="button">
                                        <span></span>
                                        <span></span>
                                    </div>
                                </button>

								<div
									key={index}
									ref={(el) => contentRefsQT.current[index] = el}
									className={`tab-content ${expandedTabQT === index ? 'expanded' : ''}`}
								>			
									<div className='content'>
									
                                    {tab.content.heading && <Heading level='h3'>
                                        <ColorComponent color={tab.content.headingColor}>{tab.content.heading}</ColorComponent>
                                    </Heading>}


                                    {tab.content.blurb && <div className="blurb b4">
                                        <ColorComponent color={tab.content.blurbColor}>{tab.content.blurb}</ColorComponent>
                                    </div>}

									</div>
								</div>
							</div>
						))}
					</div>

					{/* Desktop layout */}
					<div className="desktop-layout d-none d-lg-flex">
						<div className="buttons-container">
                            {/* Main Heading and Subheading */}
                            <div className="heading-wrapper">
                                <Heading level='h2'><ColorComponent color={headingColor}>{heading}</ColorComponent></Heading>
                            </div>

							{tabs.map((tab, index) => (
								<button
                                key={index}
                                ref={(el) => buttonRefsQT.current[index] = el}
                                onClick={() => handleLabelClick(index)}
                                className={`tab-button ${expandedTabQT === index ? 'active' : ''}`}
                            >
                              
							  <img
									src={tab.avatar?.sourceUrl || '/assets/default-avatar.svg'}
									alt={tab.avatar?.altText || ''}
									width={50} 
									height={50} 
									className={`avatar ${!tab.avatar?.sourceUrl ? 'default' : ''}`}
								/>

                              
                                <div className='text-wrap'>
                                {tab.name && 
                                    <div className="name" style={{color: tab.nameColor}}>
                                        {tab.name}
                                    </div>
                                }
                                {tab.position && 
                                    <div className="position" style={{color: tab.positionColor}}>
                                        {tab.position}
                                    </div>
                                }
                                </div>
                            </button>
                            
							))}
						</div>
						<div className="desktop-content">
							{tabs.map((tab, index) => (
								<div
									key={index}
									ref={(el) => (contentRefsQT.current[index] = el)}
									className={`tab-content ${expandedTabQT === index ? 'expanded fade-in' : 'fade-out'
										}`}
								>
									<div className='content col-6'>
								
                                    {tab.content.heading && <Heading level='h3'>
                                        <ColorComponent color={tab.content.headingColor}>{tab.content.heading}</ColorComponent>
                                    </Heading>}

                                    {tab.content.blurb && <div className="blurb b4">
                                        <ColorComponent color={tab.content.blurbColor}>{tab.content.blurb}</ColorComponent>
                                    </div>}

									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

		</Customizations>
	);
}

export default QuoteTestimonials;