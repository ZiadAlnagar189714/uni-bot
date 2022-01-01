const express = require("express");
const router = express.Router();
const page = require("../controllers/page")
const auth = require("../controllers/auth")
const admin = require('../controllers/admin')
const tour = require('../controllers/tours')


// Get Page
router.route('/').get(page.index);

router.route('/index').get(page.index);

router.route('/about').get(page.about);

router.route('/blog').get(page.blog);

router.route('/contact').get(page.contact);

router.route('/course').get(page.course);

router.route('/login').get(auth.login);

router.route('/register').get(auth.signup);

router.route('/login').post(auth.authenticate);

router.route('/register').post(auth.store);

router.route('/logout').post(auth.logout)

router.route('/profile').get((req, res) => {
    res.render('profile')
});

router.route('/admin').get((req, res) => {
    admin.getAllBotUsers()
})

router.route('/chat').get(page.chat)

router.route('/tour').post(tour.addStudentToTour);

module.exports = router;