let mongoose = require('mongoose');
let Schema = mongoose.Schema

let KnowledgeScgema = new Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  about: {
    type: String,
    required: true
  },

  photo: {
    type: String
  },

  // when true, post is hidden from public site (admin still sees it)
  hidden: {
    type: Boolean,
    default: false
  },
  pinned: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  displayDate: {
    type: Date,
    default: Date.now
  },

  // optional content blocks (image + text), same layout as main on detail page
  sections: [
    {
      title: {
        type: String,
        default: ""
      },
      description: {
        type: String,
        default: ""
      },
      detail: {
        type: String,
        default: ""
      },
      photo: {
        type: String
      }
    }
  ]

}, {
  timestamps: true
});
module.exports = mongoose.model("Knowledge",KnowledgeScgema);
