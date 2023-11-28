import React, { useEffect, useRef, useState } from 'react';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';
import Customizations from '../../filters/Customizations';
import ColorComponent from '../../filters/ColorComponent';
import Button from '../../atoms/Button/Button';

interface VerticalTabProps {
	customizations: {
		topMarginMobile: string;
		topMarginDesktop: string;
		bottomMarginMobile: string;
		bottomMarginDesktop: string;
		backgroundColor: string;
	};
	tabs: {
		label: string;
		tabLabelColor: string;
		content: {
			blurb: string;
			blurbColor: string;
			button: {
				target: string;
				title: string;
				url: string;
			};
			buttonStyle: string;
			fullWidthOrFeatured: string;
			heading: string;
			headingColor: string;
			image: {
				sourceUrl: string;
				altText?: string;
			};
			subheading: string;
			subheadingColor: string;
			list: {
				textColor: string;
				text: string;
			}[];
			table: {
                label: string;
                description: string;
              }[];
			eyebrow: string;
			eyebrowColor: string;
		};
	}[];
	heading: string;
	headingColor: string;
	subheading: string;
	subheadingColor: string;
}

const VerticalTab: React.FC<VerticalTabProps> = ({
	tabs,
	customizations,
	heading,
	headingColor,
	subheading,
	subheadingColor
}) => {

	const [expandedTabVT, setExpandedTabVT] = useState<number | null>(0);
	const buttonRefsVT = useRef<(HTMLButtonElement | null)[]>([]);
	const contentRefsVT = useRef<(HTMLDivElement | null)[]>([]);
	const containerRefVT = useRef<HTMLDivElement | null>(null);
	const contentHeightRefVT = useRef<number | null>(null);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const calculateHeight = (index: number) => {
		const contentElement = contentRefsVT.current[index];
		if (contentElement) {
			const height = contentElement.scrollHeight;
			console.log("Calculated Height:", height);
			contentHeightRefVT.current = height;
		}
	};

	const handleLabelClick = (index: number) => {
		if (expandedTabVT === index) {
			setExpandedTabVT(null);
			contentHeightRefVT.current = null;

			setTimeout(() => {
				window.scrollBy(0, -contentHeightRefVT.current!);
			}, 50);
		} else {
			calculateHeight(index);
			setExpandedTabVT(index);
		}
	};


	return (
		<Customizations
			topMarginMobile={customizations?.topMarginMobile}
			topMarginDesktop={customizations?.topMarginDesktop}
			bottomMarginMobile={customizations?.bottomMarginMobile}
			bottomMarginDesktop={customizations?.bottomMarginDesktop}
			colorLabelOuter={customizations?.backgroundColor}
		>
			<div className='container' ref={containerRefVT}>
				<div className="general-vertical-tabs">
					{/* Main Heading and Subheading */}
					<div className="heading-wrapper">
						<Heading level='h2'><ColorComponent color={headingColor}>{heading}</ColorComponent></Heading>
						<Subheading level='div' className='b4'><ColorComponent color={subheadingColor}>{subheading}</ColorComponent></Subheading>
					</div>


					{/* Mobile layout */}
					<div className="mobile-layout d-block d-lg-none">
						{tabs.map((tab, index) => (
							<div key={index} className="mobile-tab">
								<button
									ref={(el) => buttonRefsVT.current[index] = el}
									onClick={() => handleLabelClick(index)}
									className={`tab-button ${expandedTabVT === index ? 'active' : ''}`}
								>
									<Heading level='h5'>{tab.label && <ColorComponent color={tab.tabLabelColor}>{tab.label}</ColorComponent>}</Heading>
									<div id="button">
										<span></span>
										<span></span>
									</div>
								</button>
								<div
									key={index}
									ref={(el) => contentRefsVT.current[index] = el}
									className={`tab-content ${expandedTabVT === index ? 'expanded' : ''}`}
								>

									{tab.content.image?.sourceUrl && <div className={`image-wrapper ${tab.content.fullWidthOrFeatured}`}>
                                        <img src={tab.content.image.sourceUrl} alt={tab.content.image.altText || ''} width={343} height={287} />
                                    </div>}
									<div className='content'>
									

                                    {tab.content.eyebrow && <div className="eyebrow h5">
                                        <ColorComponent color={tab.content.eyebrowColor}>{tab.content.eyebrow}</ColorComponent>
                                    </div>}

                                    {tab.content.heading && <Heading level='h3'>
                                        <ColorComponent color={tab.content.headingColor}>{tab.content.heading}</ColorComponent>
                                    </Heading>}

                                    {tab.content.subheading && <Subheading level='div' className='subhead b4'>
                                        <ColorComponent color={tab.content.subheadingColor}>{tab.content.subheading}</ColorComponent>
                                    </Subheading>}

                                    {tab.content.blurb && <div className="blurb b3">
                                        <ColorComponent color={tab.content.blurbColor}>{tab.content.blurb}</ColorComponent>
                                    </div>}

                                    {tab.content.list && <ul>
                                        {tab.content.list.map((item, idx) => (
                                            <li key={idx} className='b3'>
                                                <ColorComponent color={item.textColor}>{item.text}</ColorComponent>
                                            </li>
                                        ))}
                                    </ul>}

									{tab.content.table && <div className='table'>
                                        {tab.content.table.map((item, idx) => (
                                            <div className='d-flex pt-2 pb-2' key={idx}>
                                                <div className='label h5 w-50'>{item.label} </div><div className='desc b2 ms-4 w-50'>{item.description}</div>
                                            </div>
                                        ))}
                                    </div>}

                                    {tab.content.button && <Button href={tab.content.button.url} target={tab.content.button.target} variant="primary">
                                        {tab.content.button.title}
                                    </Button>}
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Desktop layout */}
					<div className="desktop-layout d-none d-lg-block">
						<div className="buttons-container">
							{tabs.map((tab, index) => (
								<button
									key={index}
									ref={(el) => buttonRefsVT.current[index] = el}
									onClick={() => handleLabelClick(index)}
									className={`tab-button ${expandedTabVT === index ? 'active' : ''}`}
								>
									<Heading level='h5'>{tab.label && <ColorComponent color={tab.tabLabelColor}>{tab.label}</ColorComponent>}</Heading>
								</button>
							))}
						</div>
						<div className="desktop-content">
							{tabs.map((tab, index) => (
								<div
									key={index}
									ref={(el) => (contentRefsVT.current[index] = el)}
									className={`tab-content ${expandedTabVT === index ? 'expanded fade-in' : 'fade-out'
										}`}
								>
									<div className='content col-6'>
									
                                    {tab.content.eyebrow && <div className="eyebrow h5">
                                        <ColorComponent color={tab.content.eyebrowColor}>{tab.content.eyebrow}</ColorComponent>
                                    </div>}

                                    {tab.content.heading && <Heading level='h3'>
                                        <ColorComponent color={tab.content.headingColor}>{tab.content.heading}</ColorComponent>
                                    </Heading>}

                                    {tab.content.subheading && <Subheading level='div' className='subhead b4'>
                                        <ColorComponent color={tab.content.subheadingColor}>{tab.content.subheading}</ColorComponent>
                                    </Subheading>}

                                    {tab.content.blurb && <div className="blurb b3">
                                        <ColorComponent color={tab.content.blurbColor}>{tab.content.blurb}</ColorComponent>
                                    </div>}

                                    {tab.content.list && <ul>
                                        {tab.content.list.map((item, idx) => (
                                            <li key={idx} className='b3'>
                                                <ColorComponent color={item.textColor}>{item.text}</ColorComponent>
                                            </li>
                                        ))}
                                    </ul>}
									
									{tab.content.table && <div className='table'>
                                        {tab.content.table.map((item, idx) => (
                                            <div className='d-flex pt-2 pb-2' key={idx}>
                                                <div className='label h5 w-25'>{item.label} </div><div className='desc b2 ms-4 w-75'>{item.description}</div>
                                            </div>
                                        ))}
                                    </div>}

                                    {tab.content.button && <Button href={tab.content.button.url} target={tab.content.button.target} variant="primary">
                                        {tab.content.button.title}
                                    </Button>}
									</div>
									{tab.content.image?.sourceUrl && <div className={`image-wrapper ${tab.content.fullWidthOrFeatured}`}>
                                        <img src={tab.content.image.sourceUrl} alt="Tab Image" width={343} height={287} />
                                    </div>}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

		</Customizations>
	);
}

export default VerticalTab;