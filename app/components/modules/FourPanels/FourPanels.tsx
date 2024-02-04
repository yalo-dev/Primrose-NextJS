import React from 'react';

const FourPanels = () => {
    return (
        <div className='four-panels'>
                <div className='panels'>
                    <a href='/find-a-school' className='panel teal'>
                        <h5 className='b5 white bold'>Find a<br />School</h5>
                        <img src='assets/findaschool.png' alt='find a school' />
                    </a>
                    <a href='/careers' className='panel violet'>
                        <h5 className='b5 white bold'>Careers</h5>
                        <img src='assets/careers.png' alt='careers' />
                    </a>
                    <a href='/resources' className='panel red'>
                        <h5 className='b5 white bold'>Stories &amp; Resources</h5>
                        <img src='assets/storiesnresources.png' alt='stories and resources' />
                    </a>
                    <a href='/franchising' className='panel blue'>
                        <h5 className='b5 white bold'>Franchising</h5>
                        <img src='assets/franchising.png' alt='franchising' />
                    </a>
                </div>
        </div>
    );
};

export default FourPanels;
