const  mongoose  = require("mongoose")
const Network = require("../model/Network")
let removeFile = require('../helpers/removeFile')

let networkcontroller = {
index : async (req, res) => {
  try {
      const title = req.query.title || ""; 
              const query = title
    ? { title: { $regex: new RegExp(title, "i") } } // ✅ Safe regex
    : {};
    let limit = 6;
    let page = parseInt(req.query.page) || 1;

    let skip = (page - 1) * limit;

    let network = await Network.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    let totalKnowledge = await Network.countDocuments();
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
,
    store : async(req,res)=>{
       try {
         let {title,about,description } = req.body
        let network = await Network.create({
            title,
            about,
            description
        })
        return res.json(network)
       } catch (error) {
            return res.satus(500).json({msg:"get all network"})
       }
    },
  show: async (req, res) => {
  try {
    let id = req.params.id;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid network ID" });
    }

    let network = await Network.findById(id);

    if (!network) {
      return res.status(404).json({ msg: "Network not found" });
    }

    return res.status(200).json(network);

  } catch (error) {
    console.error("Show network error:", error);   // 👈 debug helper
    return res.status(500).json({ msg: "Server error" });
  }
}
,
     update : async(req,res)=>{
       try {
    let id = req.params.id;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid network ID" });
    }

    let network = await Network.findByIdAndUpdate(id,{
        ...req.body
    });
   await removeFile(__dirname + '/../public' + network.photo)
    if (!network) {
      return res.status(404).json({ msg: "Network not found" });
    }

    return res.status(200).json(network);

  } catch (error) {
    console.error("Show network error:", error);   // 👈 debug helper
    return res.status(500).json({ msg: "Server error" });
  }
    },
     destroy :async (req,res)=>{
      try {
    let id = req.params.id;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid network ID" });
    }

    let network = await Network.findByIdAndDelete(id);
 await removeFile(__dirname + '/../public' + network.photo)
    if (!network) {
      return res.status(404).json({ msg: "Network not found" });
    }

    return res.status(200).json(network);

  } catch (error) {
    console.error("Show network error:", error);   // 👈 debug helper
    return res.status(500).json({ msg: "Server error" });
  }
    },
    upload : async(req,res)=>{
        try {
            let id = req.params.id;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid network ID" });
    }

    let network = await Network.findByIdAndUpdate(id,{
        photo : "/" + req.file.filename
    });

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