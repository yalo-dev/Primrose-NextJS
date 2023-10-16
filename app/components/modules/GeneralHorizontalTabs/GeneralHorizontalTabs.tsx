import React, { useState } from 'react';
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
		if (expandedTab === index) {
			setExpandedTab(null);
		} else {
			setExpandedTab(index);
		}
	};

	const currentTab = expandedTab !== null ? tabs[expandedTab] : null;


	return (
		<div className="container">
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
								onClick={() => handleTabClick(index)}
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
					{expandedTab !== null && (
						<animated.div style={fadeInAnimationProps} className="tab-content d-flex">

							{currentTab && currentTab.content?.image?.sourceUrl && (
								<div className='image-wrapper'>
									<Image src={currentTab.content.image.sourceUrl} alt="Tab Image" width={200} height={200} />
								</div>
							)}

							<div className='content-wrapper'>
								{tabs[expandedTab].content.heading && <Heading level='h3' color={tabs[expandedTab].content.headingColor}>{tabs[expandedTab].content.heading}</Heading>}
								{tabs[expandedTab].content.subheading && <Subheading level='div' className='b3' color={tabs[expandedTab].content.headingColor}>{tabs[expandedTab].content.subheading}</Subheading>}
								<ul>
									{tabs[expandedTab].content.list?.map((item, idx) => (
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
			</Customizations>
		</div>
	);
}

export default HorizontalTab;
