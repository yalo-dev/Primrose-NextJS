import React from 'react';
import Button from '../../atoms/Button/Button'; 

const NewsletterForm = () => (
    <form className='newsletter-form'>
        <div className='form-group'>
            <label htmlFor='email' className='hidden'>Email Address</label>
            <input type='email' id='email' name='email' placeholder='Enter Email Address' autoComplete='true' aria-label='email' required />
        </div>
        <div className='form-button'>
            <Button variant="primary" label="Sign Up" type="submit" />
        </div>
    </form>
);

export default NewsletterForm;
