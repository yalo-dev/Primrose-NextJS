import React, { useEffect, useRef, useState } from 'react';
import ListItem from '../../atoms/ListItem/ListItem';
import UnorderedList from '../../molecules/UnorderedList/UnorderedList';
import Button from '../../atoms/Button/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function SchoolsMenu() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevArrowRef = useRef<HTMLButtonElement>(null);
  const nextArrowRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const { schoolSlug } = router.query;

  useEffect(() => {
    console.log(schoolSlug); 
  }, [schoolSlug]);

  useEffect(() => {
    const checkScrollPosition = () => {
      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
        const atStart = scrollLeft <= 0;
        const atEnd = scrollLeft >= (scrollWidth - clientWidth - 1);

        if (prevArrowRef.current) {
          if (atStart) {
            prevArrowRef.current.classList.remove('visible');
          } else {
            prevArrowRef.current.classList.add('visible');
          }
        }

        if (nextArrowRef.current) {
          if (atEnd) {
            nextArrowRef.current.classList.remove('visible');
          } else {
            nextArrowRef.current.classList.add('visible');
          }
        }
      }
    };

    checkScrollPosition();

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollPosition);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScrollPosition);
      }
    };
  }, []);

  const handleArrowClick = (direction) => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      const { clientWidth } = scrollContainer;
      const scrollAmount = direction === 'prev' ? -clientWidth : clientWidth;
      scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className='navbar-schools'>

        <div className='w-100 d-flex flex-column'>
          <div className='top w-100'>
            <div className='container d-lg-flex'>
              <div className='col'>
                <h1 className='h3'>Primrose School of St. Charles at Heritage</h1>
              </div>
              <div className='col w-100 col d-flex align-items-center justify-content-start'>
                <Button label='Schedule a Tour' variant='secondary' href={`/schools/${schoolSlug}/schedule-a-tour`} />
                <div className='phone ps-2 pe-2'>
                  <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="25" cy="25" r="24.5" fill="white" stroke="#DFE2D3" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M30.9098 27.155C32.0744 27.8022 33.2397 28.4494 34.4043 29.0966C34.9056 29.3749 35.1254 29.9656 34.9281 30.5042C33.9261 33.2415 30.9915 34.6863 28.2303 33.6786C22.5764 31.6148 18.3852 27.4236 16.3214 21.7697C15.3137 19.0085 16.7585 16.0739 19.4958 15.0719C20.0344 14.8746 20.6251 15.0944 20.904 15.5957C21.5506 16.7603 22.1978 17.9256 22.845 19.0902C23.1484 19.6365 23.077 20.285 22.6618 20.7516C22.1181 21.3635 21.5744 21.9753 21.0306 22.5865C22.1914 25.4132 24.5868 27.8086 27.4134 28.9694C28.0247 28.4256 28.6365 27.8819 29.2484 27.3382C29.7157 26.923 30.3635 26.8516 30.9098 27.155Z" stroke="#5E6738" />
                  </svg>
                </div>
                <div className='location'>
                  <svg width="51" height="51" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="25.5" cy="25.5" r="25" fill="white" />
                    <path d="M34.5 17.9043L28.4686 34.6066C28.4279 34.6954 28.3626 34.7707 28.2803 34.8235C28.1981 34.8762 28.1024 34.9043 28.0047 34.9043C27.907 34.9043 27.8113 34.8762 27.729 34.8235C27.6468 34.7707 27.5814 34.6954 27.5407 34.6066L24.2931 28.1112L17.7977 24.8636C17.7089 24.8229 17.6336 24.7575 17.5808 24.6753C17.5281 24.593 17.5 24.4973 17.5 24.3996C17.5 24.3019 17.5281 24.2062 17.5808 24.124C17.6336 24.0417 17.7089 23.9764 17.7977 23.9357L34.5 17.9043Z" stroke="#5E6738" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className='nav d-flex flex-column flex-sm-row align-items-start align-items-sm-center'>
            <div className='bottom w-100'>

              <button ref={prevArrowRef} onClick={() => handleArrowClick('prev')} className='scroll-arrow prev-arrow'>
                <svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="15" cy="15.85" r="15" transform="rotate(-90 15 15.85)" fill="#E6E6E6" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M13.3235 21.644C12.9421 21.3297 12.8905 20.7692 13.2084 20.392L17.2021 15.6532L13.2338 11.3368C12.8998 10.9736 12.9269 10.4114 13.2943 10.0812C13.6616 9.75095 14.2302 9.77772 14.5641 10.141L18.5324 14.4573C19.136 15.1138 19.1577 16.1097 18.5833 16.7913L14.5895 21.5301C14.2717 21.9073 13.7049 21.9582 13.3235 21.644Z" fill="#5E6738" />
                </svg>
              </button>

              <div className='nav-scroll-container' ref={scrollContainerRef}>
                <div className='container'>
                  <UnorderedList listClass='d-flex flex-grow-1 justify-center ps-0 mb-0 ps-sm-4'>
                    <ListItem>
                    <a className='b2' href={`/schools/${schoolSlug}`}>
                      Home
                    </a>
                    </ListItem>
                    <ListItem>
                      <a href={`/schools/${schoolSlug}/classrooms`} className='b2'>Our Classrooms</a>
                      <span className='ps-2'>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="10" cy="10" r="10" fill="#FBFBFB"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M6.13736 8.21565C6.34688 7.96138 6.72055 7.92703 6.97197 8.13892L10.1312 10.8014L13.0088 8.15587C13.251 7.93323 13.6257 7.95127 13.8459 8.19618C14.066 8.44109 14.0482 8.82011 13.806 9.04275L10.9285 11.6883C10.4908 12.0906 9.82686 12.1051 9.3725 11.7222L6.21324 9.0597C5.96182 8.84781 5.92785 8.46992 6.13736 8.21565Z" fill="#5E6738"/>
                        </svg>
                      </span>
                    </ListItem>
                    <ListItem>
                      <a href={`/schools/${schoolSlug}/staff`} className='b2'>Teachers & Staff</a>
                    </ListItem>
                    <ListItem>
                      <a href={`/schools/${schoolSlug}/careers`} className='b2'>School Careers</a>
                    </ListItem>
                  </UnorderedList>
                </div>
              </div>
              <button ref={nextArrowRef} onClick={() => handleArrowClick('next')} className='scroll-arrow next-arrow visible'>
                <svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="15" cy="15.85" r="15" transform="rotate(-90 15 15.85)" fill="#E6E6E6" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M13.3235 21.644C12.9421 21.3297 12.8905 20.7692 13.2084 20.392L17.2021 15.6532L13.2338 11.3368C12.8998 10.9736 12.9269 10.4114 13.2943 10.0812C13.6616 9.75095 14.2302 9.77772 14.5641 10.141L18.5324 14.4573C19.136 15.1138 19.1577 16.1097 18.5833 16.7913L14.5895 21.5301C14.2717 21.9073 13.7049 21.9582 13.3235 21.644Z" fill="#5E6738" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* offset for menu height */}
      <div className='margin-top'></div>
    </>
  );
}
