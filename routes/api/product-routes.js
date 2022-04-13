const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');


// PRODUCT ROUTES
// GET ALL
router.get('/', (req, res) => {
  Product.findAll({
    include: [
      { model: Category },
      { model: Tag, through: ProductTag, as: 'tags' },
    ],
  })
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// GET BY ID
router.get('/:id', (req, res) => {
  Product.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      { model: Category },
      { model: Tag, through: ProductTag, as: 'tags' },
    ],
  })
    .then((results) => {
      if (!results) {
        res.status(404).json({
          message: `No match for ${req.params.id}. Please try again with different ID.`,
        });
        return;
      }
      
      res.json(results);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//POST NEW PRODUCT

router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // ADD TAGS
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      res.status(200).json(product);
    })
    .then((tagIDArr) => res.status(200).json(tagIDArr))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// UPDATE PRODUCT BY ID
router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // FIND TAGS TO UPDATE
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      const tagIDArr = productTags.map(({ tag_id }) => tag_id);
      const newTagIDArr = req.body.tagIds
        .filter((tag_id) => !tagIDArr.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // UPDATE TAGS - REMOVE OLD, ADD NEW
      const tagRemoveArr = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);
      return Promise.all([
        ProductTag.destroy({ where: { id: tagRemoveArr } }),
        ProductTag.bulkCreate(newTagIDArr),
      ]);
    })
    .then((tagInsertArr) => res.json(tagInsertArr))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// DELETE ROUTE

router.delete('/:id', (req, res) => {
  Product.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((results) => {
      if (!results) {
        res.status(404).json({
          message: `No match for ${req.params.id}. Please try again with different ID.`,
        });
        return;
      }      
      res.json(results);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
