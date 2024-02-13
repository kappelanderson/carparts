const express = require("express");
const router = express.Router();
const multer  = require('multer')

const fitsuploads = multer({ dest: 'public/images/fitsupload' })

const partsuploads = multer({ dest: 'public/images/partsupload' })


// Require controller modules.
const part_controller = require("../controllers/partController");
const category_controller = require("../controllers/categoryController");
const fit_controller = require("../controllers/fitController");
const brand_controller = require("../controllers/brandcontroller");
/// part ROUTES ///

// GET catalog home page.
router.get("/", part_controller.index);

// GET request for creating a part. NOTE This must come before routes that display part (uses id).
router.get("/part/create", part_controller.part_create_get);

// POST request for creating part.
router.post("/part/create", partsuploads.single('photo'), part_controller.part_create_post);

// GET request to delete part.
router.get("/part/:id/delete", part_controller.part_delete_get);

// POST request to delete part.
router.post("/part/:id/delete", part_controller.part_delete_post);

// GET request to update part.
router.get("/part/:id/update", part_controller.part_update_get);

// POST request to update part.
router.post("/part/:id/update", part_controller.part_update_post);

// GET request for one part.
router.get("/part/:id", part_controller.part_detail);

// GET request for list of all part items.
router.get("/parts", part_controller.part_list);

/// category ROUTES ///

// GET request for creating category. NOTE This must come before route for id (i.e. display category).
router.get("/category/create", category_controller.category_create_get);

// POST request for creating category.
router.post("/category/create", category_controller.category_create_post);

// GET request to delete category.
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete category.
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request to update category.
router.get("/category/:id/update", category_controller.category_update_get);

// POST request to update category.
router.post("/category/:id/update", category_controller.category_update_post);

// GET request for one category.
router.get("/category/:id", category_controller.category_detail);

// GET request for list of all categorys.
router.get("/categories", category_controller.category_list);

/// brand ROUTES ///

// GET request for creating a brand. NOTE This must come before route that displays brand (uses id).
router.get("/brand/create", brand_controller.brand_create_get);

//POST request for creating brand.
router.post("/brand/create", brand_controller.brand_create_post);

// GET request to delete brand.
router.get("/brand/:id/delete", brand_controller.brand_delete_get);

// POST request to delete brand.
router.post("/brand/:id/delete", brand_controller.brand_delete_post);

// GET request to update brand.
router.get("/brand/:id/update", brand_controller.brand_update_get);

// POST request to update brand.
router.post("/brand/:id/update", brand_controller.brand_update_post);

// GET request for one brand.
router.get("/brand/:id", brand_controller.brand_detail);

// GET request for list of all brand.
router.get("/brands", brand_controller.brand_list);

/// fit ROUTES ///

// GET request for creating a fit. NOTE This must come before route that displays fit (uses id).
router.get(
  "/fit/create",
  fit_controller.fit_create_get,
);

// POST request for creating fit.
router.post(
  "/fit/create", fitsuploads.single('photo'),
  fit_controller.fit_create_post,
);
// GET request to delete fit.
router.get(
  "/fit/:id/delete",
  fit_controller.fit_delete_get,
);

// POST request to delete fit.
router.post(
  "/fit/:id/delete",
  fit_controller.fit_delete_post,
);

// GET request to update fit.
router.get(
  "/fit/:id/update",
  fit_controller.fit_update_get,
);

// POST request to update fit.
router.post(
  "/fit/:id/update",
  fit_controller.fit_update_post,
);

// GET request for one fit.
router.get("/fit/:id", fit_controller.fit_detail);

// GET request for list of all fit.
router.get("/fits", fit_controller.fit_list);

module.exports = router;
