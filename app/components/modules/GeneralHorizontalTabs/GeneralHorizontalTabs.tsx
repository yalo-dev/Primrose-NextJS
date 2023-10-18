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
        // Toggle the active tab
        if (expandedTab === index) {
            setExpandedTab(null);
        } else {
            setExpandedTab(index);
        }
    };

	const currentTab = expandedTab !== null ? tabs[expandedTab] : null;

	const containerRef = useRef<HTMLDivElement | null>(null);

	const [isSticky, setIsSticky] = useState(false);
    
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

	const handleLabelClick = (targetId: string) => {
		const targetElement = document.getElementById(targetId);
	
		if (window.innerWidth > 992) {  // 992px is the typical breakpoint for large (desktop) screens
			if (targetElement) {
				const offset = window.pageYOffset || document.documentElement.scrollTop;
				const absoluteTargetTop = targetElement.getBoundingClientRect().top + offset;
				
				window.scrollTo({
					top: absoluteTargetTop - 120, // accounting for the navigation space
					behavior: 'smooth'
				});
	
				if (containerRef.current) {
					const innerDiv = containerRef.current.querySelector('.inner');
					if (innerDiv) {
						const innerButtons = innerDiv.querySelectorAll('button');
						innerButtons.forEach((btn) => {
							if (btn.getAttribute("data-id") === targetId) {
								btn.classList.add("expanded");
							} else {
								btn.classList.remove("expanded");
							}
						});
					}
				}
			}
		} else {
			// This is the mobile accordion behavior
			if (expandedTab !== null && `content-${expandedTab}` === targetId) {
				setExpandedTab(null);  // close the accordion if the same button is clicked
			} else {
				setExpandedTab(parseInt(targetId.split('-')[1]));
			}
		}
	};
	
	
	
	
	
	

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
            onClick={() => handleLabelClick(`content-${index}`)}
            data-id={`content-${index}`} // Add this attribute
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
									<animated.div style={slideAnimationProps} className="tab-content">
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
														{item.icon?.sourceUrl && (
															<Image
																src={item.icon.sourceUrl}
																alt="List Icon"
																width={30}
																height={30}
															/>
														)}
														<span className='ps-4' color={item.textColor}>{item.text}</span>
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
						<div id={`content-${index}`} className="tab-content d-flex" key={index}>

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
											{item.icon?.sourceUrl && (
												<Image
													src={item.icon.sourceUrl}
													alt="List Icon"
													width={30}
													height={30}
												/>
											)}
											<span className='ps-4' color={item.textColor}>{item.text}</span>
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