import Button from "../../atoms/Button/Button";


interface PaginationProps {
    controller: {
        page: number
        setPage: React.Dispatch<React.SetStateAction<number>>
    }
    itemCount: number
    perPage: number
    scrollToRef?: React.MutableRefObject<HTMLDivElement>
}

type PageTo = number | 'next' | 'prev';

export default function Pagination({controller, itemCount, perPage, scrollToRef}: PaginationProps) {
    // return nothing if required props not present to prevent page break unexpectedly in production
    if (!(itemCount && controller && perPage)) {
        //console.error('Missing required PaginationProps')
        return
    }
    // return nothing if there's only 1 page
    const totalPages = Math.ceil(itemCount / perPage);
    if (totalPages <= 1) return
    /*TODO: move pagination state to URL
    * Due to time crunch, state management was kept as previously coded
    * Current pagination is controlled from react state
    * This is bad practice. If the browser were to refresh then the user would lose their page. Also, the user can't share links to a specific page.
    * Ideally each button would be a link (e.g. <Link href=/?page=2&perPage=9>2</Link>
    * */

    const {page, setPage} = controller;
    const scrollToAllResources = () => {
        // set the scroll to the top of the next event cycle
        setTimeout(() => {
            const scrollTo = scrollToRef?.current?.offsetTop ? scrollToRef.current.offsetTop - 70 : 0
            window.scrollTo({top: scrollTo});
        }, 0)
    };
    const handlePageClick = (pageTo: PageTo) => {
        if (typeof pageTo === "number") {
            setPage(pageTo)
            scrollToAllResources()
        } else if (pageTo === "next" || pageTo === "prev") {
            setPage(prev => pageTo === 'next' ? prev + 1 : prev - 1)
            scrollToAllResources()
        } else {
            console.error('Improper pageTo argument')
        }
    };

    // the following conditionally renders 3 clickable buttons based on the current page position
    const threeArray = new Array(3).fill("")
    const left = page <= 3 ? threeArray.map((_, index) => (
        <Button
            key={index}
            className={index + 1 === page ? 'active' : 'non'}
            onClick={() => handlePageClick(index + 1)}
            label={`${index + 1}`}
        />
    )) : []
    const middle = (3 < page && page < totalPages - 2) ? threeArray.map((_, index) => (
        <Button
            key={index}
            className={page + index - 1 === page ? 'active' : 'non'}
            onClick={() => handlePageClick(page + index - 1)}
            label={`${page + index - 1}`}
        />
    )) : []
    const right = totalPages - 2 <= page ? threeArray.map((_, index) => (
        <Button
            key={index}
            className={totalPages + index - 2 === page ? 'active' : 'non'}
            onClick={() => handlePageClick(totalPages + index - 2)}
            label={`${totalPages + index - 2}`}
        />
    )) : []
    const tripleButton = [...left, ...middle, ...right]

    return ( totalPages <= 5
        ? // Show all page buttons at once if there's only 5 or less
            <div className="pagination mt-4 mb-4 d-flex align-items-center justify-content-center">
                <Button
                    className='prev'
                    disabled={page <= 1}
                    onClick={() => handlePageClick('prev')} label={''}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd"
                              d="M5.67652 0.206047C6.05792 0.520326 6.10946 1.08083 5.79162 1.45796L1.79788 6.19685L5.7662 10.5132C6.10016 10.8764 6.07309 11.4386 5.70573 11.7688C5.33837 12.0991 4.76984 12.0723 4.43587 11.709L0.467559 7.39271C-0.135971 6.73625 -0.157669 5.74029 0.416712 5.05875L4.41045 0.319858C4.72828 -0.0572766 5.29513 -0.108231 5.67652 0.206047Z"
                              fill="#555F68"/>
                    </svg>
                </Button>
                {new Array(totalPages).fill("").map((_, index) => (
                    <Button
                        key={index}
                        className={index + 1 === page ? 'active' : 'non'}
                        onClick={() => handlePageClick(index + 1)}
                        label={`${index + 1}`}
                    />
                ))}
                <Button
                    className='next'
                    disabled={page >= totalPages}
                    onClick={() => handlePageClick('next')} label={''}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd"
                              d="M0.323475 0.206047C-0.0579243 0.520326 -0.109455 1.08083 0.208378 1.45796L4.20212 6.19685L0.233801 10.5132C-0.100161 10.8764 -0.0730881 11.4386 0.294271 11.7688C0.66163 12.0991 1.23016 12.0723 1.56413 11.709L5.53244 7.39271C6.13597 6.73625 6.15767 5.74029 5.58329 5.05875L1.58955 0.319858C1.27172 -0.0572766 0.704875 -0.108231 0.323475 0.206047Z"
                              fill="#555F68"/>
                    </svg>
                </Button>
            </div>
        : // dynamically adjust buttons if there's more than 5 pages
            <div className="pagination mt-4 mb-4 d-flex align-items-center justify-content-center">
                <Button
                    className='prev'
                    disabled={page <= 1}
                    onClick={() => handlePageClick('prev')} label={''}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd"
                              d="M5.67652 0.206047C6.05792 0.520326 6.10946 1.08083 5.79162 1.45796L1.79788 6.19685L5.7662 10.5132C6.10016 10.8764 6.07309 11.4386 5.70573 11.7688C5.33837 12.0991 4.76984 12.0723 4.43587 11.709L0.467559 7.39271C-0.135971 6.73625 -0.157669 5.74029 0.416712 5.05875L4.41045 0.319858C4.72828 -0.0572766 5.29513 -0.108231 5.67652 0.206047Z"
                              fill="#555F68"/>
                    </svg>
                </Button>
                <Button
                    className={`${1 === page ? 'active' : 'non'} ${page <= 3 && 'hidden'}`}
                    onClick={() => handlePageClick(1)}
                    label={"1"}
                />
                <p className={`m-0 ${page <= 3 && 'hidden'}`}>...</p>
                {tripleButton}
                <p className={`m-0 ${page >= totalPages-2 && 'hidden'}`}>...</p>
                <Button
                    className={`${totalPages === page ? 'active' : 'non'} ${page >= totalPages-2 && 'hidden'}`}
                    onClick={() => handlePageClick(totalPages)}
                    label={`${totalPages}`}
                />
                <Button
                    className='next'
                    disabled={page >= totalPages}
                    onClick={() => handlePageClick('next')} label={''}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd"
                              d="M0.323475 0.206047C-0.0579243 0.520326 -0.109455 1.08083 0.208378 1.45796L4.20212 6.19685L0.233801 10.5132C-0.100161 10.8764 -0.0730881 11.4386 0.294271 11.7688C0.66163 12.0991 1.23016 12.0723 1.56413 11.709L5.53244 7.39271C6.13597 6.73625 6.15767 5.74029 5.58329 5.05875L1.58955 0.319858C1.27172 -0.0572766 0.704875 -0.108231 0.323475 0.206047Z"
                              fill="#555F68"/>
                    </svg>
                </Button>
            </div>
    );
};