import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';
import { useSpring, animated } from 'react-spring';
import Customizations from '../../filters/Customizations';

interface HorizontalTabProps {
	tabs: {
		label?: string;
		tabLabelColor?: string;
		content: {
			image?: {
				sourceUrl?: string;
			};
			heading?: string;
			headingColor?: string;
			subheading?: string;
			subheadingColor?: string;
			list?: {
				icon: {
					sourceUrl: string;
				};
				text?: string;
				textColor?: string;
				detailsPopUp?: string;
			}[];
		};
	}[];
	customizations?: {
		topPaddingMobile?: string;
		topPaddingDesktop?: string;
		bottomPaddingMobile?: string;
		bottomPaddingDesktop?: string;
	};
}

const HorizontalTab: React.FC<HorizontalTabProps> = ({ tabs, customizations }) => {
	
	const [expandedTab, setExpandedTab] = useState<number | null>(0);
	const [activePopup, setActivePopup] = useState<string | null>(null);
	const buttonsRef = useRef<(HTMLButtonElement | null)[][]>(tabs.map(() => []));
	const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
	const currentTab = expandedTab !== null ? tabs[expandedTab] : null;
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const containerTop = containerRef.current.getBoundingClientRect().top;

                contentRefs.current.forEach((contentDiv, index) => {
                    if (contentDiv) {
                        const top = contentDiv.getBoundingClientRect().top;
                        const bottom = contentDiv.getBoundingClientRect().bottom;
                        
                        if (top <= 120 && bottom >= 120) {
                            setExpandedTab(index);
                        }
                    }
                });

                const lastContentOffset = document.querySelector('.general-horizontal-tabs .desktop-content:last-child')?.getBoundingClientRect().bottom;

                if (containerTop <= 120 && lastContentOffset && lastContentOffset > 0) {
                    setIsSticky(true);
                } else {
                    setIsSticky(false);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);

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
	
	const handleIconClick = (index: number, idx: number) => {
		const uniqueId = `${index}-${idx}`;
		const targetButton = buttonsRef.current[index][idx];
		
		if (targetButton && targetButton.classList.contains('has-popup')) {
			if (activePopup === uniqueId) {
				setActivePopup(null); 
			} else {
				setActivePopup(uniqueId); 
			}
		}
	};
	
	
	
	const handleLabelClick = (index: number) => {
	
		if (expandedTab === index) {
			setExpandedTab(null);
		} else {
			setExpandedTab(index);
		}
	
		// Scroll logic
		setTimeout(() => {
			const buttonElement = buttonRefs.current[index];
			const contentElement = contentRefs.current[index];
	
			if (buttonElement && contentElement) {
				if (window.innerWidth >= 992) { // Desktop
					const contentTop = contentElement.getBoundingClientRect().top;
					const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	
					window.scrollTo({
						top: scrollTop + contentTop - 120, // 120 is the offset to account for any sticky headers or desired positioning
						behavior: 'smooth'
					});
				} else { // Mobile
					const buttonTop = buttonElement.getBoundingClientRect().top;
					const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	
					window.scrollTo({
						top: scrollTop + buttonTop - 120,
						behavior: 'smooth'
					});
				}
			}
		}, 0);
	};
	
	useEffect(() => {
		const handleScroll = () => {
			if (containerRef.current) {
				const containerTop = containerRef.current.getBoundingClientRect().top;
				const lastContentOffset = document.querySelector('.desktop-content:last-child')?.getBoundingClientRect().bottom;

				if (containerTop <= 120 && lastContentOffset && lastContentOffset > 0) {
					setIsSticky(true);
				} else {
					setIsSticky(false);
				}
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		}
	}, []);

	useEffect(() => {
		tabs.forEach((_, index) => {
			if (!buttonsRef.current[index]) {
				buttonsRef.current[index] = [];
			}
		});
	}, []);
	
	return (
		<div className={`container ${isSticky ? 'sticky' : ''}`} ref={containerRef}>
			<Customizations
				topPaddingMobile={customizations?.topPaddingMobile}
				topPaddingDesktop={customizations?.topPaddingDesktop}
				bottomPaddingMobile={customizations?.bottomPaddingMobile}
				bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
			>
				<div className="general-horizontal-tabs">
					<div className="inner">
					

						{tabs.map((tab, index) => (
							
							<div key={index}>
								<button
									ref={(el) => buttonRefs.current[index] = el}
									onClick={() => handleLabelClick(index)}
									data-id={`content-${index}`}
									id={`button-${index}`}
									className={expandedTab === index ? 'expanded' : ''}
								>
									{tab.label && <Heading level='h5' color={tab.tabLabelColor}>{tab.label}
										<div id="button">
											<span></span>
											<span></span>
										</div>
									</Heading>}
								</button>

								{/* Mobile: Content rendered right below the label */}
								<div className="d-lg-none">
									{expandedTab === index && (
										<animated.div style={slideAnimationProps} className="tab-content" ref={(el) => contentRefs.current[index] = el}
										>
											{tab.content.image?.sourceUrl && (
												<div className='image-wrapper'>
													<Image src={tab.content.image.sourceUrl} alt="Tab Image" width={200} height={200} />
												</div>
											)}

											<div className='content-wrapper'>
												{tab.content.heading && <Heading level='h3' className='d-none d-lg-block' color={tab.content.headingColor}>{tab.content.heading}</Heading>}
												{tab.content.subheading && <Subheading level='div' className='b3' color={tab.content.subheadingColor}>{tab.content.subheading}</Subheading>}
												<ul>
													{tab.content.list?.map((item, idx) => (
														<li key={idx}>
															<div className="icon-and-popup-container d-flex flex-lg-column align-center justify-content-lg-center">
															<button
																ref={el => buttonsRef.current[index][idx] = el}


																className={`icon-container ${activePopup === `${index}-${idx}` ? 'active' : ''} ${item.detailsPopUp ? 'has-popup' : ''}`}
																onClick={() => handleIconClick(index, idx)}
															>
																{item.icon?.sourceUrl && (
																	<Image
																		src={item.icon.sourceUrl}
																		alt="List Icon"
																		width={30}
																		height={30}
																	/>
																)}
															</button>

																<span className='ps-4' color={item.textColor}>{item.text}</span>
																<div className={`details-popup ${activePopup === `${index}-${idx}` ? 'active' : ''}`}>
																	<div className='title-container'>
																		{item.text && <Subheading level='div' className='title'>{item.text}</Subheading>}
																	</div>
																	{item.detailsPopUp && (
																		<div className="details-container" dangerouslySetInnerHTML={{ __html: item.detailsPopUp }}></div>
																	)}
																</div>

															</div>
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
					

						{tabs.map((tab, index) => (
                			<div id={`content-${index}`} className="tab-content d-flex" key={index} ref={el => contentRefs.current[index] = el}>

								{tab.content?.image?.sourceUrl && (
									<div className='image-wrapper'>
										<Image src={tab.content.image.sourceUrl} alt="Tab Image" width={200} height={200} />
									</div>
								)}

								<div className='content-wrapper'>
									{tab.content.heading && <Heading level='h3' color={tab.content.headingColor}>{tab.content.heading}</Heading>}
									{tab.content.subheading && <Subheading level='div' className='b3' color={tab.content.subheadingColor}>{tab.content.subheading}</Subheading>}
									<ul>
										{tab.content.list?.map((item, idx) => (
											<li key={idx}>
												<div className="icon-and-popup-container d-flex flex-lg-row align-center justify-content-lg-center">
													<button
														ref={el => buttonsRef.current[index][idx] = el}


														className={`icon-container ${activePopup === `${index}-${idx}` ? 'active' : ''} ${item.detailsPopUp ? 'has-popup' : ''}`}
														onClick={() => handleIconClick(index, idx)}
													>
														{item.icon?.sourceUrl && (
															<Image
																src={item.icon.sourceUrl}
																alt="List Icon"
																width={30}
																height={30}
															/>
														)}
													</button>

													<span className='ps-4' color={item.textColor}>{item.text}</span>
													<div className={`details-popup ${activePopup === `${index}-${idx}` ? 'active' : ''}`}>
														{item.detailsPopUp && (
															<>
																<div className='title-container'>
																	{item.text && <Subheading level='div' className='title'>{item.text}</Subheading>}
																</div>
																{item.detailsPopUp && (
																	<div className="details-container" dangerouslySetInnerHTML={{ __html: item.detailsPopUp }}></div>
																)}
															</>
														)}
													</div>

												</div>
											</li>
										))}
									</ul>
								</div>
							</div>
						))}
					</div>
				</div>
			</Customizations>
		</div>
	);
}

export default HorizontalTab;