declare const $: any;
import React, { useEffect } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface StandardAccordionListProps {
  heading: string;
  faqs: FAQ[];
}

const StandardAccordionList: React.FC<StandardAccordionListProps> = ({ heading, faqs }) => {
    useEffect(() => {
        $('.faq .question').click(function() {
            $(this).parent().siblings().removeClass('expanded');
            $(this).parent().toggleClass('expanded');
            $(this).parent().siblings().find(".answer").slideUp();
            $(this).parent().find(".answer").slideToggle(); 
        });
      }, []);
      

  if (!faqs || faqs.length === 0) {
    return <div>No FAQs available.</div>;
  }

  return (
    <div className='container p-4 ps-8'>
      <div className='row text-left'>
        <h2>{heading}</h2>
      </div>
      <div className='row faqs p-2'>
        {faqs.map((faq, index) => (
          <div key={index} className='faq pt-4 pb-4'>
            <p className='question m-0  pb-3'>{faq.question}
                <button id="button">
                    <span></span>
                    <span></span>
                </button>
            </p>
            <p className='answer m-0 ps-3 pe-3'>{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StandardAccordionList;
