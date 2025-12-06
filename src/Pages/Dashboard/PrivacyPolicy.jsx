import React, { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
import Title from "../../components/common/Title";
import toast from "react-hot-toast";
import {
  usePrivacyPolicyQuery,
  useUpdatePricyPolicyMutation,
} from "../../redux/apiSlices/privacyPolicySlice";
import { Spin } from "antd";

const PrivacyPolicy = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const { data: privacyPolicy, isLoading, refetch } = usePrivacyPolicyQuery();

  const [updatePricyPolicy] = useUpdatePricyPolicyMutation();

  const privacyPolicyData = privacyPolicy?.data?.content;

  useEffect(() => {
    setContent(privacyPolicyData);
  }, [privacyPolicyData]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin />
      </div>
    );
  }

  const termsDataSave = async () => {
    const data = {
      content: content,
      type: "privacy-policy",
    };

    try {
      const res = await updatePricyPolicy(data).unwrap();
      if (res.success) {
        toast.success("Privacy Policy updated successfully");
        setContent(res.data.content);
        refetch();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Update failed. Please try again.");
    }
  };

  return (
    <div>
      <Title className="mb-4">Privacy Policy</Title>

      <JoditEditor
        ref={editor}
        value={content}
        onChange={(newContent) => {
          setContent(newContent);
        }}
      />

      <div className="flex items-center justify-center mt-5">
        <button
          onClick={termsDataSave}
          type="submit"
          className="bg-primary text-white w-[160px] h-[42px] rounded-lg"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
