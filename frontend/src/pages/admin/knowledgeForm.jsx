import axios from "../../helper/axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function KnowledgeForm() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [about, setAbout] = useState("");

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [error, setError] = useState({});

  const createKnowledge = async (e) => {
    try {
      e.preventDefault();

      const knowledge = {
        title,
        description,
        about,
      };

      let res;

      if (id) {
        res = await axios.patch("/api/knowledge/" + id, knowledge);
      } else {
        res = await axios.post("/api/knowledge", knowledge);
      }

      // Upload image ONLY if selected
      if (file) {
        const formData = new FormData();
        formData.append("photo", file);

        await axios.post(
          `/api/knowledge/${res.data._id}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      if (res.status === 200 || res.status === 201) {
        navigate("/admin/adminknowledge");
      }

    } catch (e) {
      if (e.response?.data?.errors) {
        setError(e.response.data.errors);
      }
    }
  };

  useEffect(() => {
    if (id) {
      const fetchUpdateData = async () => {
        const res = await axios.get("/api/knowledge/" + id);

        if (res.status === 200) {
          setTitle(res.data.title);
          setDescription(res.data.description);
          setAbout(res.data.about);

          if (res.data.photo) {
            setPreview(
              import.meta.env.VITE_BACKEND_ASSET_URL + res.data.photo
            );
          }
        }
      };

      fetchUpdateData();
    }
  }, [id]);

  const upload = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);

    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      setPreview(e.target.result);
    };

    fileReader.readAsDataURL(selectedFile);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">

      <form
        className="rounded-xl border bg-white p-6 shadow-sm"
        onSubmit={createKnowledge}
      >

        <h2 className="text-xl font-semibold mb-6">
          {id ? "Edit Knowledge" : "Create Knowledge"}
        </h2>

        {/* Image Upload */}
        <div className="mb-4">
          <input type="file" onChange={upload} />

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-3 w-40 rounded-lg border"
            />
          )}
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Title
          </label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Enter title"
            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {error.title && (
            <p className="text-red-600 text-sm">
              {error.title.msg}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">

          <label className="block text-sm font-medium mb-1">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Short description"
            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {error.description && (
            <p className="text-red-600 text-sm">
              {error.description.msg}
            </p>
          )}

        </div>

        {/* About */}
        <div className="mb-6">

          <label className="block text-sm font-medium mb-1">
            About
          </label>

          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows={5}
            placeholder="Detailed information"
            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {error.about && (
            <p className="text-red-600 text-sm">
              {error.about.msg}
            </p>
          )}

        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">

          <button
            type="button"
            onClick={() => navigate("/admin/adminknowledge")}
            className="rounded-lg border px-4 py-2"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {id ? "Update" : "Create"}
          </button>

        </div>

      </form>
    </div>
  );
}

export default KnowledgeForm;