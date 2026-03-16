export function waitlistEmail(_email: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're on the Forticlaw waitlist</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#f4f4f5;">

  <!-- Radial glow top (mirrors landing hero) -->
  <div style="background:radial-gradient(circle at 50% 0%,rgba(255,255,255,0.06),transparent 55%);padding:48px 0 0;">

    <div style="max-width:560px;margin:0 auto;padding:0 24px 48px;">

      <!-- Logo -->
      <div style="margin-bottom:40px;">
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="vertical-align:middle;">
              <div style="width:32px;height:32px;border-radius:7px;background:#0a0a0a;border:1px solid rgba(255,255,255,0.15);display:inline-block;text-align:center;line-height:32px;">
                <span style="color:#ffffff;font-size:13px;font-weight:900;font-family:'Arial Black',Arial,sans-serif;letter-spacing:-1px;">Fo</span>
              </div>
            </td>
            <td style="padding-left:8px;vertical-align:middle;">
              <span style="color:#ffffff;font-size:15px;font-weight:900;font-family:'Arial Black',Arial,sans-serif;letter-spacing:-0.5px;">Forticlaw</span>
            </td>
          </tr>
        </table>
      </div>

      <!-- Top line separator (mirrors landing) -->
      <div style="height:1px;background:linear-gradient(to right,transparent,rgba(255,255,255,0.15),transparent);margin-bottom:40px;"></div>

      <!-- Headline -->
      <h1 style="margin:0 0 16px;font-size:40px;font-weight:700;color:#f4f4f5;letter-spacing:-1px;line-height:1.15;">
        You're on the list.
      </h1>

      <p style="margin:0 0 36px;font-size:16px;color:#a1a1aa;line-height:1.7;">
        You just secured your spot among the first operators who'll have access to Forticlaw —
        the AI ad creative platform built for ecommerce sellers and dropshippers.
      </p>

      <!-- Discount card (mirrors landing proof-point cards) -->
      <div style="border:1px solid rgba(255,255,255,0.10);border-radius:20px;padding:28px;background:rgba(24,24,27,0.6);margin-bottom:36px;">
        <p style="margin:0 0 10px;font-size:11px;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:0.08em;">
          Your early access reward
        </p>
        <h2 style="margin:0 0 12px;font-size:30px;font-weight:700;color:#f4f4f5;letter-spacing:-0.5px;">
          20% off — for life.
        </h2>
        <p style="margin:0;font-size:15px;color:#a1a1aa;line-height:1.65;">
          When Forticlaw opens its doors, you'll receive an exclusive discount code with
          <strong style="color:#f4f4f5;font-weight:600;">20% off your subscription forever</strong>.
          We're giving this to the first&nbsp;50 people who joined the waitlist.
          You're in.
        </p>
      </div>

      <!-- What happens next -->
      <div style="margin-bottom:40px;">
        <p style="margin:0 0 6px;font-size:12px;font-weight:500;color:#52525b;text-transform:uppercase;letter-spacing:0.06em;">
          What happens next
        </p>
        <p style="margin:0;font-size:15px;color:#71717a;line-height:1.7;">
          We'll email your 20% code the day we launch. No action needed on your end —
          you're already locked in. Until then, we're heads down building something
          you'll actually want to use every day.
        </p>
      </div>

      <!-- Proof points (mirrors landing cards) -->
      <table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-bottom:40px;">
        <tr>
          <td style="padding-right:8px;vertical-align:top;width:33%;">
            <div style="border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:14px 16px;background:rgba(9,9,11,0.6);">
              <p style="margin:0 0 4px;font-size:13px;font-weight:500;color:#f4f4f5;">Shopify or any URL</p>
              <p style="margin:0;font-size:12px;color:#52525b;">No manual intake</p>
            </div>
          </td>
          <td style="padding:0 4px;vertical-align:top;width:34%;">
            <div style="border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:14px 16px;background:rgba(9,9,11,0.6);">
              <p style="margin:0 0 4px;font-size:13px;font-weight:500;color:#f4f4f5;">Draft first, batch after</p>
              <p style="margin:0;font-size:12px;color:#52525b;">Approve before scaling</p>
            </div>
          </td>
          <td style="padding-left:8px;vertical-align:top;width:33%;">
            <div style="border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:14px 16px;background:rgba(9,9,11,0.6);">
              <p style="margin:0 0 4px;font-size:13px;font-weight:500;color:#f4f4f5;">4 ratios in one ZIP</p>
              <p style="margin:0;font-size:12px;color:#52525b;">Paid-social ready</p>
            </div>
          </td>
        </tr>
      </table>

      <!-- Divider -->
      <div style="height:1px;background:rgba(255,255,255,0.06);margin-bottom:24px;"></div>

      <!-- Footer -->
      <p style="margin:0;font-size:12px;color:#3f3f46;line-height:1.6;">
        You're receiving this because you joined the waitlist at
        <a href="https://forticlaw.com" style="color:#52525b;text-decoration:underline;">forticlaw.com</a>.
        We'll never share your email or send you anything unrelated to Forticlaw.
      </p>

    </div>
  </div>

</body>
</html>`
}
