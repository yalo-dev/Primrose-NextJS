import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';


interface JobDetail {
    id: string;
    title: string;
    description: string;
  }


const JobPostPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [jobDetails, setJobDetails] = useState<JobDetail | null>(null); 
    const [isLoading, setIsLoading] = useState(false);
     const [error, setError] = useState(null);

  
    useEffect(() => {
        const fetchJobDetails = async () => {
        if (!id) return; // id might be undefined initially
        setIsLoading(true);

        try {
            const response = await fetch(`https://api.careerplug.com/jobs/${id}`);
            if (!response.ok) {
            throw new Error('Failed to fetch job details');
            }
            const data = await response.json();
            setJobDetails(data);
            console.log('i load');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    fetchJobDetails();
    }, [id]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!jobDetails) return null; 

  return (
    <div>
      <h1>{jobDetails.title}</h1>
      <p>{jobDetails.description}</p>
    </div>
  );
};

export default JobPostPage;
