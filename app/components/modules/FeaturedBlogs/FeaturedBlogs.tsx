import React, { useState } from 'react';
import ResourceCard from '../../organisms/ResourceCard/ResourceCard';
import Heading from '../../atoms/Heading/Heading';
import Customizations from '../../filters/Customizations';

interface Blog {
    id: string;
    title: string;
    uri: string;
    excerpt: string;
    date: string;
    featuredImage: {
        node: {
            altText: string;
            sourceUrl: string;
        };
    };
    resourceTags: {
        nodes: Array<{
            slug: string;
            name: string;
        }>;
    };
    resourceTypes: {
        nodes: Array<{
            name: string;
        }>;
    };
}

interface FeaturedBlogsProps {
    blogs: Blog[];
    heading: string;
    headingColor: string;
    featuredResourceIds: string[];
    customizations?: {
        topPaddingMobile?: string;
        topPaddingDesktop?: string;
        bottomPaddingMobile?: string;
        bottomPaddingDesktop?: string;
        backgroundColor?: string;
    };
}

  const FeaturedBlogs: React.FC<FeaturedBlogsProps> = ({ blogs, heading, headingColor, featuredResourceIds, customizations }) => {
    return (
        <Customizations
            topPaddingMobile={customizations?.topPaddingMobile}
            topPaddingDesktop={customizations?.topPaddingDesktop}
            bottomPaddingMobile={customizations?.bottomPaddingMobile}
            bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
            colorLabel={customizations?.backgroundColor}
        >
            <div className="featured-blogs">
                <div className="container">
                    <div className="heading-wrapper mb-4">
                        {heading && <Heading level="h2" color={headingColor}>{heading}</Heading>}
                    </div>
                    <div className="cards">
                    {blogs.map((blog) => (
                        <ResourceCard
                            key={blog.id}
                            resource={blog}
                            showFeaturedImage={true}
                            className="featured medium" 
                            featuredResourceIds={featuredResourceIds}
                            // isFeatured={featuredResourceIds.includes(blog.id)} 
                        />
                    ))}
                </div>
                </div>
            </div>
        </Customizations>
    );
};

export default FeaturedBlogs;
