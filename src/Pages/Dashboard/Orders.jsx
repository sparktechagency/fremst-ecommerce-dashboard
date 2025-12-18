import React, { useState } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Modal,
  Tag,
  Descriptions,
  Pagination,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import {
  useOrdersQuery,
  useOrderStatusChangeMutation,
} from "../../redux/apiSlices/orderSlice";
import toast from "react-hot-toast";
import Currency from "../../utils/Currency";
import logo from "../../assets/logo.png";

const { Option } = Select;

const RunningOrders = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 1000,
  });
  const [updateStatus, { isLoading: isUpdating }] =
    useOrderStatusChangeMutation();
  const { data, isLoading } = useOrdersQuery({
    page: pagination.current,
    limit: pagination.pageSize,
  });

  // Ensure orders data is properly extracted

  const orders = data?.data?.data || [];
  const paginationData = data?.data?.pagination || {};

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
  };

  // Filtered data based on search and status
  const filteredData = orders?.filter(
    (item) =>
      item?.name?.toLowerCase()?.includes(searchText?.toLowerCase()) &&
      (statusFilter
        ? item?.status?.toLowerCase() === statusFilter?.toLowerCase()
        : true)
  );

  const showModal = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleStatusChange = async (status) => {
    try {
      const res = await updateStatus({
        id: selectedOrder._id,
        status: status.toLowerCase(),
      });
      console.log(res);
      if (res?.data?.success) {
        toast.success(res?.data?.message || `Status changed to ${status}`);
      } else {
        toast.error(res?.error?.data?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
    setIsModalVisible(false);
  };

  // Table columns
  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Customer Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      render: (company) => company?.user?.name || "N/A",
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      render: (items) =>
        items.map((item, index) => (
          <div key={index}>
            <strong>{item.product?.name}</strong> ({item.size}, {item.color}) -{" "}
            {item.quantity} pcs
          </div>
        )),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => (
        <span>
          {amount} <Currency />
        </span>
      ),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "pending"
              ? "orange"
              : status === "completed"
              ? "green"
              : status === "cancelled"
              ? "red"
              : "blue"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => showModal(record)}
        />
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl heading my-5">Order History</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Space>
          <Input
            placeholder="Search by Customer Name"
            value={searchText}
            onChange={handleSearch}
            style={{ width: 400, height: 40 }}
          />
          <Select
            placeholder="Filter by status"
            onChange={handleStatusFilterChange}
            style={{ width: 200, height: 40 }}
            allowClear
          >
            <Option value="shipped">Dispatched</Option>
            <Option value="Completed">Completed</Option>
            <Option value="Pending">Pending</Option>
            <Option value="Cancelled">Cancelled</Option>
          </Select>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        pagination={paginationData}
        loading={isLoading}
      />

      <Modal
        title={
          <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            Order Details
          </span>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
        width={600}
      >
        {selectedOrder && (
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="Order ID">
              {selectedOrder?.orderId}
            </Descriptions.Item>
            <Descriptions.Item label="Customer Name">
              {selectedOrder?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Company">
              {selectedOrder?.company?.user?.name || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Contact">
              {selectedOrder?.contact}
            </Descriptions.Item>
            <Descriptions.Item label="Items">
              {selectedOrder?.items?.map((item, index) => (
                <div key={index} style={{ marginBottom: 4 }}>
                  <strong>{item.product?.name}</strong> ({item.size},{" "}
                  {item.color}) - {item.quantity} pcs
                </div>
              ))}
            </Descriptions.Item>
            <Descriptions.Item
              label="Total Amount"
              style={{ fontWeight: "bold", color: "#1890ff" }}
            >
              {selectedOrder?.totalAmount} <Currency />
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={
                  selectedOrder?.status === "In Progress"
                    ? "orange"
                    : selectedOrder?.status === "Completed"
                    ? "green"
                    : selectedOrder?.status === "Pending"
                    ? "yellow"
                    : "red"
                }
              >
                {selectedOrder.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              {new Date(selectedOrder.createdAt).toLocaleDateString()}
            </Descriptions.Item>
          </Descriptions>
        )}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Button
            className="bg-green-400    text-black"
            onClick={() => handleStatusChange("Completed")}
          >
            Mark as Completed
          </Button>
          <Button
            type="default"
            onClick={() => handleStatusChange("Dispatched")}
            style={{ marginLeft: 8 }}
            className="bg-blue-500 text-black"
          >
            Mark as Dispatched
          </Button>
          <Button
            className="bg-red-500 text-white"
            onClick={() => handleStatusChange("Cancelled")}
            style={{ marginLeft: 8 }}
          >
            Mark as Cancelled
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default RunningOrders;
