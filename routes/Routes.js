const express = require("express");
const {
  placeBetTrx,
  loginPage,
  gameHistoryWingo,
  myHistoryWingo,
  placeBetWingo,
  getBalance,
  winningInformation,
  getLevels,
  getStatus,
} = require("../controller");
const router = express.Router();

///////////////////// trx api /////////////////////////////
router.post("/trx-bet", placeBetTrx);
router.post("/user_login", loginPage);
router.get("/userwallet", getBalance);

////////   wingo api ///////////////////
router.get("/getbet-game-results", myHistoryWingo); /// my history
router.get("/colour_result", gameHistoryWingo); /// game history
router.post("/bet", placeBetWingo); /// game history
router.get("/winning-list", winningInformation); /// game history

/////////////////// general api's /////////////////////
router.get("/get-level", getLevels);
router.get("/get-status", getStatus);


module.exports = router;
