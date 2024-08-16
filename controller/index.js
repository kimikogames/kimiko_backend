const schedule = require("node-cron");
const { queryDb } = require("../helper/adminHelper");
const { getAlredyPlacedBet } = require("../helper/adminHelper");
const { failMsg } = require("../helper/helperResponse");

exports.generatedTimeEveryAfterEveryOneMin = (io) => {
  let one_min_win_time_out;
  function handleOneMinWingo() {
    one_min_win_time_out = setInterval(() => {
      const currentTime = new Date();
      const timeToSend =
        currentTime.getSeconds() > 0
          ? 60 - currentTime.getSeconds()
          : currentTime.getSeconds();
      io.emit("onemin", timeToSend); // Emit the formatted time
      if (timeToSend === 3) {
        clearBetOneMin();
      }
      if (timeToSend === 0) {
        clearTimeout(one_min_win_time_out);
        handleOneMinWingo();
      }
    }, 1000);
  }
  handleOneMinWingo();
};

const clearBetOneMin = async () => {
  try {
    ////////////////////// query for get transaction number /////////////////////
    let get_actual_round = "";
    const get_games_no = `SELECT win_transactoin FROM wingo_round_number WHERE win_id = 1;`;
    await queryDb(get_games_no, [])
      .then(async (result) => {
        /////////////////////// get the actual result //////////////////
        get_actual_round = result?.[0]?.win_transactoin;
      })
      .catch((e) => {
        console.log("Something went wrong in clear bet 1 min");
      });

    //////////////////// query for get actual number /////////////////////////////
    const admin_se_result_aaya_hai = `SELECT number FROM colour_admin_result WHERE gameid = ? AND gamesno = ? LIMIT 1;`;
    let get_actual_result = -1;
    get_actual_round !== "" &&
      (await queryDb(admin_se_result_aaya_hai, [
        1,
        String(Number(get_actual_round) + 1),
      ])
        .then(async (result) => {
          get_actual_result = result?.[0]?.number || -1;
        })
        .catch((e) => {
          console.log("Something went wrong in clear bet 1 min");
        }));

    const query = `SELECT slot_num, mid_amount FROM wingo_mediator_table WHERE game_type = 1 AND mid_amount = (SELECT MIN(mid_amount) FROM wingo_mediator_table WHERE game_type = 1);`;
    await queryDb(query, [])
      .then(async (result) => {
        let create_array_for_random = [];
        if (result.length === 0) {
          create_array_for_random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        } else {
          result.forEach((element) => {
            create_array_for_random.push(element.slot_num);
          });
        }
        const slot =
          get_actual_result >= 0
            ? get_actual_result
            : create_array_for_random[
                Math.floor(Math.random() * create_array_for_random.length)
              ];
        ///////// insert into ledger entry and this sp also clear the all result ///////////////////////
        let clear_bet = "CALL wingo_insert_ledger_entry_one_min(?);";
        await queryDb(clear_bet, [Number(slot)])
          .then(async (result) => {})
          .catch((e) => {
            return res.status(500).json({
              msg: `Something went wrong api calling`,
            });
          });
      })
      .catch((e) => {
        return res.status(500).json({
          msg: `Something went wrong api calling`,
        });
      });
  } catch (e) {
    return failMsg("Something went worng in node api");
  }
};

exports.generatedTimeEveryAfterEveryThreeMin = (io) => {
  let min = 2;
  const job = schedule.schedule("* * * * * *", function () {
    const currentTime = new Date().getSeconds(); // Get the current time
    const timeToSend = currentTime > 0 ? 60 - currentTime : currentTime;
    io.emit("threemin", `${min}_${timeToSend}`);
    if (min === 0 && timeToSend === 8) {
      clearBetThreeMin();
    }
    if (currentTime === 0) {
      min--;
      if (min < 0) min = 2; // Reset min to 2 when it reaches 0
    }
  });
};
const clearBetThreeMin = async () => {
  try {
    ////////////////////// query for get transaction number /////////////////////
    const get_games_no = `SELECT win_transactoin FROM wingo_round_number WHERE win_id = 2;`;
    let get_actual_round = "";
    await queryDb(get_games_no, [])
      .then(async (result) => {
        get_actual_round = result?.[0]?.win_transactoin;
      })
      .catch((e) => {
        console.log("Something went wrong in clear bet 1 min");
      });
    //////////////////// query for get actual number /////////////////////////////
    const admin_se_result_aaya_hai = `SELECT number FROM colour_admin_result WHERE gameid = ? AND gamesno = ? LIMIT 1;`;
    let get_actual_result = -1;
    await queryDb(admin_se_result_aaya_hai, [
      2,
      String(Number(get_actual_round) + 1),
    ])
      .then(async (result) => {
        get_actual_result = result?.[0]?.number || -1;
      })
      .catch((e) => {
        console.log("Something went wrong in clear bet 1 min");
      });
    const query = `SELECT slot_num, mid_amount FROM wingo_mediator_table WHERE game_type = 2 AND mid_amount = (SELECT MIN(mid_amount) FROM wingo_mediator_table WHERE game_type = 2);`;
    await queryDb(query, [])
      .then(async (result) => {
        let create_array_for_random = [];
        if (result.length === 0) {
          create_array_for_random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        } else {
          result.forEach((element) => {
            create_array_for_random.push(element.slot_num);
          });
        }
        const slot =
          get_actual_result >= 0
            ? get_actual_result
            : create_array_for_random[
                Math.floor(Math.random() * create_array_for_random.length)
              ];
        ///////// insert into ledger entry and this sp also clear the all result ///////////////////////
        let clear_bet = "CALL wingo_insert_ledger_entry_three_min(?);";
        await queryDb(clear_bet, [Number(slot)])
          .then(async (result) => {})
          .catch((e) => {
            return res.status(500).json({
              msg: `Something went wrong api calling`,
            });
          });
      })
      .catch((e) => {
        return res.status(500).json({
          msg: `Something went wrong api calling`,
        });
      });
  } catch (e) {
    return failMsg("Something went worng in node api");
  }
};

exports.generatedTimeEveryAfterEveryFiveMin = (io) => {
  let min = 4;
  const job = schedule.schedule("* * * * * *", function () {
    const currentTime = new Date().getSeconds(); // Get the current time
    const timeToSend = currentTime > 0 ? 60 - currentTime : currentTime;
    io.emit("fivemin", `${min}_${timeToSend}`);

    if (timeToSend === 8 && min === 0) {
      clearBetFiveMin();
    }
    ///
    if (currentTime === 0) {
      min--;
      if (min < 0) min = 4;
    }
  });
};

const clearBetFiveMin = async () => {
  try {
    ////////////////////// query for get transaction number /////////////////////
    const get_games_no = `SELECT win_transactoin FROM wingo_round_number WHERE win_id = 3;`;
    let get_actual_round = "";
    await queryDb(get_games_no, [])
      .then(async (result) => {
        get_actual_round = result?.[0]?.win_transactoin;
      })
      .catch((e) => {
        console.log("Something went wrong in clear bet 1 min");
      });
    //////////////////// query for get actual number /////////////////////////////
    const admin_se_result_aaya_hai = `SELECT number FROM colour_admin_result WHERE gameid = ? AND gamesno = ? LIMIT 1;`;
    let get_actual_result = -1;
    get_actual_round !== "" &&
      (await queryDb(admin_se_result_aaya_hai, [
        3,
        String(Number(get_actual_round) + 1),
      ])
        .then(async (result) => {
          get_actual_result = result?.[0]?.number || -1;
        })
        .catch((e) => {
          console.log("Something went wrong in clear bet 1 min");
        }));
    const query = `SELECT slot_num, mid_amount FROM wingo_mediator_table WHERE game_type = 3 AND mid_amount = (SELECT MIN(mid_amount) FROM wingo_mediator_table WHERE game_type = 3);`;
    await queryDb(query, [])
      .then(async (result) => {
        let create_array_for_random = [];
        if (result.length === 0) {
          create_array_for_random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        } else {
          result.forEach((element) => {
            create_array_for_random.push(element.slot_num);
          });
        }
        const slot =
          get_actual_result >= 0
            ? get_actual_result
            : create_array_for_random[
                Math.floor(Math.random() * create_array_for_random.length)
              ];
        ///////// insert into ledger entry and this sp also clear the all result ///////////////////////
        let clear_bet = "CALL wingo_insert_ledger_entry_five_min(?);";
        await queryDb(clear_bet, [Number(slot)])
          .then(async (result) => {})
          .catch((e) => {
            return res.status(500).json({
              msg: `Something went wrong api calling`,
            });
          });
      })
      .catch((e) => {
        return res.status(500).json({
          msg: `Something went wrong api calling`,
        });
      });
  } catch (e) {
    return failMsg("Something went worng in node api");
  }
};

exports.loginPage = async (req, res) => {
  const { password, username } = req.body;
  if (!password || !username)
    return res.status(200).json({
      msg: `Everything is required`,
    });

  try {
    const query = `SELECT id FROM user WHERE email = ? OR mobile = ?  AND password = ?;`;
    await queryDb(query, [username, username, password])
      .then((newresult) => {
        if (newresult?.length === 0) {
          return res.status(200).json({
            error: "400",
            msg: "Credential not matches.",
          });
        }
        return res.status(200).json({
          UserID: newresult?.[0]?.id,
          error: "200",
          msg: "Login Successfully",
        });
      })
      .catch((error) => {
        return res.status(500).json({
          msg: `Something went wrong api calling`,
        });
      });
  } catch (e) {
    return failMsg("Something went worng in node api");
  }
};
exports.getBalance = async (req, res) => {
  const { userid } = req.query;

  if (!userid)
    return res.status(200).json({
      msg: `Everything is required`,
    });

  const num_gameid = Number(userid);

  if (typeof num_gameid !== "number")
    return res.status(200).json({
      msg: `User id should be in number`,
    });
  try {
    const query = `SELECT cricket_wallet,wallet,winning_wallet,today_turnover,username,email,referral_code,full_name,custid FROM user WHERE id = ?;`;
    await queryDb(query, [Number(num_gameid)])
      .then((newresult) => {
        if (newresult?.length === 0) {
          return res.status(200).json({
            error: "400",
            msg: "Something went wrong",
          });
        }
        return res.status(200).json({
          error: "200",
          data: {
            cricket_wallet: newresult?.[0]?.cricket_wallet,
            wallet: newresult?.[0]?.wallet,
            winning: newresult?.[0]?.winning_wallet,
            total_turnover: newresult?.[0]?.today_turnover,
            username: newresult?.[0]?.username,
            email: newresult?.[0]?.email,
            referral_code: newresult?.[0]?.referral_code,
            full_name: newresult?.[0]?.full_name,
            custid: newresult?.[0]?.custid,
          },
        });
      })
      .catch((error) => {
        return res.status(500).json({
          msg: `Something went wrong api calling`,
        });
      });
  } catch (e) {
    return failMsg("Something went worng in node api");
  }
};

exports.placeBetTrx = async (req, res) => {
  const { amount, gameid, gamesnio, number, userid } = req.body;
  if (gamesnio && Number(gamesnio) <= 1) {
    return res.status(200).json({
      msg: `Refresh your page may be your game history not updated.`,
    });
  }

  if (!amount || !gameid || !gamesnio || !String(number) || !userid)
    return res.status(200).json({
      msg: `Everything is required`,
    });

  if (userid && Number(userid) <= 0) {
    return res.status(200).json({
      msg: `Please refresh your page`,
    });
  }

  if (Number(amount) <= 0)
    return res.status(200).json({
      msg: `Amount should be grater or equal to 1.`,
    });
  if (gameid && Number(gameid) <= 0)
    return res.status(200).json({
      msg: `Type is not define`,
    });
  if (gameid && Number(gameid) >= 4)
    return res.status(200).json({
      msg: `Type is not define`,
    });

  const num_gameid = Number(gameid);

  if (typeof num_gameid !== "number")
    return res.status(200).json({
      msg: `Game id should be in number`,
    });

  let get_round = "";
  if (num_gameid === 1) {
    get_round = `SELECT tr_tranaction_id FROM tr_game WHERE tr_id = 4;`;
  } else if (num_gameid === 2) {
    get_round = `SELECT tr_tranaction_id FROM tr_game WHERE tr_id = 5;`;
  } else {
    get_round = `SELECT tr_tranaction_id FROM tr_game WHERE tr_id = 6;`;
  }
  const get_round_number =
    get_round !== "" &&
    (await queryDb(get_round, [])
      .then((result) => {
        return result;
      })
      .catch((e) => {
        console.log("Something went wrong in get round.");
      }));
  await getAlredyPlacedBet([
    String(Number(get_round_number?.[0]?.tr_tranaction_id) + 1),
    String(userid),
    num_gameid,
  ]).then(async (result) => {
    if (
      [10, 20, 30]?.includes(Number(number)) &&
      result?.find((i) => [10, 20, 30]?.includes(Number(i?.number)))
    ) {
      return res.status(200).json({
        msg: `Already Placed on color`,
      });
    } else if (
      [40, 50]?.includes(Number(number)) &&
      result?.find((i) => [40, 50]?.includes(Number(i?.number)))
    ) {
      return res.status(200).json({
        msg: `Already placed on big/small`,
      });
    } else if (
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]?.includes(Number(number)) &&
      result?.filter((i) =>
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]?.includes(Number(i?.number))
      )?.length > 2
    ) {
      return res.status(200).json({
        msg: `You have already placed 3  bets.`,
      });
    } else {
      try {
        const query = `CALL trx_bet_placed(?, ?, ?, ?, @result_msg); SELECT @result_msg;`;
        try {
          const newresult = await queryDb(query, [
            String(userid),
            Number(gameid),
            String(amount),
            String(number),
          ])
            .then((result) => {
              res.status(200).json({
                error: "200",
                msg: result?.[1]?.[0]?.["@result_msg"],
              });
            })
            .catch((e) => {
              return res.status(500).json({
                msg: "Something went wrong with the API call",
              });
            });
        } catch (error) {
          console.error("Error:", error);
          return res.status(500).json({
            msg: "Something went wrong with the API call",
          });
        }
      } catch (e) {
        return failMsg("Something went worng in node api");
      }
    }
  });
};

//////////////////////////////////////////////////////////////// Wingo ///////////////////////////////////////////
exports.gameHistoryWingo = async (req, res) => {
  const { gameid, limit } = req.query;

  if (!gameid || !limit) {
    return res.status(400).json({
      // Changed to 400 for bad request
      msg: "gameid and limit are required",
    });
  }

  const num_gameid = Number(gameid);
  const num_limit = Number(limit);

  if (typeof num_gameid !== "number" || typeof num_limit !== "number") {
    return res.status(400).send("gameid and limit should be numbers");
  }
  try {
    let query = "";
    if (num_gameid === 1) {
      query =
        "SELECT * FROM `colour_results` WHERE gameid = 1 ORDER BY id DESC LIMIT 150;";
    } else if (num_gameid === 2) {
      query =
        "SELECT * FROM `colour_results` WHERE gameid = 2 ORDER BY id DESC LIMIT 150;";
    } else {
      query =
        "SELECT * FROM `colour_results` WHERE gameid = 3 ORDER BY id DESC LIMIT 150;";
    }
    query !== "" &&
      (await queryDb(query, [])
        .then((result) => {
          return res.status(200).json({
            msg: "Data fetched successfully",
            data: result,
          });
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json({
            msg: `Something went wrong api calling`,
          });
        }));
  } catch (e) {
    return failMsg("Something went worng in node api");
  }
};

exports.myHistoryWingo = async (req, res) => {
  const { userid, gameid, limit } = req.query;

  if (!userid || !gameid) {
    return res.status(400).json({
      // Changed to 400 for bad request
      msg: "gameid and userid are required",
    });
  }

  const num_gameid = Number(gameid);
  const num_limit = Number(limit);
  const num_userid = Number(userid);

  if (
    typeof num_gameid !== "number" ||
    typeof num_limit !== "number" ||
    typeof num_userid !== "number"
  ) {
    return res.status(400).send("gameid and limit should be numbers");
  }
  try {
    let query = "";
    if (num_gameid === 1) {
      query = `SELECT * FROM colour_bet WHERE gameid = 1 AND userid = ?  ORDER BY id DESC LIMIT 150;`;
    } else if (num_gameid === 2) {
      query = `SELECT * FROM colour_bet WHERE gameid = 2 AND userid = ?  ORDER BY id DESC LIMIT 150;`;
    } else {
      query = `SELECT * FROM colour_bet WHERE gameid = 3 AND userid = ?  ORDER BY id DESC LIMIT 150;`;
    }
    query !== "" &&
      (await queryDb(query, [Number(num_userid)])
        .then((result) => {
          return res.status(200).json({
            msg: "Data fetched successfully",
            data: result,
          });
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json({
            msg: `Something went wrong api calling`,
          });
        }));
  } catch (e) {
    return failMsg("Something went worng in node api");
  }
};

exports.placeBetWingo = async (req, res) => {
  const { amount, gameid, number, userid } = req.body;
  if (!amount || !gameid || !String(number) || !userid)
    return res.status(200).json({
      msg: `Everything is required`,
    });

  if (userid && Number(userid) <= 0) {
    return res.status(200).json({
      msg: `Please refresh your page`,
    });
  }

  if (Number(amount) <= 0)
    return res.status(200).json({
      msg: `Amount should be grater or equal to 1.`,
    });
  if (gameid && Number(gameid) <= 0)
    return res.status(200).json({
      msg: `Type is not define`,
    });
  if (gameid && Number(gameid) >= 4)
    return res.status(200).json({
      msg: `Type is not define`,
    });

  const num_gameid = Number(gameid);

  if (typeof num_gameid !== "number")
    return res.status(200).json({
      msg: `Game id should be in number`,
    });
  let get_round = "";
  if (num_gameid === 1) {
    get_round = `SELECT win_transactoin FROM wingo_round_number WHERE win_id = 1;`;
  } else if (num_gameid === 2) {
    get_round = `SELECT win_transactoin FROM wingo_round_number WHERE win_id = 2;`;
  } else {
    get_round = `SELECT win_transactoin FROM wingo_round_number WHERE win_id = 3;`;
  }
  const get_round_number =
    get_round !== "" &&
    (await queryDb(get_round, [])
      .then((result) => {
        return result;
      })
      .catch((e) => {
        console.log("Something went wrong in get round.");
      }));
  await getAlredyPlacedBet([
    String(Number(get_round_number?.[0]?.win_transactoin) + 1),
    String(userid),
    num_gameid,
  ]).then(async (result) => {
    if (
      [10, 20, 30]?.includes(Number(number)) &&
      result?.find((i) => [10, 20, 30]?.includes(Number(i?.number)))
    ) {
      return res.status(200).json({
        msg: `Already Placed on color`,
      });
    } else if (
      [40, 50]?.includes(Number(number)) &&
      result?.find((i) => [40, 50]?.includes(Number(i?.number)))
    ) {
      return res.status(200).json({
        msg: `Already placed on big/small`,
      });
    } else if (
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]?.includes(Number(number)) &&
      result?.filter((i) =>
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]?.includes(Number(i?.number))
      )?.length > 2
    ) {
      return res.status(200).json({
        msg: `You have already placed 3  bets.`,
      });
    } else {
      try {
        const query = `CALL wingo_bet_placed(?, ?, ?, ?, @result_msg); SELECT @result_msg;`;
        try {
          const newresult = await queryDb(query, [
            String(userid),
            Number(num_gameid),
            String(amount),
            String(number),
          ])
            .then((result) => {
              res.status(200).json({
                error: "200",
                msg: result?.[1]?.[0]?.["@result_msg"],
              });
            })
            .catch((e) => {
              return res.status(500).json({
                msg: "Something went wrong with the API call",
              });
            });
        } catch (error) {
          return res.status(500).json({
            msg: "Something went wrong with the API call",
          });
        }
      } catch (e) {
        return res.status(500).json({
          msg: "Something went worng in node api",
        });
      }
    }
  });
};

exports.winningInformation = async (req, res) => {
  try {
    const query = `SELECT email,winning_wallet AS win FROM user ORDER BY CAST(winning_wallet AS UNSIGNED) DESC LIMIT 10;`;
    await queryDb(query, [])
      .then((result) => {
        return res.status(200).json({
          msg: "Data fetched successfully",
          data: result,
        });
      })
      .catch((e) => {
        console.log(e);
        return res.status(500).json({
          msg: `Something went wrong api calling`,
        });
      });
  } catch (e) {
    return failMsg("Something went worng in node api");
  }
};

exports.getLevels = async (req, res) => {
  try {
    const { userid } = req.query;
    if (!userid)
      return res.status(201).json({
        msg: "Please provide uesr id.",
      });
    const id_in_number = Number(userid);
    if (typeof id_in_number !== "number")
      return res.status(201).json({
        msg: "Something went wrong.",
      });
    const query = `CALL sp_get_levels_data(?,?);`;
    await queryDb(query, [Number(id_in_number), 5])
      .then((result) => {
        res.status(200).json({
          msg: "Data get successfully",
          data: result?.[0],
        });
      })
      .catch((e) => {
        console.log(e);
      });
  } catch (e) {
    res.status(500).json({
      msg: "Something went wrong.",
    });
  }
};

exports.getStatus = async (req, res) => {
  try {
    const query_for_get_status =
      "SELECT status,title FROM admin_setting WHERE id IN(13,14,15);";
    const data = await queryDb(query_for_get_status, []);
    return res.status(200).json({
      msg: "Data get successfully",
      data: data,
    });
  } catch (e) {
    console.log(e);
  }
};
