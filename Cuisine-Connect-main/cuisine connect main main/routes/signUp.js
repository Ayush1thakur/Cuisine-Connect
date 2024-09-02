const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const validatecred = require('../middlewares/validatecredential');
const router = express.Router();

router.post('/signup', validatecred, async (req, res, next) => {
    try {
        let newuser = req.newuser;
        let dataPath = path.join(__dirname, '../data.json');
        let database = JSON.parse(await fs.readFile(dataPath, 'utf-8'));

        database.push(newuser);

        await fs.writeFile(dataPath, JSON.stringify(database, null, 2));
        // res.status(201).send('User is created');
        // res.redirect("/login")

        res.status(201).send(`
        <script>
            alert('User is created successfully');
            window.location.href = "/login";
        </script>
        `);


    } catch (err) {
        next(err);
    }
});

module.exports = router;