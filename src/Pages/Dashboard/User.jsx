import React, { useState } from "react";
import { Input, Table, Button, Space, Spin } from "antd";
import { Link, useParams } from "react-router-dom";
import { MdOutlineEmail, MdOutlineLocalPhone } from "react-icons/md";
import { FaEye, FaLocationDot, FaUsers } from "react-icons/fa6";
import { IoIosCalculator } from "react-icons/io";
import { TbShoppingCartCheck } from "react-icons/tb";
import { GiMoneyStack } from "react-icons/gi";
import SalesTrackingChart from "../../components/ui/Home/SalesTrackingChart";
import {
  useGetCompanyByIdQuery,
  useGetEmployeesByCompanyQuery,
} from "../../redux/apiSlices/userSlice";
import moment from "moment";
import Currency from "../../utils/Currency";
import { imageUrl } from "../../redux/api/baseApi";

const User = () => {
  const { id } = useParams();
  const [searchText, setSearchText] = useState("");

  const { data: companyById, isFetching } = useGetCompanyByIdQuery(id);
  const { data: companyEmployees, isFetching: isEmployeesFetching } =
    useGetEmployeesByCompanyQuery(id);

  if (isFetching || isEmployeesFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin />
      </div>
    );
  }

  const companyData = companyById?.data || {};
  const employeesData = companyEmployees?.data?.data || [];

  const imgUrl =
    companyData?.user?.profile ||
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmtj40PvvTQ1g64pgKZ2oKEk-tqT9rA4CXSA&s";

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredEmployees = employeesData;

  const columns = [
    {
      title: "Serial",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => <p>{index + 1}</p>,
    },

    {
      title: "Name",
      dataIndex: ["user", "name"],
      key: "name",
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
    },
    {
      title: "Budget",
      dataIndex: "budget",
      key: "budget",
      render: (text) => (
        <p>
          {text} <Currency />
        </p>
      ),
    },
    {
      title: "Budget Left",
      dataIndex: "budgetLeft",
      key: "budgetLeft",
      render: (text) => (
        <p>
          {text?.toFixed(2)} <Currency />
        </p>
      ),
    },
    {
      title: "Expire On",
      dataIndex: "budgetExpiredAt",
      key: "budgetExpiredAt",
      render: (text) => <p>{moment(text).format("DD-MM-YYYY")}</p>,
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Link to={`/employee/details/${record._id}`}>
            <Button className="bg-[#e9b007] text-white border-none">
              <FaEye size={24} />
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex w-full">
        <div className="w-[25%] flex gap-5 flex-col">
          <div className="p-5 rounded-xl shadow-md bg-white">
            <img
              className="w-80 h-80 mx-auto rounded-xl object-cover"
              src={imgUrl?.startsWith("http") ? imgUrl : `${imageUrl}${imgUrl}`}
              alt=""
            />
          </div>
          <div className="p-4 bg-white shadow-md rounded-lg flex flex-col gap-3">
            <h1 className="text-3xl font-bold">{companyData?.user?.name}</h1>
            <p className="text-gray-600 text-lg flex items-center gap-2">
              <MdOutlineEmail /> {companyData?.user?.email}
            </p>
            <p className="text-gray-600 text-lg flex items-center gap-2">
              <MdOutlineLocalPhone /> {companyData?.user?.contact}
            </p>
            <p className="text-gray-600 text-lg flex items-center gap-2">
              <FaLocationDot />{" "}
              {companyData?.user?.address
                ? companyData?.user?.address?.streetAddress
                  ? `${companyData?.user?.address?.streetAddress} ${companyData?.user?.address?.city} ${companyData?.user?.address?.postalCode}`
                  : ""
                : "N/A"}
            </p>
          </div>
        </div>
        <div className="w-[75%] px-10">
          <div className="grid grid-col-1 md:grid-cols-4 gap-5">
            <div className="flex flex-col hover:shadow-xl px-10 rounded-2xl shadow-md py-6 gap-3 items-center">
              <div className="p-6 rounded-2xl bg-[#f3f3ff]">
                <TbShoppingCartCheck size={40} />
              </div>
              <h1 className="text-lg text-gray-600">Total Order</h1>
              <h1 className="text-2xl font-bold">
                {companyData?.totalOrders || 0}
              </h1>
            </div>
            <div className="flex flex-col hover:shadow-xl px-10 rounded-2xl shadow-md py-6 gap-3 items-center">
              <div className="p-6 rounded-2xl bg-[#edf6fd]">
                <FaUsers size={40} />
              </div>
              <h1 className="text-lg text-gray-600">Total Employee</h1>
              <h1 className="text-2xl font-bold">
                {companyData?.totalEmployees || 0}
              </h1>
            </div>
            <div className="flex flex-col hover:shadow-xl px-10 rounded-2xl shadow-md py-6 gap-3 items-center">
              <div className="p-6 rounded-2xl bg-[#fff6da]">
                <IoIosCalculator size={40} />
              </div>
              <h1 className="text-lg text-gray-600">Total Budget</h1>
              <h1 className="text-2xl font-bold">
                {companyData?.totalBudget || 0} <Currency />
              </h1>
            </div>
            <div className="flex flex-col hover:shadow-xl px-8 rounded-2xl shadow-md py-6 gap-3 items-center">
              <div className="p-6 rounded-2xl bg-[#fce7e7]">
                <GiMoneyStack size={40} />
              </div>
              <h1 className="text-lg text-gray-600">Total Spent Budget</h1>
              <h1 className="text-2xl font-bold">
                {companyData?.totalSpentBudget || 0} <Currency />
              </h1>
            </div>
          </div>
          <div className="bg-white p-5 my-5 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold ms-7 my-1">Total Orders</h1>
            <SalesTrackingChart companyId={companyData?._id} />
          </div>
        </div>
      </div>
      <div className="my-10">
        <Input
          placeholder="Search by employee name"
          value={searchText}
          onChange={handleSearch}
          style={{ width: 400, height: 40, marginBottom: 16 }}
        />
        <Table
          columns={columns}
          rowKey="_id"
          dataSource={filteredEmployees}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
      </div>
    </div>
  );
};

export default User;
