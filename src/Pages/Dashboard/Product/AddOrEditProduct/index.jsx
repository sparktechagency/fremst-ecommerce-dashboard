import React from "react";
import { Form, Button } from "antd";
import useProductForm from "./useProductForm";
import ProductDetailsForm from "./ProductDetailsForm";
import ProductImagesSection from "./ProductImagesSection";
import ProductMetaSection from "./ProductMetaSection";

/**
 * Add or Edit Product Page
 * Main orchestrator component that composes all sub-components
 */
const AddOrEditProduct = () => {
  const {
    id,
    form,
    fileList,
    featuredImageList,
    isCreating,
    isUpdating,
    handleFileListChange,
    handleFeaturedImageListChange,
    handleSubmit,
  } = useProductForm();

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-semibold mb-5">
        {id ? "Edit Product" : "Add New Product"}
      </h1>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="flex">
          {/* Left Side - Product Details */}
          <ProductDetailsForm />

          {/* Right Side - Images and Meta */}
          <div className="w-1/2 pl-5 flex flex-col">
            <ProductImagesSection
              id={id}
              fileList={fileList}
              featuredImageList={featuredImageList}
              onFileListChange={handleFileListChange}
              onFeaturedImageListChange={handleFeaturedImageListChange}
            />
            <ProductMetaSection />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-5 gap-3">
          <Button className="py-5">Cancel</Button>
          <Button
            className="bg-primary text-white py-5"
            htmlType="submit"
            loading={isCreating || isUpdating}
          >
            {id ? "Update Product" : "Publish Product"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddOrEditProduct;
