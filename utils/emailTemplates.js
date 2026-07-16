function acceptedEmail(applicantName, jobTitle, companyName) {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #16a34a;">Congratulations, ${applicantName}! 🎉</h2>
        <p>We're pleased to inform you that your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been <strong>accepted</strong>.</p>
        <p>Our team will reach out to you shortly with the next steps.</p>
        <br/>
        <p>Best regards,</p>
        <p>${companyName} Hiring Team</p>
    </div>
    `;
}

function rejectedEmail(applicantName, jobTitle, companyName) {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #dc2626;">Application Update</h2>
        <p>Dear ${applicantName},</p>
        <p>Thank you for applying for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.</p>
        <p>After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.</p>
        <p>We appreciate your interest and encourage you to apply for future openings that match your skills.</p>
        <br/>
        <p>Best regards,</p>
        <p>${companyName} Hiring Team</p>
    </div>
    `;
}

module.exports = { acceptedEmail, rejectedEmail };