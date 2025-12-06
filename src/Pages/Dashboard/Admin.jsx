import { Table, Input, Button, Space, Alert, Modal, Spin } from "antd";
import React, { useState } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import CreateAdmin from "../../components/ui/Admin/CreateAdmin";
import Title from "../../components/common/Title";
import {
  useDeleteAdminMutation,
  useGetAllAdminsQuery,
} from "../../redux/apiSlices/userSlice";
import toast from "react-hot-toast";
import { imageUrl } from "../../redux/api/baseApi";

const Admin = () => {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [deleteAdmin, { isLoading }] = useDeleteAdminMutation();
  const { data, isFetching } = useGetAllAdminsQuery();

  if (isLoading || isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin />
      </div>
    );
  }

  const admins = data?.data || [];

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleDelete = async (id) => {
    //show a alert before deleting
    Modal.confirm({
      title: "Are you sure?",
      content:
        "Do you really want to delete this admin? This action cannot be undone.",
      okText: "Yes, Delete",
      cancelText: "Cancel",
      okType: "danger",
      centered: true,
      onOk: async () => {
        try {
          const response = await deleteAdmin(id).unwrap();
          toast.success(response?.message || "Admin deleted successfully");
        } catch (error) {
          toast.error(error?.data?.message || "Failed to delete admin");
        }
      },
    });
  };

  const filteredData = admins.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Serial No.",
      dataIndex: "index",
      key: "index",
      render: (_, record, index) => <p>{index + 1}</p>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => {
        console.log(
          record?.profile?.startsWith("http")
            ? record.profile
            : `${imageUrl}${record.profile}`
        );
        return (
          <Space>
            <img
              src={
                record?.profile?.startsWith("http")
                  ? record.profile
                  : `${imageUrl}${record.profile}`
              }
              alt={record.name}
              style={{ width: 50, height: 50, borderRadius: "50%" }}
            />
            <span>{record.name}</span>
          </Space>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text, record) => (
        <span className=" bg-gray-100 py-1 px-2 rounded-full">
          {record.role === "admin" ? "Admin" : "Super Admin"}
        </span>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => handleDelete(record._id)}>
          <RiDeleteBin5Line size={24} className="text-red-600" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <Title className="">Admins</Title>
      </div>

      {/* search input and add button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Input
          placeholder="Search by name"
          value={searchText}
          onChange={handleSearch}
          style={{ width: 400, height: 40 }}
        />
        <Button
          className="bg-primary text-white"
          onClick={() => {
            setOpen(true);
          }}
          style={{ height: 40 }}
        >
          + Add Admin
        </Button>
      </div>

      {/* table container */}
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={false}
        rowKey="_id"
      />
      <CreateAdmin open={open} setOpen={setOpen} />
    </div>
  );
};

export default Admin;
