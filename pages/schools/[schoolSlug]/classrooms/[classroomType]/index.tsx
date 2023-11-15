import { useRouter } from 'next/router';

const ClassroomTypePage = () => {
  const router = useRouter();
  const { schoolSlug, classroomType } = router.query;

  return (
    <div>
      <h1>{classroomType} Classroom Page</h1>
    </div>
  );
};

export default ClassroomTypePage;
