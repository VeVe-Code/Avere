import axios from "../../helper/axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import assetUrl from "../../helper/assetUrl";
import { validateImageFile } from "../../helper/validateImage";
import {
  validateContentForm,
  hasFieldErrors,
  normalizeServerErrors,
} from "../../helper/formValidation";
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

function emptyBlock() {
  return { title: "", content: "", file: null, preview: null, photo: null };
}

function KnowledgeForm() {
  let { id } = useParams();
  let navigate = useNavigate();

  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [about, setAbout] = useState("");
  let [hidden, setHidden] = useState(false);
  let [displayDate, setDisplayDate] = useState(todayDateInput());
  let [file, setFile] = useState(null);
  let [preview, setPreview] = useState(null);
  let [blocks, setBlocks] = useState([]);
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

  let createKnowledge = async (e) => {
    e.preventDefault();
    setFormError("");

    let clientErrors = validateContentForm({ title, description, about });
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

      let filteredSections = [];
      let sectionImages = new FormData();
      let sectionIndexes = [];

      blocks.forEach((b) => {
        if (!(b.title || b.content || b.file || b.photo)) return;
        let idx = filteredSections.length;
        filteredSections.push({
          title: b.title || "",
          description: "",
          detail: b.content || "",
          photo: b.photo || null,
        });
        if (b.file) {
          sectionImages.append("photos", b.file);
          sectionIndexes.push(idx);
        }
      });

      let knowledge = {
        title,
        description,
        about,
        hidden,
        displayDate: displayDateToApi(displayDate),
        sections: JSON.stringify(filteredSections),
      };

      let res;
      if (id) {
        res = await axios.patch("/api/knowledge/" + id, knowledge);
      } else {
        res = await axios.post("/api/knowledge", knowledge);
      }

      let kid = res.data._id;

      if (file) {
        let formData = new FormData();
        formData.append("photo", file);
        await axios.post(`/api/knowledge/${kid}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (sectionIndexes.length > 0) {
        sectionImages.append("indexes", JSON.stringify(sectionIndexes));
        await axios.post(
          `/api/knowledge/${kid}/sections-upload`,
          sectionImages,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      navigate("/admin/adminknowledge");
    } catch (e) {
      if (e.response?.data?.errors) {
        setError(normalizeServerErrors(e.response.data));
      } else {
        setFormError(
          e.response?.data?.msg || e.response?.data?.error || "Save failed"
        );
      }
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    let fetchUpdateData = async () => {
      let res = await axios.get("/api/knowledge/" + id);
      if (res.status === 200) {
        setTitle(res.data.title || "");
        setDescription(res.data.description || "");
        setAbout(res.data.about || "");
        setHidden(Boolean(res.data.hidden));
        setDisplayDate(formatDateForInput(res.data.displayDate || res.data.createdAt));
        if (res.data.photo) setPreview(assetUrl(res.data.photo));
        if (res.data.sections?.length) {
          setBlocks(
            res.data.sections.map((sec) => ({
              title: sec.title || "",
              content: sec.detail || sec.description || "",
              file: null,
              preview: sec.photo ? assetUrl(sec.photo) : null,
              photo: sec.photo || null,
            }))
          );
        }
      }
    };
    fetchUpdateData();
  }, [id]);

  let uploadCover = (e) => {
    let selected = e.target.files[0];
    if (!selected) return;
    let imgErr = validateImageFile(selected);
    if (imgErr) {
      setFormError(imgErr);
      e.target.value = "";
      return;
    }
    setFormError("");
    setFile(selected);
    let reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(selected);
  };

  let addBlock = () => setBlocks((prev) => [...prev, emptyBlock()]);

  let removeBlock = (index) =>
    setBlocks((prev) => prev.filter((_, i) => i !== index));

  let moveBlock = (index, dir) => {
    setBlocks((prev) => {
      let next = [...prev];
      let target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  let updateBlock = (index, field, value) => {
    setBlocks((prev) => {
      let next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  let uploadBlockImage = (index, e) => {
    let selected = e.target.files[0];
    if (!selected) return;
    let imgErr = validateImageFile(selected);
    if (imgErr) {
      setFormError(imgErr);
      e.target.value = "";
      return;
    }
    setFormError("");
    setBlocks((prev) => {
      let next = [...prev];
      next[index] = {
        ...next[index],
        file: selected,
        preview: URL.createObjectURL(selected),
      };
      return next;
    });
  };

  return (
    <AdminFormCard
      title={id ? "Edit knowledge article" : "Create knowledge article"}
      subtitle="Cover, basics, full article, then extra image + text blocks in order."
      onSubmit={createKnowledge}
      footer={
        <FormActions
          onCancel={() => navigate("/admin/adminknowledge")}
          saving={saving}
          isEdit={!!id}
          submitLabel={id ? "Update" : "Publish"}
        />
      }
    >
      <FormErrorBanner message={formError} errors={error} />

      <FormSection step="1" title="Cover image" hasError={Boolean(error.photo)}>
        <ImageDropzone
          preview={preview}
          onChange={(e) => {
            clearField("photo");
            uploadCover(e);
          }}
          error={error.photo?.msg}
        />
      </FormSection>

      <FormSection
        step="2"
        title="Basic info"
        hasError={Boolean(error.title || error.description)}
      >
        <FormField label="Title" required error={error.title?.msg}>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              clearField("title");
            }}
            type="text"
            placeholder="Headline"
            className={fieldClass}
            aria-invalid={Boolean(error.title)}
          />
        </FormField>

        <FormField
          label="List preview"
          required
          hint="About 20 characters shown on the knowledge list"
          error={error.description?.msg}
        >
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              clearField("description");
            }}
            rows={2}
            placeholder="Short preview for the list card..."
            className={fieldClass}
            aria-invalid={Boolean(error.description)}
          />
        </FormField>

        <FormField label="Display date" hint="Used when list sorting is set to Display date.">
          <DisplayDateField value={displayDate} onChange={setDisplayDate} />
        </FormField>

        <FormField
          label="Visibility"
          hint="Hidden posts stay in admin but are not shown on the public site."
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
      </FormSection>

      <FormSection step="3" title="Full article" hasError={Boolean(error.about)}>
        <FormField
          label="About"
          required
          hint="Main body on the detail page — use the toolbar"
          error={error.about?.msg}
        >
          <RichTextEditor
            value={about}
            onChange={(v) => {
              setAbout(v);
              clearField("about");
            }}
            placeholder="Write the full story..."
            minHeightClass="min-h-[220px]"
          />
        </FormField>
      </FormSection>

      <FormSection step="4" title="Extra content blocks">
        <div className="flex flex-wrap items-center justify-between gap-3 -mt-1 mb-1">
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
            Optional. Stack more images and text in order: Image → Text → Image → Text.
            Use arrows to reorder.
          </p>
          <button
            type="button"
            onClick={addBlock}
            className="rounded-xl bg-slate-900 text-white text-sm font-medium px-4 py-2 hover:bg-slate-800"
          >
            + Add block
          </button>
        </div>

        {!blocks.length && (
          <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            No extra blocks yet.
          </div>
        )}

        {blocks.map((block, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Block {index + 1}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveBlock(index, -1)}
                  disabled={index === 0}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none"
                  aria-label="Move block up"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveBlock(index, 1)}
                  disabled={index === blocks.length - 1}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none"
                  aria-label="Move block down"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeBlock(index)}
                  className="text-sm text-red-600 hover:text-red-700 ml-1"
                >
                  Remove
                </button>
              </div>
            </div>

            <ImageDropzone
              preview={block.preview}
              onChange={(e) => uploadBlockImage(index, e)}
              hint="Block image — jpg, png, webp, gif"
            />

            <FormField label="Title (optional)">
              <input
                type="text"
                value={block.title}
                onChange={(e) => updateBlock(index, "title", e.target.value)}
                placeholder="Block heading"
                className={fieldClass}
              />
            </FormField>

            <FormField label="Text">
              <RichTextEditor
                value={block.content}
                onChange={(html) => updateBlock(index, "content", html)}
                placeholder="Text for this block..."
                minHeightClass="min-h-[120px]"
              />
            </FormField>
          </div>
        ))}
      </FormSection>
    </AdminFormCard>
  );
}

export default KnowledgeForm;
