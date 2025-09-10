 
import { Resend } from 'resend';
    

export const sendSigninEmail = async (email: string, token: string) => {
   
const RESEND_API = process.env.RESEND_API
const resend = new Resend(RESEND_API);

resend.emails.send({
  from: 'onboarding@resend.dev',
  to: email,
  subject: 'Verify your email',
    html: `<center>
    <h1>please click here for login</h1>
  <a href="${process.env.BACKEND_URL}/api/v1/signin/post?token=${token}">click here</a>
  </center>`
});
}