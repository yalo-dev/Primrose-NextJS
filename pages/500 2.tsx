import CustomError from "../app/components/organisms/CustomError";

export default function () {
    return <CustomError statusCode={500} message={"Unknown server error"} />
}