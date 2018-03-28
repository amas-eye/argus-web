let express = require('express');
let router = express.Router();


/* GET home page. */


router.get('/', (req, res) => {
    // res.sendfile("./app/index.html");
    res.status(200).render('app/index', {
        title: 'rdj'
    })
})

module.exports = router;