import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import Heading from "../../app/components/atoms/Heading/Heading";
import { ResourceFilter } from "../../app/components/filters/ResourceFilter";
import Pagination from "../../app/components/molecules/Pagination/Pagination";
import ResourceCard from "../../app/components/organisms/ResourceCard/ResourceCard";
import {
  getAllFilters,
  getAllResources,
  getResourceSettings,
} from "../../app/lib/resources";

export async function getStaticProps() {
  try {
    const [resourceData, filterTermsData, resourceSettings] = await Promise.all(
      [getAllResources(), getAllFilters(), getResourceSettings()],
    );
    console.log(resourceData);
    return {
      props: {
        seo: resourceSettings.data.seo,
        resources: resourceData.data.resources.nodes,
        featuredResources:
          resourceSettings.data.resourcesSettings.resourceSettings
            .featuredResources,
        excludedResources:
          resourceSettings.data.resourcesSettings.resourceSettings
            .hideTagFromSearch,
        filterTerms: filterTermsData.data,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error fetching data", error);
    return {
      props: {
        resources: [],
        featuredResources: [],
        excludedResources: [],
        filterTerms: [],
      },
    };
  }
}

export default function ResourcesList({
  resources,
  featuredResources,
  excludedResources,
  filterTerms,
}) {
  // TODO: this is statically adding rows for resource types. Better user experience would be to dynamically add resource rows as they are edited on the backend

  const router = useRouter();
  const featuredResourceIds = featuredResources?.map((fr) => fr.id);
  const displayedFeaturedResources = featuredResources?.slice(0, 5);
  const excludedResourceIds = excludedResources?.map((tag) => tag.id);

  const filterResourcesByTypeAndExcludeFeatured = (typeSlug) => {
    return resources.filter(
      (resource) =>
        resource.resourceTypes.nodes.some((type) => type.slug === typeSlug) &&
        !featuredResourceIds?.includes(resource.id) &&
        !excludedResourceIds?.includes(resource.id),
    );
  };
  const sortByDateDescending = (a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime();

  const familiesResources = filterResourcesByTypeAndExcludeFeatured(
    "for-families",
  )
    .sort(sortByDateDescending)
    .slice(0, 3);
  const educatorsResources = filterResourcesByTypeAndExcludeFeatured(
    "for-educators",
  )
    .sort(sortByDateDescending)
    .slice(0, 3);
  const newsroomResources = filterResourcesByTypeAndExcludeFeatured("news")
    .sort(sortByDateDescending)
    .slice(0, 3);
  const franchiseResources = filterResourcesByTypeAndExcludeFeatured(
    "franchising",
  )
    .sort(sortByDateDescending)
    .slice(0, 3);

  const { filteredResources, SearchAndFilterUI } = ResourceFilter(
    resources,
    filterTerms,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredResources]);

  const renderTitle = (title: string, linkTo: string = ""): React.ReactNode => {
    let adjustedTitle = title;
    if (title.includes("Families"))
      adjustedTitle = title.replace("Families", "All Family Resources");
    if (title.includes("Educators"))
      adjustedTitle = title.replace("Educators", "All Educator Resources");
    if (title.includes("Newsroom"))
      adjustedTitle = title.replace("Newsroom", "All News");
    if (title.includes("Franchising"))
      adjustedTitle = title.replace("Franchising", "All Franchising");

    return (
      <div className="title-container">
        <Heading level="h2" className="title">
          {title}
        </Heading>
        {linkTo && (
          <Link className="link" href={linkTo}>
            {adjustedTitle.replace("For ", "")}
          </Link>
        )}
      </div>
    );
  };

  const renderResourceItems = (
    resourceList: any[],
    showFeaturedImage: boolean = true,
    classNames: string[] = [],
    showExcerptIfNoImage: boolean = false,
  ): React.ReactNode => {
    if (!resourceList || resourceList.length === 0) {
      return null;
    }

    return (
      <div className="gap d-flex flex-wrap">
        {resourceList.map((resource, index) => {
          if (!resource) {
            return null;
          }

          if (excludedResourceIds?.includes(resource.id)) {
            return null;
          }

          const isNewsroom = resource?.resourceTypes?.nodes?.some(
            (type) => type.slug === "newsroom",
          );
          const isFeatured = resource?.resourceTags?.nodes?.some(
            (tag) => tag.slug === "featured",
          );
          const shouldAddNewsroomClass = isNewsroom && !isFeatured;
          const className =
            classNames[index] || classNames[classNames.length - 1];

          const categoryFirstNode = resource?.resourceTypes?.nodes[0];
          const category = categoryFirstNode?.slug;
          const link =
            resource?.newsFields?.link != null
              ? resource?.newsFields?.link
              : router.pathname + "/" + category + "/" + resource.slug;
          return (
            <ResourceCard
              key={resource.id}
              resource={resource}
              showFeaturedImage={showFeaturedImage}
              className={`${className} ${shouldAddNewsroomClass ? "small" : ""}`}
              showExcerptIfNoImage={showExcerptIfNoImage}
              featuredResourceIds={featuredResourceIds}
              customLink={link}
            />
          );
        })}
      </div>
    );
  };

  const [currentPage, setCurrentPage] = useState(1);
  const resourcesPerPage = 9;
  const indexOfLastResource = currentPage * resourcesPerPage;
  const indexOfFirstResource = indexOfLastResource - resourcesPerPage;
  const allResourcesRef = useRef<HTMLDivElement>(null);
  const filteredResourcesExcludes = filteredResources.filter(
    (resource) => !excludedResourceIds?.includes(resource.id),
  );

  const currentResources = filteredResourcesExcludes
    .slice(indexOfFirstResource, indexOfLastResource)
    .map((resource) => ({
      ...resource,
      isFeatured: featuredResourceIds?.includes(resource.id),
    }));

  return (
    <>
      <div className="container">
        <div className="resources-container">
          {renderResourceItems(displayedFeaturedResources, true, [
            "featured large",
            "featured medium",
          ])}
        </div>
        <div className="resources-container">
          {renderTitle("For Families", "/stories-resources/for-families")}
          {renderResourceItems(familiesResources, true, ["families medium"])}
        </div>
        <div className="resources-container">
          {renderTitle("For Educators", "/stories-resources/for-educators")}
          {renderResourceItems(educatorsResources, true, ["educators medium"])}
        </div>
        <div className="resources-container">
          {renderTitle("Newsroom", "/stories-resources/news")}
          {renderResourceItems(newsroomResources, false, ["newsroom"])}
        </div>
        {franchiseResources.length > 0 && (
          <div className="resources-container">
            {renderTitle("Franchising", "/stories-resources/franchising")}
            {renderResourceItems(franchiseResources, false, ["newsroom"])}
          </div>
        )}

        <div id="all" className="resources-container" ref={allResourcesRef}>
          <div className="title-and-search-container">
            {renderTitle("All Stories & Resources")}
            {SearchAndFilterUI}
          </div>
          {renderResourceItems(currentResources, true, ["medium"], true)}
          <Pagination
            controller={{ page: currentPage, setPage: setCurrentPage }}
            itemCount={filteredResources?.length}
            perPage={resourcesPerPage}
            scrollToRef={allResourcesRef}
          />
        </div>
      </div>
    </>
  );
}
