import axios from "../../helper/axios";
import assetUrl from "../../helper/assetUrl";
import { validateImageFile } from "../../helper/validateImage";
import {
  validateContentForm,
  hasFieldErrors,
  normalizeServerErrors,
} from "../../helper/formValidation";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RichTextEditor from "../../components/RichTextEditor";
import {
  AdminFormCard,
  FormSection,
  FormField,
  FormErrorBanner,
  ImageDropzone,
  FormActions,
  fieldClass,
} from "../../components/admin/AdminFormUI";
import DisplayDateField from "../../components/admin/DisplayDateField.jsx";
import { displayDateToApi, formatDateForInput, todayDateInput } from "../../helper/displayDate.js";

function ServiceForm() {
  let { id } = useParams();
  let navigate = useNavigate();

  let [name, setName] = useState("");
  let [description, setDescription] = useState("");
  let [about, setAbout] = useState("");
  let [hidden, setHidden] = useState(false);
  let [pinned, setPinned] = useState(false);
  let [displayDate, setDisplayDate] = useState(todayDateInput());
  let [category, setCategory] = useState("");
  let [categories, setCategories] = useState([]);
  let [file, setFile] = useState(null);
  let [preview, setPreview] = useState(null);
  let [error, setError] = useState({});
  let [formError, setFormError] = useState("");
  let [saving, setSaving] = useState(false);

  let clearField = (key) =>
    setError((prev) => {
      if (!prev[key]) return prev;
      let next = { ...prev };
      delete next[key];
      return next;
    });

  let creatservice = async (e) => {
    e.preventDefault();
    setFormError("");

    let clientErrors = validateContentForm(
      { name, description, about, category },
      {
        nameKey: "name",
        requireCategory: true,
        requirePhotoOnCreate: true,
        isEdit: !!id,
        hasPhoto: Boolean(file || preview),
      }
    );
    if (file) {
      let imgErr = validateImageFile(file);
      if (imgErr) clientErrors.photo = { msg: imgErr };
    }
    if (hasFieldErrors(clientErrors)) {
      setError(clientErrors);
      return;
    }
    setError({});

    try {
      setSaving(true);
      let service = {
        name,
        description,
        about,
        category,
        hidden,
        pinned,
        displayDate: displayDateToApi(displayDate),
      };
      let res;
      if (id) {
        res = await axios.patch("/api/service/" + id, service);
      } else {
        res = await axios.post("/api/service", service);
      }

      if (file) {
        let formData = new FormData();
        formData.set("photo", file);
        await axios.post(`/api/service/${res.data._id}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (res.status === 200 || res.status === 201) {
        navigate("/admin/adminservice");
      }
    } catch (e) {
      if (e.response?.data?.errors) {
        setError(normalizeServerErrors(e.response.data));
      } else {
        setFormError(
          e.response?.data?.error ||
            e.response?.data?.msg ||
            e.message ||
            "Save failed"
        );
      }
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    let fetchCategories = async () => {
      let res = await axios.get("/api/category");
      setCategories(res.data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!id) return;
    let fetchUpdateService = async () => {
      let res = await axios.get("/api/service/" + id);
      if (res.status === 200) {
        let data = res.data;
        setName(data.name);
        setDescription(data.description);
        setAbout(data.about);
        setHidden(Boolean(data.hidden));
        setPinned(Boolean(data.pinned));
        setDisplayDate(formatDateForInput(data.displayDate || data.createdAt));
        setCategory(data.category?._id || data.category || "");
        if (data.photo) setPreview(assetUrl(data.photo));
      }
    };
    fetchUpdateService();
  }, [id]);

  let upload = (e) => {
    let selected = e.target.files[0];
    if (!selected) return;
    let imgErr = validateImageFile(selected);
    if (imgErr) {
      setFormError(imgErr);
      setFile(null);
      e.target.value = "";
      return;
    }
    setFormError("");
    setFile(selected);
    let reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(selected);
  };

  return (
    <AdminFormCard
      title={id ? "Edit service" : "Create service"}
      subtitle="Fill each step below. Preview is for the list; About is the full page."
      onSubmit={creatservice}
      footer={
        <FormActions
          onCancel={() => navigate("/admin/adminservice")}
          saving={saving}
          isEdit={!!id}
        />
      }
    >
      <FormErrorBanner message={formError} errors={error} />

      <FormSection step="1" title="Cover image" hasError={Boolean(error.photo)}>
        <ImageDropzone
          preview={preview}
          onChange={(e) => {
            clearField("photo");
            upload(e);
          }}
          error={error.photo?.msg}
        />
      </FormSection>

      <FormSection
        step="2"
        title="Basic info"
        hasError={Boolean(error.name || error.description || error.category)}
      >
        <FormField label="Service name" required error={error.name?.msg}>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearField("name");
            }}
            type="text"
            placeholder="e.g. Network installation"
            className={fieldClass}
            aria-invalid={Boolean(error.name)}
          />
        </FormField>

        <FormField
          label="List preview"
          required
          hint="Short text on the list card"
          error={error.description?.msg}
        >
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              clearField("description");
            }}
            rows={3}
            placeholder="One or two short sentences..."
            className={fieldClass}
            aria-invalid={Boolean(error.description)}
          />
        </FormField>

        <FormField label="Category" required error={error.category?.msg}>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              clearField("category");
            }}
            className={fieldClass}
            aria-invalid={Boolean(error.category)}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.title}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Display date"
          hint="Used when list sorting is set to Display date (newest first). Manual order is unchanged."
        >
          <DisplayDateField
            value={displayDate}
            onChange={setDisplayDate}
          />
        </FormField>

        <FormField
          label="Visibility"
          hint="Hidden items stay in admin but are not shown on the public site."
        >
          <label className="flex items-center gap-3 cursor-pointer select-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3">
            <input
              type="checkbox"
              checked={hidden}
              onChange={(e) => setHidden(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-800 dark:text-slate-200">
              Hide from public site
            </span>
          </label>
        </FormField>

        <FormField
          label="Pin to top"
          hint="Pinned services appear first on the public Services page."
        >
          <label className="flex items-center gap-3 cursor-pointer select-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3">
            <input
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-800 dark:text-slate-200">
              Pin this service to the top
            </span>
          </label>
        </FormField>
      </FormSection>

      <FormSection step="3" title="Full detail" hasError={Boolean(error.about)}>
        <FormField
          label="About"
          required
          hint="Shown on the detail page — use the toolbar"
          error={error.about?.msg}
        >
          <RichTextEditor
            value={about}
            onChange={(v) => {
              setAbout(v);
              clearField("about");
            }}
            placeholder="Write the full service detail..."
            minHeightClass="min-h-[220px]"
          />
        </FormField>
      </FormSection>
    </AdminFormCard>
  );
}

export default ServiceForm;
