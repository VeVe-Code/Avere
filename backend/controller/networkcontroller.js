const  mongoose  = require("mongoose")
const Network = require("../model/Network")
let removeFile = require('../helpers/removeFile')
const { parseBool, excludeHidden } = require('../helpers/visibility')

async function listNetwork(req, res, { publicOnly = false } = {}) {
  try {
      const title = req.query.title || ""; 
      const category = req.query.category || null
              let query = title
    ? { title: { $regex: new RegExp(title, "i") } }
    : {};
    if (category) {
      query.category = category
    }
    if (publicOnly) query = excludeHidden(query);

    let limit = 6;
    let page = parseInt(req.query.page) || 1;

    let skip = (page - 1) * limit;

    let network = await Network.find(query).populate('category','title')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    let totalKnowledge = await Network.countDocuments(query);
    let totalPage = Math.ceil(totalKnowledge / limit);

    let links = {
      nextPage: page < totalPage,
      prevPage: page > 1,
      page: page,
      totalPages: totalPage,
      loopablelinks: []
    };

    for (let i = 1; i <= totalPage; i++) {
      links.loopablelinks.push({
        number: i,
        currentPage: i === page
      });
    }

    let response = {
      data: network,
      links
    };

    return res.json(response);
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
}

let networkcontroller = {
index : async (req, res) => listNetwork(req, res, { publicOnly: false }),
publicIndex : async (req, res) => listNetwork(req, res, { publicOnly: true }),
    store : async(req,res)=>{
       try {
         let {title,about,description,category,hidden } = req.body
        let network = await Network.create({
            title,
            about,
            description,
            category,
            hidden: parseBool(hidden, false)
        })
        return res.json(network)
       } catch (error) {
            return res.status(500).json({msg:"get all network"})
       }
    },
  show: async (req, res) => {
  try {
    let id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid network ID" });
    }

    let network = await Network.findById(id);

    if (!network) {
      return res.status(404).json({ msg: "Network not found" });
    }

    return res.status(200).json(network);

  } catch (error) {
    console.error("Show network error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
},
  publicShow: async (req, res) => {
  try {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid network ID" });
    }
    let network = await Network.findById(id);
    if (!network || network.hidden) {
      return res.status(404).json({ msg: "Network not found" });
    }
    return res.status(200).json(network);
  } catch (error) {
    return res.status(500).json({ msg: "Server error" });
  }
},
     update : async(req,res)=>{
       try {
    let id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid network ID" });
    }

    let updateData = { ...req.body };
    if (updateData.hidden !== undefined) {
      updateData.hidden = parseBool(updateData.hidden, false);
    }
    delete updateData.photo;

    let network = await Network.findByIdAndUpdate(id, updateData, { new: true });
    if (!network) {
      return res.status(404).json({ msg: "Network not found" });
    }

    return res.status(200).json(network);

  } catch (error) {
    console.error("Show network error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
    },
    toggleHidden: async (req, res) => {
      try {
        let id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ msg: "Invalid network ID" });
        }
        let network = await Network.findById(id);
        if (!network) {
          return res.status(404).json({ msg: "Network not found" });
        }
        network.hidden = !network.hidden;
        await network.save();
        return res.json(network);
      } catch (error) {
        return res.status(500).json({ msg: "Server error" });
      }
    },
     destroy :async (req,res)=>{
      try {
    let id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid network ID" });
    }

    let network = await Network.findByIdAndDelete(id);
 if (network?.photo) await removeFile(__dirname + '/../public' + network.photo)
    if (!network) {
      return res.status(404).json({ msg: "Network not found" });
    }

    return res.status(200).json(network);

  } catch (error) {
    console.error("Show network error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
    },
    upload : async(req,res)=>{
        try {
            let id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid network ID" });
    }

    let network = await Network.findByIdAndUpdate(id,{
        photo : "/" + req.file.filename
    }, { new: true });

    if (!network) {
      return res.status(404).json({ msg: "Network not found" });
    }

    return res.status(200).json(network);
        } catch (e) {
          return res.status(500).json({ msg: "Server error" });
        }
    }
}

module.exports = networkcontroller
