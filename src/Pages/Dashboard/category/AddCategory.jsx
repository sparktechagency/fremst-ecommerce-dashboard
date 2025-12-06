import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, Table, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { MdEditSquare } from "react-icons/md";
import {
  useAddCategoryMutation,
  useGetAllCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../../redux/apiSlices/Category";
import toast from "react-hot-toast";
import { imageUrl } from "../../../redux/api/baseApi";

const AddCategory = () => {
  const [fileList, setFileList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [form] = Form.useForm();
  const [createCategory, { isLoading: isCreating }] = useAddCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const { data, isLoading, error } = useGetAllCategoriesQuery();

  const categories = data?.data || [];

  useEffect(() => {
    // When a category is selected for editing, set the form values.
    if (selectedCategory) {
      form.setFieldsValue({
        categoryName: selectedCategory.title,
      });

      // Set the fileList for image upload
      const imageUrl = selectedCategory.image.startsWith("http")
        ? selectedCategory.image
        : `${BASE_URL}${selectedCategory.image}`;

      setFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: imageUrl,
        },
      ]);
    }
  }, [selectedCategory, form]);

  const handleUpload = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleSubmit = (values) => {
    const formData = new FormData();
    let jsonPayload = {};

    // Append the image file if a new file is uploaded
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("image", fileList[0].originFileObj);
    }

    jsonPayload.title = values.categoryName;
    formData.append("data", JSON.stringify(jsonPayload));

    if (selectedCategory) {
      // Update existing category
      updateCategory({ id: selectedCategory._id, data: formData })
        .unwrap()
        .then((response) => {
          toast.success(
            response?.data?.message || "Category updated successfully"
          );
        })
        .catch((error) => {
          toast.error(error?.data?.message || "Failed to update category");
        });
    } else {
      // Create new category
      createCategory(formData)
        .unwrap()
        .then((response) => {
          toast.success(
            response?.data?.message || "Category created successfully"
          );
          setFileList([]); // Reset file list
          form.resetFields(); // Reset form fields
        })
        .catch((error) => {
          toast.error(error?.data?.message || "Failed to create category");
        });
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
  };

  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Serial No.",
      dataIndex: "serialNo",
      key: "serialNo",
      render: (_, record, index) => <p>{index + 1}</p>,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <div className="bg-gray-200 w-24 h-24 flex items-center justify-center rounded-lg">
          <img
            className="rounded-xl object-cover w-full h-full"
            src={image?.startsWith("http") ? image : `${imageUrl}${image}`}
            alt="category"
            style={{ width: 90, height: 90 }}
          />
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>
            <MdEditSquare size={24} className="text-green-600" />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-3xl heading mb-5">Add Category</h1>
      <div className="flex">
        {/* Add/Edit Category Section */}
        <div className="w-1/2 pr-5 h-[350px] bg-white p-5 rounded-2xl border-t-8 border-primary">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ categoryName: selectedCategory?.title }}
          >
            <Form.Item
              name="categoryName"
              label="Category Name"
              rules={[
                { required: true, message: "Please input the category name!" },
              ]}
            >
              <Input placeholder="Enter category name" style={{ height: 40 }} />
            </Form.Item>
            <Form.Item
              name="categoryImage"
              label="Category Image"
              rules={[
                {
                  required: !selectedCategory,
                  message: "Please upload a category image!",
                },
              ]}
            >
              <Upload
                listType="picture-card"
                maxCount={1}
                fileList={fileList}
                beforeUpload={() => false}
                onChange={handleUpload}
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
            <div className="text-end">
              <Button
                className="bg-primary rounded-xl text-white py-5"
                htmlType="submit"
                loading={isCreating || isUpdating}
              >
                {selectedCategory ? "Update" : "Publish"}
              </Button>
            </div>
          </Form>
        </div>

        {/* Categories Table */}
        <div className="w-1/2 pl-5">
          <Input
            placeholder="Search categories"
            value={searchText}
            onChange={handleSearch}
            style={{ width: 300, marginBottom: 16, height: 40 }}
          />
          <Table
            columns={columns}
            dataSource={filteredCategories}
            rowKey="_id"
            loading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
