const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// TAGS ROUTES
// GET ALL
router.get('/', (req, res) => {
  Tag.findAll({
    include: [{ model: Product, through: ProductTag, as: 'products' }],
  })
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//GET BY ID

router.get('/:id', (req, res) => {
  Tag.findOne({
    where: {
      id: req.params.id,
    },
    include: [{ model: Product, through: ProductTag, as: 'products' }],
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

// CREATE NEW TAG

router.post('/', (req, res) => {
  Tag.create({
    tag_name: req.body.tag_name,
  })
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// UPDATE TAG

router.put('/:id', (req, res) => {
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((results) => {
      if (!results[0]) {
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

// DELETE TAG

router.delete('/:id', (req, res) => {
  Tag.destroy({
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
