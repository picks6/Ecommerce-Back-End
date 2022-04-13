const router = require('express').Router();
const res = require('express/lib/response');
const { Category, Product } = require('../../models');


//CATEGORY ROUTES
//GET ALL

router.get('/', (req, res) => {
  Category.findAll({
    include: [{ model: Product }],
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
  Category.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Product,
      },
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

//Update Category

router.post('/', (req, res) => {
  Category.create({
    category_name: req.body.category_name,
  })
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//Update Route

router.put('/:id', (req, res) => {
  Category.update(
    {
      category_name: req.body.category_name,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
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

// Delete by ID
router.delete('/:id', (req, res) => {
  Category.destroy({
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
