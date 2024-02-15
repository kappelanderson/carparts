const Part = require("../models/part");
const Fit = require("../models/fit");
const Category = require("../models/category");
const Brand = require("../models/brand");
const { body, validationResult } = require("express-validator");


const asyncHandler = require("express-async-handler");
const part = require("../models/part");

exports.index = asyncHandler(async (req, res, next) => {
    // Get details of books, book instances, authors and part counts (in parallel)
    const [
      numPart,
      numFit,
      numCategory,
      numBrand,
    ] = await Promise.all([
        Part.countDocuments({}).exec(),
        Fit.countDocuments({}).exec(),
        Category.countDocuments({}).exec(),
        Brand.countDocuments({}).exec(),
    ]);
  
    res.render("index", {
      title: "Car Parts",
      part_count: numPart,
      fit_count: numFit,
      category_count: numCategory,
      brand_count: numBrand,
    });
  });
  
// Display list of all parts.
exports.part_list = asyncHandler(async (req, res, next) => {
    const allParts = await Part.find({}, "title description price photo")
    .sort({ title: 1 })
    .exec();

  res.render("part_list", { title: "Part List", part_list: allParts });
});

// Display detail page for a specific part.
exports.part_detail = asyncHandler(async (req, res, next) => {
    
    const part = await Part.findById(req.params.id)
    .populate("brand", "name")
    .populate("fit", "name")
    .populate("category", "name")
    .exec();

    console.log(part.fit[0].name)
  if (part === null) {
    // No results.
    const err = new Error("Part not found");
    err.status = 404;
    return next(err);
  }

  res.render("part_detail", {
    title: "Book:",
    part: part,
  });
});

// Display part create form on GET.
exports.part_create_get = asyncHandler(async (req, res, next) => {
  // Get all authors and genres, which we can use for adding to our book.
  const [allBrands, allFits, allCategories] = await Promise.all([
    Brand.find().sort({ name: 1 }).exec(),
    Fit.find().sort({ name: 1 }).exec(),
    Category.find().sort({ name: 1 }).exec(),

  ]);
  console.log(allBrands)

  res.render("part_form", {
    title: "Create Part",
    brands: allBrands,
    fits: allFits,
    categories: allCategories
  });
});

// Handle part create on POST.
exports.part_create_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },

  // Validate and sanitize fields.
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    let photourl = null
    if(req.file){
      photourl = req.file.path.substring(6) || null
    }
    const part = new Part({
      title: req.body.title,
      description: req.body.description,
      photo: photourl,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
      fit: req.body.fit,
      category: req.body.category || null,
      brand: req.body.brand,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      console.log("Part " + part)
      // Get all authors and genres for form.
      const [allFits, allCategories, allBrands] = await Promise.all([
        Fit.find().sort({ name: 1 }).exec(),
        Category.find().sort({ name: 1 }).exec(),
        Brand.find().sort({ name: 1 }).exec(),

      ]);


      res.render("part_form", {
        title: part.title,
        part: part,        
        fits: allFits,
        categories: allCategories,
        brands: allBrands,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save book.
      await part.save();
      res.redirect(part.url);
    }
  }),
];
// Display part delete form on GET.
exports.part_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of brand and all their books (in parallel)
  const part = await Part.findById(req.params.id).exec()

  if (part === null) {
    // No results.
    res.redirect("/catalog/parts");
  }

  res.render("part_delete", {
    title: "Delete Part",
    part: part,
  });});

// Handle part delete on POST.
exports.part_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of category and all their books (in parallel)
  const part = await Part.findById(req.params.id).exec()
  


    // category has no books. Delete object and redirect to the list of categorys.
    await Part.findByIdAndDelete(req.body.partid);
    res.redirect("/catalog/parts");
  });

// Display part update form on GET.
exports.part_update_get = asyncHandler(async (req, res, next) => {

  const [allFits, allCategories, allBrands, part] = await Promise.all([
    Fit.find().sort({ name: 1 }).exec(),
    Category.find().sort({ name: 1 }).exec(),
    Brand.find().sort({ name: 1 }).exec(),
    Part.findOne({_id: req.params.id}).exec()
  ]);


  res.render("part_form", {
    title: "Update Part",
    part: part,        
    fits: allFits,
    categories: allCategories,
    brands: allBrands,
  });});

// Handle part update on POST.
exports.part_update_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },

  // Validate and sanitize fields.
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {

    const part = await Part.findOne({ _id: req.params.id  }).exec();

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    let photourl = part.photo
    if(req.file){
      photourl = req.file.path.substring(6) || null
    }
    
      part.title = req.body.title
      part.description = req.body.description
      part.photo = photourl
      part.price = req.body.price
      part.number_in_stock = req.body.number_in_stock
      part.fit = req.body.fit
      part.category = req.body.category || null
      part.brand = req.body.brand

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      console.log("Part " + part)
      // Get all authors and genres for form.
      const [allFits, allCategories, allBrands] = await Promise.all([
        Fit.find().sort({ name: 1 }).exec(),
        Category.find().sort({ name: 1 }).exec(),
        Brand.find().sort({ name: 1 }).exec(),

      ]);


      res.render("part_form", {
        title: part.title,
        part: part,        
        fits: allFits,
        categories: allCategories,
        brands: allBrands,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save book.
      await part.save();
      res.redirect(part.url);
    }
  }),
];

[
  // Validate and sanitize the name field.
  body("name", "part name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    const part = await Part.findOne({ _id: req.params.id  }).exec();

    // Extract the validation errors from a request.
    const errors = validationResult(req);
    if(req.file){
      part.photo = req.file.path.substring(6)
    }
    part.name = req.body.name

    // Create a part object with escaped and trimmed data.

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("fit_form", {
        title: "Update fit",
        part: part,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if fit with same name already exists.

        // New fit saved. Redirect to fit detail page.

        await part.save()
        res.redirect(part.url);
      
    }
  }),
];