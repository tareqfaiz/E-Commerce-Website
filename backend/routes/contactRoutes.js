const express = require('express');
const router = express.Router();
const {
  submitContactForm,
  getContactRequests,
  markContactRead,
  replyContact,
} = require('../controllers/contactController');

// POST /contact - submit contact form
router.post('/', submitContactForm);

// GET /contact - get contact requests with pagination
router.get('/', getContactRequests);

// PATCH /contact/:id/read - mark contact request as read/unread
router.patch('/:id/read', markContactRead);

// POST /contact/:id/reply - send reply email and log admin info
router.post('/:id/reply', replyContact);

const { deleteContact } = require('../controllers/contactController');

// DELETE /contact/:id - delete contact request
router.delete('/:id', deleteContact);

module.exports = router;
