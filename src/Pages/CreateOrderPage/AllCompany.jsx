import { Button, Spin, Table } from "antd";
import { useGetAllCompaniesQuery } from "../../redux/apiSlices/userSlice";
import { imageUrl } from "../../redux/api/baseApi";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import Currency from "../../utils/Currency";

const AllCompany = () => {
  const { data: getAllCompany, isLoading } = useGetAllCompaniesQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin />
      </div>
    );
  }

  const companies = getAllCompany?.data?.data || [];
  const meta = getAllCompany?.data?.meta || {
    page: 1,
    limit: 10,
    total: companies.length,
  };

  const formatAddress = (address) => {
    if (!address) return "N/A";
    if (typeof address === "string") return address;
    const { streetAddress, city, postalCode } = address || {};
    const parts = [streetAddress, city, postalCode].filter(Boolean);
    return parts.length ? parts.join(", ") : "N/A";
  };

  const columns = [
    {
      title: "Logo",
      dataIndex: ["user", "profile"],
      key: "logo",
      render: (profile) => {
        const src = profile
          ? profile.startsWith("http")
            ? profile
            : `${imageUrl}${profile}`
          : undefined;
        return src ? (
          <img
            src={src}
            alt="logo"
            style={{
              width: 36,
              height: 36,
              borderRadius: 6,
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 6,
              background: "#f0f0f0",
            }}
          />
        );
      },
    },
    {
      title: "Company Name",
      dataIndex: ["user", "name"],
      key: "name",
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
    },
    {
      title: "Contact",
      dataIndex: ["user", "contact"],
      key: "contact",
    },
    {
      title: "Address",
      dataIndex: ["user", "address"],
      key: "address",
      render: (address) => formatAddress(address),
    },
    {
      title: "Employees",
      dataIndex: "totalEmployees",
      key: "totalEmployees",
    },
    {
      title: "Orders",
      dataIndex: "totalOrders",
      key: "totalOrders",
    },
    {
      title: "Spent Budget",
      dataIndex: "totalSpentBudget",
      key: "totalSpentBudget",
      render: (totalSpentBudget) => (
        <p>
          {totalSpentBudget?.toFixed(2)} <Currency />
        </p>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <div>
          <Link to={`/employees/${record._id}`}>
            <Button
              title="View Employees"
              type="primary"
              className="bg-primary"
            >
              <FaEye />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl heading mb-4">All Companies</h1>
      <Table
        columns={columns}
        dataSource={companies}
        rowKey="_id"
        pagination={{
          current: meta.page,
          pageSize: meta.limit,
          total: meta.total,
        }}
      />
    </div>
  );
};

export default AllCompany;
