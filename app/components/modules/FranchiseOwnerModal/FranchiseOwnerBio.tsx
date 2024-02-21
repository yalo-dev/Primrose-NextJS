import Button from "../../atoms/Button/Button";
import {useState} from "react";
import FranchiseOwnerModal from "./FranchiseOwnerModal";

export default function FranchiseOwnerBio({franchiseOwner}) {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto';
  };

  return (
        <div className='row school staff'>
        <div className='franchise-owners'>
            {franchiseOwner && (
                <div className='two-columns-image-and-text-alternative reverse-column'>
                    <div className='left-column col-12 col-lg-5 offset-lg-1 mb-0'>
                        {franchiseOwner?.image && (
                            <img
                                src={franchiseOwner.image.sourceUrl}
                                alt={'Franchise Owner ' + franchiseOwner.name}
                                className='img-fluid'
                                width="500"
                                height="500"
                            />
                        )}
                    </div>
                    <div className='right-column col-12 col-lg-5'>
                        <h2>{!franchiseOwner.multipleOwners ? 'Franchise Owner' : 'Franchise Owners'}</h2>
                        <h5>{franchiseOwner.name}</h5>
                        <div className="bio" dangerouslySetInnerHTML={{__html: franchiseOwner.bio}}/>
                        <Button onClick={handleOpenModal}>Read More</Button>
                        <FranchiseOwnerModal
                            franchiseOwner={franchiseOwner}
                            show={showModal}
                            onClose={handleCloseModal}
                        />
                    </div>
                </div>
            )}
        </div>
    </div>
    )
}