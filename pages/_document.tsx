import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
	render() {
		return (
			<Html>
				<Head>
					<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
					<link
						href="//fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@200;400&family=Poppins:wght@300;400;500&display=swap"
						rel="stylesheet"
					/>
					{/* <!-- Start of HubSpot Embed Code --> */}
					<script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/22602766.js"></script>
					{/* <!-- End of HubSpot Embed Code --> */}
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
