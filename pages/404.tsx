import CustomError from "../app/components/organisms/CustomError";

export default function () {
  return <CustomError message={"Unknown page"} statusCode={404} />;
}
