import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Button from '../../app/components/atoms/Button/Button';
import SelectDropdown from '../../app/components/molecules/SelectDropdown/SelectDropdown';

interface JobDetail {
    location: any;
    id: number;
    name: string;
    description: string;
    city: string;
    state: string;
    employment: {
        id: number;
        name: string;
    };
    prescreen_questions: {
        id: string;
        type: string;
        question: string;
        required: boolean;
        options: any;
    }
}

const JobPostPage = () => {
    const router = useRouter();
    const { schoolSlug, jobId } = router.query;
    const [jobDetails, setJobDetails] = useState<JobDetail | undefined>(undefined);
    const [isLoading, setLoading] = useState(true);
    const [pageUrl, setPageUrl] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        resume: null,
        coverLetter: null,
        recentJobTitle: '',
        recentEmployer: '',
        schedule: '',
        liftUp: '',
        references: '',
        referred: false,
        optInText: false,
    });


    // Define the options for the dropdowns
    const scheduleOptions = [
        { label: 'Yes', url: '#', target: '_self' },
        { label: 'No', url: '#', target: '_self' }
    ];

    const liftUpOptions = [
        { label: 'Yes', url: '#', target: '_self' },
        { label: 'No', url: '#', target: '_self' }
    ];

    const referencesOptions = [
        { label: 'Yes', url: '#', target: '_self' },
        { label: 'No', url: '#', target: '_self' }
    ];

    useEffect(() => {
        if (jobId) {
            fetch(`/api/fetchJobs?jobId=${jobId}`)
                .then(response => response.json())
                .then(data => {
                    setJobDetails(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching job details:', error);
                    setLoading(false);
                });
            setPageUrl(window.location.href);
        }
    }, [jobId]);

    const handleSelect = (name) => (option) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: option.label
        }));
    };

    const handleChange = (event) => {
        const { name, value, type, checked, files } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === 'file' ? files[0] : type === 'checkbox' ? checked : value,
        }));
    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formData);
        /*response = await fetch(`/api/fetchJobs`, {
        method: 'POST', 
        headers: {
        'content-type': 'applicaiton/json;charset=UTF-8',
        }, 
        body: JSON.stringify({
            email:
        }),
        })*/
        //setIsSubmitted(true);
    };

    // Go to the next form step
    const goToNextStep = () => {
        if (currentStep < 2) {
            setCurrentStep(currentStep + 1);
        }
    };

    // Go to the previous form step
    const goToPreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    if (isSubmitted) {
        return (
            <div className='thank-you'>
                <div className='text-center'><img src='/assets/thankyouimage.png' alt='thank you image' /></div>
                <h4 className='mt-4'>Thank you for your application!</h4>
                <p className='b3'>We received your application and will be in touch soon. If you subscribed to text messages, look out for a message from us. We will also reach out via email.</p>
            </div>
        );
    }

    if (isLoading) return <p>Loading...</p>;
    if (!jobDetails) return <p>Job not found</p>;

    const schoolName = jobDetails.location?.name || 'Not specified';
    
    
    const PreScreen = (qs): React.ReactNode => {
    console.log(qs);
        return (
        <div className="prescreen">
            {
            qs.map(psq =>{
                if(!psq.id.includes('phone_number')){
                    if(psq.type == 'text'){
                        return(
                        <>
                        <label htmlFor={psq.id}>{psq.question}</label>
                        <input type="text" id={psq.id} name={psq.id} placeholder={psq.question} required={psq.required} />
                        </>
                        )
                    }else if(psq.type == 'select'){
                        return(
                        <>
                        <label htmlFor={psq.id}>{psq.question}</label>
                        <select required={psq.required} name={psq.id} id={psq.id}>
                            <option>Select</option>
                            {
                            psq.options.map(opt => {
                                return (<option value={opt.value}>{opt.label}</option>);
                            }
                            )
                            }
                        </select>
                        </>
                        )
                    }
                }
            })
            
            }
        </div>
        )
    }
    
    return (
        <div className='single-job-post pt-5 pb-5'>
            <div className='container d-lg-flex justify-content-between'>
                <div className='main'>
                    <div className='back-container mt-3 mb-4'>
                        <Link href='/careers/search' passHref>
                            <span className='arrow'>
                                <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.78906 1L-0.000412507 6.26316L5.78906 11" stroke="#18211F" />
                                    <path d="M0.523438 6.26279L14.8655 6.26279" stroke="#18211F" />
                                </svg>
                            </span> Back to Open Positions
                        </Link>
                    </div>
                    <h1>{jobDetails.name}</h1>
                    <div className='location d-lg-flex align-items-center'>
                        <p className='b4 mb-0'>{schoolName}</p><span className='d-none d-lg-flex'>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                        <p className='b4 mb-0'>{jobDetails.city}, {jobDetails.state}</p>
                    </div>
                    <p className='employment-type mt-2 mb-2'>{jobDetails.employment?.name}</p>
                    <div dangerouslySetInnerHTML={{ __html: jobDetails.description }}></div>


                    <div className='social-sharing pt-5 d-none d-lg-block'>
                        <h5 className='green'>Share this post</h5>
                        <div className=' d-flex'>
                            <div className='facebook'>
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer"><svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
                                    <path d="M45 30.0919C45 21.7567 38.2846 15 30.0019 15C21.7154 15.0019 15 21.7567 15 30.0937C15 37.6247 20.4856 43.8676 27.6547 45V34.4544H23.8489V30.0937H27.6584V26.766C27.6584 22.9846 29.8988 20.8961 33.324 20.8961C34.9663 20.8961 36.6817 21.1905 36.6817 21.1905V24.9025H34.79C32.9284 24.9025 32.3472 26.0667 32.3472 27.261V30.0919H36.5054L35.8418 34.4526H32.3453V44.9981C39.5144 43.8658 45 37.6228 45 30.0919Z" fill="black" />
                                </svg></a>
                            </div>
                            <div className='twitter'>
                                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=Check out this job opportunity!`} target="_blank" rel="noopener noreferrer"><svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M23.2969 22.67L34.2635 37.33H36.7469L25.7802 22.67H23.2969Z" fill="black" />
                                    <path d="M30 15C21.7157 15 15 21.7157 15 30C15 38.2843 21.7157 45 30 45C38.2843 45 45 38.2843 45 30C45 21.7157 38.2843 15 30 15ZM33.6773 38.5013L28.6847 31.8257L22.5053 38.5013H20.917L27.975 30.8767L20.9613 21.4987H26.367L30.965 27.6467L36.6557 21.4987H38.244L31.6747 28.596L39.083 38.5013H33.6773Z" fill="black" />
                                </svg>
                                </a>
                            </div>
                            <div className='linkedin'>
                                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer"><svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M46.6198 43.0974C46.6979 43.0981 46.7753 43.0833 46.8473 43.0539C46.9192 43.0245 46.9842 42.9811 47.0381 42.9264C47.092 42.8717 47.1337 42.8068 47.1607 42.7358C47.1876 42.6649 47.1992 42.5893 47.1947 42.5138C47.1947 42.1 46.9367 41.9023 46.4074 41.9023H45.5522V44.0689H45.8738V43.1245H46.2691L46.2782 43.136L46.8915 44.0689H47.2355L46.5756 43.1033L46.6198 43.0974ZM46.2477 42.8803H45.8748V42.1478H46.3475C46.5917 42.1478 46.8702 42.1864 46.8702 42.4959C46.8702 42.8518 46.5903 42.8803 46.2477 42.8803ZM38.2291 40.3821H33.6679V33.4692C33.6679 31.8208 33.6375 29.6987 31.2957 29.6987C28.92 29.6987 28.5566 31.4948 28.5566 33.3492V40.3817H23.9954V26.1659H28.3741V28.1087H28.4354C28.8736 27.3836 29.5068 26.787 30.2676 26.3827C31.0284 25.9783 31.8883 25.7812 32.7557 25.8123C37.3786 25.8123 38.231 28.7552 38.231 32.5836L38.2291 40.3821ZM18.8489 24.2228C18.3254 24.2228 17.8136 24.0727 17.3783 23.7913C16.9429 23.5099 16.6036 23.1099 16.4032 22.6418C16.2027 22.1738 16.1502 21.6587 16.2523 21.1618C16.3543 20.6649 16.6063 20.2084 16.9764 19.8501C17.3465 19.4918 17.8181 19.2477 18.3316 19.1488C18.845 19.0498 19.3772 19.1005 19.8609 19.2943C20.3446 19.4881 20.758 19.8163 21.049 20.2376C21.3399 20.6588 21.4952 21.154 21.4953 21.6607C21.4954 21.9971 21.427 22.3302 21.294 22.641C21.161 22.9518 20.9661 23.2342 20.7204 23.4721C20.4746 23.7101 20.1829 23.8988 19.8618 24.0276C19.5407 24.1564 19.1965 24.2227 18.8489 24.2228ZM21.1295 40.3821H16.5635V26.1659H21.1295V40.3821ZM40.503 15.0002H14.2716C13.6762 14.9937 13.1025 15.2162 12.6765 15.6189C12.2506 16.0215 12.0073 16.5713 12 17.1475V42.6394C12.007 43.2159 12.2502 43.7661 12.6761 44.1691C13.1021 44.5722 13.6759 44.7952 14.2716 44.789H40.503C41.0999 44.7963 41.6753 44.5739 42.1029 44.1709C42.5305 43.7678 42.7754 43.217 42.7836 42.6394V17.1457C42.7751 16.5684 42.5301 16.0179 42.1025 15.6153C41.6749 15.2126 41.0996 14.9926 40.503 15.0002Z" fill="black" />
                                    <path d="M46.2898 40.9371C45.7349 40.9423 45.2047 41.1599 44.8151 41.5424C44.4255 41.925 44.2083 42.4412 44.211 42.9783C44.2136 43.5154 44.436 44.0296 44.8293 44.4084C45.2227 44.7873 45.7551 45 46.31 45C46.865 45 47.3974 44.7873 47.7907 44.4084C48.1841 44.0296 48.4064 43.5154 48.4091 42.9783C48.4118 42.4412 48.1946 41.925 47.805 41.5424C47.4154 41.1599 46.8852 40.9423 46.3302 40.9371H46.2898ZM46.2898 44.7674C45.9258 44.7733 45.5682 44.6745 45.2622 44.4837C44.9562 44.2929 44.7155 44.0185 44.5707 43.6953C44.4258 43.3721 44.3832 43.0146 44.4482 42.6679C44.5133 42.3213 44.6831 42.0011 44.9362 41.7479C45.1893 41.4946 45.5143 41.3197 45.8701 41.2453C46.2259 41.1708 46.5966 41.2001 46.9352 41.3295C47.2738 41.4589 47.5651 41.6825 47.7724 41.9721C47.9796 42.2618 48.0935 42.6044 48.0996 42.9567V42.9865C48.1098 43.4487 47.9299 43.8958 47.5995 44.2296C47.2691 44.5633 46.8153 44.7565 46.3378 44.7665H46.2903" fill="black" />
                                </svg>
                                </a>
                            </div>
                            <div className='email'><a href={`mailto:?subject=Interesting Job Opportunity&body=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer"><svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M49.5 18.75C49.5 16.6875 47.8125 15 45.75 15H15.75C13.6875 15 12 16.6875 12 18.75V41.25C12 43.3125 13.6875 45 15.75 45H45.75C47.8125 45 49.5 43.3125 49.5 41.25V18.75ZM45.75 18.75L30.75 28.125L15.75 18.75H45.75ZM45.75 41.25H15.75V22.5L30.75 31.875L45.75 22.5V41.25Z" fill="black" />
                            </svg>
                            </a></div>
                        </div>
                    </div>
                </div>
                <div className='aside'>
                    <div className='email-resume-wrapper border-top border-bottom pt-5 pb-5'>
                        <p className='b4 bold'>Already have a resume on Indeed?</p>
                        <Button href='#'>Apply with Indeed</Button>
                    </div>
                    <div className='form-wrapper mt-4'>
                        {isSubmitted ? (
                            <div className='thank-you'>
                                <div className='text-center'><img src='/assets/thankyouimage.png' alt='thank you image' /></div>
                                <h4 className='mt-4'>Thank you for your application!</h4>
                                <p className='b3'>We received your application and will be in touch soon. If you subscribed to text messages, look out for a message from us. We will also reach out via email.</p>
                            </div>
                        ) : (
                            <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
                                <p className='b4 bold'>Apply on our website:</p>
                                <p>* Required Fields</p>
                                {currentStep === 1 && (
                                    <div className='first-page' id="step1">
                                        <label htmlFor="firstName">First Name*</label>
                                        <input type="text" id="firstName" name="firstName" placeholder='First Name' required />

                                        <label htmlFor="lastName">Last Name*</label>
                                        <input type="text" id="lastName" name="lastName" placeholder='Last Name' required />

                                        <label htmlFor="email">Email*</label>
                                        <input type="email" id="email" name="email" placeholder='Email Address' required />

                                        <label htmlFor="phone">Phone number*</label>
                                        <input type="tel" id="phone" name="phone" placeholder='Phone Number' required />

                                        <div className='checkbox-wrap d-flex align-items-start'>
                                            <input type="checkbox" id="optInText" name="optInText" defaultChecked />
                                            <span className="checkbox-style"></span>
                                            <label htmlFor="optInText">Yes, text me! For the fastest response to interviews & follow-ups. Opt-out anytime.</label>
                                        </div>

                                        <label htmlFor="address">Address</label>
                                        <input type="text" id="address" name="address" placeholder='Address' />

                                        <label htmlFor="city">City</label>
                                        <input type="text" id="city" name="city" placeholder='City' />

                                        <label htmlFor="state">State</label>
                                        <input type="text" id="state" name="state" placeholder='State' />

                                        <label htmlFor="postal_code">Zip code</label>
                                        <input type="text" id="postal_code" name="postal_code" placeholder='Zip code' />
                                    </div>
                                )}
                                {currentStep === 2 && (
                                    <div className='second-page' id="step2">
                                        <label htmlFor="resume">Resume*</label>
                                        <input type="file" id="resume" name="resume" required placeholder='Resume' />

                                        <label htmlFor="coverLetter">Cover Letter</label>
                                        <input type="file" id="coverLetter" name="coverLetter" placeholder='Cover Letter' />
                                        <div id="prescreen">
                                        {
                                        PreScreen(jobDetails.prescreen_questions)
                                        }
                                        </div>
                                        

                                    </div>
                                )}
                                {/* Pagination */}
                                <div className='pagination d-flex justify-content-center align-items-center pt-4 pb-4'>
                                    {/* Disable the left arrow if on the first step */}
                                    <span className={`arrow-left me-2 ${currentStep === 1 ? 'disabled' : ''}`} onClick={goToPreviousStep}>
                                        <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <ellipse cx="15" cy="15" rx="15" ry="15" transform="matrix(1.31134e-07 -1 -1 -1.31134e-07 30.5 30)" fill="#FBFBFB" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M17.1765 20.794C17.5579 20.4797 17.6095 19.9192 17.2916 19.542L13.2979 14.8032L17.2662 10.4868C17.6002 10.1236 17.5731 9.5614 17.2057 9.23117C16.8384 8.90094 16.2698 8.92771 15.9359 9.29096L11.9676 13.6073C11.364 14.2637 11.3423 15.2597 11.9167 15.9413L15.9105 20.6801C16.2283 21.0573 16.7951 21.1082 17.1765 20.794Z" fill="#555F68" />
                                        </svg>
                                    </span>
                                    <span className="green bold">Step {currentStep} of 2</span>
                                    {/* Disable the right arrow if on the second step */}
                                    <span className={`arrow-right ms-2 ${currentStep === 2 ? 'disabled' : ''}`} onClick={goToNextStep}>
                                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <ellipse cx="15" cy="15" rx="15" ry="15" transform="matrix(4.37114e-08 1 1 -4.37114e-08 0 0)" fill="#FBFBFB" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M13.3235 9.20605C12.9421 9.52033 12.8905 10.0808 13.2084 10.458L17.2021 15.1968L13.2338 19.5132C12.8998 19.8764 12.9269 20.4386 13.2943 20.7688C13.6616 21.0991 14.2302 21.0723 14.5641 20.709L18.5324 16.3927C19.136 15.7363 19.1577 14.7403 18.5833 14.0587L14.5895 9.31986C14.2717 8.94272 13.7049 8.89177 13.3235 9.20605Z" fill="#555F68" />
                                        </svg>
                                    </span>
                                </div>

                                {/* Submit button only on second page */}
                                {currentStep === 2 && (
                                    <div className='m-auto text-center'><Button type="submit">Submit Application</Button></div>
                                )}
                            </form>
                        )}
                    </div>
                </div>
                <div className='social-sharing pt-5 d-lg-none'>
                    <h5 className='green'>Share this post</h5>
                    <div className=' d-flex'>
                        <div className='facebook'>
                            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer"><svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
                                <path d="M45 30.0919C45 21.7567 38.2846 15 30.0019 15C21.7154 15.0019 15 21.7567 15 30.0937C15 37.6247 20.4856 43.8676 27.6547 45V34.4544H23.8489V30.0937H27.6584V26.766C27.6584 22.9846 29.8988 20.8961 33.324 20.8961C34.9663 20.8961 36.6817 21.1905 36.6817 21.1905V24.9025H34.79C32.9284 24.9025 32.3472 26.0667 32.3472 27.261V30.0919H36.5054L35.8418 34.4526H32.3453V44.9981C39.5144 43.8658 45 37.6228 45 30.0919Z" fill="black" />
                            </svg></a>
                        </div>
                        <div className='twitter'>
                            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=Check out this job opportunity!`} target="_blank" rel="noopener noreferrer"><svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23.2969 22.67L34.2635 37.33H36.7469L25.7802 22.67H23.2969Z" fill="black" />
                                <path d="M30 15C21.7157 15 15 21.7157 15 30C15 38.2843 21.7157 45 30 45C38.2843 45 45 38.2843 45 30C45 21.7157 38.2843 15 30 15ZM33.6773 38.5013L28.6847 31.8257L22.5053 38.5013H20.917L27.975 30.8767L20.9613 21.4987H26.367L30.965 27.6467L36.6557 21.4987H38.244L31.6747 28.596L39.083 38.5013H33.6773Z" fill="black" />
                            </svg>
                            </a>
                        </div>
                        <div className='linkedin'>
                            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer"><svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M46.6198 43.0974C46.6979 43.0981 46.7753 43.0833 46.8473 43.0539C46.9192 43.0245 46.9842 42.9811 47.0381 42.9264C47.092 42.8717 47.1337 42.8068 47.1607 42.7358C47.1876 42.6649 47.1992 42.5893 47.1947 42.5138C47.1947 42.1 46.9367 41.9023 46.4074 41.9023H45.5522V44.0689H45.8738V43.1245H46.2691L46.2782 43.136L46.8915 44.0689H47.2355L46.5756 43.1033L46.6198 43.0974ZM46.2477 42.8803H45.8748V42.1478H46.3475C46.5917 42.1478 46.8702 42.1864 46.8702 42.4959C46.8702 42.8518 46.5903 42.8803 46.2477 42.8803ZM38.2291 40.3821H33.6679V33.4692C33.6679 31.8208 33.6375 29.6987 31.2957 29.6987C28.92 29.6987 28.5566 31.4948 28.5566 33.3492V40.3817H23.9954V26.1659H28.3741V28.1087H28.4354C28.8736 27.3836 29.5068 26.787 30.2676 26.3827C31.0284 25.9783 31.8883 25.7812 32.7557 25.8123C37.3786 25.8123 38.231 28.7552 38.231 32.5836L38.2291 40.3821ZM18.8489 24.2228C18.3254 24.2228 17.8136 24.0727 17.3783 23.7913C16.9429 23.5099 16.6036 23.1099 16.4032 22.6418C16.2027 22.1738 16.1502 21.6587 16.2523 21.1618C16.3543 20.6649 16.6063 20.2084 16.9764 19.8501C17.3465 19.4918 17.8181 19.2477 18.3316 19.1488C18.845 19.0498 19.3772 19.1005 19.8609 19.2943C20.3446 19.4881 20.758 19.8163 21.049 20.2376C21.3399 20.6588 21.4952 21.154 21.4953 21.6607C21.4954 21.9971 21.427 22.3302 21.294 22.641C21.161 22.9518 20.9661 23.2342 20.7204 23.4721C20.4746 23.7101 20.1829 23.8988 19.8618 24.0276C19.5407 24.1564 19.1965 24.2227 18.8489 24.2228ZM21.1295 40.3821H16.5635V26.1659H21.1295V40.3821ZM40.503 15.0002H14.2716C13.6762 14.9937 13.1025 15.2162 12.6765 15.6189C12.2506 16.0215 12.0073 16.5713 12 17.1475V42.6394C12.007 43.2159 12.2502 43.7661 12.6761 44.1691C13.1021 44.5722 13.6759 44.7952 14.2716 44.789H40.503C41.0999 44.7963 41.6753 44.5739 42.1029 44.1709C42.5305 43.7678 42.7754 43.217 42.7836 42.6394V17.1457C42.7751 16.5684 42.5301 16.0179 42.1025 15.6153C41.6749 15.2126 41.0996 14.9926 40.503 15.0002Z" fill="black" />
                                <path d="M46.2898 40.9371C45.7349 40.9423 45.2047 41.1599 44.8151 41.5424C44.4255 41.925 44.2083 42.4412 44.211 42.9783C44.2136 43.5154 44.436 44.0296 44.8293 44.4084C45.2227 44.7873 45.7551 45 46.31 45C46.865 45 47.3974 44.7873 47.7907 44.4084C48.1841 44.0296 48.4064 43.5154 48.4091 42.9783C48.4118 42.4412 48.1946 41.925 47.805 41.5424C47.4154 41.1599 46.8852 40.9423 46.3302 40.9371H46.2898ZM46.2898 44.7674C45.9258 44.7733 45.5682 44.6745 45.2622 44.4837C44.9562 44.2929 44.7155 44.0185 44.5707 43.6953C44.4258 43.3721 44.3832 43.0146 44.4482 42.6679C44.5133 42.3213 44.6831 42.0011 44.9362 41.7479C45.1893 41.4946 45.5143 41.3197 45.8701 41.2453C46.2259 41.1708 46.5966 41.2001 46.9352 41.3295C47.2738 41.4589 47.5651 41.6825 47.7724 41.9721C47.9796 42.2618 48.0935 42.6044 48.0996 42.9567V42.9865C48.1098 43.4487 47.9299 43.8958 47.5995 44.2296C47.2691 44.5633 46.8153 44.7565 46.3378 44.7665H46.2903" fill="black" />
                            </svg>
                            </a>
                        </div>
                        <div className='email'><a href={`mailto:?subject=Interesting Job Opportunity&body=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer"><svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M49.5 18.75C49.5 16.6875 47.8125 15 45.75 15H15.75C13.6875 15 12 16.6875 12 18.75V41.25C12 43.3125 13.6875 45 15.75 45H45.75C47.8125 45 49.5 43.3125 49.5 41.25V18.75ZM45.75 18.75L30.75 28.125L15.75 18.75H45.75ZM45.75 41.25H15.75V22.5L30.75 31.875L45.75 22.5V41.25Z" fill="black" />
                        </svg>
                        </a></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobPostPage;

