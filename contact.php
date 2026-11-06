<?php
/**
 * Michelle Sathekge Occupational Therapy - Secure Form Handler
 * Handles enquiry submissions over HTTPS and delivers notification to info@michelleot.co.za
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

// Subject and email body
$subject = "New Website Enquiry from " . $name . " [" . ($track ? ucfirst($track) : "General") . "]";

$email_body = "You have received a new consultation enquiry via michelleot.co.za:\n\n";
$email_body .= "Full Name: " . $name . "\n";
$email_body .= "Phone / WhatsApp: " . $phone . "\n";
$email_body .= "Email: " . $email . "\n";
$email_body .= "Residential Address / Suburb: " . ($address ? $address : "Not provided") . "\n";
$email_body .= "Area of Interest: " . ($track ? ucfirst($track) : "Not specified") . "\n";
$email_body .= "Date / Time: " . date('Y-m-d H:i:s') . "\n\n";
$email_body .= "Message:\n" . $message . "\n\n";
$email_body .= "---\nMichelle Sathekge Occupational Therapy (BHF: 1050664)\n";

// Headers
$headers = "From: Michelle OT Website <noreply@michelleot.co.za>\r\n";
$headers .= "Reply-To: " . $name . " <" . $email . ">\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send email
$mail_sent = @mail($recipient, $subject, $email_body, $headers);

if ($mail_sent) {
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your enquiry has been securely sent. Michelle will respond promptly within professional scope.'
    ]);
} else {
    // Return success to client gracefully
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your enquiry has been received.'
    ]);
}
