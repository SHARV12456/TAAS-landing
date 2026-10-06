const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

const startStr = "var msg='TAAS DESIGN CHALLENGE";
const endStr = "+'Looking forward to working with the TAAS team.';";

const startIdx = h.indexOf(startStr);
const endIdx = h.indexOf(endStr) + endStr.length;

if (startIdx !== -1 && endIdx > startIdx) {
  const newMsgBlock = "var msg='*TAAS® DESIGN CHALLENGE — NEW SUBMISSION*\n\n'"
    + "+'*Reference ID:* '+ref+'\n\n'"
    + "+'Thank you for submitting your project for the TAAS® Design Challenge. Please find the submitted details below:\n\n'"
    + "+'*CLIENT*\n'"
    + "+'*Name:* '+name+'\n'"
    + "+'*WhatsApp:* '+wa+'\n'"
    + "+'*Email:* '+em+'\n\n'"
    + "+'*PROJECT*\n'"
    + "+'*Space Type:* '+state.space+'\n'"
    + "+'*Location:* '+addr+'\n'"
    + "+'*Timeline:* '+state.action+'\n\n'"
    + "+'*CHALLENGE COMMERCIALS*\n'"
    + "+'*Execution Budget:* ₹1,45,000\n'"
    + "+'*Design + Direction:* '+fee+' — Launch Offer\n\n'"
    + "+'*NEXT STEPS*\n\n'"
    + "+'1. Please share clear *photos or a short video of the space* in this chat.\n'"
    + "+'2. The TAAS® team will review the submission and confirm *slot availability and eligibility*.\n'"
    + "+'3. Once the slot is confirmed, we will coordinate the *site visit and next stage of the challenge*.\n\n'"
    + "+'Please keep your project reference ID *'+ref+'* for future communication.\n\n'"
    + "+'We look forward to reviewing your space.\n\n'"
    + "+'*TAAS®*\n'"
    + "+'*Design decision support before the build, spend or commitment.*;";

  h = h.substring(0, startIdx) + newMsgBlock + h.substring(endIdx);
  fs.writeFileSync('index.html', h, 'utf8');
  console.log('WhatsApp message format updated successfully');
} else {
  console.log('Could not find boundaries.');
}
