export default function FranchiseOwnerModal({ franchiseOwner, show, onClose }) {
    return (
      <div className={`modal-overlay ${show ? 'show' : ''}`} onClick={onClose}>
        <div className='modal-content' onClick={e => e.stopPropagation()}>
          <div className='close' onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="29" viewBox="0 0 32 29" fill="none">
              <circle cx="10.5" cy="10.5" r="9.75" transform="matrix(0.733776 0.679391 -0.733776 0.679391 15.8516 0.036377)" stroke="#858783" strokeWidth="1.5" />
              <rect width="1.28571" height="9" transform="matrix(0.733776 0.679391 -0.733776 0.679391 18.6797 10.8098)" fill="#5E6738" />
              <rect width="1.28571" height="9" transform="matrix(0.733776 -0.679391 0.733776 0.679391 12.082 11.6824)" fill="#5E6738" />
            </svg>
          </div>
          <div className='two-columns-image-and-text-alternative' style={{padding: 0}}>
            <div className='left-column'>
              <img src={franchiseOwner.image.sourceUrl} alt={'Franchise Owner ' + franchiseOwner.name} />
            </div>
            <div className='right-column'>
              <h5 className='b4'>{franchiseOwner.name}</h5>
              <div className='b3 pb-3'>{franchiseOwner.multipleOwners ? 'Franchise Owners' : 'Franchise Owner'}</div>
              <div className="modal-bio" dangerouslySetInnerHTML={{__html:franchiseOwner.bio}} />
            </div>
          </div>
        </div>
      </div>
    );
  };