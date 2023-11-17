import React, { useEffect, useRef, useState } from 'react';
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
				altText?: string;
			};
			heading?: string;
			headingColor?: string;
			subheading?: string;
			subheadingColor?: string;
			list?: {
				icon: {
					sourceUrl: string;
					altText?: string;
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
	
	const [expandedTabGH, setExpandedTabGH] = useState<number | null>(0);
	const [activePopupGH, setActivePopupGH] = useState<string | null>(null);
	const buttonsRefGH = useRef<(HTMLButtonElement | null)[][]>(tabs.map(() => []));
	const buttonRefsGH = useRef<(HTMLButtonElement | null)[]>([]);
	const contentRefsGH = useRef<(HTMLDivElement | null)[]>([]);
	const currentTabGH = expandedTabGH !== null ? tabs[expandedTabGH] : null;
	const containerRefGH = useRef<HTMLDivElement | null>(null);
	const [isStickyGH, setIsStickyGH] = useState(false);

    useEffect(() => {
        const handleScrollGH = () => {
            if (containerRefGH.current) {
                const containerTop = containerRefGH.current.getBoundingClientRect().top;

                contentRefsGH.current.forEach((contentDiv, index) => {
                    if (contentDiv) {
                        const top = contentDiv.getBoundingClientRect().top;
                        const bottom = contentDiv.getBoundingClientRect().bottom;
                        
                        if (top <= 120 && bottom >= 120) {
                            setExpandedTabGH(index);
                        }
                    }
                });

                const lastContentOffset = document.querySelector('.general-horizontal-tabs .desktop-content:last-child')?.getBoundingClientRect().bottom;

                if (containerTop <= 120 && lastContentOffset && lastContentOffset > 0) {
                    setIsStickyGH(true);
                } else {
                    setIsStickyGH(false);
                }
            }
        };

        window.addEventListener('scroll', handleScrollGH);
        return () => {
            window.removeEventListener('scroll', handleScrollGH);
        }
    }, []);

	const slideAnimationPropsGH = useSpring({
		opacity: expandedTabGH !== null ? 1 : 0,
		transform: expandedTabGH !== null ? 'scaleY(1)' : 'scaleY(0)',
		from: {
			opacity: 0,
			transform: 'scaleY(0)'
		},
		config: { tension: 280, friction: 60 }
	});

	const fadeInAnimationPropsGH = useSpring({
		opacity: expandedTabGH !== null ? 1 : 0,
		from: {
			opacity: 0
		}
	});
	
	const handleIconClickGH = (index: number, idx: number) => {
		const uniqueId = `${index}-${idx}`;
		const targetButton = buttonsRefGH.current[index][idx];
		
		if (targetButton && targetButton.classList.contains('has-popup')) {
			if (activePopupGH === uniqueId) {
				setActivePopupGH(null); 
			} else {
				setActivePopupGH(uniqueId); 
			}
		}
	};
	
	const handleLabelClickGH = (index: number) => {
	
		if (expandedTabGH === index) {
			setExpandedTabGH(null);
		} else {
			setExpandedTabGH(index);
		}
	
		// Scroll logic
		setTimeout(() => {
			const buttonElement = buttonRefsGH.current[index];
			const contentElement = contentRefsGH.current[index];
	
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
		const handleScrollGH = () => {
			if (containerRefGH.current) {
				const containerTop = containerRefGH.current.getBoundingClientRect().top;
				const lastContentOffset = document.querySelector('.general-horizontal-tabs .desktop-content:last-child')?.getBoundingClientRect().bottom;

				if (containerTop <= 120 && lastContentOffset && lastContentOffset > 0) {
					setIsStickyGH(true);
				} else {
					setIsStickyGH(false);
				}
			}
		};

		window.addEventListener('scroll', handleScrollGH);
		return () => {
			window.removeEventListener('scroll', handleScrollGH);
		}
	}, []);

	useEffect(() => {
		tabs.forEach((_, index) => {
			if (!buttonsRefGH.current[index]) {
				buttonsRefGH.current[index] = [];
			}
		});
	}, []);
	
	return (
		<div className={`container ${isStickyGH ? 'sticky' : ''}`} ref={containerRefGH}>
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
									ref={(el) => buttonRefsGH.current[index] = el}
									onClick={() => handleLabelClickGH(index)}
									data-id={`content-${index}`}
									id={`button-${index}`}
									className={expandedTabGH === index ? 'clickable expanded' : 'clickable'}
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
									{expandedTabGH === index && (
										<animated.div style={slideAnimationPropsGH} className="tab-content" ref={(el) => contentRefsGH.current[index] = el}
										>
											{tab.content.image?.sourceUrl && (
												<div className='image-wrapper'>
													<img src={tab.content.image.sourceUrl} alt={tab.content.image.altText  || ''} width={200} height={200} />
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
																ref={el => buttonsRefGH.current[index][idx] = el}


																className={`icon-container ${activePopupGH === `${index}-${idx}` ? 'active' : ''} ${item.detailsPopUp ? 'has-popup' : ''}`}
																onClick={() => handleIconClickGH(index, idx)}
															>
																{item.icon?.sourceUrl && (
																	<img
																		src={item.icon.sourceUrl}
																		alt="List Icon"
																		width={30}
																		height={30}
																	/>
																)}
															</button>

																<span className='ps-4' color={item.textColor}>{item.text}</span>
																<div className={`details-popup ${activePopupGH === `${index}-${idx}` ? 'active' : ''}`}>
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
                			<div id={`content-${index}`} className="tab-content d-flex" key={index} ref={el => contentRefsGH.current[index] = el}>

								{tab.content?.image?.sourceUrl && (
									<div className='image-wrapper'>
										<img src={tab.content.image.sourceUrl} alt={tab.content.image.altText  || ''} width={200} height={200} />
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
														ref={el => buttonsRefGH.current[index][idx] = el}


														className={`icon-container ${activePopupGH === `${index}-${idx}` ? 'active' : ''} ${item.detailsPopUp ? 'has-popup' : ''}`}
														onClick={() => handleIconClickGH(index, idx)}
													>
														{item.icon?.sourceUrl && (
															<img
																src={item.icon.sourceUrl}
																alt={item.icon.altText || ''}
																width={30}
																height={30}
															/>
														)}
													</button>

													<span className='ps-4' color={item.textColor}>{item.text}</span>
													<div className={`details-popup ${activePopupGH === `${index}-${idx}` ? 'active' : ''}`}>
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