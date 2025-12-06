import { useState } from "react";
import profileBanner from "../../assets/profileBanner.png";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { PiSuitcaseSimple } from "react-icons/pi";
import { FaRegBuilding } from "react-icons/fa6";
import {
  MdOutlineEmail,
  MdOutlineLocalPhone,
  MdOutlineLocationOn,
} from "react-icons/md";
import { Button, Input, Select, Spin, Table, Tooltip } from "antd";
import moment from "moment";
import { TbShoppingCartCheck } from "react-icons/tb";
import { IoIosCalculator } from "react-icons/io";
import { RiMoneyCnyCircleLine } from "react-icons/ri";
import { GiMoneyStack } from "react-icons/gi";
import { useGetSingleEmployeeByIdQuery } from "../../redux/apiSlices/userSlice";
import { useParams } from "react-router-dom";
import { useGetEmployeeOrdersHistoryQuery } from "../../redux/apiSlices/orderSlice";
import Currency from "../../utils/Currency";
import logo from "../../assets/logo.png";
import { imageUrl } from "../../redux/api/baseApi";

const EmployeeProfile = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { id } = useParams();

  const { data: getEmployeeData, isFetching } =
    useGetSingleEmployeeByIdQuery(id);
  const { data: getEmployeeOrders, isFetching: isFetchingOrders } =
    useGetEmployeeOrdersHistoryQuery(id);

  if (isFetching || isFetchingOrders) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin />
      </div>
    );
  }

  const employeeData = getEmployeeData?.data || [];
  const orderHistory = getEmployeeOrders?.data?.data || [];

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
  };

  const filteredOrderHistory = orderHistory?.filter((order) => {
    const matchesSearchText = searchText
      ? order?.items?.some((item) =>
          item?.product?.name?.toLowerCase().includes(searchText.toLowerCase())
        )
      : true;

    const matchesStatusFilter = statusFilter
      ? order?.status?.toLowerCase() === statusFilter.toLowerCase()
      : true;

    return matchesSearchText && matchesStatusFilter;
  });

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      key: "_id",
      render: (id) => <Tooltip title={id}>{id?.slice(0, 10)}</Tooltip>,
    },
    {
      title: "Product Name",
      dataIndex: "items",
      key: "items",
      render: (items) =>
        items?.map((item, index) => (
          <div key={index}>{item?.product?.name}</div>
        )),
    },
    {
      title: "Item",
      dataIndex: "items",
      key: "items",
      render: (items) => <span>{items?.length}</span>,
    },
    {
      title: "Price",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text) => (
        <span>
          {text?.toFixed(2)} <Currency />
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <span
          className={
            text === "pending"
              ? "text-yellow-600"
              : text === "delivered"
              ? "text-green-500"
              : "text-red-500"
          }
        >
          {text}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => <span>{moment(date).format("L")}</span>,
    },
  ];

  return (
    <div className="max-w-[1500px] mx-auto my-10 flex gap-5 w-full">
      <div className="w-[35%]">
        <div className="border rounded-2xl shadow-md relative">
          <img
            className="w-full rounded-t-2xl h-[180px]"
            src={profileBanner}
            alt="profileBanner"
          />
          <div className="absolute flex flex-col items-center top-12 left-5 ">
            <div className="w-48 h-48 border-8 rounded-full border-white">
              <img
                className="object-cover w-full h-full rounded-full"
                src={
                  employeeData?.user?.profile?.startsWith("https")
                    ? employeeData?.user?.profile
                    : `${imageUrl}${employeeData?.user?.profile}`
                }
                alt="profileImg"
                width={200}
                height={200}
              />
            </div>
            <p className="text-3xl font-semibold flex items-center gap-4">
              {employeeData?.user?.name}{" "}
              <span>
                <BsFillPatchCheckFill color="#1e88e5" size={30} />
              </span>
            </p>
          </div>
          <div className="mt-36 px-8 mb-8">
            <h1 className="flex items-center gap-2 text-lg">
              <span>
                <PiSuitcaseSimple />
              </span>
              {employeeData?.designation}
            </h1>
            <h1 className="flex items-center gap-2 text-lg">
              <span>
                <FaRegBuilding />
              </span>
              {employeeData?.company?.user?.name}
            </h1>
            <h1 className="flex items-center gap-2 text-lg">
              <span>
                <MdOutlineEmail />
              </span>
              {employeeData?.user?.email}
            </h1>
            <h1 className="flex items-center gap-2 text-lg">
              <span>
                <MdOutlineLocalPhone />
              </span>
              {employeeData?.user?.contact}
            </h1>
            <h1 className="flex items-center gap-2 text-lg">
              <span>
                <MdOutlineLocationOn />
              </span>
              {employeeData?.user?.address
                ? employeeData?.user?.address?.streetAddress
                  ? `${employeeData?.user?.address?.streetAddress} ${employeeData?.user?.address?.city} ${employeeData?.user?.address?.state} ${employeeData?.user?.address?.city} ${employeeData?.user?.address?.postalCode}`
                  : employeeData?.user?.address
                : "N/A"}
            </h1>
          </div>
        </div>

        <div className="shadow-md">
          <h1 className="bg-primary text-white px-10 py-3 rounded-t-2xl font-semibold">
            Budget Details
          </h1>
          <div className="p-5">
            <h1 className="text-lg">
              Assigned Budget:{" "}
              <span>
                {employeeData?.budget} <Currency />
              </span>
            </h1>
            <h1 className="text-lg">
              Assigned Duration: <span>{employeeData?.duration} Months</span>
            </h1>
            <h1 className="text-lg">
              Assigned Date:{" "}
              <span>{moment(employeeData?.budgetAssignedAt).format("LL")}</span>
            </h1>
            <h1 className="text-lg">
              Expiration Date:{" "}
              <span>{moment(employeeData?.budgetExpiredAt).format("LL")}</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="w-[65%]">
        <div className="grid grid-col-1 md:grid-cols-4 gap-5">
          <div className="flex flex-col hover:shadow-xl px-10 rounded-2xl shadow-md py-6 gap-3 items-center">
            <div className="p-6 rounded-2xl bg-[#f3f3ff]">
              <TbShoppingCartCheck size={40} />
            </div>
            <h1 className="text-lg text-gray-600">Total Order</h1>
            <h1 className="text-2xl font-bold">{employeeData?.totalOrders}</h1>
          </div>
          <div className="flex flex-col hover:shadow-xl px-10 rounded-2xl shadow-md py-6 gap-3 items-center">
            <div className="p-6 rounded-2xl bg-[#fff6da]">
              <IoIosCalculator size={40} />
            </div>
            <h1 className="text-lg text-gray-600">Total Budget</h1>
            <h1 className="text-2xl font-bold">
              {employeeData?.budget} <Currency />
            </h1>
          </div>
          <div className="flex flex-col hover:shadow-xl px-10 rounded-2xl shadow-md py-6 gap-3 items-center">
            <div className="p-6 rounded-2xl bg-[#edf6fd]">
              <RiMoneyCnyCircleLine size={40} />
            </div>
            <h1 className="text-lg text-gray-600">Total Spend</h1>
            <h1 className="text-2xl font-bold">
              {employeeData?.totalSpentBudget} <Currency />
            </h1>
          </div>
          <div className="flex flex-col hover:shadow-xl px-8 rounded-2xl shadow-md py-6 gap-3 items-center">
            <div className="p-6 rounded-2xl bg-[#fce7e7]">
              <GiMoneyStack size={40} />
            </div>
            <h1 className="text-lg text-gray-600">Remaining Budget</h1>
            <h1 className="text-2xl font-bold">
              {employeeData?.budgetLeft?.toFixed(2)} <Currency />
            </h1>
          </div>
        </div>

        <p className="mt-10">My Order History</p>
        <div className="flex justify-between items-center my-5">
          <Input
            placeholder="Search by product name"
            value={searchText}
            onChange={handleSearch}
            style={{ width: "30%" }}
          />
          <Select
            placeholder="Filter by status"
            onChange={handleStatusChange}
            style={{ width: "20%" }}
            allowClear
          >
            <Select.Option value="delivered">Delivered</Select.Option>
            <Select.Option value="cancelled">Cancelled</Select.Option>
            <Select.Option value="pending">Pending</Select.Option>
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={filteredOrderHistory}
          rowKey={(record) => record._id}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default EmployeeProfile;
