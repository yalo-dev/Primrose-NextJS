import React, { useEffect, useState } from 'react';
import Button from '../../atoms/Button/Button';
import SelectDropdown, { OptionType } from '../../molecules/SelectDropdown/SelectDropdown';
import Head from 'next/head';
import defaultThumb from '../../../../public/assets/staff-default-thumbnail.jpg';

interface LeadershipMember {
    image?: {
      sourceUrl?: string;
    };
    name?: string;
    title?: string;
    bio?: string;
    group?: string;
  }
  
  interface LeadershipMemberListProps {
    leadershipMembers: LeadershipMember[];
  }

  export default function LeadershipPage({ leadershipMembers }: LeadershipMemberListProps) {
    console.log(leadershipMembers); 

  const [activeBio, setActiveBio] = useState(null);
  const [bioHeights, setBioHeights] = useState({});
  const initialLeadershipCount = 20;
  const [visibleLeadershipCount, setVisibleLeadershipCount] = useState(initialLeadershipCount);
  const [filteredLeadershipMembers, setFilteredLeadershipMembers] = useState<LeadershipMember[]>(leadershipMembers);
  const [selectedGroup, setSelectedGroup] = useState<OptionType>(null);


  const loadMoreLeadership = () => {
    setVisibleLeadershipCount((prevCount) => prevCount + 4);
  };

  const canLoadMore = filteredLeadershipMembers?.length > visibleLeadershipCount;

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
        const height = bioElement.scrollHeight;
        setBioHeights({ ...bioHeights, [index]: height });
      }
    });
  };

  const groupOptions = [
    { label: 'All Leadership', value: 'All' },
    { label: 'Leadership', value: 'Leadership' },
    { label: 'Teachers', value: 'Teacher' },
    { label: 'Leadership', value: 'Leadership' },
  ];
    

  useEffect(() => {
    const filtered =
      !selectedGroup || selectedGroup.value === 'All'
        ? leadershipMembers
        : leadershipMembers.filter((member) => member.group === selectedGroup.value);
  
    setFilteredLeadershipMembers(filtered);
    setVisibleLeadershipCount(initialLeadershipCount);
  }, [selectedGroup, leadershipMembers]);
  

  console.log(selectedGroup);
  console.log(leadershipMembers);

  const handleSelectedGroup = (selectedOption) => {
    setSelectedGroup(selectedOption);
  };

  return (
    <div className="staff-module">
    <div className="staff">
      <div className="staff-members-section">
        <div className="heading">
          <div className="filter">
            <SelectDropdown
              selectedOption={selectedGroup}
              options={groupOptions}
              placeholder="Select A Category"
              onSelect={handleSelectedGroup}
              type="filter"
            />
          </div>
        </div>
        <div className="staff-members">
          {filteredLeadershipMembers?.slice(0, visibleLeadershipCount).map((member, index) => (
            <div className={`staff-member ${activeBio === index ? 'expanded' : ''}`} key={index}>
              <div className="row align-items-center">
                <div className="col-4">
                {member.image ? <img src={member.image.sourceUrl} alt={member.name} className="img-fluid" /> : <img src={defaultThumb.src} alt="Primrose Leadership Member Photo" className="img-fluid" />}
                </div>
                <div className="col-7">
                  <div className="text-wrap pe-5">
                    <h5 className="mb-0">{member?.name}</h5>
                    <div className="b3">{member?.title}</div>
                  </div>
                  <div id="button" onClick={() => handleToggleBio(index)} className={activeBio === index ? 'expanded' : ''}>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="col-12">
                  <div
                    className={`bio ${activeBio === index ? 'expanded' : ''}`}
                    id={`bio-${index}`}
                    style={{ maxHeight: activeBio === index ? `${bioHeights[index]}px` : '0' }}
                  >
                    <div className="b3 p-3" dangerouslySetInnerHTML={{ __html: member?.bio }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="load-more d-flex align-items-center justify-content-center">
          {canLoadMore && <Button onClick={loadMoreLeadership}>Load More</Button>}
        </div>
      </div>
    </div>
    </div>
  );
}
