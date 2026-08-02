const { default: mongoose } = require("mongoose")
const Position = require("../model/Position")
const { parseBool, excludeHidden } = require('../helpers/visibility')

let positioncontroller = {
    index: async (req, res) => {
        let positions = await Position.find().sort({ createdAt: -1 })
        return res.json(positions)
    },
    publicIndex: async (req, res) => {
        let positions = await Position.find(excludeHidden()).sort({ createdAt: -1 })
        return res.json(positions)
    },
    store: async (req, res) => {
        try {
            let { title, description, detail, hidden } = req.body
            let position = await Position.create({
                title,
                description,
                detail,
                hidden: parseBool(hidden, false)
            })
            return res.json(position)
        } catch (e) {
            return res.status(500).json({ msg: "server error" })
        }
    },
    show: async (req, res) => {
        try {
            let id = req.params.id
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ msg: "Invalid Position ID" })
            }
            let position = await Position.findById(id)
            if (!position) {
                return res.status(404).json({ msg: "Position not found" })
            }
            return res.json(position)
        } catch (e) {
            return res.status(500).json({ msg: "server error" })
        }
    },
    publicShow: async (req, res) => {
        try {
            let id = req.params.id
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ msg: "Invalid Position ID" })
            }
            let position = await Position.findById(id)
            if (!position || position.hidden) {
                return res.status(404).json({ msg: "Position not found" })
            }
            return res.json(position)
        } catch (e) {
            return res.status(500).json({ msg: "server error" })
        }
    },
    update: async (req, res) => {
        try {
            let id = req.params.id
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ msg: "Invalid Position ID" })
            }
            let updateData = { ...req.body }
            if (updateData.hidden !== undefined) {
                updateData.hidden = parseBool(updateData.hidden, false)
            }
            const position = await Position.findByIdAndUpdate(
                id,
                updateData,
                {
                    new: true,
                    runValidators: true
                }
            )
            if (!position) {
                return res.status(404).json({ msg: "Position not found" })
            }
            return res.status(200).json(position)
        } catch (e) {
            return res.status(500).json({ msg: "server error" })
        }
    },
    toggleHidden: async (req, res) => {
        try {
            let id = req.params.id
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ msg: "Invalid Position ID" })
            }
            let position = await Position.findById(id)
            if (!position) {
                return res.status(404).json({ msg: "Position not found" })
            }
            position.hidden = !position.hidden
            await position.save()
            return res.json(position)
        } catch (e) {
            return res.status(500).json({ msg: "server error" })
        }
    },
    destroy: async (req, res) => {
        try {
            let id = req.params.id
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ msg: "Invalid Position ID" })
            }
            let position = await Position.findByIdAndDelete(id)
            if (!position) {
                return res.status(404).json({ msg: "Position not found" })
            }
            return res.json(position)
        } catch (e) {
            return res.status(500).json({ msg: "server error" })
        }
    }
}

module.exports = positioncontroller
