import BlockAndSlider from '../../modules/BlockAndSlider/BlockAndSlider';
import ClassroomSelectAndContent from '../../modules/ClassroomSelectAndContent/ClassroomSelectAndContent';
import ClassroomSelectAndImage from '../../modules/ClassroomSelectAndImage/ClassroomSelectAndImage';
import DynamicColumns from '../../modules/DynamicColumns/DynamicColumns';
import DynamicForm from '../../modules/DynamicForm/DynamicForm';
import FeaturedBlogs from '../../modules/FeaturedBlogs/FeaturedBlogs';
import FeaturedSection from '../../modules/FeaturedSection/FeaturedSection';
import FindASchool from '../../modules/FindASchool/FindASchool';
import FindASchoolMap from '../../modules/FindASchoolModule/FindASchoolModule';
import FourAcrossSlider from '../../modules/FourAcrossSlider/FourAcrossSlider';
import EyebrowHeadingSubheading from '../../modules/EyebrowHeadingSubheading/EyebrowHeadingSubheading'
import GeneralButtonCTA from '../../modules/GeneralButtonCTA/GeneralButtonCTA';
import GeneralHorizontalTabs from '../../modules/GeneralHorizontalTabs/GeneralHorizontalTabs';
import GeneralVerticalTabs from '../../modules/GeneralVerticalTabs/GeneralVerticalTabs';
import HarmonyAndHeart from '../../modules/HarmonyAndHeart/HarmonyAndHeart';
import HeroWithImage from '../../modules/HeroWithImage/HeroWithImage';
import HeroWithVideo from '../../modules/HeroWithVideo/HeroWithVideo';
import HomeHeroWithVideo from '../../modules/HomeHeroWithVideo/HomeHeroWithVideo';
import NewsletterFormCTA from '../../modules/NewsletterFormCTA/NewsletterFormCTA';
import PathwayToOwnership from '../../modules/PathwayToOwnership/PathwayToOwnership';
import PrimroseFriends from '../../modules/PrimroseFriends/PrimroseFriends';
import ContentWithSchoolhouse from '../../modules/ContentWithSchoolhouse/ContentWithSchoolhouse';
import Q1Skills from '../../modules/Q1Skills/Q1Skills';
import QuoteTestimonials from '../../modules/QuoteTestimonials/QuoteTestimonials';
import SeasonalBanner from '../../modules/SeasonalBanner/SeasonalBanner';
import StandardAccordionList from '../../modules/StandardAccordionList/StandardAccordionList';
import TestimonialsWithVideoOrImage from '../../modules/TestimonialsWithVideoOrImage/TestimonialsWithVideoOrImage';
import Timeline from '../../modules/Timeline/Timeline';
import TwoColumnsFeaturedBlock from '../../modules/TwoColumnsFeaturedBlock/TwoColumnsFeaturedBlock';
import TwoColumnsFeaturedImage from '../../modules/TwoColumnsFeaturedImage/TwoColumnsFeaturedImage';
import TwoColumnsGreenBackground from '../../modules/TwoColumnsGreenBackground/TwoColumnsGreenBackground';
import TwoColumnsImageAndTextAlternative from '../../modules/TwoColumnsImageAndTextAlternative/TwoColumnsImageAndTextAlternative';
import TwoColumnsImageAndText from '../../modules/TwoColumnsImageAndText/TwoColumnsImageAndText';
import WysiwygEditor from '../../modules/WysiwygEditor/WysiwygEditor';

export const CommonPageComponent = ({ modules }) => {
    

    return (
    <div className="modules--container">
        {modules.map((module, index) => {

            let ModuleComponent;

            switch (module.__typename) {
                case 'Page_Modules_Modules_BlockAndSlider':
                    ModuleComponent = BlockAndSlider;
                    break;
                case 'Page_Modules_Modules_ClassroomSelectAndImage':
                    ModuleComponent = ClassroomSelectAndImage;
                    break;
                case 'Page_Modules_Modules_ClassroomSelectAndContent':
                    ModuleComponent = ClassroomSelectAndContent;
                    break;
                case 'Page_Modules_Modules_ContentWithSchoolhouse':
                    ModuleComponent = ContentWithSchoolhouse;
                    break;
                case 'Page_Modules_Modules_DynamicColumns':
                    ModuleComponent = DynamicColumns;
                    break;
                case 'Page_Modules_Modules_DynamicForm':
                    ModuleComponent = DynamicForm;
                    break;
                case 'Page_Modules_Modules_EyebrowHeadingSubheading':
                    ModuleComponent = EyebrowHeadingSubheading;
                    break;
                case 'Page_Modules_Modules_FeaturedBlogs':
                    ModuleComponent = FeaturedBlogs;
                break;
                case 'Page_Modules_Modules_FeaturedSection':
                    ModuleComponent = FeaturedSection;
                break;
                case 'Page_Modules_Modules_FindASchool':
                    ModuleComponent = FindASchool;
                    break;
                case 'Page_Modules_Modules_FindASchoolMap':
                    ModuleComponent = FindASchoolMap;
                    break;
                case 'Page_Modules_Modules_FourAcrossSlider':
                    ModuleComponent = FourAcrossSlider;
                    break;
                case 'Page_Modules_Modules_GeneralButtonCta':
                    ModuleComponent = GeneralButtonCTA;
                    break;
                case 'Page_Modules_Modules_GeneralHorizontalTabs':
                    ModuleComponent = GeneralHorizontalTabs;
                    break;
                case 'Page_Modules_Modules_GeneralVerticalTabs':
                    ModuleComponent = GeneralVerticalTabs;
                break;
                case 'Page_Modules_Modules_HarmonyAndHeart':
                    ModuleComponent = HarmonyAndHeart;
                    break;
                case 'Page_Modules_Modules_HeroWithImage':
                    ModuleComponent = HeroWithImage;
                    break;
                case 'Page_Modules_Modules_HeroWithVideo':
                    ModuleComponent = HeroWithVideo;
                    break;
                case 'Page_Modules_Modules_HomeHeroWithVideo':
                    ModuleComponent = HomeHeroWithVideo;
                    break;
                case 'Page_Modules_Modules_NewsletterFormCta':
                    ModuleComponent = NewsletterFormCTA;
                    break;
                case 'Page_Modules_Modules_PathwayToOwnership':
                    ModuleComponent = PathwayToOwnership;
                    break;
                case 'Page_Modules_Modules_PrimroseFriends':
                    ModuleComponent = PrimroseFriends;
                    break;
                case 'Page_Modules_Modules_Q1Skills':
                    ModuleComponent = Q1Skills;
                    break;
                case 'Page_Modules_Modules_QuoteTestimonials':
                    ModuleComponent = QuoteTestimonials;
                    break;
                case 'Page_Modules_Modules_SeasonalBanner':
                    ModuleComponent = SeasonalBanner;
                    break;
                case 'Page_Modules_Modules_StandardAccordionList':
                    ModuleComponent = StandardAccordionList;
                    break;
                case 'Page_Modules_Modules_TestimonialsWithVideoOrImage':
                    ModuleComponent = TestimonialsWithVideoOrImage;
                    break;
                case 'Page_Modules_Modules_Timeline':
                    ModuleComponent = Timeline;
                    break;
                case 'Page_Modules_Modules_TwoColumnsFeaturedBlock':
                    ModuleComponent = TwoColumnsFeaturedBlock;
                    break;
                case 'Page_Modules_Modules_TwoColumnsFeaturedImage':
                    ModuleComponent = TwoColumnsFeaturedImage;
                    break;
                case 'Page_Modules_Modules_TwoColumnsGreenBackground':
                    ModuleComponent = TwoColumnsGreenBackground;
                    break;
                case 'Page_Modules_Modules_TwoColumnsImageAndTextAlternative':
                    ModuleComponent = TwoColumnsImageAndTextAlternative;
                    break;
                case 'Page_Modules_Modules_TwoColumnsImageAndText':
                    ModuleComponent = TwoColumnsImageAndText;
                    break;
                case 'Page_Modules_Modules_WysiwygEditor':
                    ModuleComponent = WysiwygEditor;
                    break;
                default:
                    ModuleComponent = null;
            }
            // Determine the id to be used
            const moduleIdToUse = module.moduleId || module.__typename;

            // Add moduleId to moduleProps if it's not empty
            const moduleProps = module.moduleId ? { ...module, moduleId: module.moduleId } : module;

            return (
                <section id={moduleIdToUse} className={`module ${module.__typename}`} key={index} >
                    {ModuleComponent && <ModuleComponent {...moduleProps} />}
                </section>
            );
        })}
    </div>
    );
};
