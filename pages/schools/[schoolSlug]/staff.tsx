import { gql, useQuery } from "@apollo/client";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import FranchiseOwnerBio from "../../../app/components/modules/FranchiseOwnerModal/FranchiseOwnerBio";
import SelectDropdown, {
  OptionType,
} from "../../../app/components/molecules/SelectDropdown/SelectDropdown";
import ScheduleATourSlider from "../../../components/schools/ScheduleATourSlider";
import defaultThumb from "../../../public/assets/staff-default-thumbnail.jpg";
import getSchoolsNav from "../../../queries/getSchoolsNav";

interface StaffMember {
  altText?: string;
  image: {
    sourceUrl: string;
  };
  name: string;
  title: string;
  bio: string;
  group: string;
}

export async function getServerSideProps(context) {
  const { schoolSlug } = context.params;
  const schoolNavData = await getSchoolsNav(schoolSlug);

  const GET_SCHOOL_STAFF = gql`
    query SchoolData($id: ID!) {
      school(id: $id, idType: URI) {
        id
        slug
        uri
        title
        seo {
          fullHead
        }
        schoolCorporateSettings {
          usesCalendly
          staffMeta {
            description
            fieldGroupName
            title
          }
          address {
            city
            state
          }
        }
        schoolAdminSettings {
          staffMembers {
            bio
            classroomAssignment
            group
            image {
              mediaItemUrl
              sourceUrl
            }
            altText
            name
            title
          }
          meetStaffImage {
            altText
            mediaItemUrl
            sourceUrl
          }
          franchiseOwner {
            bio
            multipleOwners
            name
            image {
              altText
              sourceUrl
              mediaItemUrl
            }
          }
        }
      }
    }
  `;

  const response = useQuery(GET_SCHOOL_STAFF, {
    variables: { id: schoolSlug },
  });

  const school = response?.data?.school;
  const staff = response?.data?.school?.schoolAdminSettings?.staffMembers;
  const schoolAdminSettings = response?.data?.school?.schoolAdminSettings;
  const franchiseOwner =
    response?.data?.school?.schoolAdminSettings?.franchiseOwner;
  //console.log(staff);

  let customSeo = {
    fullHead: school.seo.fullHead
      .replaceAll(`${schoolSlug}`, `${schoolSlug}/staff`)
      .replaceAll(`<title>`, `<title>Franchise Owner(s) and Staff | `),
  };
  return {
    props: {
      school,
      schoolNavData,
      staff,
      schoolSlug,
      schoolAdminSettings,
      franchiseOwner,
      customSeo,
    },
  };
}

export default function StaffPage({
  school,
  staff,
  schoolSlug,
  franchiseOwner,
}) {
  const [activeBio, setActiveBio] = useState(null);
  const [bioHeights, setBioHeights] = useState({});
  const initialStaffCount = 1000;
  const [filteredStaffMembers, setFilteredStaffMembers] =
    useState<StaffMember[]>(staff);
  const [selectedGroup, setSelectedGroup] = useState<OptionType>(null);
  const schoolCity = school.schoolCorporateSettings?.address?.city;
  const schoolState = school.schoolCorporateSettings?.address?.state;
  const metaTitle =
    school.schoolCorporateSettings?.staffMeta?.title ??
    `Franchise Owner(s) and Staff | Primrose School of ${school?.title}`;
  const defaultDesc = `Meet the teachers and leadership team at Primrose School of ${school?.title}, one of the premier child care and early education providers in ${schoolCity}, ${schoolState}.`;
  const metaDesc =
    school.schoolCorporateSettings?.staffMeta?.description ?? defaultDesc;

  useEffect(() => {
    setActiveBio(null);
  }, [filteredStaffMembers]);

  const handleToggleBio = (index) => {
    if (activeBio !== index) {
      measureBioHeight(index);
    }
    setActiveBio(activeBio === index ? null : index);
  };

  const measureBioHeight = (index) => {
    requestAnimationFrame(() => {
      const bioElement = document.querySelector(`#bio-${index}`);
      if (bioElement) {
        // null check
        const height = bioElement.scrollHeight;
        setBioHeights({ ...bioHeights, [index]: height });
      }
    });
  };

  const groupOptions = [
    { label: "All Teachers & Staff", value: "All" },
    { label: "Leadership", value: "Leadership" },
    { label: "Teachers", value: "Teacher" },
    { label: "Staff", value: "Staff" },
  ];

  useEffect(() => {
    const filtered =
      !selectedGroup || selectedGroup.value === "All"
        ? staff
        : staff?.filter((member) => member.group === selectedGroup.value);

    setFilteredStaffMembers(filtered);
  }, [selectedGroup, staff]);
  const handleSelectedGroup = (selectedOption) => {
    setSelectedGroup(selectedOption);
  };
  const defaultImages = [
    {
      url: "/schoolsHomeDefault/scrollies-1.jpg",
      altText: "A child and teacher's hand on a book",
    },
    {
      url: "/schoolsHomeDefault/scrollies-2.jpg",
      altText: "A young boy playing with toys",
    },
    {
      url: "/schoolsHomeDefault/scrollies-3.jpg",
      altText: "A young boy playing to the floor looking up at camera",
    },
    {
      url: "/schoolsHomeDefault/scrollies-4.jpg",
      altText: "A young boy smiling at camera",
    },
    {
      url: "/schoolsHomeDefault/scrollies-5.jpg",
      altText: "A young boy looking at camera",
    },
  ];

  return (
    <div className="school staff">
      <Head>
        <title>{metaTitle}</title>
        <meta name={"description"} content={metaDesc} />
      </Head>
      <div className="row">
        <div className="staff-members-section">
          <div className="heading">
            <h1>Teachers & Staff</h1>
            <div className="filter">
              <SelectDropdown
                selectedOption={selectedGroup}
                options={groupOptions}
                placeholder="Select A Category"
                onSelect={handleSelectedGroup}
                type={"filter"}
              />
            </div>
          </div>
          <div className="staff-members">
            {filteredStaffMembers
              ?.slice(0, initialStaffCount)
              .map((member, index) => (
                <div
                  className={`staff-member ${activeBio === index ? "expanded" : ""}`}
                  key={index}
                >
                  <div className="row align-items-center">
                    <div className="col-4">
                      {member.image ? (
                        <Image
                          width={980}
                          height={980}
                          src={member.image.sourceUrl}
                          alt={member.name}
                          className="img-fluid"
                        />
                      ) : (
                        <img
                          src={defaultThumb.src}
                          alt="Primrose Staff Member Photo"
                          className="img-fluid"
                        />
                      )}
                    </div>
                    <div className="col-7 ">
                      <div className="text-wrap pe-5">
                        <h5 className="mb-0">{member.name}</h5>
                        <div className="b3">{member.title}</div>
                      </div>
                      {member.bio && (
                        <div
                          id="button"
                          onClick={() => handleToggleBio(index)}
                          className={activeBio === index ? "expanded" : ""}
                        >
                          <span></span>
                          <span></span>
                        </div>
                      )}
                    </div>
                    <div className="col-12">
                      <div
                        className={`bio ${activeBio === index ? "expanded" : ""}`}
                        id={`bio-${index}`}
                        style={{
                          maxHeight:
                            activeBio === index
                              ? `${bioHeights[index]}px`
                              : "0",
                        }}
                      >
                        <div
                          className="b3 p-3"
                          dangerouslySetInnerHTML={{ __html: member.bio }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="container">
        {/* Franchise Owners Section */}
        {franchiseOwner?.bio && (
          <FranchiseOwnerBio franchiseOwner={franchiseOwner} />
        )}
      </div>
      <ScheduleATourSlider
        schoolSlug={schoolSlug}
        images={defaultImages}
        usesCalendly={school?.schoolCorporateSettings?.usesCalendly}
      />
    </div>
  );
}
