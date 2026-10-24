import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, subject, type, data } = body;

    if (!to) {
      return NextResponse.json({ error: "Recipient email is required" }, { status: 400 });
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || `"AOUJ Haute Couture" <no-reply@aouj.atelier>`;

    // Generate HTML Content based on Type
    let htmlContent = "";
    let emailSubject = subject || "AOUJ Atelier Notification";

    if (type === "OTP") {
      emailSubject = "AOUJ Atelier - Password Reset Verification Code";
      htmlContent = `
        <div style="font-family: 'Georgia', serif; max-width: 580px; margin: 0 auto; background-color: #FAF7F2; border: 1px solid #D8C9B6; padding: 36px 30px; color: #151007;">
          <div style="text-align: center; border-bottom: 1px solid #D8C9B6; padding-bottom: 20px; margin-bottom: 24px;">
            <h1 style="margin: 0; font-size: 32px; letter-spacing: 6px; font-weight: normal; color: #151007;">AOUJ</h1>
            <p style="margin: 4px 0 0 0; font-size: 11px; letter-spacing: 3px; color: #907553; text-transform: uppercase;">Haute Couture & Heirloom Atelier</p>
          </div>

          <p style="font-size: 14px; line-height: 1.6; color: #3A2E21;">Dear Valued Client,</p>
          <p style="font-size: 14px; line-height: 1.6; color: #3A2E21;">
            We received a request to reset the password for your AOUJ account. Please use the 6-digit verification code below to authorize your credential update:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; font-size: 36px; font-family: monospace; letter-spacing: 8px; font-weight: bold; color: #151007; background: #F2EAE0; padding: 14px 28px; border: 1px solid #907553;">
              ${data?.otp || "000000"}
            </span>
          </div>

          <p style="font-size: 12px; line-height: 1.5; color: #665a4a; text-align: center;">
            This OTP code is valid for <strong>15 minutes</strong>. If you did not initiate this request, please contact our concierge immediately.
          </p>

          <div style="border-top: 1px solid #D8C9B6; margin-top: 30px; padding-top: 16px; text-align: center; font-size: 11px; color: #907553; text-transform: uppercase; letter-spacing: 1px;">
            AOUJ Atelier • Gulberg III, Lahore • +92 300 0000000
          </div>
        </div>
      `;
    } else if (type === "ORDER_CONFIRMATION") {
      emailSubject = `AOUJ Atelier - Order Confirmation (${data?.orderNumber})`;
      const itemsList = (data?.items || [])
        .map(
          (it: any) => `
          <tr style="border-bottom: 1px solid #E8DEC8;">
            <td style="padding: 10px 0; font-size: 13px; color: #151007;">
              <strong>${it.productName || it.name}</strong>
              <br/>
              <span style="font-size: 11px; color: #665a4a;">
                ${it.selectedWomanSize ? `Woman: ${it.selectedWomanSize} ` : ""}
                ${it.selectedGirlSize ? `Girl: ${it.selectedGirlSize}` : ""}
              </span>
            </td>
            <td style="padding: 10px 0; font-size: 13px; text-align: center; color: #151007;">${it.quantity}</td>
            <td style="padding: 10px 0; font-size: 13px; text-align: right; font-weight: bold; color: #151007;">PKR ${(it.lineTotal || (it.price * it.quantity)).toLocaleString()}</td>
          </tr>`
        )
        .join("");

      htmlContent = `
        <div style="font-family: 'Georgia', serif; max-width: 620px; margin: 0 auto; background-color: #FAF7F2; border: 1px solid #D8C9B6; padding: 36px 30px; color: #151007;">
          <div style="text-align: center; border-bottom: 1px solid #D8C9B6; padding-bottom: 20px; margin-bottom: 24px;">
            <h1 style="margin: 0; font-size: 32px; letter-spacing: 6px; font-weight: normal; color: #151007;">AOUJ</h1>
            <p style="margin: 4px 0 0 0; font-size: 11px; letter-spacing: 3px; color: #907553; text-transform: uppercase;">Haute Couture & Heirloom Atelier</p>
          </div>

          <p style="font-size: 15px; color: #3A2E21;">Dear <strong>${data?.customerName || "Valued Patron"}</strong>,</p>
          <p style="font-size: 13px; line-height: 1.6; color: #3A2E21;">
            Thank you for ordering with AOUJ Atelier. Your consignment has been registered under reference <strong>${data?.orderNumber}</strong> and has been forwarded to our master tailors.
          </p>

          <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
            <thead>
              <tr style="border-bottom: 2px solid #D8C9B6; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; color: #907553;">
                <th style="text-align: left; padding: 6px 0;">Piece</th>
                <th style="text-align: center; padding: 6px 0;">Qty</th>
                <th style="text-align: right; padding: 6px 0;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>

          <div style="background: #F2EAE0; padding: 14px 18px; border: 1px solid #D8C9B6; font-size: 13px; margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span>Grand Total Payable:</span>
              <strong style="color: #907553;">PKR ${(data?.grandTotal || 0).toLocaleString()}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; color: #665a4a;">
              <span>Payment Terms:</span>
              <span>${data?.paymentMethod || "Cash on Delivery"}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; color: #665a4a; margin-top: 4px;">
              <span>Delivery Address:</span>
              <span>${data?.shippingAddress || "Registered Destination"}, ${data?.city || ""}</span>
            </div>
          </div>

          <div style="text-align: center; margin: 28px 0;">
            <a href="https://aouj.atelier/track-order?order=${data?.orderNumber}" style="background-color: #151007; color: #FAF7F2; padding: 12px 24px; text-decoration: none; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; display: inline-block;">
              Track Order Consignment
            </a>
          </div>

          <div style="border-top: 1px solid #D8C9B6; margin-top: 30px; padding-top: 16px; text-align: center; font-size: 11px; color: #907553; text-transform: uppercase; letter-spacing: 1px;">
            AOUJ Atelier Concierge • +92 342-6300002 • Gulberg III, Lahore
          </div>
        </div>
      `;
    }

    // If SMTP is configured in environment, dispatch email through SMTP
    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      // Plain text fallback prevents spam filters from flagging HTML-only emails
      const plainTextFallback = type === "ORDER_CONFIRMATION"
        ? `Dear ${data?.customerName || "Valued Patron"},\n\nThank you for ordering with AOUJ Atelier. Your consignment has been registered under reference ${data?.orderNumber}.\n\nTotal Payable: PKR ${(data?.grandTotal || 0).toLocaleString()}\nPayment Method: ${data?.paymentMethod || "Cash on Delivery"}\nDelivery Address: ${data?.shippingAddress || ""}, ${data?.city || ""}\n\nAOUJ Atelier Concierge: +92 342-6300002`
        : `Your verification code is: ${data?.otp || "000000"}`;

      await transporter.sendMail({
        from: smtpFrom,
        to,
        replyTo: smtpUser,
        subject: emailSubject,
        text: plainTextFallback,
        html: htmlContent,
        headers: {
          "X-Entity-Ref-ID": `${data?.orderNumber || Date.now()}`,
          "X-Priority": "3",
          "Importance": "Normal",
        },
      });

      return NextResponse.json({ success: true, message: `Email dispatched to ${to}` });
    }

    // Graceful fallback for local development:
    // Log the generated email details to terminal and return success
    console.log(`\n======================================================`);
    console.log(`[AOUJ EMAIL SERVICE] Ready to send to: ${to}`);
    console.log(`Subject: ${emailSubject}`);
    if (type === "OTP") {
      console.log(`>>> 6-DIGIT OTP CODE: [ ${data?.otp} ] <<<`);
    } else if (type === "ORDER_CONFIRMATION") {
      console.log(`>>> ORDER CONFIRMED: [ ${data?.orderNumber} ] - PKR ${data?.grandTotal} <<<`);
    }
    console.log(`(To send via real SMTP inboxes, configure SMTP_HOST, SMTP_USER, SMTP_PASS in .env.local)`);
    console.log(`======================================================\n`);

    return NextResponse.json({
      success: true,
      delivered: false,
      notice: "Email recorded. Configure SMTP_HOST in .env.local to route through live inbox.",
    });
  } catch (error: any) {
    console.error("Email service dispatch error:", error);
    return NextResponse.json({ error: error.message || "Failed to send email" }, { status: 500 });
  }
}
