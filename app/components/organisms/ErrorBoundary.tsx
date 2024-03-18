import React from "react";
import CustomError from "./CustomError";

class ErrorBoundary extends React.Component {

  constructor(props) {
    super(props)
    // Define a state variable to track whether is an error or not
    this.state = { hasError: false, errorMsg: "" }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, errorMsg: error.message }
  }

  render() {
    // Check if the error is thrown
    // @ts-ignore
      if (this.state.hasError) {
      // You can render any custom fallback UI

          return (
              // @ts-ignore
            <CustomError statusCode={400} message={this.state.errorMsg}/>
        )
    }

    // Return children components in case of no error
    // @ts-ignore
    return this.props.children
  }
}

export default ErrorBoundary