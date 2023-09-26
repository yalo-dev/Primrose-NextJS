import FeaturedBlogs from '../../modules/FeaturedBlogs/FeaturedBlogs';
//import StandardAccordionList from '../../modules/StandardAccordionList/StandardAccordionList';

export const CommonPageComponent = ({ modules }) => (
    <div className="modules--container">
        {modules.map((module, index) => {
            const style = {
                backgroundImage: module.backgroundImage ? `url(${module.backgroundImage.sourceUrl})` : undefined,
                backgroundColor: module.backgroundColor || undefined,
            };

            let ModuleComponent;

            switch (module.__typename) {
                case 'Page_Modules_Modules_FeaturedBlogs':
                    ModuleComponent = FeaturedBlogs;
                    break;
                // case 'Page_Modules_Modules_StandardAccordionList':
                //     ModuleComponent = StandardAccordionList;
                //     break;
                default:
                    ModuleComponent = null;
            }

            return (
                <section className={`module ${module.__typename} pt-4 pb-4`} key={index} id={`${module.__typename}${index}`} style={style}>
                    {console.log("Current module: ", module)}
                    {ModuleComponent && <ModuleComponent {...module} />}
                </section>
            );
        })}
    </div>
);
