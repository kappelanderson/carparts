const Brand = require("../models/brand");
const Part = require("../models/part");
const { body, validationResult } = require("express-validator");


const asyncHandler = require("express-async-handler");

// Display list of all brands.
exports.brand_list = asyncHandler(async (req, res, next) => {
    const allBrands = await Brand.find().sort({ name: 1 }).exec();
    res.render("brand_list", {
      title: "Brand List",
      brand_list: allBrands,
    });
});

// Display detail page for a specific brand.
exports.brand_detail = asyncHandler(async (req, res, next) => {
 // Get details of genre and all associated books (in parallel)
 const [brand, partInBrand] = await Promise.all([
    Brand.findById(req.params.id).exec(),
    Part.find({ brand: req.params.id }, "title price description photo").exec(),
  ]);
  if (brand === null) {
    // No results.
    const err = new Error("Brand not found");
    err.status = 404;
    return next(err);
  }

  res.render("brand_detail", {
    title: "brand Detail",
    brand: brand,
    brand_parts: partInBrand,
  });
});

// Display brand create form on GET.
exports.brand_create_get = asyncHandler(async (req, res, next) => {
  res.render("brand_form", { title: "Create Brand" });
});

// Handle brand create on POST.
exports.brand_create_post = [  body("name", "Part name must contain at least 3 characters")
.trim()
.isLength({ min: 3 })
.escape(),

// Process request after validation and sanitization.
asyncHandler(async (req, res, next) => {
// Extract the validation errors from a request.
const errors = validationResult(req);

// Create a brand object with escaped and trimmed data.
const brand = new Brand({ name: req.body.name });

if (!errors.isEmpty()) {
  // There are errors. Render the form again with sanitized values/error messages.
  res.render("brand_form", {
    title: "Create brand",
    brand: brand,
    errors: errors.array(),
  });
  return;
} else {
  // Data from form is valid.
  // Check if part with same name already exists.
  const brandExists = await Brand.findOne({ name: req.body.name }).exec();
  if (brandExists) {
    // part exists, redirect to its detail page.
    res.redirect(brandExists.url);
  } else {
    await brand.save();
    // New part saved. Redirect to part detail page.
    res.redirect(brand.url);
  }
}
}),
]

// Display brand delete form on GET.
exports.brand_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: brand delete GET");
});

// Handle brand delete on POST.
exports.brand_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: brand delete POST");
});

// Display brand update form on GET.
exports.brand_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: brand update GET");
});

// Handle brand update on POST.
exports.brand_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: brand update POST");
});
