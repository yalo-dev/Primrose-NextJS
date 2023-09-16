import React from 'react';
import Button from '../../atoms/Button/Button'; 

const NewsletterForm = () => (
    <form className='newsletter-form'>
        <div className='form-group'>
            <label htmlFor='email' className='hidden'>Email Address</label>
            <input type='email' id='email' name='email' required placeholder='Enter Email Address' />
        </div>
        <Button variant="primary" label="Sign Up" type="submit" />
    </form>
);

export default NewsletterForm;
