import { useState, useEffect } from "react";
import { Form } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useCreateProductMutation,
  useGetSingleProductQuery,
  useUpdateProductMutation,
} from "../../../../redux/apiSlices/productSlice";
import { imageUrl } from "../../../../redux/api/baseApi";

/**
 * Custom hook for managing product form state and logic
 */
const useProductForm = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Image states
  const [fileList, setFileList] = useState([]);
  const [featuredImageList, setFeaturedImageList] = useState([]);

  // API hooks
  const { data: product, isFetching: isFetchingProduct } =
    useGetSingleProductQuery(id, {
      skip: !id,
    });
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  // Handle changes for image uploads
  const handleFileListChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleFeaturedImageListChange = ({ fileList: newFileList }) => {
    setFeaturedImageList(newFileList);
  };

  // Populate form when editing
  useEffect(() => {
    if (product && id) {
      const {
        image,
        featuredImages,
        category,
        sizes,
        colors,
        brands,
        tags,
        name,
        quantity,
        availability,
        ...rest
      } = product.data;

      // Set form fields
      form.setFieldsValue({
        ...rest,
        name,
        quantity,
        category: category?._id,
        sizes: sizes || [],
        colors: colors || [],
        brands: brands || [],
        tags: tags || [],
        availability: availability ? "isStock" : "outOfStock",
      });

      // Handle main image - FIX: renamed variable to avoid collision
      if (image) {
        const fullImageUrl = image.startsWith("https")
          ? image
          : `${imageUrl}${image}`;

        setFileList([
          {
            uid: "-1",
            name: "product-image.jpg",
            status: "done",
            url: fullImageUrl,
          },
        ]);
      }

      // Handle featured images - FIX: renamed variable to avoid collision
      if (featuredImages?.length) {
        const featuredUrls = featuredImages.map((url) =>
          url.startsWith("https") ? url : `${imageUrl}${url}`
        );

        setFeaturedImageList(
          featuredUrls.map((url, index) => ({
            uid: `-${index + 1}`,
            name: `featuredImage-${index + 1}.jpg`,
            status: "done",
            url,
          }))
        );
      }
    }
  }, [product, id, form]);

  // Form submission handler
  const handleSubmit = async (values) => {
    const formData = new FormData();
    const jsonPayload = {};

    // Check if a new product image is uploaded
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("image", fileList[0].originFileObj);
    }

    // Check if new featured images are uploaded
    const newFeaturedImages = featuredImageList.filter(
      (file) => file.originFileObj
    );
    if (newFeaturedImages.length > 0) {
      newFeaturedImages.forEach((file) => {
        formData.append("featuredImage", file.originFileObj);
      });
    }

    // Collect existing featured images
    const existingImages = featuredImageList
      .filter((item) => item.url)
      .map((item) => item.url.replace(imageUrl, ""));

    if (existingImages.length > 0) {
      jsonPayload.existingFeaturedImages = existingImages;
    }

    // Append other form fields
    Object.entries(values).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        jsonPayload[key] = value;
      } else {
        jsonPayload[key] = key === "availability" ? value === "isStock" : value;
      }
    });

    formData.append("data", JSON.stringify(jsonPayload));

    try {
      if (id) {
        const response = await updateProduct({ id, data: formData });

        if (response?.data?.success) {
          toast.success(response?.data?.message);
          form.resetFields();
          setFileList([]);
          setFeaturedImageList([]);
          navigate("/productList");
        } else {
          toast.error(response?.data?.message);
        }
      } else {
        const response = await createProduct(formData);

        if (response?.data?.success) {
          toast.success(response?.data?.message);
          form.resetFields();
          setFileList([]);
          setFeaturedImageList([]);
        } else {
          toast.error(response?.data?.message);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return {
    id,
    form,
    fileList,
    featuredImageList,
    isFetchingProduct,
    isCreating,
    isUpdating,
    handleFileListChange,
    handleFeaturedImageListChange,
    handleSubmit,
  };
};

export default useProductForm;
