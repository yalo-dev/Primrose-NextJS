import { CommonPageComponent } from '../app/components/templates/Layout/CommonPageComponent';
import { useQuery } from '@apollo/client';
import { client } from '../app/lib/apollo';
import gql from 'graphql-tag';
import { getPageByUri } from '../app/lib/pages';




const HomePage = ({page}) => {


 console.log(page);


  const modules = page?.data?.page?.modules?.modules || [];

  return <CommonPageComponent modules={modules} />;
};

export default HomePage;


export async function getStaticProps() {
	const page = await getPageByUri('home'); 
	
	return {
	  props: {
		page,
	  },
	  revalidate: 10,
	};
  }
  