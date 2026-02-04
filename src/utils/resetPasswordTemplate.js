const resetPasswordTemplate = (name, resetLink) => {
    console.log(name, resetLink)
    return `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px">
    <div style="max-width:500px; background:#ffffff; padding:25px; border-radius:8px; margin:auto">
      <h2 style="color:#111827">Reset Your Password</h2>
      <p>Hi <b>${name}</b>,</p>
      <p>You requested to reset your password. Click the button below:</p>

      <a href="${resetLink}"
        style="display:inline-block;margin-top:20px;background:#2563eb;color:#ffffff;
        padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:bold">
        Reset Password
      </a>

      <p style="margin-top:20px;color:#6b7280;font-size:14px">
        This link will expire in 15 minutes.<br/>
        If you did not request this, please ignore this email.
      </p>

      <p style="margin-top:30px;font-size:13px;color:#9ca3af">
        © Product App
      </p>
    </div>
  </div>
  `
}

export default resetPasswordTemplate
