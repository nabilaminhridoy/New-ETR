import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Default email templates
const defaultTemplates = [
  // Admin templates
  {
    name: 'admin_id_verification_request',
    displayName: 'ID Verification Request',
    category: 'admin',
    subject: 'New ID Verification Request - {{userName}}',
    title: 'New ID Verification Request',
    body: '<p>A new ID verification request has been submitted by <strong>{{userName}}</strong> ({{userEmail}}).</p><p><strong>Document Type:</strong> {{documentType}}</p><p><strong>Submitted Date:</strong> {{submittedDate}}</p><p>Please review and verify the documents in the admin panel.</p>',
    footerText: 'This is an automated notification. Please do not reply to this email.',
    copyrightText: '© {{year}} EidTicketResell. All rights reserved.',
    variables: ['userName', 'userEmail', 'documentType', 'submittedDate', 'year'],
  },
  {
    name: 'admin_new_ticket_listing',
    displayName: 'New Ticket Listing',
    category: 'admin',
    subject: 'New Ticket Listed - {{routeName}}',
    title: 'New Ticket Listing',
    body: '<p>A new ticket has been listed on the platform:</p><ul><li><strong>Route:</strong> {{routeName}}</li><li><strong>Travel Date:</strong> {{travelDate}}</li><li><strong>Price:</strong> {{sellingPrice}} BDT</li><li><strong>Seller:</strong> {{sellerName}} ({{sellerEmail}})</li></ul><p>Please review and approve the ticket in the admin panel.</p>',
    footerText: 'This is an automated notification. Please do not reply to this email.',
    copyrightText: '© {{year}} EidTicketResell. All rights reserved.',
    variables: ['routeName', 'travelDate', 'sellingPrice', 'sellerName', 'sellerEmail', 'year'],
  },
  {
    name: 'admin_ticket_sold',
    displayName: 'Ticket Sold',
    category: 'admin',
    subject: 'Ticket Sold - #{{ticketId}}',
    title: 'Ticket Successfully Sold',
    body: '<p>Great news! A ticket has been sold on the platform:</p><ul><li><strong>Ticket ID:</strong> #{{ticketId}}</li><li><strong>Buyer:</strong> {{buyerName}} ({{buyerEmail}})</li><li><strong>Amount:</strong> {{totalAmount}} BDT</li><li><strong>Payment Method:</strong> {{paymentMethod}}</li></ul><p>The seller has been notified and the funds will be processed according to the payout policy.</p>',
    footerText: 'This is an automated notification. Please do not reply to this email.',
    copyrightText: '© {{year}} EidTicketResell. All rights reserved.',
    variables: ['ticketId', 'buyerName', 'buyerEmail', 'totalAmount', 'paymentMethod', 'year'],
  },
  {
    name: 'admin_ticket_report_submitted',
    displayName: 'Ticket Report Submitted',
    category: 'admin',
    subject: 'New Report Submitted - Ticket #{{ticketId}}',
    title: 'New Ticket Report',
    body: '<p>A new report has been submitted for a ticket:</p><ul><li><strong>Ticket ID:</strong> #{{ticketId}}</li><li><strong>Reporter:</strong> {{userName}} ({{userEmail}})</li><li><strong>Reason:</strong> {{reportReason}}</li><li><strong>Description:</strong> {{reportDescription}}</li><li><strong>Reported Date:</strong> {{reportedDate}}</li></ul><p>Please review the report and take appropriate action.</p>',
    footerText: 'This is an automated notification. Please do not reply to this email.',
    copyrightText: '© {{year}} EidTicketResell. All rights reserved.',
    variables: ['ticketId', 'userName', 'userEmail', 'reportReason', 'reportDescription', 'reportedDate', 'year'],
  },
  {
    name: 'admin_payment_received',
    displayName: 'Payment Received',
    category: 'admin',
    subject: 'Payment Received - #{{transactionId}}',
    title: 'New Payment Received',
    body: '<p>A new payment has been received:</p><ul><li><strong>Transaction ID:</strong> #{{transactionId}}</li><li><strong>Amount:</strong> {{totalAmount}} BDT</li><li><strong>Payment Method:</strong> {{paymentMethod}}</li><li><strong>Buyer:</strong> {{buyerName}} ({{buyerEmail}})</li><li><strong>Ticket Price:</strong> {{ticketPrice}} BDT</li><li><strong>Platform Fee:</strong> {{platformFee}} BDT</li></ul><p>The payment has been processed successfully.</p>',
    footerText: 'This is an automated notification. Please do not reply to this email.',
    copyrightText: '© {{year}} EidTicketResell. All rights reserved.',
    variables: ['transactionId', 'totalAmount', 'paymentMethod', 'buyerName', 'buyerEmail', 'ticketPrice', 'platformFee', 'year'],
  },
  {
    name: 'admin_seller_withdrawal_request',
    displayName: 'Seller Withdrawal Request',
    category: 'admin',
    subject: 'Withdrawal Request - {{sellerName}}',
    title: 'New Withdrawal Request',
    body: '<p>A new withdrawal request has been submitted:</p><ul><li><strong>Seller:</strong> {{sellerName}} ({{sellerEmail}})</li><li><strong>Amount:</strong> {{amount}} BDT</li><li><strong>Withdrawal Method:</strong> {{withdrawalMethod}}</li><li><strong>Account Details:</strong> {{accountDetails}}</li><li><strong>Request Date:</strong> {{requestDate}}</li></ul><p>Please review and process the withdrawal in the admin panel.</p>',
    footerText: 'This is an automated notification. Please do not reply to this email.',
    copyrightText: '© {{year}} EidTicketResell. All rights reserved.',
    variables: ['sellerName', 'sellerEmail', 'amount', 'withdrawalMethod', 'accountDetails', 'requestDate', 'year'],
  },
  {
    name: 'admin_seller_payout_processed',
    displayName: 'Seller Payout Processed',
    category: 'admin',
    subject: 'Payout Processed - {{sellerName}}',
    title: 'Payout Successfully Processed',
    body: '<p>A seller payout has been successfully processed:</p><ul><li><strong>Seller:</strong> {{sellerName}} ({{sellerEmail}})</li><li><strong>Amount:</strong> {{amount}} BDT</li><li><strong>Transaction Reference:</strong> {{transactionRef}}</li><li><strong>Processed Date:</strong> {{processedDate}}</li></ul><p>The seller has been notified of the successful payout.</p>',
    footerText: 'This is an automated notification. Please do not reply to this email.',
    copyrightText: '© {{year}} EidTicketResell. All rights reserved.',
    variables: ['sellerName', 'sellerEmail', 'amount', 'transactionRef', 'processedDate', 'year'],
  },
  // User templates
  {
    name: 'user_registration_verification',
    displayName: 'Email Verification',
    category: 'user',
    subject: 'Verify Your Email Address - EidTicketResell',
    title: 'Welcome to EidTicketResell!',
    body: '<p>Thank you for registering with EidTicketResell!</p><p>Please verify your email address by clicking the button below:</p><p><a href="{{verificationLink}}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Verify Email</a></p><p>This link will expire in {{expirationTime}}.</p><p>If you did not create this account, please ignore this email.</p>',
    footerText: 'If you have any questions, feel free to contact our support team.',
    copyrightText: '© {{year}} EidTicketResell. All rights reserved.',
    variables: ['userName', 'verificationLink', 'expirationTime', 'year'],
  },
  {
    name: 'user_password_reset',
    displayName: 'Password Reset',
    category: 'user',
    subject: 'Reset Your Password - EidTicketResell',
    title: 'Password Reset Request',
    body: '<p>We received a request to reset your password for your EidTicketResell account.</p><p>Click the button below to reset your password:</p><p><a href="{{resetLink}}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a></p><p>This link will expire in {{expirationTime}}.</p><p>If you did not request this password reset, please ignore this email.</p>',
    footerText: 'For security reasons, please never share your password with anyone.',
    copyrightText: '© {{year}} EidTicketResell. All rights reserved.',
    variables: ['userName', 'resetLink', 'expirationTime', 'year'],
  },
  {
    name: 'user_welcome',
    displayName: 'Welcome Email',
    category: 'user',
    subject: 'Welcome to EidTicketResell! - {{userName}}',
    title: 'Welcome to EidTicketResell!',
    body: '<p>Dear <strong>{{userName}}</strong>,</p><p>Welcome to EidTicketResell - your trusted platform for buying and selling travel tickets!</p><p><strong>What you can do:</strong></p><ul><li>🎫 <strong>Buy Tickets:</strong> Find great deals on bus, train, launch, and air tickets</li><li>💰 <strong>Sell Tickets:</strong> Sell your unused tickets and earn money</li><li>🔒 <strong>Safe & Secure:</strong> All transactions are protected</li></ul><p>Get started by exploring our ticket listings or post your own tickets for sale!</p><p><a href="{{listingLink}}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Browse Tickets</a></p><p>If you have any questions, our support team is here to help!</p>',
    footerText: 'Thank you for choosing EidTicketResell. Happy travels!',
    copyrightText: '© {{year}} EidTicketResell. All rights reserved.',
    variables: ['userName', 'listingLink', 'year'],
  },
  {
    name: 'user_id_verification_approved',
    displayName: 'ID Verification Approved',
    category: 'user',
    subject: 'ID Verification Approved - EidTicketResell',
    title: 'Great News! Your ID is Verified',
    body: '<p>Dear <strong>{{userName}}</strong>,</p><p>Your {{documentType}} verification has been <strong>approved</strong>!</p><p>You now have full access to all features on EidTicketResell:</p><ul><li>✅ Sell unlimited tickets</li><li>✅ Withdraw earnings to your account</li><li>✅ Access premium features</li></ul><p>Start buying or selling tickets today!</p><p><a href="{{dashboardLink}}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Go to Dashboard</a></p>',
    footerText: 'Thank you for verifying your identity with EidTicketResell.',
    copyrightText: '© {{year}} EidTicketResell. All rights reserved.',
    variables: ['userName', 'documentType', 'dashboardLink', 'year'],
  },
  {
    name: 'user_id_verification_rejected',
    displayName: 'ID Verification Rejected',
    category: 'user',
    subject: 'ID Verification Update - EidTicketResell',
    title: 'ID Verification Update',
    body: '<p>Dear <strong>{{userName}}</strong>,</p><p>Your {{documentType}} verification could not be approved.</p><p><strong>Reason:</strong> {{rejectionReason}}</p><p>Please review the requirements and resubmit your verification documents:</p><ul><li>Make sure the document is clear and readable</li><li>Ensure all details are visible</li><li>Use a valid government-issued ID</li></ul><p><a href="{{verificationLink}}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Resubmit Verification</a></p><p>If you believe this is an error, please contact our support team.</p>',
    footerText: 'Our support team is here to help you with any questions.',
    copyrightText: '© {{year}} EidTicketResell. All rights reserved.',
    variables: ['userName', 'documentType', 'rejectionReason', 'verificationLink', 'year'],
  },
  {
    name: 'user_ticket_pending_review',
    displayName: 'Ticket Pending Review',
    category: 'user',
    subject: 'Ticket Under Review - #{{ticketId}}',
    title: 'Your Ticket is Under Review',
    body: '<p>Dear <strong>{{sellerName}}</strong>,</p><p>Your ticket listing <strong>#{{ticketId}}</strong> has been submitted and is currently under review.</p><p><strong>Ticket Details:</strong></p><ul><li><strong>Route:</strong> {{routeName}}</li><li><strong>Travel Date:</strong> {{travelDate}}</li><li><strong>Price:</strong> {{sellingPrice}} BDT</li></ul><p>Our team will review your ticket within 24 hours. You will receive a notification once it is approved.</p><p><a href="{{editLink}}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Ticket</a></p>',
    footerText: 'Thank you for using EidTicketResell!',
    copyrightText: '© {{year}} EidTicketResell. All rights reserved.',
    variables: ['sellerName', 'ticketId', 'routeName', 'travelDate', 'sellingPrice', 'editLink', 'year'],
  },
  {
    name: 'user_ticket_approved',
    displayName: 'Ticket Approved',
    category: 'user',
    subject: 'Ticket Approved! - #{{ticketId}}',
    title: 'Your Ticket is Now Live!',
    body: '<p>Great news, <strong>{{sellerName}}</strong>!</p><p>Your ticket <strong>#{{ticketId}}</strong> has been approved and is now live on the platform.</p><p><strong>Ticket Details:</strong></p><ul><li><strong>Route:</strong> {{routeName}}</li><li><strong>Travel Date:</strong> {{travelDate}}</li><li><strong>Price:</strong> {{sellingPrice}} BDT</li></ul><p>Buyers can now view and purchase your ticket. You will be notified when it sells!</p><p><a href="{{ticketLink}}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Your Ticket</a></p>',
    footerText: 'Good luck with your sale!',
    copyrightText: '© {{year}} EidTicketResell. All rights reserved.',
    variables: ['sellerName', 'ticketId', 'routeName', 'travelDate', 'sellingPrice', 'ticketLink', 'year'],
  },
  {
    name: 'user_ticket_expiring',
    displayName: 'Ticket Expiring Soon',
    category: 'user',
    subject: 'Ticket Expiring Soon - #{{ticketId}}',
    title: 'Your Ticket is Expiring Soon',
    body: '<p>Dear <strong>{{sellerName}}</strong>,</p><p>Your ticket <strong>#{{ticketId}}</strong> for {{routeName}} on {{travelDate}} is expiring soon.</p><p><strong>Ticket Details:</strong></p><ul><li><strong>Route:</strong> {{routeName}}</li><li><strong>Travel Date:</strong> {{travelDate}}</li><li><strong>Current Price:</strong> {{oldPrice}} BDT</li><li><strong>Suggested Price:</strong> {{newPrice}} BDT</li></ul><p>Consider lowering the price to increase chances of selling:</p><ul><li>💰 You could save up to {{savings}} BDT</li><li>⏰ Only {{daysRemaining}} days left</li></ul><p><a href="{{editLink}}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Update Price</a></p>',
    footerText: 'Don\'t miss out on selling your ticket!',
    copyrightText: '© {{year}} EidTicketResell. All rights reserved.',
    variables: ['sellerName', 'ticketId', 'routeName', 'travelDate', 'oldPrice', 'newPrice', 'savings', 'daysRemaining', 'editLink', 'year'],
  },
  {
    name: 'user_payment_confirmation',
    displayName: 'Payment Confirmation',
    category: 'user',
    subject: 'Payment Confirmation - #{{transactionId}}',
    title: 'Payment Successful!',
    body: '<p>Dear <strong>{{buyerName}}</strong>,</p><p>Your payment has been successfully processed!</p><p><strong>Payment Details:</strong></p><ul><li><strong>Transaction ID:</strong> #{{transactionId}}</li><li><strong>Amount:</strong> {{totalAmount}} BDT</li><li><strong>Payment Method:</strong> {{paymentMethod}}</li><li><strong>Payment Date:</strong> {{paymentDate}}</li></ul><p><strong>Ticket Information:</strong></p><ul><li><strong>Ticket Price:</strong> {{ticketPrice}} BDT</li><li><strong>Platform Fee:</strong> {{platformFee}} BDT</li></ul><p>You will receive your ticket details via email and SMS. Safe travels!</p>',
    footerText: 'Thank you for your purchase!',
    copyrightText: '© {{year}} EidTicketResell. All rights reserved.',
    variables: ['buyerName', 'transactionId', 'totalAmount', 'paymentMethod', 'paymentDate', 'ticketPrice', 'platformFee', 'year'],
  },
  {
    name: 'user_ticket_sold_notification',
    displayName: 'Ticket Sold',
    category: 'user',
    subject: 'Your Ticket is Sold! - #{{ticketId}}',
    title: 'Congratulations! Your Ticket Sold!',
    body: '<p>Great news, <strong>{{sellerName}}</strong>!</p><p>Your ticket <strong>#{{ticketId}}</strong> has been sold!</p><p><strong>Sale Details:</strong></p><ul><li><strong>Selling Price:</strong> {{sellingPrice}} BDT</li><li><strong>Buyer:</strong> {{buyerName}}</li><li><strong>Buyer Email:</strong> {{buyerEmail}}</li><li><strong>Buyer Phone:</strong> {{buyerPhone}}</li></ul><p><strong>Earnings:</strong></p><ul><li><strong>Ticket Price:</strong> {{ticketPrice}} BDT</li><li><strong>Platform Fee:</strong> {{platformFee}} BDT</li><li><strong>Your Earnings:</strong> <strong>{{earnings}} BDT</strong></li></ul><p>Your earnings will be credited to your wallet. You can withdraw them anytime from your dashboard.</p><p><a href="{{walletLink}}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Wallet</a></p>',
    footerText: 'Thank you for using EidTicketResell!',
    copyrightText: '© {{year}} EidTicketResell. All rights reserved.',
    variables: ['sellerName', 'ticketId', 'sellingPrice', 'buyerName', 'buyerEmail', 'buyerPhone', 'ticketPrice', 'platformFee', 'earnings', 'walletLink', 'year'],
  },
  {
    name: 'user_payout_confirmation',
    displayName: 'Payout Confirmation',
    category: 'user',
    subject: 'Payout Processed - {{amount}} BDT',
    title: 'Your Payout Has Been Processed',
    body: '<p>Dear <strong>{{userName}}</strong>,</p><p>Your withdrawal request has been successfully processed!</p><p><strong>Payout Details:</strong></p><ul><li><strong>Amount:</strong> {{amount}} BDT</li><li><strong>Payment Method:</strong> {{paymentMethod}}</li><li><strong>Account:</strong> {{accountDetails}}</li><li><strong>Transaction Reference:</strong> {{transactionRef}}</li><li><strong>Processed Date:</strong> {{processedDate}}</li></ul><p>The amount has been transferred to your account. Please allow 1-3 business days for the funds to appear in your account.</p><p>Thank you for using EidTicketResell!</p>',
    footerText: 'If you have any questions, please contact our support team.',
    copyrightText: '© {{year}} EidTicketResell. All rights reserved.',
    variables: ['userName', 'amount', 'paymentMethod', 'accountDetails', 'transactionRef', 'processedDate', 'year'],
  },
  {
    name: 'user_travel_reminder',
    displayName: 'Travel Reminder',
    category: 'user',
    subject: 'Travel Reminder - {{routeName}}',
    title: 'Upcoming Travel Reminder',
    body: '<p>Dear <strong>{{userName}}</strong>,</p><p>This is a friendly reminder about your upcoming trip!</p><p><strong>Trip Details:</strong></p><ul><li><strong>Route:</strong> {{routeName}}</li><li><strong>Travel Date:</strong> {{travelDate}}</li><li><strong>Departure Time:</strong> {{departureTime}}</li><li><strong>Seat Number:</strong> {{seatNumber}}</li><li><strong>Transport:</strong> {{companyName}}</li></ul><p><strong>Important Reminders:</strong></p><ul><li>🎫 Carry your ticket (printed or digital)</li><li>📱 Keep your phone charged</li><li>⏰ Arrive at the station 30 minutes early</li><li>🪪 Bring a valid ID for verification</li></ul><p>Have a safe and pleasant journey! 🚀</p>',
    footerText: 'Safe travels with EidTicketResell!',
    copyrightText: '© {{year}} EidTicketResell. All rights reserved.',
    variables: ['userName', 'routeName', 'travelDate', 'departureTime', 'seatNumber', 'companyName', 'year'],
  },
  {
    name: 'user_price_drop_alert',
    displayName: 'Price Drop Alert',
    category: 'user',
    subject: 'Price Drop Alert - {{routeName}}',
    title: 'Great News! Prices Have Dropped!',
    body: '<p>Dear <strong>{{userName}}</strong>,</p><p>Good news! Tickets for your favorite route have dropped in price!</p><p><strong>Route:</strong> {{routeName}}</p><p><strong>Price Drop:</strong></p><ul><li>❌ Was: {{oldPrice}} BDT</li><li>✅ Now: {{newPrice}} BDT</li><li>💰 You save: {{savings}} BDT</li></ul><p>These prices won\'t last long! Book your tickets now before prices go up again.</p><p><a href="{{listingLink}}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Book Now</a></p><p>Hurry, this offer is valid for a limited time!</p>',
    footerText: 'Don\'t miss out on these great deals!',
    copyrightText: '© {{year}} EidTicketResell. All rights reserved.',
    variables: ['userName', 'routeName', 'oldPrice', 'newPrice', 'savings', 'listingLink', 'year'],
  },
  {
    name: 'user_report_received',
    displayName: 'Report Received',
    category: 'user',
    subject: 'Your Report Has Been Received',
    title: 'Thank You for Your Report',
    body: '<p>Dear <strong>{{userName}}</strong>,</p><p>Thank you for reporting an issue on EidTicketResell!</p><p><strong>Report Details:</strong></p><ul><li><strong>Ticket:</strong> #{{ticketId}}</li><li><strong>Reason:</strong> {{reportReason}}</li><li><strong>Description:</strong> {{reportDescription}}</li><li><strong>Reported Date:</strong> {{reportedDate}}</li></ul><p>Our team will review your report and take appropriate action. You will receive a notification once the issue is resolved.</p><p>We appreciate your help in keeping EidTicketResell safe for everyone!</p>',
    footerText: 'Thank you for being a valued member of EidTicketResell!',
    copyrightText: '© {{year}} EidTicketResell. All rights reserved.',
    variables: ['userName', 'ticketId', 'reportReason', 'reportDescription', 'reportedDate', 'year'],
  },
  {
    name: 'user_report_resolved',
    displayName: 'Report Resolved',
    category: 'user',
    subject: 'Your Report Has Been Resolved',
    title: 'Your Report Has Been Resolved',
    body: '<p>Dear <strong>{{userName}}</strong>,</p><p>Your report regarding ticket #{{ticketId}} has been resolved!</p><p><strong>Resolution Status:</strong> {{resolutionStatus}}</p><p><strong>Admin Notes:</strong></p><p>{{adminNotes}}</p><p><strong>Resolution Date:</strong> {{resolutionDate}}</p><p>If you have any further questions or concerns, please don\'t hesitate to contact our support team.</p><p>Thank you for helping us improve EidTicketResell!</p>',
    footerText: 'We appreciate your feedback and patience.',
    copyrightText: '© {{year}} EidTicketResell. All rights reserved.',
    variables: ['userName', 'ticketId', 'resolutionStatus', 'adminNotes', 'resolutionDate', 'year'],
  },
  {
    name: 'user_account_blocked',
    displayName: 'Account Blocked',
    category: 'user',
    subject: 'Account Suspended - EidTicketResell',
    title: 'Account Suspension Notice',
    body: '<p>Dear <strong>{{userName}}</strong>,</p><p>We regret to inform you that your EidTicketResell account has been suspended.</p><p><strong>Reason for Suspension:</strong></p><p>{{blockReason}}</p><p><strong>Reference ID:</strong> {{referenceId}}</p><p>If you believe this suspension is in error, or if you would like to appeal this decision, please contact our support team.</p><p><a href="{{supportLink}}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Contact Support</a></p><p>We will review your case and get back to you as soon as possible.</p>',
    footerText: 'Thank you for your understanding.',
    copyrightText: '© {{year}} EidTicketResell. All rights reserved.',
    variables: ['userName', 'blockReason', 'referenceId', 'supportLink', 'year'],
  },
  {
    name: 'user_account_unblocked',
    displayName: 'Account Unblocked',
    category: 'user',
    subject: 'Account Reactivated - EidTicketResell',
    title: 'Your Account Has Been Reactivated!',
    body: '<p>Great news, <strong>{{userName}}</strong>!</p><p>Your EidTicketResell account has been reactivated and you now have full access to all features.</p><p><strong>Reference ID:</strong> {{referenceId}}</p><p>You can now:</p><ul><li>✅ Browse and buy tickets</li><li>✅ List and sell tickets</li><li>✅ Withdraw your earnings</li><li>✅ Access all premium features</li></ul><p>We apologize for any inconvenience this may have caused. Thank you for your patience and understanding.</p><p><a href="{{dashboardLink}}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Go to Dashboard</a></p><p>Welcome back to EidTicketResell! 🎉</p>',
    footerText: 'We\'re happy to have you back!',
    copyrightText: '© {{year}} EidTicketResell. All rights reserved.',
    variables: ['userName', 'referenceId', 'dashboardLink', 'year'],
  },
]

/**
 * GET /api/admin/email-templates
 * Get all email templates
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') // 'admin' or 'user'
    
    // Check if templates exist
    const existingTemplates = await db.emailTemplate.findMany()
    
    // If no templates exist, create defaults
    if (existingTemplates.length === 0) {
      for (const template of defaultTemplates) {
        await db.emailTemplate.create({
          data: {
            name: template.name,
            displayName: template.displayName,
            category: template.category,
            subject: template.subject,
            title: template.title,
            body: template.body,
            footerText: template.footerText,
            copyrightText: template.copyrightText,
            variables: JSON.stringify(template.variables),
            isActive: true,
          },
        })
      }
    }

    // Fetch all templates
    let templates
    if (category) {
      templates = await db.emailTemplate.findMany({
        where: { category },
        orderBy: { displayName: 'asc' },
      })
    } else {
      templates = await db.emailTemplate.findMany({
        orderBy: { displayName: 'asc' },
      })
    }

    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Error fetching email templates:', error)
    return NextResponse.json({ error: 'Failed to fetch email templates' }, { status: 500 })
  }
}

/**
 * POST /api/admin/email-templates
 * Create or update email template
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, displayName, category, subject, title, body, footerText, copyrightText, variables, isActive } = data

    if (!name) {
      return NextResponse.json({ error: 'Template name is required' }, { status: 400 })
    }

    // Check if template exists
    const existing = await db.emailTemplate.findUnique({
      where: { name },
    })

    if (existing) {
      // Build update data
      const updateData: Record<string, unknown> = {}
      
      if (displayName !== undefined) updateData.displayName = displayName
      if (category !== undefined) updateData.category = category
      if (subject !== undefined) updateData.subject = subject
      if (title !== undefined) updateData.title = title
      if (body !== undefined) updateData.body = body
      if (footerText !== undefined) updateData.footerText = footerText
      if (copyrightText !== undefined) updateData.copyrightText = copyrightText
      if (variables !== undefined) updateData.variables = variables ? JSON.stringify(variables) : null
      if (isActive !== undefined) updateData.isActive = isActive

      // Update existing template
      const updated = await db.emailTemplate.update({
        where: { name },
        data: updateData,
      })
      return NextResponse.json({ success: true, template: updated })
    } else {
      // Create new template
      const created = await db.emailTemplate.create({
        data: {
          name,
          displayName: displayName || name,
          category: category || 'user',
          subject: subject || '',
          title: title || '',
          body: body || '',
          footerText: footerText || null,
          copyrightText: copyrightText || null,
          variables: variables ? JSON.stringify(variables) : null,
          isActive: isActive !== undefined ? isActive : true,
        },
      })
      return NextResponse.json({ success: true, template: created })
    }
  } catch (error) {
    console.error('Error saving email template:', error)
    return NextResponse.json({ error: 'Failed to save email template' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/email-templates
 * Delete email template
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')
    
    if (!name) {
      return NextResponse.json({ error: 'Template name is required' }, { status: 400 })
    }

    await db.emailTemplate.delete({
      where: { name },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting email template:', error)
    return NextResponse.json({ error: 'Failed to delete email template' }, { status: 500 })
  }
}
