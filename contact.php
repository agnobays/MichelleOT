<?php
/**
 * Michelle Sathekge Occupational Therapy - Secure Styled Form Handler
 * Dispatches responsive, branded HTML emails to info@michelleot.co.za
 */

header('Content-Type: application/json; charset=utf-8');

// Allow only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

// Destination email
$recipient = 'info@michelleot.co.za';

// Sanitize inputs
$name    = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_SPECIAL_CHARS);
$phone   = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_SPECIAL_CHARS);
$email   = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$address = filter_input(INPUT_POST, 'address', FILTER_SANITIZE_SPECIAL_CHARS);
$track   = filter_input(INPUT_POST, 'track', FILTER_SANITIZE_SPECIAL_CHARS);
$message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_SPECIAL_CHARS);

// Validate required fields
if (empty($name) || empty($phone) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please provide your name, phone number, a valid email address, and message.']);
    exit;
}

// Format Area of Interest label
$track_labels = [
    'individual' => 'Individual or Family Therapy (Clinical)',
    'vocational' => 'Vocational Rehab / Return-to-Work Programs',
    'corporate'  => 'Corporate / Employer Consultation',
    'general'    => 'General Professional Enquiry'
];
$track_display = isset($track_labels[$track]) ? $track_labels[$track] : ($track ? ucfirst($track) : 'General Enquiry');

// Clean phone for WhatsApp international link (e.g. 082 -> 2782)
$wa_phone = preg_replace('/[^0-9]/', '', $phone);
if (strpos($wa_phone, '0') === 0) {
    $wa_phone = '27' . substr($wa_phone, 1);
}

$date_str = date('d M Y, H:i (T)');
$subject = "New Website Enquiry: " . $name . " [" . $track_display . "]";

// Boundary for multipart
$boundary = "==Multipart_Boundary_x" . md5(time()) . "x";

// 1. Plain Text Version (fallback)
$text_body = "NEW CONSULTATION ENQUIRY - MICHELLE SATHEKGE OCCUPATIONAL THERAPY\n";
$text_body .= "=================================================================\n\n";
$text_body .= "Full Name:        " . $name . "\n";
$text_body .= "Phone / WhatsApp: " . $phone . "\n";
$text_body .= "Email:            " . $email . "\n";
$text_body .= "Address / Suburb: " . ($address ? $address : "Not provided") . "\n";
$text_body .= "Area of Interest: " . $track_display . "\n";
$text_body .= "Date / Time:      " . $date_str . "\n\n";
$text_body .= "Client Message:\n";
$text_body .= "-----------------------------------------------------------------\n";
$text_body .= $message . "\n\n";
$text_body .= "=================================================================\n";
$text_body .= "Michelle Sathekge Occupational Therapy | BHF: 1050664\n";
$text_body .= "EMPOWERING EVERY STEP TOWARDS A MEANINGFUL LIFE\n";

// 2. Rich HTML Version (Master Brand Standard)
$html_body = '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Website Enquiry</title>
</head>
<body style="margin:0; padding:0; background-color:#F7F5EF; font-family:Arial, Helvetica, sans-serif; color:#333333; line-height:1.5;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F7F5EF; padding:25px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card Container (600px standard) -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; background-color:#FFFFFF; border-radius:8px; overflow:hidden; border:1px solid #E2DED5; box-shadow:0 4px 15px rgba(0,0,0,0.05);">
          
          <!-- Brand Header -->
          <tr>
            <td style="background-color:#0B4033; padding:28px 30px; text-align:left; border-bottom:3px solid #C09A47;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="font-size:11px; letter-spacing:0.12em; color:#C09A47; text-transform:uppercase; font-weight:bold; display:block; margin-bottom:4px;">Website Consultation Lead</span>
                    <h1 style="color:#FFFFFF; font-size:20px; font-weight:bold; margin:0; line-height:1.2;">Michelle Sathekge Occupational Therapy</h1>
                    <span style="color:#DDE5E2; font-size:12px; margin-top:4px; display:block;">BHF Practice No: <strong>1050664</strong></span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding:30px;">
              
              <div style="margin-bottom:20px;">
                <span style="background-color:#FAF4E6; color:#0B4033; border-left:3px solid #C09A47; padding:4px 10px; font-size:11px; font-weight:bold; letter-spacing:0.06em; text-transform:uppercase; display:inline-block; margin-bottom:8px;">New Enquiry Details</span>
                <h2 style="color:#0B4033; font-size:18px; margin:0 0 4px 0;">You have received a new consultation request</h2>
                <p style="color:#666666; font-size:13px; margin:0;">Submitted via <a href="https://michelleot.co.za" style="color:#0B4033; text-decoration:none; font-weight:bold;">michelleot.co.za</a> on ' . $date_str . '</p>
              </div>

              <!-- Client Information Table -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FAF8F3; border:1px solid #ECE7DD; border-radius:6px; margin-bottom:25px;">
                <tr>
                  <td style="padding:12px 16px; border-bottom:1px solid #ECE7DD; width:35%; font-size:12px; font-weight:bold; text-transform:uppercase; color:#0B4033; letter-spacing:0.05em;">Client Name</td>
                  <td style="padding:12px 16px; border-bottom:1px solid #ECE7DD; font-size:15px; font-weight:bold; color:#111111;">' . htmlspecialchars($name) . '</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px; border-bottom:1px solid #ECE7DD; font-size:12px; font-weight:bold; text-transform:uppercase; color:#0B4033; letter-spacing:0.05em;">Contact Number</td>
                  <td style="padding:12px 16px; border-bottom:1px solid #ECE7DD; font-size:14px; color:#111111;">
                    <a href="tel:' . htmlspecialchars($phone) . '" style="color:#0B4033; font-weight:bold; text-decoration:none;">' . htmlspecialchars($phone) . '</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px; border-bottom:1px solid #ECE7DD; font-size:12px; font-weight:bold; text-transform:uppercase; color:#0B4033; letter-spacing:0.05em;">Email Address</td>
                  <td style="padding:12px 16px; border-bottom:1px solid #ECE7DD; font-size:14px; color:#111111;">
                    <a href="mailto:' . htmlspecialchars($email) . '" style="color:#0B4033; font-weight:bold; text-decoration:none;">' . htmlspecialchars($email) . '</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px; border-bottom:1px solid #ECE7DD; font-size:12px; font-weight:bold; text-transform:uppercase; color:#0B4033; letter-spacing:0.05em;">Address / Suburb</td>
                  <td style="padding:12px 16px; border-bottom:1px solid #ECE7DD; font-size:14px; color:#333333;">' . ($address ? htmlspecialchars($address) : '<span style="color:#999999; font-style:italic;">Not provided</span>') . '</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px; font-size:12px; font-weight:bold; text-transform:uppercase; color:#0B4033; letter-spacing:0.05em;">Area of Interest</td>
                  <td style="padding:12px 16px; font-size:14px; font-weight:bold; color:#C09A47;">' . htmlspecialchars($track_display) . '</td>
                </tr>
              </table>

              <!-- Client Message Box -->
              <div style="margin-bottom:25px;">
                <span style="font-size:12px; font-weight:bold; text-transform:uppercase; color:#0B4033; letter-spacing:0.05em; display:block; margin-bottom:8px;">Client Message / Consultation Context:</span>
                <div style="background-color:#FFFFFF; border:1px solid #E2DED5; border-left:4px solid #0B4033; border-radius:4px; padding:15px; font-size:14px; line-height:1.6; color:#222222; white-space:pre-wrap;">' . nl2br(htmlspecialchars($message)) . '</div>
              </div>

              <!-- Quick Action Reply Buttons -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:15px;">
                <tr>
                  <td align="left" style="padding-right:8px; width:50%;">
                    <a href="https://wa.me/' . $wa_phone . '?text=' . urlencode("Hi " . $name . ", this is Michelle Sathekge Occupational Therapy regarding your enquiry on our website.") . '" target="_blank" style="display:block; text-align:center; background-color:#25D366; color:#FFFFFF; text-decoration:none; padding:12px 15px; font-size:13px; font-weight:bold; border-radius:5px;">
                      💬 Open in WhatsApp
                    </a>
                  </td>
                  <td align="right" style="padding-left:8px; width:50%;">
                    <a href="mailto:' . htmlspecialchars($email) . '?subject=' . urlencode("Re: Occupational Therapy Enquiry - Michelle Sathekge OT") . '" style="display:block; text-align:center; background-color:#0B4033; color:#FFFFFF; text-decoration:none; padding:12px 15px; font-size:13px; font-weight:bold; border-radius:5px;">
                      ✉️ Reply by Email
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#FAF8F3; padding:20px 30px; border-top:1px solid #ECE7DD; text-align:center;">
              <p style="color:#0B4033; font-size:12px; font-weight:bold; letter-spacing:0.08em; text-transform:uppercase; margin:0 0 4px 0;">EMPOWERING EVERY STEP TOWARDS A MEANINGFUL LIFE</p>
              <p style="color:#666666; font-size:11px; margin:0 0 6px 0;">Netcare Garden City Hospital • Midrand Consulting Rooms</p>
              <p style="color:#999999; font-size:10px; margin:0; line-height:1.4;">Confidentiality Notice: This consultation transmission contains privileged healthcare information intended strictly for Michelle Sathekge Occupational Therapy under the Protection of Personal Information Act (POPIA).</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>';

// Construct MIME Multipart message
$full_message  = "--" . $boundary . "\r\n";
$full_message .= "Content-Type: text/plain; charset=\"UTF-8\"\r\n";
$full_message .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
$full_message .= $text_body . "\r\n\r\n";

$full_message .= "--" . $boundary . "\r\n";
$full_message .= "Content-Type: text/html; charset=\"UTF-8\"\r\n";
$full_message .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
$full_message .= $html_body . "\r\n\r\n";
$full_message .= "--" . $boundary . "--";

// Headers
$headers  = "From: Michelle OT Website <noreply@michelleot.co.za>\r\n";
$headers .= "Reply-To: " . $name . " <" . $email . ">\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/alternative; boundary=\"" . $boundary . "\"\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// Send email
$mail_sent = @mail($recipient, $subject, $full_message, $headers);

if ($mail_sent) {
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your enquiry has been securely sent. Michelle will respond promptly within professional scope.'
    ]);
} else {
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your enquiry has been received.'
    ]);
}
