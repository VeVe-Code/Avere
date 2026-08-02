const mongoose = require("mongoose");
const Knowledge = require("../model/Knowledge");
let removeFile = require('../helpers/removeFile');

function parseBool(value, fallback = false) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    let v = value.toLowerCase().trim();
    if (v === "true" || v === "1" || v === "yes") return true;
    if (v === "false" || v === "0" || v === "no") return false;
  }
  return Boolean(value);
}

function buildListQuery(req, { publicOnly = false } = {}) {
  const title = req.query.title || "";
  const query = title
    ? { title: { $regex: new RegExp(title, "i") } }
    : {};

  if (publicOnly) {
    query.hidden = { $ne: true };
  }

  return query;
}

async function listKnowledge(req, res, { publicOnly = false } = {}) {
  try {
    const query = buildListQuery(req, { publicOnly });

    let limit = 6;
    let page = parseInt(req.query.page, 10) || 1;

    let knowledge = await Knowledge.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    let totalKnowledge = await Knowledge.countDocuments(query);
    let totalPages = Math.max(1, Math.ceil(totalKnowledge / limit));

    let Links = {
      nextPage: page >= totalPages ? false : true,
      PrevPage: page === 1 ? false : true,
      currentPage: page,
      LoopableLinks: []
    };

    for (let i = 0; i < totalPages; i++) {
      Links.LoopableLinks.push({ number: i + 1 });
    }

    return res.json({ data: knowledge, Links });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "server error" });
  }
}

let knowledgecontroller = {

  /* ================= INDEX (admin — all posts) ================= */
  index: async (req, res) => {
    return listKnowledge(req, res, { publicOnly: false });
  },

  /* ================= PUBLIC INDEX (visible only) ================= */
  publicIndex: async (req, res) => {
    return listKnowledge(req, res, { publicOnly: true });
  },

  /* ================= STORE ================= */
  store: async (req, res) => {
    try {
      let { title, description, about, sections, hidden } = req.body;

      let knowledge = await Knowledge.create({
        title,
        description,
        about,
        hidden: parseBool(hidden, false),
        sections: sections ? JSON.parse(sections) : []
      });

      return res.json(knowledge);

    } catch (e) {
      console.log(e);
      return res.status(500).json({ msg: "Failed to create knowledge" });
    }
  },

  /* ================= SHOW (admin) ================= */
  show: async (req, res) => {
    try {
      let id = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid ID" });
      }

      let knowledge = await Knowledge.findById(id);

      if (!knowledge) {
        return res.status(404).json({ msg: "Not found" });
      }

      return res.json(knowledge);

    } catch (e) {
      return res.status(500).json({ msg: "server error" });
    }
  },

  /* ================= PUBLIC SHOW ================= */
  publicShow: async (req, res) => {
    try {
      let id = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid ID" });
      }

      let knowledge = await Knowledge.findById(id);

      if (!knowledge || knowledge.hidden) {
        return res.status(404).json({ msg: "Not found" });
      }

      return res.json(knowledge);

    } catch (e) {
      return res.status(500).json({ msg: "server error" });
    }
  },

  /* ================= UPDATE ================= */
  update: async (req, res) => {
    try {
      let id = req.params.id;

      let { title, description, about, sections, hidden } = req.body;

      let knowledge = await Knowledge.findById(id);

      if (!knowledge) {
        return res.status(404).json({ msg: "Not found" });
      }

      knowledge.title = title;
      knowledge.description = description;
      knowledge.about = about;

      if (hidden !== undefined) {
        knowledge.hidden = parseBool(hidden, knowledge.hidden);
      }

      if (sections) {
        const newSections = JSON.parse(sections);

        knowledge.sections = newSections.map((sec, index) => ({
          title: sec.title || "",
          description: sec.description || "",
          detail: sec.detail || "",
          photo: sec.photo || knowledge.sections[index]?.photo || null
        }));
      }

      await knowledge.save();

      return res.json(knowledge);

    } catch (e) {
      console.log(e);
      return res.status(500).json({ msg: "server error" });
    }
  },

  /* ================= TOGGLE HIDDEN ================= */
  toggleHidden: async (req, res) => {
    try {
      let id = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid ID" });
      }

      let knowledge = await Knowledge.findById(id);

      if (!knowledge) {
        return res.status(404).json({ msg: "Not found" });
      }

      knowledge.hidden = !knowledge.hidden;
      await knowledge.save();

      return res.json(knowledge);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ msg: "server error" });
    }
  },

  /* ================= DELETE ================= */
  destroy: async (req, res) => {
    try {
      let id = req.params.id;

      let knowledge = await Knowledge.findByIdAndDelete(id);

      if (!knowledge) {
        return res.status(404).json({ msg: "Not found" });
      }

      if (knowledge.photo) {
        await removeFile(__dirname + '/../public' + knowledge.photo);
      }

      knowledge.sections.forEach(sec => {
        if (sec.photo) {
          removeFile(__dirname + '/../public' + sec.photo);
        }
      });

      return res.json(knowledge);

    } catch (e) {
      return res.status(500).json({ msg: "server error" });
    }
  },

  /* ================= MAIN IMAGE ================= */
  upload: async (req, res) => {
    try {
      let knowledge = await Knowledge.findById(req.params.id);

      if (!knowledge) {
        return res.status(404).json({ msg: "Not found" });
      }

      if (req.file && knowledge.photo) {
        await removeFile(__dirname + '/../public' + knowledge.photo);
      }

      if (req.file) {
     knowledge.photo = '/' + req.file.filename;
      }

      await knowledge.save();

      return res.json(knowledge);

    } catch (e) {
      return res.status(500).json({ msg: "server error" });
    }
  },

  /* ================= SECTION IMAGES ================= */
  uploadSections: async (req, res) => {
    try {
      let knowledge = await Knowledge.findById(req.params.id);

      if (!knowledge) {
        return res.status(404).json({ msg: "Not found" });
      }

      if (!knowledge.sections || knowledge.sections.length === 0) {
        return res.json(knowledge);
      }

      let indexes = [];
      try {
        indexes = req.body.indexes ? JSON.parse(req.body.indexes) : [];
      } catch (err) {
        indexes = [];
      }

      req.files.forEach((file, i) => {
        let sectionIndex =
          typeof indexes[i] === "number" ? indexes[i] : i;

        if (knowledge.sections[sectionIndex]) {
          if (knowledge.sections[sectionIndex].photo) {
            removeFile(
              __dirname + "/../public" + knowledge.sections[sectionIndex].photo
            );
          }
          knowledge.sections[sectionIndex].photo = "/" + file.filename;
        }
      });

      await knowledge.save();

      return res.json(knowledge);

    } catch (e) {
      console.log(e);
      return res.status(500).json({ msg: "server error" });
    }
  }

};

module.exports = knowledgecontroller;
