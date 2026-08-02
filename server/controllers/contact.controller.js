const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const sendEmail = require("../services/email.service");

const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    throw new ApiError(400, "All fields are required");
  }

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body{
        margin:0;
        padding:20px;
        background:#f4f7fb;
        font-family:Arial,Helvetica,sans-serif;
      }

      .container{
        max-width:600px;
        margin:auto;
        background:#ffffff;
        border-radius:10px;
        overflow:hidden;
        box-shadow:0 2px 10px rgba(0,0,0,.08);
      }

      .header{
        background:#16a34a;
        color:#fff;
        text-align:center;
        padding:20px;
      }

      .content{
        padding:30px;
      }

      .card{
        background:#f8fafc;
        border-radius:8px;
        padding:18px;
        margin-bottom:20px;
      }

      .card p{
        margin:10px 0;
      }

      .message{
        background:#eefaf2;
        border-left:4px solid #16a34a;
        padding:15px;
        border-radius:6px;
        white-space:pre-wrap;
      }

      .footer{
        background:#f8fafc;
        text-align:center;
        color:#666;
        font-size:13px;
        padding:18px;
      }
    </style>
  </head>

  <body>

    <div class="container">

      <div class="header">
        <h2>📩 New Contact Form Submission</h2>
        <p>PharmaPlus</p>
      </div>

      <div class="content">

        <div class="card">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
        </div>

        <h3>Message</h3>

        <div class="message">
${message}
        </div>

      </div>

      <div class="footer">
        This email was automatically generated from the PharmaPlus Contact Form.
      </div>

    </div>

  </body>
  </html>
  `;

  await sendEmail(
    process.env.ADMIN_EMAIL,
    `📩 New Contact Form Submission from ${name}`,
    htmlContent
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Message sent successfully"));
});

module.exports = { submitContactForm };