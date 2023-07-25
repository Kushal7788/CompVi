var express = require("express");
var router = express.Router();
var { Check } = require("../models/Check");
const { reclaimprotocol } = require("@reclaimprotocol/reclaim-sdk");
const bodyParser = require("body-parser");
const reclaim = new reclaimprotocol.Reclaim();

router.get("/", (request, response) => {
  response.status(200).json({
    success: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.get("/getId", async (request, response) => {
  const check = new Check();
  check.data = {};
  await check.save();
  response.status(200).json({
    checkId: check.checkId,
  });
});

router.post("/update/email-provider/:checkId", async (req, res) => {
  const check = await Check.findOne({ checkId: req.params.checkId });
  if (!check)
    return res.status(401).json({ message: "Invalid URL, please check." });

  const { emailProvider } = req.body;
  console.log(emailProvider);
  let request;
  if (emailProvider === "Google") {
    request = reclaim.requestProofs({
      title: "Reclaim Protocol",
      baseCallbackUrl: process.env.BASE_URL + "/update/proof",
      callbackId: check.checkId,
      requestedProofs: [
        new reclaim.CustomProvider({
          provider: "google-login",
          payload: {},
        }),
      ],
    });
  } else if (emailProvider === "Outlook") {
    request = reclaim.requestProofs({
      title: "Reclaim Protocol",
      baseCallbackUrl: process.env.BASE_URL + "/update/proof",
      callbackId: check.checkId,
      requestedProofs: [
        new reclaim.CustomProvider({
          provider: "outlook-login",
          payload: {},
        }),
      ],
    });
  } else if (emailProvider === "GoDaddy") {
    request = reclaim.requestProofs({
      title: "Reclaim Protocol",
      baseCallbackUrl: process.env.BASE_URL + "/update/proof",
      callbackId: check.checkId,
      requestedProofs: [
        new reclaim.CustomProvider({
          provider: "outlook-login",
          payload: {},
        }),
      ],
    });
  }
  const reclaimUrl = await request.getReclaimUrl();
  if (!reclaimUrl)
    return res.status(500).json({ message: "Internal Server Error" });
  check.data = { emailProvider: emailProvider };
  await check.save();
  res.status(201).json({ url: reclaimUrl });
});

router.post("/update/proof", bodyParser.text("*/*"), async (req, res) => {
  const check = await Check.findOne({ checkId: req.query.id });
  if (!check) return res.status(401).send("<h1>Unable to update Proof</h1>");
  check.data = {
    ...check.data,
    proofs: JSON.parse(Object.keys(req.body)[0]).proofs,
  };
  await check.save();
  if (isProofsCorrect) {
    check.data = {
      ...check.data,
      proofParams: check.data.proofs.map((proof) => proof.parameters),
    };
  }
  await check.save();
  console.log(check.data)
  const excludedDomains = ["com", "in", "ac", "co", "org", "net", "edu", "gmail", 
  "yahoo", "hotmail", "outlook", "godaddy", "gov", "nic", "net"]
  const emailParts = check.data.proofParams.emailAddress.split("@");
  const domain = emailParts[emailParts.length - 1];
  const domainParts = domain.split(".");
  if(excludedDomains.includes(domainParts[0])){
    check.data.proofs.companyName = "No Company";
  }
  else
    check.data.proofs.companyName = domainParts[0];
  
  const isProofsCorrect = await reclaim.verifyCorrectnessOfProofs(
    check.data.proofs
  );
  res.status(201).send("<h1>Proof was generated</h1>");
});

router.get("/fetch/:checkId", async (req, res) => {
  const check = await Check.findOne({ checkId: req.params.checkId });
  if (!check)
    return res.status(401).json({ message: "Invalid URL, please check." });
  res.status(200).json({
    data: check.data,
  });
});

module.exports = router;
