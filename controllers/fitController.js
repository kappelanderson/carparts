const Fit = require("../models/fit");
const Part = require("../models/part");
const { body, validationResult } = require("express-validator");


const asyncHandler = require("express-async-handler");

// Display list of all fits.
exports.fit_list = asyncHandler(async (req, res, next) => {
    const allFits = await Fit.find().sort({ name: 1 }).exec();
    res.render("fit_list", {
      title: "Fit List",
      fit_list: allFits,
    });
});

// Display detail page for a specific fit.
exports.fit_detail = asyncHandler(async (req, res, next) => {
 // Get details of fit and all associated books (in parallel)
 const [fit, partsInFit] = await Promise.all([
    Fit.findById(req.params.id).exec(),
    Part.find({ fit: req.params.id }, "title price description photo").exec(),
  ]);
  if (fit === null) {
    // No results.
    const err = new Error("fit not found");
    err.status = 404;
    return next(err);
  }

  res.render("fit_detail", {
    title: "fit Detail",
    fit: fit,
    fit_parts: partsInFit,
  });
});

// Display fit create form on GET.
exports.fit_create_get = asyncHandler(async (req, res, next) => {
  res.render("fit_form", { title: "Create Fit" });
});

// Handle fit create on POST.
exports.fit_create_post = [
  // Validate and sanitize the name field.
  body("name", "fit name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    let photourl = null
    if(req.file){
      photourl = req.file.path.substring(6) || null
    }
    // Create a fit object with escaped and trimmed data.
    const fit = new Fit({ name: req.body.name, photo: photourl });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("fit_form", {
        title: "Create fit",
        fit: fit,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if fit with same name already exists.
      const fitExists = await Fit.findOne({ name: req.body.name }).exec();
      if (fitExists) {
        // fit exists, redirect to its detail page.
        res.redirect(fitExists.url);
      } else {
        await fit.save();
        // New fit saved. Redirect to fit detail page.
        res.redirect(fit.url);
      }
    }
  }),
];



// Display fit delete form on GET.
exports.fit_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of fit and all their books (in parallel)
  const [fit, allpartsByFits] = await Promise.all([
    Fit.findById(req.params.id).exec(),
    Part.find({ fit: req.params.id }, "title summary").exec(),
  ]);

  if (allpartsByFits === null) {
    // No results.
    res.redirect("/catalog/fits");
  }

  res.render("fit_delete", {
    title: "Delete fit",
    fit: fit,
    fit_parts: allpartsByFits,
  });});

// Handle fit delete on POST.
exports.fit_delete_post = asyncHandler(async (req, res, next) => {
 // Get details of fit and all their books (in parallel)
 const [fit, allPartsByFits] = await Promise.all([
  Fit.findById(req.params.id).exec(),
  Part.find({ fit: req.params.id }, "title summary").exec(),
]);

if (allPartsByFits.length > 0) {
  // fit has books. Render in same way as for GET route.
  res.render("fit_delete", {
    title: "Delete fit",
    fit: fit,
    fit_parts: allPartsByFits,
  });
  return;
} else {
  // fit has no books. Delete object and redirect to the list of fits.
  await Fit.findByIdAndDelete(req.body.fitid);
  res.redirect("/catalog/fits");
}
});

// Display fit update form on GET.
exports.fit_update_get = asyncHandler(async (req, res, next) => {
  const fit = await Fit.findOne({ _id: req.params.id  }).exec();
  res.render("fit_form", {
    title: "Update Fit",
    fit: fit,
  });
});

// Handle fit update on POST.
exports.fit_update_post = [
  // Validate and sanitize the name field.
  body("name", "fit name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    const fit = await Fit.findOne({ _id: req.params.id  }).exec();

    // Extract the validation errors from a request.
    const errors = validationResult(req);
    if(req.file){
      fit.photo = req.file.path.substring(6)
    }
    fit.name = req.body.name

    // Create a fit object with escaped and trimmed data.

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("fit_form", {
        title: "Update fit",
        fit: fit,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if fit with same name already exists.

        // New fit saved. Redirect to fit detail page.

        await fit.save()
        res.redirect(fit.url);
      
    }
  }),
];