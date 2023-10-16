import { useEffect, useState } from 'react';
import ClassroomSelectAndContent from '../../modules/ClassroomSelectAndContent/ClassroomSelectAndContent';
import ClassroomSelectAndImage from '../../modules/ClassroomSelectAndImage/ClassroomSelectAndImage';
import FindASchool from '../../modules/FindASchool/FindASchool';
import GeneralButtonCTA from '../../modules/GeneralButtonCTA/GeneralButtonCTA';
import GeneralHorizontalTabs from '../../modules/GeneralHorizontalTabs/GeneralHorizontalTabs';
import HeroWithImage from '../../modules/HeroWithImage/HeroWithImage';
import HeroWithVideo from '../../modules/HeroWithVideo/HeroWithVideo';
import NewsletterFormCTA from '../../modules/NewsletterFormCTA/NewsletterFormCTA';
import Q1Skills from '../../modules/Q1Skills/Q1Skills';
import SeasonalBanner from '../../modules/SeasonalBanner/SeasonalBanner';
import StandardAccordionList from '../../modules/StandardAccordionList/StandardAccordionList';
import TwoColumnsFeaturedImage from '../../modules/TwoColumnsFeaturedImage/TwoColumnsFeaturedImage';
import TwoColumnsImageAndText from '../../modules/TwoColumnsImageAndText/TwoColumnsImageAndText';
import WysiwygEditor from '../../modules/WysiwygEditor/WysiwygEditor';

export const CommonPageComponent = ({ modules }) => {
    

    return (
    <div className="modules--container">
        {modules.map((module, index) => {

            let ModuleComponent;

            switch (module.__typename) {
                case 'Page_Modules_Modules_ClassroomSelectAndImage':
                    ModuleComponent = ClassroomSelectAndImage;
                    break;
                case 'Page_Modules_Modules_ClassroomSelectAndContent':
                    ModuleComponent = ClassroomSelectAndContent;
                    break;
                case 'Page_Modules_Modules_FindASchool':
                    ModuleComponent = FindASchool;
                    break;
                case 'Page_Modules_Modules_GeneralButtonCta':
                    ModuleComponent = GeneralButtonCTA;
                    break;
                case 'Page_Modules_Modules_GeneralHorizontalTabs':
                    ModuleComponent = GeneralHorizontalTabs;
                    break;
                case 'Page_Modules_Modules_HeroWithImage':
                    ModuleComponent = HeroWithImage;
                    break;
                case 'Page_Modules_Modules_HeroWithVideo':
                    ModuleComponent = HeroWithVideo;
                    break;
                case 'Page_Modules_Modules_NewsletterFormCta':
                    ModuleComponent = NewsletterFormCTA;
                    break;
                case 'Page_Modules_Modules_Q1Skills':
                    ModuleComponent = Q1Skills;
                    break;
                case 'Page_Modules_Modules_SeasonalBanner':
                    ModuleComponent = SeasonalBanner;
                    break;
                case 'Page_Modules_Modules_StandardAccordionList':
                    ModuleComponent = StandardAccordionList;
                    break;
                case 'Page_Modules_Modules_TwoColumnsFeaturedImage':
                    ModuleComponent = TwoColumnsFeaturedImage;
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
            return (
                <section className={`module ${module.__typename}`} key={index} id={`${module.__typename}${index}`}>

                    {console.log("Current module: ", module)}

                    {ModuleComponent && <ModuleComponent {...module} />}
                </section>
            );
        })}
    </div>
    );
};
