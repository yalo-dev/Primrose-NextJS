import React, { useEffect } from 'react';

const NewsletterForm = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = '//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, []);
   
    return (
        <div className='newsletter-form'>
            <div id='mc_embed_shell'>
                <div id='mc_embed_signup'>
                    <form action='https://primroseschools.us2.list-manage.com/subscribe/post?u=c6dddaf79648446f1b3dbcd34&amp;id=5db6b821c1&amp;f_id=00b2c2e1f0' method='post' id='mc-embedded-subscribe-form' name='mc-embedded-subscribe-form' className='validate' target='_blank'>
                        <div id='mc_embed_signup_scroll' className='d-flex w-100 position-relative justify-content-between'>
                            <div className='mc-field-group form-group pe-2'>
                                <label htmlFor='mce-EMAIL' className='hidden'>Email Address <span className='asterisk'>*</span></label>
                                <input id='mce-EMAIL' type='email' name='EMAIL' className='required email' placeholder='Enter Email Address' autoComplete='true' aria-label='email' required defaultValue='' />
                            </div>
                            <div id='mce-responses' className='clear'>
                                <div className='response' id='mce-error-response' style={{ display: 'none' }}></div>
                                <div className='response' id='mce-success-response' style={{ display: 'none' }}></div>
                            </div>
                            <div aria-hidden='true' style={{ position: 'absolute', left: '-5000px' }}>
                                <input type='text' name='b_c6dddaf79648446f1b3dbcd34_5db6b821c1' tabIndex={-1} defaultValue='' />
                            </div>
                            <div className='form-button'>
                                <input type='submit' name='subscribe' id='mc-embedded-subscribe' className='primary' value='Sign Up' aria-label='sign up' />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default NewsletterForm;
