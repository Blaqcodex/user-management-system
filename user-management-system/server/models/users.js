// server/routes/users.js
const router = require('express').Router();
const User = require('../models/user');

router.get('/',           async (req, res) => res.json(await User.find()));
router.post('/',          async (req, res) => res.json(await User.create(req.body)));
router.put('/:id',        async (req, res) => res.json(await User.findByIdAndUpdate(req.params.id, req.body, { new: true })));
router.delete('/:id',     async (req, res) => { await User.findByIdAndDelete(req.params.id); res.json({ ok: true }); });

module.exports = router;