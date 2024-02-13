const Category = require("../models/category");
const Part = require("../models/part");
const { body, validationResult } = require("express-validator");


const asyncHandler = require("express-async-handler");

// Display list of all categorys.
exports.category_list = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find().sort({ name: 1 }).exec();
    res.render("category_list", {
      title: "Category List",
      category_list: allCategories,
    });
});

// Display detail page for a specific category.
exports.category_detail = asyncHandler(async (req, res, next) => {
 // Get details of genre and all associated books (in parallel)
 const [category, partInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Part.find({ category: req.params.id }, "title price description photo").exec(),
  ]);
  if (category === null) {
    // No results.
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_detail", {
    title: "Category Detail",
    category: category,
    category_parts: partInCategory,
  });
});

// Display category create form on GET.
exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render("category_form", { title: "Create Category" });
});

// Handle category create on POST.
exports.category_create_post = [  body("name", "Part name must contain at least 3 characters")
.trim()
.isLength({ min: 3 })
.escape(),

// Process request after validation and sanitization.
asyncHandler(async (req, res, next) => {
// Extract the validation errors from a request.
const errors = validationResult(req);

// Create a brand object with escaped and trimmed data.
const category = new Category({ name: req.body.name });

if (!errors.isEmpty()) {
  // There are errors. Render the form again with sanitized values/error messages.
  res.render("category_form", {
    title: "Create Category",
    category: category,
    errors: errors.array(),
  });
  return;
} else {
  // Data from form is valid.
  // Check if part with same name already exists.
  const categoryExists = await Category.findOne({ name: req.body.name }).exec();
  if (categoryExists) {
    // part exists, redirect to its detail page.
    res.redirect(categoryExists.url);
  } else {
    await category.save();
    // New part saved. Redirect to part detail page.
    res.redirect(category.url);
  }
}
}),
]

// Display category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: category delete GET");
});

// Handle category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: category delete POST");
});

// Display category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: category update GET");
});

// Handle category update on POST.
exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: category update POST");
});
