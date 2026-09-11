const  mongoose  = require("mongoose")
const Network = require("../model/Network")
let removeFile = require('../helpers/removeFile')
const { parseBool, excludeHidden } = require('../helpers/visibility')
const {
  CATALOG_SORT,
  ORDER_SORT,
  makeReorderHandler,
  makeTogglePinnedHandler,
  makeMoveHandler,
  makeSwitchHandler,
  makeNormalizeHandler,
  parseOrderField,
} = require('../helpers/catalogOrder')
const {
  resolveListSort,
  getSortMode,
  displayDateForCreate,
  applyDisplayDateUpdate,
} = require('../helpers/catalogSort')

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
    // Admin: order only (cross-page move/switch). Public: pinned first.
    const sort = await resolveListSort('network', { publicOnly })

    let network = await Network.find(query).populate('category','title')
      .skip(skip)
      .limit(limit)
      .sort(sort);

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
    if (!publicOnly) response.sortMode = await getSortMode('network')

    res.set('Cache-Control', 'no-store')
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
         let {title,about,description,category,hidden,pinned,order } = req.body
        let network = await Network.create({
            title,
            about,
            description,
            category,
            hidden: parseBool(hidden, false),
            pinned: parseBool(pinned, false),
            order: parseOrderField(order, 0),
            displayDate: displayDateForCreate(req.body),
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
    if (updateData.pinned !== undefined) {
      updateData.pinned = parseBool(updateData.pinned, false);
    }
    if (updateData.order !== undefined) {
      updateData.order = parseOrderField(updateData.order, 0);
    }
    applyDisplayDateUpdate(updateData, req.body)
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
    togglePinned: makeTogglePinnedHandler(Network, 'Network not found'),
    reorder: makeReorderHandler(Network, ORDER_SORT, 'network items'),
    normalizeOrders: makeNormalizeHandler(Network, ORDER_SORT, 'network items'),
    move: makeMoveHandler(Network, ORDER_SORT, 'network items'),
    switch: makeSwitchHandler(Network, ORDER_SORT, 'network items'),
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
