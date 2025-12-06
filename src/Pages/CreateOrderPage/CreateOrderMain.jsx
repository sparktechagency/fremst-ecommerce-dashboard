import { jwtDecode } from "jwt-decode";
import AllCompany from "./AllCompany";
import EmployeesByCompany from "./EmployeesByCompany";

const CreateOrderMain = () => {
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

  let role;
  let userId;
  try {
    const decodedToken = jwtDecode(token);
    role = decodedToken?.role;
    userId = decodedToken?.userId;
  } catch (e) {
    role = undefined;
    userId = undefined;
  }

  // If company user, show employees of that company directly
  if (role === "company" && userId) {
    return (
      <div>
        <EmployeesByCompany companyId={userId} />
      </div>
    );
  }

  // Default for super-admin and others: show all companies
  return (
    <div>
      <AllCompany />
    </div>
  );
};

export default CreateOrderMain;
