import axios from "../../helper/axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ServiceForm() {
  let { id } = useParams();
  let navigate = useNavigate();

  // service fields
  let [name, setName] = useState("");
  let [description, setDescription] = useState("");
  let [about, setAbout] = useState("");
  let [category, setCategory] = useState(""); // ✅ category
  let [categories, setCategories] = useState([]); // ✅ category list

  // image
  let [file, setFile] = useState(null);
  let [preview, setPreview] = useState(null);

  let [error, setError] = useState({});

  // ===============================
  // CREATE / UPDATE SERVICE
  // ===============================
  let creatservice = async (e) => {
    e.preventDefault();

    try {
      let service = {
        name,
        description,
        about,
        category // ✅ send category _id
      };

      let res;
      if (id) {
        res = await axios.patch("/api/service/" + id, service);
      } else {
        res = await axios.post("/api/service", service);
      }

      // upload photo
      if (file) {
        let formData = new FormData();
        formData.set("photo", file);

        await axios.post(
          `/api/service/${res.data._id}/upload`,
          formData,
          {
            headers: {
              Accept: "multipart/form-data"
            }
          }
        );
      }

      if (res.status === 200 || res.status === 201) {
        navigate("/admin/adminservice");
      }
    } catch (e) {
      if (e.response?.data?.errors) {
        setError(e.response.data.errors);
      }
    }
  };

  // ===============================
  // FETCH CATEGORIES
  // ===============================
  useEffect(() => {
    let fetchCategories = async () => {
      let res = await axios.get("/api/category");
      setCategories(res.data);
    };
    fetchCategories();
  }, []);

  // ===============================
  // FETCH SERVICE FOR EDIT
  // ===============================
  useEffect(() => {
    if (id) {
      let fetchUpdateService = async () => {
        let res = await axios.get("/api/service/" + id);
        if (res.status === 200) {
          let data = res.data;
          setName(data.name);
          setDescription(data.description);
          setAbout(data.about);
          setCategory(data.category); // ✅ set category
          if (data.photo) {
            setPreview(import.meta.env.VITE_BACKEND_URL + data.photo);
          }
        }
      };
      fetchUpdateService();
    }
  }, [id]);

  // ===============================
  // IMAGE UPLOAD PREVIEW
  // ===============================
  let upload = (e) => {
    let file = e.target.files[0];
    setFile(file);

    let reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <form
        className="rounded-xl border bg-white p-6 shadow-sm"
        onSubmit={creatservice}
      >
        <h2 className="text-xl font-semibold mb-6">
          {id ? "Edit Service" : "Create Service"}
        </h2>

        {/* Image */}
        <div className="mb-4">
          <input type="file" onChange={upload} />
          {preview && (
            <img
              src={preview}
              alt=""
              className="mt-3 h-32 rounded object-cover"
            />
          )}
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Service Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            className="w-full rounded-lg border px-3 py-2"
          />
          {error.name && (
            <p className="text-red-600 text-sm">{error.name.msg}</p>
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
            className="w-full rounded-lg border px-3 py-2"
          />
          {error.description && (
            <p className="text-red-600 text-sm">{error.description.msg}</p>
          )}
        </div>

        {/* About */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            About
          </label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows={5}
            className="w-full rounded-lg border px-3 py-2"
          />
          {error.about && (
            <p className="text-red-600 text-sm">{error.about.msg}</p>
          )}
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.title}
              </option>
            ))}
          </select>
          {error.category && (
            <p className="text-red-600 text-sm">{error.category.msg}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="rounded-lg border px-4 py-2"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            {id ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ServiceForm;
