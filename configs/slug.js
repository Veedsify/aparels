const slugify = require("slugify");


const slugOptions = {
    lower: true,
    strict: true,
    replacement: '_'
};


function createSlug(text) {
    const slug = slugify(text, slugOptions);
    return slug
}

module.exports = createSlug