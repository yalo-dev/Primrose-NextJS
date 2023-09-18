# React Gravityform

[![Version](https://img.shields.io/npm/v/react-gravity-form.svg)](https://www.npmjs.com/package/react-gravity-form)

This module includes a react component for dropping Gravity Forms from your Wordpress site into your react applications.

## Installation

```
$ npm install --save react-gravity-form
```

### Backend

Make sure to create a custom GF endpoint to fetch the form. See [example](https://bitbucket.org/gohike/gravity-forms/src/devweek/gravityforms.php)

## Usage

### The GravityForm Component

Import component:

```javascript
import GravityForm from "react-gravity-form";
```

Include the component anywhere inside your own components:

```javascript
<GravityForm
	backendUrl="https://www.example.com/wp-json/glamrock/v1/gf/forms/1"
	formID="1"
	onChange={someFunction} // optional - keep all entered values as parameter
	onSubmitSuccess={someFunction} // optional - calls after form has been submitted successfully
	onError={handlerFunction} // optional - fires on GF error (gform_validation hook)
	styledComponents={{Button, Loading, Input...}} // optional
	populatedFields={{parameterName: "Value"}}
	jumpToConfirmation={false} // optional, default is equal to true
	submitComponent={Component} // optional - pass your <Component/> (like loading, another button...) to render in front of the submit button
	getParams={{}} // optional - pass an Object with your params to send the GF request with query string included
/>
```

### Custom component

```javascript
import ComponentName from 'ComponentName';

...

<GravityForm
  ...
  customComponents={{
    3: ComponentName,
  }}
/>
```

### File upload - Dropzone

- To use a dropzone inside your file upload field you have to add a `dropzone` class name in an Appearance tab of the field
- To change the dropzone text pass it as a prop:

```javascript
<GravityForm dropzoneText="Drag here or browse to upload" {...props} />
```

### DatePicker

If Date Input Type is `datepicker` we use a React <a target="_blank" href="https://github.com/Hacker0x01/react-datepicker">DatePicker</a> module. If you want to pass your own props to the component use `gform_pre_render` hook and pass this options using `datepickerOptions` key. Example:

```php
<?php
add_filter( 'gform_pre_render', 'adjust_date_field' );
function adjust_date_field($form){
	foreach( $form['fields'] as &$field )  {
					if ( $field->type == 'date' ) {
						$field['datepickerOptions'] = array(
          		'minDate' => date("Y/m/d"),
							'dateFormat' => 'MM/dd/yyy'
        		);
					}
	}
	return $form;
}
```

### Captcha

We use [recaptcha package](https://www.npmjs.com/package/react-google-recaptcha)
To make it work pass `sitekey` as property to GravityForm component

### Change validation messages from backend

Y

```php
<?php
add_filter( 'gform_pre_render', 'change_error_messages' );
function change_error_messages( $form ) {

		function setErrorMsg($fields, $customMessage) {
			$errorMgs = [
							'custom' => $customMessage,
							'required' => esc_html__('This field is required', 'gravityforms')
			];

			if($fields === 'required') {
				return $errorMgs;
			} else {
				$data = [];
				foreach ($fields as $fieldName) {
					$data[$fieldName] = $fieldName === 'mismatch' ? esc_html__('Mismatch', 'gravityforms') : esc_html__('Enter a valid ' . $fieldName, 'gravityforms');
				}
				return array_merge($errorMgs, $data);
			}
		}

		foreach( $form['fields'] as &$field )  {
			switch ($field['type']) {
				case 'date':
					$field['errorMessage'] = setErrorMsg(['date', 'month', 'year'], $field['errorMessage']);
					break;
				case 'email':
					$field['errorMessage'] = setErrorMsg(['email', 'mismatch'], $field['errorMessage']);
					break;
				default:
					$field['errorMessage'] = setErrorMsg('required',  $field['errorMessage']);
			}
		}
		return $form;
	}
```

### Roadmap

- Extended the validation functionality with validating attribute values (for example min and max amounts.
- Allow fields to be prepopulated
