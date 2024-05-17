import Image from "next/image";

const FourPanels = () => {
  return (
    <div className="four-panels">
      <div className="panels">
        <a href="/find-a-school" className="panel teal">
          <h5 className="b5 white bold">
            Find A<br />
            School
          </h5>
          <Image
            width={1920}
            height={1920}
            src="/assets/404_FAS.png"
            alt="find a school"
          />
        </a>
        <a href="/careers" className="panel violet">
          <h5 className="b5 white bold">Careers</h5>
          <Image
            width={1920}
            height={1920}
            src="/assets/404_Careers.png"
            alt="careers"
          />
        </a>
        <a href="/stories-resources" className="panel red">
          <h5 className="b5 white bold">Stories &amp; Resources</h5>
          <Image
            width={1920}
            height={1920}
            src="/assets/404_S&R.png"
            alt="stories and resources"
          />
        </a>
        <a href="/franchising" className="panel blue">
          <h5 className="b5 white bold">Franchising</h5>
          <Image
            width={1920}
            height={1920}
            src="/assets/franchising.png"
            alt="franchising"
          />
        </a>
      </div>
    </div>
  );
};

export default FourPanels;
