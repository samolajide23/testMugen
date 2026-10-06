--!strict
-- Generated source-driven slice, NOT full character support. See pikachu-checkpoint-report.json.
local config: any = {}
config["startState"] = 0
config["deferredControllers"] = {}
config["deferredControllers"][1] = "playsnd"
config["permissiveParameters"] = true
config["commands"] = {}
config["commands"][1] = {
  ["name"] = "FF",
  ["command"] = "F, F",
  ["time"] = 10,
  ["bufferTime"] = 1,
  ["remap"] = {
    ["x"] = "x",
    ["y"] = "y",
    ["z"] = "z",
    ["a"] = "a",
    ["b"] = "b",
    ["c"] = "c",
    ["s"] = "s",
  },
}
config["commands"][2] = {
  ["name"] = "BB",
  ["command"] = "B, B",
  ["time"] = 10,
  ["bufferTime"] = 1,
  ["remap"] = {
    ["x"] = "x",
    ["y"] = "y",
    ["z"] = "z",
    ["a"] = "a",
    ["b"] = "b",
    ["c"] = "c",
    ["s"] = "s",
  },
}
config["commands"][3] = {
  ["name"] = "recovery",
  ["command"] = "x+y",
  ["time"] = 1,
  ["bufferTime"] = 1,
  ["remap"] = {
    ["x"] = "x",
    ["y"] = "y",
    ["z"] = "z",
    ["a"] = "a",
    ["b"] = "b",
    ["c"] = "c",
    ["s"] = "s",
  },
}
config["commands"][4] = {
  ["name"] = "a",
  ["command"] = "a",
  ["time"] = 1,
  ["bufferTime"] = 1,
  ["remap"] = {
    ["x"] = "x",
    ["y"] = "y",
    ["z"] = "z",
    ["a"] = "a",
    ["b"] = "b",
    ["c"] = "c",
    ["s"] = "s",
  },
}
config["commands"][5] = {
  ["name"] = "b",
  ["command"] = "b",
  ["time"] = 1,
  ["bufferTime"] = 1,
  ["remap"] = {
    ["x"] = "x",
    ["y"] = "y",
    ["z"] = "z",
    ["a"] = "a",
    ["b"] = "b",
    ["c"] = "c",
    ["s"] = "s",
  },
}
config["commands"][6] = {
  ["name"] = "x",
  ["command"] = "x",
  ["time"] = 1,
  ["bufferTime"] = 1,
  ["remap"] = {
    ["x"] = "x",
    ["y"] = "y",
    ["z"] = "z",
    ["a"] = "a",
    ["b"] = "b",
    ["c"] = "c",
    ["s"] = "s",
  },
}
config["commands"][7] = {
  ["name"] = "y",
  ["command"] = "y",
  ["time"] = 1,
  ["bufferTime"] = 1,
  ["remap"] = {
    ["x"] = "x",
    ["y"] = "y",
    ["z"] = "z",
    ["a"] = "a",
    ["b"] = "b",
    ["c"] = "c",
    ["s"] = "s",
  },
}
config["commands"][8] = {
  ["name"] = "holddown",
  ["command"] = "/$D",
  ["time"] = 1,
  ["bufferTime"] = 1,
  ["remap"] = {
    ["x"] = "x",
    ["y"] = "y",
    ["z"] = "z",
    ["a"] = "a",
    ["b"] = "b",
    ["c"] = "c",
    ["s"] = "s",
  },
}
config["states"] = {}
config["states"][1] = {
  ["id"] = 0,
  ["source"] = "<host:checkpoint-idle>",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "S",
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "I",
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "S",
    },
    [4] = {
      ["key"] = "anim",
      ["value"] = "0",
    },
    [5] = {
      ["key"] = "ctrl",
      ["value"] = "1",
    },
    [6] = {
      ["key"] = "velset",
      ["value"] = "0,0",
    },
  },
  ["controllers"] = {

  },
}
config["states"][2] = {
  ["id"] = -1,
  ["source"] = "pikachu.cmd",
  ["entries"] = {

  },
  ["controllers"] = {
    [1] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cmd",
      ["line"] = 279,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 280,
        },
        [2] = {
          ["key"] = "value",
          ["value"] = "100",
          ["line"] = 281,
        },
        [3] = {
          ["key"] = "trigger1",
          ["value"] = "command = \034FF\034",
          ["line"] = 282,
        },
        [4] = {
          ["key"] = "trigger1",
          ["value"] = "statetype = S",
          ["line"] = 283,
        },
        [5] = {
          ["key"] = "trigger1",
          ["value"] = "ctrl",
          ["line"] = 284,
        },
      },
    },
    [2] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cmd",
      ["line"] = 288,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 289,
        },
        [2] = {
          ["key"] = "value",
          ["value"] = "105",
          ["line"] = 290,
        },
        [3] = {
          ["key"] = "trigger1",
          ["value"] = "command = \034BB\034",
          ["line"] = 291,
        },
        [4] = {
          ["key"] = "trigger1",
          ["value"] = "statetype = S",
          ["line"] = 292,
        },
        [5] = {
          ["key"] = "trigger1",
          ["value"] = "ctrl",
          ["line"] = 293,
        },
      },
    },
    [3] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cmd",
      ["line"] = 313,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 314,
        },
        [2] = {
          ["key"] = "value",
          ["value"] = "200",
          ["line"] = 315,
        },
        [3] = {
          ["key"] = "triggerall",
          ["value"] = "command = \034x\034",
          ["line"] = 316,
        },
        [4] = {
          ["key"] = "triggerall",
          ["value"] = "command != \034holddown\034",
          ["line"] = 317,
        },
        [5] = {
          ["key"] = "trigger1",
          ["value"] = "statetype = S",
          ["line"] = 318,
        },
        [6] = {
          ["key"] = "trigger1",
          ["value"] = "ctrl",
          ["line"] = 319,
        },
      },
    },
    [4] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cmd",
      ["line"] = 322,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 323,
        },
        [2] = {
          ["key"] = "value",
          ["value"] = "230",
          ["line"] = 324,
        },
        [3] = {
          ["key"] = "triggerall",
          ["value"] = "command = \034x\034",
          ["line"] = 325,
        },
        [4] = {
          ["key"] = "triggerall",
          ["value"] = "command != \034holddown\034 && p2bodydist x<= 20",
          ["line"] = 326,
        },
        [5] = {
          ["key"] = "trigger1",
          ["value"] = "stateno = 200",
          ["line"] = 327,
        },
        [6] = {
          ["key"] = "trigger1",
          ["value"] = "movecontact && time >= 6",
          ["line"] = 328,
        },
        [7] = {
          ["key"] = "trigger1",
          ["value"] = "statetype = S",
          ["line"] = 329,
        },
      },
    },
    [5] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cmd",
      ["line"] = 332,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 333,
        },
        [2] = {
          ["key"] = "value",
          ["value"] = "240",
          ["line"] = 334,
        },
        [3] = {
          ["key"] = "triggerall",
          ["value"] = "command = \034x\034",
          ["line"] = 335,
        },
        [4] = {
          ["key"] = "triggerall",
          ["value"] = "command != \034holddown\034 && p2bodydist x<= 20",
          ["line"] = 336,
        },
        [5] = {
          ["key"] = "trigger1",
          ["value"] = "(stateno = 230)",
          ["line"] = 337,
        },
        [6] = {
          ["key"] = "trigger1",
          ["value"] = "movecontact  && time >= 6",
          ["line"] = 338,
        },
      },
    },
    [6] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cmd",
      ["line"] = 341,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 342,
        },
        [2] = {
          ["key"] = "value",
          ["value"] = "210",
          ["line"] = 343,
        },
        [3] = {
          ["key"] = "triggerall",
          ["value"] = "command = \034y\034",
          ["line"] = 344,
        },
        [4] = {
          ["key"] = "triggerall",
          ["value"] = "command != \034holddown\034",
          ["line"] = 345,
        },
        [5] = {
          ["key"] = "trigger1",
          ["value"] = "statetype = S",
          ["line"] = 346,
        },
        [6] = {
          ["key"] = "trigger1",
          ["value"] = "ctrl",
          ["line"] = 347,
        },
        [7] = {
          ["key"] = "trigger2",
          ["value"] = "(stateno = 200) || (stateno = 230) || (stateno = 240)",
          ["line"] = 348,
        },
        [8] = {
          ["key"] = "trigger2",
          ["value"] = "movecontact",
          ["line"] = 349,
        },
      },
    },
    [7] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cmd",
      ["line"] = 352,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 353,
        },
        [2] = {
          ["key"] = "value",
          ["value"] = "250",
          ["line"] = 354,
        },
        [3] = {
          ["key"] = "triggerall",
          ["value"] = "command = \034y\034",
          ["line"] = 355,
        },
        [4] = {
          ["key"] = "triggerall",
          ["value"] = "command != \034holddown\034 && p2bodydist x<= 20",
          ["line"] = 356,
        },
        [5] = {
          ["key"] = "trigger1",
          ["value"] = "stateno = 210",
          ["line"] = 357,
        },
        [6] = {
          ["key"] = "trigger1",
          ["value"] = "movecontact  && time >= 6",
          ["line"] = 358,
        },
        [7] = {
          ["key"] = "trigger2",
          ["value"] = "stateno = 240",
          ["line"] = 359,
        },
        [8] = {
          ["key"] = "trigger2",
          ["value"] = "movecontact  && time >= 6",
          ["line"] = 360,
        },
      },
    },
    [8] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cmd",
      ["line"] = 363,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 364,
        },
        [2] = {
          ["key"] = "value",
          ["value"] = "220",
          ["line"] = 365,
        },
        [3] = {
          ["key"] = "triggerall",
          ["value"] = "command = \034a\034",
          ["line"] = 366,
        },
        [4] = {
          ["key"] = "triggerall",
          ["value"] = "command != \034holddown\034",
          ["line"] = 367,
        },
        [5] = {
          ["key"] = "trigger1",
          ["value"] = "statetype = S",
          ["line"] = 368,
        },
        [6] = {
          ["key"] = "trigger1",
          ["value"] = "ctrl",
          ["line"] = 369,
        },
        [7] = {
          ["key"] = "trigger2",
          ["value"] = "stateno = 200",
          ["line"] = 370,
        },
        [8] = {
          ["key"] = "trigger2",
          ["value"] = "movecontact",
          ["line"] = 371,
        },
        [9] = {
          ["key"] = "trigger3",
          ["value"] = "stateno = 230",
          ["line"] = 372,
        },
        [10] = {
          ["key"] = "trigger3",
          ["value"] = "movecontact",
          ["line"] = 373,
        },
        [11] = {
          ["key"] = "trigger4",
          ["value"] = "stateno = 240",
          ["line"] = 374,
        },
        [12] = {
          ["key"] = "trigger4",
          ["value"] = "movecontact",
          ["line"] = 375,
        },
        [13] = {
          ["key"] = "trigger5",
          ["value"] = "stateno = 210",
          ["line"] = 376,
        },
        [14] = {
          ["key"] = "trigger5",
          ["value"] = "movecontact",
          ["line"] = 377,
        },
        [15] = {
          ["key"] = "trigger6",
          ["value"] = "stateno = 220",
          ["line"] = 378,
        },
        [16] = {
          ["key"] = "trigger6",
          ["value"] = "movecontact && time >= 50",
          ["line"] = 379,
        },
        [17] = {
          ["key"] = "trigger7",
          ["value"] = "stateno = 250",
          ["line"] = 380,
        },
        [18] = {
          ["key"] = "trigger7",
          ["value"] = "movecontact",
          ["line"] = 381,
        },
      },
    },
    [9] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cmd",
      ["line"] = 405,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 406,
        },
        [2] = {
          ["key"] = "value",
          ["value"] = "400",
          ["line"] = 407,
        },
        [3] = {
          ["key"] = "triggerall",
          ["value"] = "command = \034x\034",
          ["line"] = 408,
        },
        [4] = {
          ["key"] = "triggerall",
          ["value"] = "command = \034holddown\034",
          ["line"] = 409,
        },
        [5] = {
          ["key"] = "trigger1",
          ["value"] = "statetype = C",
          ["line"] = 410,
        },
        [6] = {
          ["key"] = "trigger1",
          ["value"] = "ctrl",
          ["line"] = 411,
        },
        [7] = {
          ["key"] = "trigger2",
          ["value"] = "(stateno = 220) || (stateno = 420)",
          ["line"] = 412,
        },
        [8] = {
          ["key"] = "trigger2",
          ["value"] = "time >= 20",
          ["line"] = 413,
        },
      },
    },
    [10] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cmd",
      ["line"] = 417,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 418,
        },
        [2] = {
          ["key"] = "value",
          ["value"] = "410",
          ["line"] = 419,
        },
        [3] = {
          ["key"] = "triggerall",
          ["value"] = "command = \034y\034",
          ["line"] = 420,
        },
        [4] = {
          ["key"] = "triggerall",
          ["value"] = "command = \034holddown\034",
          ["line"] = 421,
        },
        [5] = {
          ["key"] = "trigger1",
          ["value"] = "statetype = C",
          ["line"] = 422,
        },
        [6] = {
          ["key"] = "trigger1",
          ["value"] = "ctrl",
          ["line"] = 423,
        },
        [7] = {
          ["key"] = "trigger2",
          ["value"] = "(stateno = 400) || (stateno = 200)",
          ["line"] = 424,
        },
        [8] = {
          ["key"] = "trigger2",
          ["value"] = "(time > 10) || (time > 8)",
          ["line"] = 425,
        },
      },
    },
    [11] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cmd",
      ["line"] = 428,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 429,
        },
        [2] = {
          ["key"] = "value",
          ["value"] = "420",
          ["line"] = 430,
        },
        [3] = {
          ["key"] = "triggerall",
          ["value"] = "command = \034a\034",
          ["line"] = 431,
        },
        [4] = {
          ["key"] = "trigger1",
          ["value"] = "statetype = C",
          ["line"] = 432,
        },
        [5] = {
          ["key"] = "trigger1",
          ["value"] = "ctrl",
          ["line"] = 433,
        },
      },
    },
    [12] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cmd",
      ["line"] = 437,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 438,
        },
        [2] = {
          ["key"] = "value",
          ["value"] = "600",
          ["line"] = 439,
        },
        [3] = {
          ["key"] = "triggerall",
          ["value"] = "command = \034x\034",
          ["line"] = 440,
        },
        [4] = {
          ["key"] = "trigger1",
          ["value"] = "statetype = A",
          ["line"] = 441,
        },
        [5] = {
          ["key"] = "trigger1",
          ["value"] = "ctrl",
          ["line"] = 442,
        },
        [6] = {
          ["key"] = "trigger2",
          ["value"] = "(stateno = 600)",
          ["line"] = 443,
        },
        [7] = {
          ["key"] = "trigger2",
          ["value"] = "(time >= 16)",
          ["line"] = 444,
        },
        [8] = {
          ["key"] = "trigger3",
          ["value"] = "stateno = 1350",
          ["line"] = 445,
        },
      },
    },
    [13] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cmd",
      ["line"] = 448,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 449,
        },
        [2] = {
          ["key"] = "value",
          ["value"] = "610",
          ["line"] = 450,
        },
        [3] = {
          ["key"] = "triggerall",
          ["value"] = "command = \034y\034",
          ["line"] = 451,
        },
        [4] = {
          ["key"] = "trigger1",
          ["value"] = "statetype = A",
          ["line"] = 452,
        },
        [5] = {
          ["key"] = "trigger1",
          ["value"] = "ctrl",
          ["line"] = 453,
        },
        [6] = {
          ["key"] = "trigger2",
          ["value"] = "stateno = 600",
          ["line"] = 454,
        },
        [7] = {
          ["key"] = "trigger2",
          ["value"] = "movecontact && time > 8",
          ["line"] = 455,
        },
        [8] = {
          ["key"] = "trigger3",
          ["value"] = "stateno = 1350",
          ["line"] = 456,
        },
        [9] = {
          ["key"] = "trigger4",
          ["value"] = "stateno = 610",
          ["line"] = 457,
        },
        [10] = {
          ["key"] = "trigger4",
          ["value"] = "time > 16",
          ["line"] = 458,
        },
      },
    },
    [14] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cmd",
      ["line"] = 473,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 474,
        },
        [2] = {
          ["key"] = "value",
          ["value"] = "1000",
          ["line"] = 475,
        },
        [3] = {
          ["key"] = "triggerall",
          ["value"] = "command = \034b\034",
          ["line"] = 476,
        },
        [4] = {
          ["key"] = "triggerall",
          ["value"] = "statetype != A",
          ["line"] = 477,
        },
        [5] = {
          ["key"] = "triggerall",
          ["value"] = "ctrl = 1",
          ["line"] = 478,
        },
        [6] = {
          ["key"] = "trigger1",
          ["value"] = "statetype = S",
          ["line"] = 479,
        },
      },
    },
    [15] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cmd",
      ["line"] = 483,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 484,
        },
        [2] = {
          ["key"] = "value",
          ["value"] = "1010",
          ["line"] = 485,
        },
        [3] = {
          ["key"] = "triggerall",
          ["value"] = "command = \034b\034",
          ["line"] = 486,
        },
        [4] = {
          ["key"] = "triggerall",
          ["value"] = "statetype = C",
          ["line"] = 487,
        },
        [5] = {
          ["key"] = "trigger1",
          ["value"] = "ctrl",
          ["line"] = 488,
        },
        [6] = {
          ["key"] = "trigger2",
          ["value"] = "stateno = 1010",
          ["line"] = 489,
        },
        [7] = {
          ["key"] = "trigger2",
          ["value"] = "statetime >= 12",
          ["line"] = 490,
        },
      },
    },
    [16] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cmd",
      ["line"] = 493,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 494,
        },
        [2] = {
          ["key"] = "value",
          ["value"] = "1020",
          ["line"] = 495,
        },
        [3] = {
          ["key"] = "triggerall",
          ["value"] = "command = \034b\034",
          ["line"] = 496,
        },
        [4] = {
          ["key"] = "trigger1",
          ["value"] = "statetype = A",
          ["line"] = 497,
        },
        [5] = {
          ["key"] = "trigger1",
          ["value"] = "ctrl",
          ["line"] = 498,
        },
        [6] = {
          ["key"] = "trigger2",
          ["value"] = "stateno = 1020",
          ["line"] = 499,
        },
        [7] = {
          ["key"] = "trigger2",
          ["value"] = "statetime >= 12",
          ["line"] = 500,
        },
      },
    },
  },
}
config["states"][3] = {
  ["id"] = 200,
  ["source"] = "pikachu.cns",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "S",
      ["line"] = 410,
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "A",
      ["line"] = 411,
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "S",
      ["line"] = 412,
    },
    [4] = {
      ["key"] = "juggle",
      ["value"] = "4",
      ["line"] = 413,
    },
    [5] = {
      ["key"] = "poweradd",
      ["value"] = "50",
      ["line"] = 414,
    },
    [6] = {
      ["key"] = "ctrl",
      ["value"] = "0",
      ["line"] = 415,
    },
    [7] = {
      ["key"] = "velset",
      ["value"] = "0,0",
      ["line"] = 416,
    },
    [8] = {
      ["key"] = "anim",
      ["value"] = "200",
      ["line"] = 417,
    },
    [9] = {
      ["key"] = "sprpriority",
      ["value"] = "1",
      ["line"] = 418,
    },
  },
  ["controllers"] = {
    [1] = {
      ["type"] = "HitDef",
      ["source"] = "pikachu.cns",
      ["line"] = 446,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "HitDef",
          ["line"] = 447,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "AnimElem = 3",
          ["line"] = 448,
        },
        [3] = {
          ["key"] = "attr",
          ["value"] = "S, NA",
          ["line"] = 449,
        },
        [4] = {
          ["key"] = "damage",
          ["value"] = "20, 0",
          ["line"] = 450,
        },
        [5] = {
          ["key"] = "animtype",
          ["value"] = "Light",
          ["line"] = 451,
        },
        [6] = {
          ["key"] = "guardflag",
          ["value"] = "MA",
          ["line"] = 452,
        },
        [7] = {
          ["key"] = "hitflag",
          ["value"] = "MAF",
          ["line"] = 453,
        },
        [8] = {
          ["key"] = "priority",
          ["value"] = "3, Hit",
          ["line"] = 454,
        },
        [9] = {
          ["key"] = "pausetime",
          ["value"] = "3, 8",
          ["line"] = 455,
        },
        [10] = {
          ["key"] = "sparkno",
          ["value"] = "0",
          ["line"] = 456,
        },
        [11] = {
          ["key"] = "sparkxy",
          ["value"] = "-10, -30",
          ["line"] = 457,
        },
        [12] = {
          ["key"] = "hitsound",
          ["value"] = "s900,5",
          ["line"] = 458,
        },
        [13] = {
          ["key"] = "guardsound",
          ["value"] = "6, 0",
          ["line"] = 459,
        },
        [14] = {
          ["key"] = "ground.type",
          ["value"] = "High",
          ["line"] = 460,
        },
        [15] = {
          ["key"] = "ground.slidetime",
          ["value"] = "3",
          ["line"] = 461,
        },
        [16] = {
          ["key"] = "ground.hittime",
          ["value"] = "10",
          ["line"] = 462,
        },
        [17] = {
          ["key"] = "ground.velocity",
          ["value"] = "-3",
          ["line"] = 463,
        },
        [18] = {
          ["key"] = "airguard.velocity",
          ["value"] = "-2,-1",
          ["line"] = 464,
        },
        [19] = {
          ["key"] = "air.type",
          ["value"] = "High",
          ["line"] = 465,
        },
        [20] = {
          ["key"] = "ground.slidetime",
          ["value"] = "1",
          ["line"] = 466,
        },
        [21] = {
          ["key"] = "ground.hittime",
          ["value"] = "6",
          ["line"] = 467,
        },
        [22] = {
          ["key"] = "ground.velocity",
          ["value"] = "-1,-1",
          ["line"] = 468,
        },
        [23] = {
          ["key"] = "air.velocity",
          ["value"] = "-2,-1",
          ["line"] = 469,
        },
        [24] = {
          ["key"] = "palfx.time",
          ["value"] = "15",
          ["line"] = 470,
        },
        [25] = {
          ["key"] = "palfx.mul",
          ["value"] = "256,256,256",
          ["line"] = 471,
        },
        [26] = {
          ["key"] = "palfx.add",
          ["value"] = "100,100,180",
          ["line"] = 472,
        },
        [27] = {
          ["key"] = "palfx.sinadd",
          ["value"] = "-80,-80,-80,6",
          ["line"] = 473,
        },
        [28] = {
          ["key"] = "palfx.color",
          ["value"] = "250",
          ["line"] = 474,
        },
      },
    },
    [2] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cns",
      ["line"] = 507,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 508,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "AnimTime = 0",
          ["line"] = 509,
        },
        [3] = {
          ["key"] = "value",
          ["value"] = "0",
          ["line"] = 510,
        },
        [4] = {
          ["key"] = "ctrl",
          ["value"] = "1",
          ["line"] = 511,
        },
      },
    },
  },
}
config["states"][4] = {
  ["id"] = 210,
  ["source"] = "pikachu.cns",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "S",
      ["line"] = 516,
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "A",
      ["line"] = 517,
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "S",
      ["line"] = 518,
    },
    [4] = {
      ["key"] = "juggle",
      ["value"] = "4",
      ["line"] = 519,
    },
    [5] = {
      ["key"] = "poweradd",
      ["value"] = "90",
      ["line"] = 520,
    },
    [6] = {
      ["key"] = "ctrl",
      ["value"] = "0",
      ["line"] = 521,
    },
    [7] = {
      ["key"] = "velset",
      ["value"] = "0,0",
      ["line"] = 522,
    },
    [8] = {
      ["key"] = "anim",
      ["value"] = "210",
      ["line"] = 523,
    },
    [9] = {
      ["key"] = "sprpriority",
      ["value"] = "1",
      ["line"] = 524,
    },
  },
  ["controllers"] = {
    [1] = {
      ["type"] = "HitDef",
      ["source"] = "pikachu.cns",
      ["line"] = 553,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "HitDef",
          ["line"] = 554,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "AnimElem = 3",
          ["line"] = 555,
        },
        [3] = {
          ["key"] = "attr",
          ["value"] = "S, NA",
          ["line"] = 556,
        },
        [4] = {
          ["key"] = "damage",
          ["value"] = "40, 0",
          ["line"] = 557,
        },
        [5] = {
          ["key"] = "animtype",
          ["value"] = "Light",
          ["line"] = 558,
        },
        [6] = {
          ["key"] = "guardflag",
          ["value"] = "MA",
          ["line"] = 559,
        },
        [7] = {
          ["key"] = "hitflag",
          ["value"] = "MAF",
          ["line"] = 560,
        },
        [8] = {
          ["key"] = "priority",
          ["value"] = "3, Hit",
          ["line"] = 561,
        },
        [9] = {
          ["key"] = "pausetime",
          ["value"] = "3, 8",
          ["line"] = 562,
        },
        [10] = {
          ["key"] = "sparkno",
          ["value"] = "0",
          ["line"] = 563,
        },
        [11] = {
          ["key"] = "sparkxy",
          ["value"] = "-10, -30",
          ["line"] = 564,
        },
        [12] = {
          ["key"] = "hitsound",
          ["value"] = "s900,5",
          ["line"] = 565,
        },
        [13] = {
          ["key"] = "guardsound",
          ["value"] = "6, 0",
          ["line"] = 566,
        },
        [14] = {
          ["key"] = "ground.type",
          ["value"] = "High",
          ["line"] = 567,
        },
        [15] = {
          ["key"] = "ground.slidetime",
          ["value"] = "3",
          ["line"] = 568,
        },
        [16] = {
          ["key"] = "ground.hittime",
          ["value"] = "10",
          ["line"] = 569,
        },
        [17] = {
          ["key"] = "ground.velocity",
          ["value"] = "-3",
          ["line"] = 570,
        },
        [18] = {
          ["key"] = "airguard.velocity",
          ["value"] = "-2,-1",
          ["line"] = 571,
        },
        [19] = {
          ["key"] = "air.type",
          ["value"] = "High",
          ["line"] = 572,
        },
        [20] = {
          ["key"] = "ground.slidetime",
          ["value"] = "1",
          ["line"] = 573,
        },
        [21] = {
          ["key"] = "ground.hittime",
          ["value"] = "6",
          ["line"] = 574,
        },
        [22] = {
          ["key"] = "ground.velocity",
          ["value"] = "-1,-1",
          ["line"] = 575,
        },
        [23] = {
          ["key"] = "air.velocity",
          ["value"] = "-2,-1",
          ["line"] = 576,
        },
        [24] = {
          ["key"] = "palfx.time",
          ["value"] = "15",
          ["line"] = 577,
        },
        [25] = {
          ["key"] = "palfx.mul",
          ["value"] = "256,256,256",
          ["line"] = 578,
        },
        [26] = {
          ["key"] = "palfx.add",
          ["value"] = "100,100,180",
          ["line"] = 579,
        },
        [27] = {
          ["key"] = "palfx.sinadd",
          ["value"] = "-80,-80,-80,6",
          ["line"] = 580,
        },
        [28] = {
          ["key"] = "palfx.color",
          ["value"] = "250",
          ["line"] = 581,
        },
      },
    },
    [2] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cns",
      ["line"] = 614,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 615,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "AnimTime = 0",
          ["line"] = 616,
        },
        [3] = {
          ["key"] = "value",
          ["value"] = "0",
          ["line"] = 617,
        },
        [4] = {
          ["key"] = "ctrl",
          ["value"] = "1",
          ["line"] = 618,
        },
      },
    },
  },
}
config["states"][5] = {
  ["id"] = 220,
  ["source"] = "pikachu.cns",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "S",
      ["line"] = 622,
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "A",
      ["line"] = 623,
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "S",
      ["line"] = 624,
    },
    [4] = {
      ["key"] = "juggle",
      ["value"] = "4",
      ["line"] = 625,
    },
    [5] = {
      ["key"] = "poweradd",
      ["value"] = "90",
      ["line"] = 626,
    },
    [6] = {
      ["key"] = "velset",
      ["value"] = "0,0",
      ["line"] = 627,
    },
    [7] = {
      ["key"] = "ctrl",
      ["value"] = "0",
      ["line"] = 628,
    },
    [8] = {
      ["key"] = "anim",
      ["value"] = "220",
      ["line"] = 629,
    },
    [9] = {
      ["key"] = "sprpriority",
      ["value"] = "1",
      ["line"] = 630,
    },
  },
  ["controllers"] = {
    [1] = {
      ["type"] = "Velset",
      ["source"] = "pikachu.cns",
      ["line"] = 658,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "Velset",
          ["line"] = 659,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "animelem = 1",
          ["line"] = 660,
        },
        [3] = {
          ["key"] = "trigger2",
          ["value"] = "animelem = 2",
          ["line"] = 661,
        },
        [4] = {
          ["key"] = "x",
          ["value"] = "0",
          ["line"] = 662,
        },
        [5] = {
          ["key"] = "y",
          ["value"] = "0",
          ["line"] = 663,
        },
      },
    },
    [2] = {
      ["type"] = "Velset",
      ["source"] = "pikachu.cns",
      ["line"] = 667,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "Velset",
          ["line"] = 668,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "animelem = 3",
          ["line"] = 669,
        },
        [3] = {
          ["key"] = "trigger2",
          ["value"] = "animelem = 4",
          ["line"] = 670,
        },
        [4] = {
          ["key"] = "trigger3",
          ["value"] = "animelem = 5",
          ["line"] = 671,
        },
        [5] = {
          ["key"] = "trigger4",
          ["value"] = "animelem = 6",
          ["line"] = 672,
        },
        [6] = {
          ["key"] = "x",
          ["value"] = "10",
          ["line"] = 673,
        },
        [7] = {
          ["key"] = "y",
          ["value"] = "0",
          ["line"] = 674,
        },
      },
    },
    [3] = {
      ["type"] = "Velset",
      ["source"] = "pikachu.cns",
      ["line"] = 676,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "Velset",
          ["line"] = 677,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "animelem = 7",
          ["line"] = 678,
        },
        [3] = {
          ["key"] = "x",
          ["value"] = "4",
          ["line"] = 679,
        },
        [4] = {
          ["key"] = "y",
          ["value"] = "0",
          ["line"] = 680,
        },
      },
    },
    [4] = {
      ["type"] = "HitDef",
      ["source"] = "pikachu.cns",
      ["line"] = 717,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "HitDef",
          ["line"] = 718,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "AnimElem = 4",
          ["line"] = 719,
        },
        [3] = {
          ["key"] = "trigger2",
          ["value"] = "AnimElem = 5",
          ["line"] = 720,
        },
        [4] = {
          ["key"] = "attr",
          ["value"] = "S, NA",
          ["line"] = 721,
        },
        [5] = {
          ["key"] = "damage",
          ["value"] = "23, 0",
          ["line"] = 722,
        },
        [6] = {
          ["key"] = "animtype",
          ["value"] = "Light",
          ["line"] = 723,
        },
        [7] = {
          ["key"] = "guardflag",
          ["value"] = "MA",
          ["line"] = 724,
        },
        [8] = {
          ["key"] = "hitflag",
          ["value"] = "MAF",
          ["line"] = 725,
        },
        [9] = {
          ["key"] = "priority",
          ["value"] = "3, Hit",
          ["line"] = 726,
        },
        [10] = {
          ["key"] = "pausetime",
          ["value"] = "3, 8",
          ["line"] = 727,
        },
        [11] = {
          ["key"] = "sparkno",
          ["value"] = "1",
          ["line"] = 728,
        },
        [12] = {
          ["key"] = "sparkxy",
          ["value"] = "-10, -30",
          ["line"] = 729,
        },
        [13] = {
          ["key"] = "hitsound",
          ["value"] = "s900,5",
          ["line"] = 730,
        },
        [14] = {
          ["key"] = "guardsound",
          ["value"] = "6, 0",
          ["line"] = 731,
        },
        [15] = {
          ["key"] = "ground.type",
          ["value"] = "High",
          ["line"] = 732,
        },
        [16] = {
          ["key"] = "ground.slidetime",
          ["value"] = "5",
          ["line"] = 733,
        },
        [17] = {
          ["key"] = "ground.hittime",
          ["value"] = "10",
          ["line"] = 734,
        },
        [18] = {
          ["key"] = "ground.velocity",
          ["value"] = "-4",
          ["line"] = 735,
        },
        [19] = {
          ["key"] = "airguard.velocity",
          ["value"] = "-1.9,-.8",
          ["line"] = 736,
        },
        [20] = {
          ["key"] = "air.type",
          ["value"] = "High",
          ["line"] = 737,
        },
        [21] = {
          ["key"] = "ground.slidetime",
          ["value"] = "6",
          ["line"] = 738,
        },
        [22] = {
          ["key"] = "ground.hittime",
          ["value"] = "6",
          ["line"] = 739,
        },
        [23] = {
          ["key"] = "air.velocity",
          ["value"] = "-4,-1",
          ["line"] = 740,
        },
        [24] = {
          ["key"] = "palfx.time",
          ["value"] = "15",
          ["line"] = 741,
        },
        [25] = {
          ["key"] = "palfx.mul",
          ["value"] = "256,256,256",
          ["line"] = 742,
        },
        [26] = {
          ["key"] = "palfx.add",
          ["value"] = "100,100,180",
          ["line"] = 743,
        },
        [27] = {
          ["key"] = "palfx.sinadd",
          ["value"] = "-80,-80,-80,6",
          ["line"] = 744,
        },
        [28] = {
          ["key"] = "palfx.color",
          ["value"] = "250",
          ["line"] = 745,
        },
      },
    },
    [5] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cns",
      ["line"] = 773,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 774,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "AnimTime = 0",
          ["line"] = 775,
        },
        [3] = {
          ["key"] = "value",
          ["value"] = "0",
          ["line"] = 776,
        },
        [4] = {
          ["key"] = "ctrl",
          ["value"] = "1",
          ["line"] = 777,
        },
      },
    },
  },
}
config["states"][6] = {
  ["id"] = 230,
  ["source"] = "pikachu.cns",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "S",
      ["line"] = 781,
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "A",
      ["line"] = 782,
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "S",
      ["line"] = 783,
    },
    [4] = {
      ["key"] = "juggle",
      ["value"] = "4",
      ["line"] = 784,
    },
    [5] = {
      ["key"] = "poweradd",
      ["value"] = "50",
      ["line"] = 785,
    },
    [6] = {
      ["key"] = "ctrl",
      ["value"] = "0",
      ["line"] = 786,
    },
    [7] = {
      ["key"] = "velset",
      ["value"] = "2,0",
      ["line"] = 787,
    },
    [8] = {
      ["key"] = "anim",
      ["value"] = "230",
      ["line"] = 788,
    },
    [9] = {
      ["key"] = "sprpriority",
      ["value"] = "1",
      ["line"] = 789,
    },
  },
  ["controllers"] = {
    [1] = {
      ["type"] = "HitDef",
      ["source"] = "pikachu.cns",
      ["line"] = 796,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "HitDef",
          ["line"] = 797,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "time = 0",
          ["line"] = 798,
        },
        [3] = {
          ["key"] = "attr",
          ["value"] = "S, NA",
          ["line"] = 799,
        },
        [4] = {
          ["key"] = "damage",
          ["value"] = "23, 0",
          ["line"] = 800,
        },
        [5] = {
          ["key"] = "animtype",
          ["value"] = "Light",
          ["line"] = 801,
        },
        [6] = {
          ["key"] = "guardflag",
          ["value"] = "MA",
          ["line"] = 802,
        },
        [7] = {
          ["key"] = "hitflag",
          ["value"] = "MAF",
          ["line"] = 803,
        },
        [8] = {
          ["key"] = "priority",
          ["value"] = "3, Hit",
          ["line"] = 804,
        },
        [9] = {
          ["key"] = "pausetime",
          ["value"] = "3, 8",
          ["line"] = 805,
        },
        [10] = {
          ["key"] = "sparkno",
          ["value"] = "0",
          ["line"] = 806,
        },
        [11] = {
          ["key"] = "sparkxy",
          ["value"] = "-10, -30",
          ["line"] = 807,
        },
        [12] = {
          ["key"] = "hitsound",
          ["value"] = "s1,2",
          ["line"] = 808,
        },
        [13] = {
          ["key"] = "guardsound",
          ["value"] = "6, 0",
          ["line"] = 809,
        },
        [14] = {
          ["key"] = "ground.type",
          ["value"] = "High",
          ["line"] = 810,
        },
        [15] = {
          ["key"] = "ground.slidetime",
          ["value"] = "2",
          ["line"] = 811,
        },
        [16] = {
          ["key"] = "ground.hittime",
          ["value"] = "10",
          ["line"] = 812,
        },
        [17] = {
          ["key"] = "ground.velocity",
          ["value"] = "-2",
          ["line"] = 813,
        },
        [18] = {
          ["key"] = "airguard.velocity",
          ["value"] = "-1.9,-.8",
          ["line"] = 814,
        },
        [19] = {
          ["key"] = "air.type",
          ["value"] = "High",
          ["line"] = 815,
        },
        [20] = {
          ["key"] = "ground.slidetime",
          ["value"] = "1",
          ["line"] = 816,
        },
        [21] = {
          ["key"] = "ground.hittime",
          ["value"] = "6",
          ["line"] = 817,
        },
        [22] = {
          ["key"] = "ground.velocity",
          ["value"] = "-1,-3",
          ["line"] = 818,
        },
        [23] = {
          ["key"] = "air.velocity",
          ["value"] = "-0,-2",
          ["line"] = 819,
        },
      },
    },
    [2] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cns",
      ["line"] = 834,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 835,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "AnimTime = 0",
          ["line"] = 836,
        },
        [3] = {
          ["key"] = "value",
          ["value"] = "0",
          ["line"] = 837,
        },
        [4] = {
          ["key"] = "ctrl",
          ["value"] = "1",
          ["line"] = 838,
        },
      },
    },
  },
}
config["states"][7] = {
  ["id"] = 240,
  ["source"] = "pikachu.cns",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "S",
      ["line"] = 843,
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "A",
      ["line"] = 844,
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "S",
      ["line"] = 845,
    },
    [4] = {
      ["key"] = "juggle",
      ["value"] = "4",
      ["line"] = 846,
    },
    [5] = {
      ["key"] = "poweradd",
      ["value"] = "50",
      ["line"] = 847,
    },
    [6] = {
      ["key"] = "ctrl",
      ["value"] = "0",
      ["line"] = 848,
    },
    [7] = {
      ["key"] = "velset",
      ["value"] = "2,0",
      ["line"] = 849,
    },
    [8] = {
      ["key"] = "anim",
      ["value"] = "240",
      ["line"] = 850,
    },
    [9] = {
      ["key"] = "sprpriority",
      ["value"] = "1",
      ["line"] = 851,
    },
  },
  ["controllers"] = {
    [1] = {
      ["type"] = "HitDef",
      ["source"] = "pikachu.cns",
      ["line"] = 858,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "HitDef",
          ["line"] = 859,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "time = 0",
          ["line"] = 860,
        },
        [3] = {
          ["key"] = "attr",
          ["value"] = "S, NA",
          ["line"] = 861,
        },
        [4] = {
          ["key"] = "damage",
          ["value"] = "23, 0",
          ["line"] = 862,
        },
        [5] = {
          ["key"] = "animtype",
          ["value"] = "Light",
          ["line"] = 863,
        },
        [6] = {
          ["key"] = "guardflag",
          ["value"] = "MA",
          ["line"] = 864,
        },
        [7] = {
          ["key"] = "hitflag",
          ["value"] = "MAF",
          ["line"] = 865,
        },
        [8] = {
          ["key"] = "priority",
          ["value"] = "3, Hit",
          ["line"] = 866,
        },
        [9] = {
          ["key"] = "pausetime",
          ["value"] = "3, 8",
          ["line"] = 867,
        },
        [10] = {
          ["key"] = "sparkno",
          ["value"] = "0",
          ["line"] = 868,
        },
        [11] = {
          ["key"] = "sparkxy",
          ["value"] = "-10, -30",
          ["line"] = 869,
        },
        [12] = {
          ["key"] = "hitsound",
          ["value"] = "s1,2",
          ["line"] = 870,
        },
        [13] = {
          ["key"] = "guardsound",
          ["value"] = "6, 0",
          ["line"] = 871,
        },
        [14] = {
          ["key"] = "ground.type",
          ["value"] = "High",
          ["line"] = 872,
        },
        [15] = {
          ["key"] = "ground.slidetime",
          ["value"] = "2",
          ["line"] = 873,
        },
        [16] = {
          ["key"] = "ground.hittime",
          ["value"] = "10",
          ["line"] = 874,
        },
        [17] = {
          ["key"] = "ground.velocity",
          ["value"] = "-2",
          ["line"] = 875,
        },
        [18] = {
          ["key"] = "airguard.velocity",
          ["value"] = "-1.9,-.8",
          ["line"] = 876,
        },
        [19] = {
          ["key"] = "air.type",
          ["value"] = "High",
          ["line"] = 877,
        },
        [20] = {
          ["key"] = "ground.slidetime",
          ["value"] = "1",
          ["line"] = 878,
        },
        [21] = {
          ["key"] = "ground.hittime",
          ["value"] = "6",
          ["line"] = 879,
        },
        [22] = {
          ["key"] = "ground.velocity",
          ["value"] = "-1,-3",
          ["line"] = 880,
        },
        [23] = {
          ["key"] = "air.velocity",
          ["value"] = "-0,-2",
          ["line"] = 881,
        },
      },
    },
    [2] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cns",
      ["line"] = 896,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 897,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "AnimTime = 0",
          ["line"] = 898,
        },
        [3] = {
          ["key"] = "value",
          ["value"] = "0",
          ["line"] = 899,
        },
        [4] = {
          ["key"] = "ctrl",
          ["value"] = "1",
          ["line"] = 900,
        },
      },
    },
  },
}
config["states"][8] = {
  ["id"] = 250,
  ["source"] = "pikachu.cns",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "S",
      ["line"] = 905,
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "A",
      ["line"] = 906,
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "S",
      ["line"] = 907,
    },
    [4] = {
      ["key"] = "juggle",
      ["value"] = "1",
      ["line"] = 908,
    },
    [5] = {
      ["key"] = "poweradd",
      ["value"] = "50",
      ["line"] = 909,
    },
    [6] = {
      ["key"] = "ctrl",
      ["value"] = "0",
      ["line"] = 910,
    },
    [7] = {
      ["key"] = "velset",
      ["value"] = "2,0",
      ["line"] = 911,
    },
    [8] = {
      ["key"] = "anim",
      ["value"] = "250",
      ["line"] = 912,
    },
    [9] = {
      ["key"] = "sprpriority",
      ["value"] = "1",
      ["line"] = 913,
    },
  },
  ["controllers"] = {
    [1] = {
      ["type"] = "HitDef",
      ["source"] = "pikachu.cns",
      ["line"] = 933,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "HitDef",
          ["line"] = 934,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "time = 0",
          ["line"] = 935,
        },
        [3] = {
          ["key"] = "attr",
          ["value"] = "S, NA",
          ["line"] = 936,
        },
        [4] = {
          ["key"] = "damage",
          ["value"] = "23, 0",
          ["line"] = 937,
        },
        [5] = {
          ["key"] = "animtype",
          ["value"] = "Back",
          ["line"] = 938,
        },
        [6] = {
          ["key"] = "guardflag",
          ["value"] = "MA",
          ["line"] = 939,
        },
        [7] = {
          ["key"] = "hitflag",
          ["value"] = "MAF",
          ["line"] = 940,
        },
        [8] = {
          ["key"] = "priority",
          ["value"] = "3, Hit",
          ["line"] = 941,
        },
        [9] = {
          ["key"] = "pausetime",
          ["value"] = "0, 8",
          ["line"] = 942,
        },
        [10] = {
          ["key"] = "sparkno",
          ["value"] = "0",
          ["line"] = 943,
        },
        [11] = {
          ["key"] = "sparkxy",
          ["value"] = "-10, -30",
          ["line"] = 944,
        },
        [12] = {
          ["key"] = "hitsound",
          ["value"] = "s1,2",
          ["line"] = 945,
        },
        [13] = {
          ["key"] = "guardsound",
          ["value"] = "6, 0",
          ["line"] = 946,
        },
        [14] = {
          ["key"] = "ground.type",
          ["value"] = "High",
          ["line"] = 947,
        },
        [15] = {
          ["key"] = "ground.slidetime",
          ["value"] = "2",
          ["line"] = 948,
        },
        [16] = {
          ["key"] = "ground.hittime",
          ["value"] = "10",
          ["line"] = 949,
        },
        [17] = {
          ["key"] = "ground.velocity",
          ["value"] = "-.7,-7.3",
          ["line"] = 950,
        },
        [18] = {
          ["key"] = "airguard.velocity",
          ["value"] = "-1,-.8",
          ["line"] = 951,
        },
        [19] = {
          ["key"] = "air.type",
          ["value"] = "High",
          ["line"] = 952,
        },
        [20] = {
          ["key"] = "ground.slidetime",
          ["value"] = "1",
          ["line"] = 953,
        },
        [21] = {
          ["key"] = "ground.hittime",
          ["value"] = "6",
          ["line"] = 954,
        },
        [22] = {
          ["key"] = "air.velocity",
          ["value"] = "-.7,-7.3",
          ["line"] = 955,
        },
        [23] = {
          ["key"] = "fall",
          ["value"] = "1",
          ["line"] = 956,
        },
        [24] = {
          ["key"] = "palfx.time",
          ["value"] = "20",
          ["line"] = 957,
        },
        [25] = {
          ["key"] = "palfx.mul",
          ["value"] = "256,256,256",
          ["line"] = 958,
        },
        [26] = {
          ["key"] = "palfx.add",
          ["value"] = "100,100,100",
          ["line"] = 959,
        },
        [27] = {
          ["key"] = "palfx.sinadd",
          ["value"] = "-80,-80,-80,15",
          ["line"] = 960,
        },
        [28] = {
          ["key"] = "palfx.color",
          ["value"] = "255",
          ["line"] = 961,
        },
      },
    },
    [2] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cns",
      ["line"] = 976,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 977,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "AnimTime = 0",
          ["line"] = 978,
        },
        [3] = {
          ["key"] = "value",
          ["value"] = "0",
          ["line"] = 979,
        },
        [4] = {
          ["key"] = "ctrl",
          ["value"] = "1",
          ["line"] = 980,
        },
      },
    },
  },
}
config["states"][9] = {
  ["id"] = 400,
  ["source"] = "pikachu.cns",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "C",
      ["line"] = 985,
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "A",
      ["line"] = 986,
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "C",
      ["line"] = 987,
    },
    [4] = {
      ["key"] = "juggle",
      ["value"] = "5",
      ["line"] = 988,
    },
    [5] = {
      ["key"] = "poweradd",
      ["value"] = "50",
      ["line"] = 989,
    },
    [6] = {
      ["key"] = "ctrl",
      ["value"] = "0",
      ["line"] = 990,
    },
    [7] = {
      ["key"] = "anim",
      ["value"] = "400",
      ["line"] = 991,
    },
    [8] = {
      ["key"] = "sprpriority",
      ["value"] = "2",
      ["line"] = 992,
    },
  },
  ["controllers"] = {
    [1] = {
      ["type"] = "HitDef",
      ["source"] = "pikachu.cns",
      ["line"] = 1020,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "HitDef",
          ["line"] = 1021,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "AnimElem = 3",
          ["line"] = 1022,
        },
        [3] = {
          ["key"] = "attr",
          ["value"] = "S, NA",
          ["line"] = 1023,
        },
        [4] = {
          ["key"] = "damage",
          ["value"] = "20, 0",
          ["line"] = 1024,
        },
        [5] = {
          ["key"] = "animtype",
          ["value"] = "Light",
          ["line"] = 1025,
        },
        [6] = {
          ["key"] = "guardflag",
          ["value"] = "MA",
          ["line"] = 1026,
        },
        [7] = {
          ["key"] = "hitflag",
          ["value"] = "MAF",
          ["line"] = 1027,
        },
        [8] = {
          ["key"] = "priority",
          ["value"] = "3, Hit",
          ["line"] = 1028,
        },
        [9] = {
          ["key"] = "pausetime",
          ["value"] = "3, 8",
          ["line"] = 1029,
        },
        [10] = {
          ["key"] = "sparkno",
          ["value"] = "0",
          ["line"] = 1030,
        },
        [11] = {
          ["key"] = "sparkxy",
          ["value"] = "-10, -30",
          ["line"] = 1031,
        },
        [12] = {
          ["key"] = "hitsound",
          ["value"] = "s900,5",
          ["line"] = 1032,
        },
        [13] = {
          ["key"] = "guardsound",
          ["value"] = "6, 0",
          ["line"] = 1033,
        },
        [14] = {
          ["key"] = "ground.type",
          ["value"] = "Low",
          ["line"] = 1034,
        },
        [15] = {
          ["key"] = "ground.slidetime",
          ["value"] = "3",
          ["line"] = 1035,
        },
        [16] = {
          ["key"] = "ground.hittime",
          ["value"] = "10",
          ["line"] = 1036,
        },
        [17] = {
          ["key"] = "ground.velocity",
          ["value"] = "-3",
          ["line"] = 1037,
        },
        [18] = {
          ["key"] = "airguard.velocity",
          ["value"] = "-2,-1",
          ["line"] = 1038,
        },
        [19] = {
          ["key"] = "air.type",
          ["value"] = "High",
          ["line"] = 1039,
        },
        [20] = {
          ["key"] = "ground.slidetime",
          ["value"] = "1",
          ["line"] = 1040,
        },
        [21] = {
          ["key"] = "ground.hittime",
          ["value"] = "6",
          ["line"] = 1041,
        },
        [22] = {
          ["key"] = "ground.velocity",
          ["value"] = "-1,-1",
          ["line"] = 1042,
        },
        [23] = {
          ["key"] = "air.velocity",
          ["value"] = "-2,-1",
          ["line"] = 1043,
        },
        [24] = {
          ["key"] = "palfx.time",
          ["value"] = "15",
          ["line"] = 1044,
        },
        [25] = {
          ["key"] = "palfx.mul",
          ["value"] = "256,256,256",
          ["line"] = 1045,
        },
        [26] = {
          ["key"] = "palfx.add",
          ["value"] = "100,100,180",
          ["line"] = 1046,
        },
        [27] = {
          ["key"] = "palfx.sinadd",
          ["value"] = "-80,-80,-80,6",
          ["line"] = 1047,
        },
        [28] = {
          ["key"] = "palfx.color",
          ["value"] = "250",
          ["line"] = 1048,
        },
      },
    },
    [2] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cns",
      ["line"] = 1081,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 1082,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "AnimTime = 0",
          ["line"] = 1083,
        },
        [3] = {
          ["key"] = "value",
          ["value"] = "11",
          ["line"] = 1084,
        },
        [4] = {
          ["key"] = "ctrl",
          ["value"] = "1",
          ["line"] = 1085,
        },
      },
    },
  },
}
config["states"][10] = {
  ["id"] = 410,
  ["source"] = "pikachu.cns",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "C",
      ["line"] = 1090,
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "A",
      ["line"] = 1091,
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "C",
      ["line"] = 1092,
    },
    [4] = {
      ["key"] = "juggle",
      ["value"] = "6",
      ["line"] = 1093,
    },
    [5] = {
      ["key"] = "poweradd",
      ["value"] = "90",
      ["line"] = 1094,
    },
    [6] = {
      ["key"] = "ctrl",
      ["value"] = "0",
      ["line"] = 1095,
    },
    [7] = {
      ["key"] = "anim",
      ["value"] = "410",
      ["line"] = 1096,
    },
    [8] = {
      ["key"] = "sprpriority",
      ["value"] = "2",
      ["line"] = 1097,
    },
  },
  ["controllers"] = {
    [1] = {
      ["type"] = "HitDef",
      ["source"] = "pikachu.cns",
      ["line"] = 1126,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "HitDef",
          ["line"] = 1127,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "AnimElem = 3",
          ["line"] = 1128,
        },
        [3] = {
          ["key"] = "attr",
          ["value"] = "S, NA",
          ["line"] = 1129,
        },
        [4] = {
          ["key"] = "damage",
          ["value"] = "40, 0",
          ["line"] = 1130,
        },
        [5] = {
          ["key"] = "animtype",
          ["value"] = "Heavy",
          ["line"] = 1131,
        },
        [6] = {
          ["key"] = "guardflag",
          ["value"] = "MA",
          ["line"] = 1132,
        },
        [7] = {
          ["key"] = "hitflag",
          ["value"] = "MAF",
          ["line"] = 1133,
        },
        [8] = {
          ["key"] = "priority",
          ["value"] = "3, Hit",
          ["line"] = 1134,
        },
        [9] = {
          ["key"] = "pausetime",
          ["value"] = "3, 8",
          ["line"] = 1135,
        },
        [10] = {
          ["key"] = "sparkno",
          ["value"] = "0",
          ["line"] = 1136,
        },
        [11] = {
          ["key"] = "sparkxy",
          ["value"] = "-10, -30",
          ["line"] = 1137,
        },
        [12] = {
          ["key"] = "hitsound",
          ["value"] = "s900,5",
          ["line"] = 1138,
        },
        [13] = {
          ["key"] = "guardsound",
          ["value"] = "6, 0",
          ["line"] = 1139,
        },
        [14] = {
          ["key"] = "ground.type",
          ["value"] = "Low",
          ["line"] = 1140,
        },
        [15] = {
          ["key"] = "ground.slidetime",
          ["value"] = "3",
          ["line"] = 1141,
        },
        [16] = {
          ["key"] = "ground.hittime",
          ["value"] = "10",
          ["line"] = 1142,
        },
        [17] = {
          ["key"] = "ground.velocity",
          ["value"] = "-3",
          ["line"] = 1143,
        },
        [18] = {
          ["key"] = "airguard.velocity",
          ["value"] = "-2,-1",
          ["line"] = 1144,
        },
        [19] = {
          ["key"] = "air.type",
          ["value"] = "High",
          ["line"] = 1145,
        },
        [20] = {
          ["key"] = "ground.slidetime",
          ["value"] = "1",
          ["line"] = 1146,
        },
        [21] = {
          ["key"] = "ground.hittime",
          ["value"] = "6",
          ["line"] = 1147,
        },
        [22] = {
          ["key"] = "ground.velocity",
          ["value"] = "-1,-1",
          ["line"] = 1148,
        },
        [23] = {
          ["key"] = "air.velocity",
          ["value"] = "-2,-1",
          ["line"] = 1149,
        },
        [24] = {
          ["key"] = "palfx.time",
          ["value"] = "15",
          ["line"] = 1150,
        },
        [25] = {
          ["key"] = "palfx.mul",
          ["value"] = "256,256,256",
          ["line"] = 1151,
        },
        [26] = {
          ["key"] = "palfx.add",
          ["value"] = "100,100,180",
          ["line"] = 1152,
        },
        [27] = {
          ["key"] = "palfx.sinadd",
          ["value"] = "-80,-80,-80,6",
          ["line"] = 1153,
        },
        [28] = {
          ["key"] = "palfx.color",
          ["value"] = "250",
          ["line"] = 1154,
        },
      },
    },
    [2] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cns",
      ["line"] = 1187,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 1188,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "AnimTime = 0",
          ["line"] = 1189,
        },
        [3] = {
          ["key"] = "value",
          ["value"] = "11",
          ["line"] = 1190,
        },
        [4] = {
          ["key"] = "ctrl",
          ["value"] = "1",
          ["line"] = 1191,
        },
      },
    },
  },
}
config["states"][11] = {
  ["id"] = 420,
  ["source"] = "pikachu.cns",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "C",
      ["line"] = 1195,
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "A",
      ["line"] = 1196,
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "S",
      ["line"] = 1197,
    },
    [4] = {
      ["key"] = "juggle",
      ["value"] = "3",
      ["line"] = 1198,
    },
    [5] = {
      ["key"] = "velset",
      ["value"] = "0,0",
      ["line"] = 1199,
    },
    [6] = {
      ["key"] = "poweradd",
      ["value"] = "50",
      ["line"] = 1200,
    },
    [7] = {
      ["key"] = "ctrl",
      ["value"] = "0",
      ["line"] = 1201,
    },
    [8] = {
      ["key"] = "anim",
      ["value"] = "500",
      ["line"] = 1202,
    },
    [9] = {
      ["key"] = "sprpriority",
      ["value"] = "3",
      ["line"] = 1203,
    },
  },
  ["controllers"] = {
    [1] = {
      ["type"] = "Explod",
      ["source"] = "pikachu.cns",
      ["line"] = 1220,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "Explod",
          ["line"] = 1221,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "animelem = 1",
          ["line"] = 1222,
        },
        [3] = {
          ["key"] = "anim",
          ["value"] = "34675",
          ["line"] = 1223,
        },
        [4] = {
          ["key"] = "pos",
          ["value"] = "10,0",
          ["line"] = 1224,
        },
        [5] = {
          ["key"] = "scale",
          ["value"] = "1,1",
          ["line"] = 1225,
        },
        [6] = {
          ["key"] = "facing",
          ["value"] = "-1",
          ["line"] = 1226,
        },
        [7] = {
          ["key"] = "sprpriority",
          ["value"] = "-3",
          ["line"] = 1227,
        },
        [8] = {
          ["key"] = "ownpal",
          ["value"] = "1",
          ["line"] = 1228,
        },
        [9] = {
          ["key"] = "ignorehitpause",
          ["value"] = "1",
          ["line"] = 1229,
        },
      },
    },
    [2] = {
      ["type"] = "VelAdd",
      ["source"] = "pikachu.cns",
      ["line"] = 1242,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "VelAdd",
          ["line"] = 1243,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "animelem = 1",
          ["line"] = 1244,
        },
        [3] = {
          ["key"] = "trigger2",
          ["value"] = "animelem = 2",
          ["line"] = 1245,
        },
        [4] = {
          ["key"] = "x",
          ["value"] = "3",
          ["line"] = 1246,
        },
        [5] = {
          ["key"] = "y",
          ["value"] = "0",
          ["line"] = 1247,
        },
      },
    },
    [3] = {
      ["type"] = "VelAdd",
      ["source"] = "pikachu.cns",
      ["line"] = 1249,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "VelAdd",
          ["line"] = 1250,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "animelem = 4",
          ["line"] = 1251,
        },
        [3] = {
          ["key"] = "trigger2",
          ["value"] = "animelem = 5",
          ["line"] = 1252,
        },
        [4] = {
          ["key"] = "x",
          ["value"] = "3",
          ["line"] = 1253,
        },
        [5] = {
          ["key"] = "y",
          ["value"] = "0",
          ["line"] = 1254,
        },
      },
    },
    [4] = {
      ["type"] = "VelAdd",
      ["source"] = "pikachu.cns",
      ["line"] = 1256,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "VelAdd",
          ["line"] = 1257,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "animelem = 6",
          ["line"] = 1258,
        },
        [3] = {
          ["key"] = "trigger2",
          ["value"] = "animelem = 7",
          ["line"] = 1259,
        },
        [4] = {
          ["key"] = "trigger3",
          ["value"] = "animelem = 8",
          ["line"] = 1260,
        },
        [5] = {
          ["key"] = "x",
          ["value"] = "1",
          ["line"] = 1261,
        },
        [6] = {
          ["key"] = "y",
          ["value"] = "0",
          ["line"] = 1262,
        },
      },
    },
    [5] = {
      ["type"] = "HitDef",
      ["source"] = "pikachu.cns",
      ["line"] = 1264,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "HitDef",
          ["line"] = 1265,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "time = 0",
          ["line"] = 1266,
        },
        [3] = {
          ["key"] = "attr",
          ["value"] = "S, NA",
          ["line"] = 1267,
        },
        [4] = {
          ["key"] = "damage",
          ["value"] = "23, 0",
          ["line"] = 1268,
        },
        [5] = {
          ["key"] = "animtype",
          ["value"] = "Heavy",
          ["line"] = 1269,
        },
        [6] = {
          ["key"] = "air.animtype",
          ["value"] = "Up",
          ["line"] = 1270,
        },
        [7] = {
          ["key"] = "fall.animtype",
          ["value"] = "Down",
          ["line"] = 1271,
        },
        [8] = {
          ["key"] = "guardflag",
          ["value"] = "MA",
          ["line"] = 1272,
        },
        [9] = {
          ["key"] = "hitflag",
          ["value"] = "MAF",
          ["line"] = 1273,
        },
        [10] = {
          ["key"] = "priority",
          ["value"] = "3, Hit",
          ["line"] = 1274,
        },
        [11] = {
          ["key"] = "pausetime",
          ["value"] = "3, 8",
          ["line"] = 1275,
        },
        [12] = {
          ["key"] = "sparkno",
          ["value"] = "3",
          ["line"] = 1276,
        },
        [13] = {
          ["key"] = "sparkxy",
          ["value"] = "-10, -10",
          ["line"] = 1277,
        },
        [14] = {
          ["key"] = "hitsound",
          ["value"] = "s900,5",
          ["line"] = 1278,
        },
        [15] = {
          ["key"] = "guardsound",
          ["value"] = "6, 0",
          ["line"] = 1279,
        },
        [16] = {
          ["key"] = "ground.type",
          ["value"] = "Low",
          ["line"] = 1280,
        },
        [17] = {
          ["key"] = "ground.slidetime",
          ["value"] = "5",
          ["line"] = 1281,
        },
        [18] = {
          ["key"] = "ground.hittime",
          ["value"] = "10",
          ["line"] = 1282,
        },
        [19] = {
          ["key"] = "ground.velocity",
          ["value"] = "-2,-4",
          ["line"] = 1283,
        },
        [20] = {
          ["key"] = "airguard.velocity",
          ["value"] = "-1.9,-.8",
          ["line"] = 1284,
        },
        [21] = {
          ["key"] = "air.type",
          ["value"] = "High",
          ["line"] = 1285,
        },
        [22] = {
          ["key"] = "air.velocity",
          ["value"] = "-2,-4",
          ["line"] = 1286,
        },
        [23] = {
          ["key"] = "fall",
          ["value"] = "1",
          ["line"] = 1287,
        },
      },
    },
    [6] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cns",
      ["line"] = 1289,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 1290,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "AnimTime = 0",
          ["line"] = 1291,
        },
        [3] = {
          ["key"] = "value",
          ["value"] = "11",
          ["line"] = 1292,
        },
        [4] = {
          ["key"] = "ctrl",
          ["value"] = "1",
          ["line"] = 1293,
        },
      },
    },
  },
}
config["states"][12] = {
  ["id"] = 600,
  ["source"] = "pikachu.cns",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "A",
      ["line"] = 1297,
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "A",
      ["line"] = 1298,
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "A",
      ["line"] = 1299,
    },
    [4] = {
      ["key"] = "juggle",
      ["value"] = "2",
      ["line"] = 1300,
    },
    [5] = {
      ["key"] = "poweradd",
      ["value"] = "50",
      ["line"] = 1301,
    },
    [6] = {
      ["key"] = "ctrl",
      ["value"] = "0",
      ["line"] = 1302,
    },
    [7] = {
      ["key"] = "anim",
      ["value"] = "600",
      ["line"] = 1303,
    },
    [8] = {
      ["key"] = "sprpriority",
      ["value"] = "1",
      ["line"] = 1304,
    },
  },
  ["controllers"] = {
    [1] = {
      ["type"] = "HitDef",
      ["source"] = "pikachu.cns",
      ["line"] = 1332,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "HitDef",
          ["line"] = 1333,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "animelem = 4",
          ["line"] = 1334,
        },
        [3] = {
          ["key"] = "attr",
          ["value"] = "A, NA",
          ["line"] = 1335,
        },
        [4] = {
          ["key"] = "damage",
          ["value"] = "20",
          ["line"] = 1336,
        },
        [5] = {
          ["key"] = "guardflag",
          ["value"] = "HA",
          ["line"] = 1337,
        },
        [6] = {
          ["key"] = "priority",
          ["value"] = "3",
          ["line"] = 1338,
        },
        [7] = {
          ["key"] = "pausetime",
          ["value"] = "3,8",
          ["line"] = 1339,
        },
        [8] = {
          ["key"] = "sparkno",
          ["value"] = "1",
          ["line"] = 1340,
        },
        [9] = {
          ["key"] = "sparkxy",
          ["value"] = "-10,-0",
          ["line"] = 1341,
        },
        [10] = {
          ["key"] = "hitsound",
          ["value"] = "s900,5",
          ["line"] = 1342,
        },
        [11] = {
          ["key"] = "guardsound",
          ["value"] = "6,0",
          ["line"] = 1343,
        },
        [12] = {
          ["key"] = "ground.type",
          ["value"] = "High",
          ["line"] = 1344,
        },
        [13] = {
          ["key"] = "ground.slidetime",
          ["value"] = "5",
          ["line"] = 1345,
        },
        [14] = {
          ["key"] = "ground.hittime",
          ["value"] = "5",
          ["line"] = 1346,
        },
        [15] = {
          ["key"] = "ground.velocity",
          ["value"] = "-4",
          ["line"] = 1347,
        },
        [16] = {
          ["key"] = "air.velocity",
          ["value"] = "-2,-3",
          ["line"] = 1348,
        },
        [17] = {
          ["key"] = "palfx.time",
          ["value"] = "15",
          ["line"] = 1349,
        },
        [18] = {
          ["key"] = "palfx.mul",
          ["value"] = "256,256,256",
          ["line"] = 1350,
        },
        [19] = {
          ["key"] = "palfx.add",
          ["value"] = "100,100,180",
          ["line"] = 1351,
        },
        [20] = {
          ["key"] = "palfx.sinadd",
          ["value"] = "-80,-80,-80,6",
          ["line"] = 1352,
        },
        [21] = {
          ["key"] = "palfx.color",
          ["value"] = "250",
          ["line"] = 1353,
        },
      },
    },
    [2] = {
      ["type"] = "CtrlSet",
      ["source"] = "pikachu.cns",
      ["line"] = 1386,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "CtrlSet",
          ["line"] = 1387,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "Time = 17",
          ["line"] = 1388,
        },
        [3] = {
          ["key"] = "value",
          ["value"] = "1",
          ["line"] = 1389,
        },
      },
    },
  },
}
config["states"][13] = {
  ["id"] = 610,
  ["source"] = "pikachu.cns",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "A",
      ["line"] = 1394,
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "A",
      ["line"] = 1395,
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "A",
      ["line"] = 1396,
    },
    [4] = {
      ["key"] = "juggle",
      ["value"] = "6",
      ["line"] = 1397,
    },
    [5] = {
      ["key"] = "poweradd",
      ["value"] = "90",
      ["line"] = 1398,
    },
    [6] = {
      ["key"] = "ctrl",
      ["value"] = "0",
      ["line"] = 1399,
    },
    [7] = {
      ["key"] = "anim",
      ["value"] = "610",
      ["line"] = 1400,
    },
    [8] = {
      ["key"] = "sprpriority",
      ["value"] = "2",
      ["line"] = 1401,
    },
  },
  ["controllers"] = {
    [1] = {
      ["type"] = "HitDef",
      ["source"] = "pikachu.cns",
      ["line"] = 1432,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "HitDef",
          ["line"] = 1433,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "Time = 0",
          ["line"] = 1434,
        },
        [3] = {
          ["key"] = "attr",
          ["value"] = "A, NA",
          ["line"] = 1435,
        },
        [4] = {
          ["key"] = "damage",
          ["value"] = "50",
          ["line"] = 1436,
        },
        [5] = {
          ["key"] = "guardflag",
          ["value"] = "HA",
          ["line"] = 1437,
        },
        [6] = {
          ["key"] = "priority",
          ["value"] = "4",
          ["line"] = 1438,
        },
        [7] = {
          ["key"] = "pausetime",
          ["value"] = "5,9",
          ["line"] = 1439,
        },
        [8] = {
          ["key"] = "sparkno",
          ["value"] = "2",
          ["line"] = 1440,
        },
        [9] = {
          ["key"] = "sparkxy",
          ["value"] = "-10,-30",
          ["line"] = 1441,
        },
        [10] = {
          ["key"] = "hitsound",
          ["value"] = "s900,5",
          ["line"] = 1442,
        },
        [11] = {
          ["key"] = "guardsound",
          ["value"] = "6,0",
          ["line"] = 1443,
        },
        [12] = {
          ["key"] = "animtype",
          ["value"] = "Med",
          ["line"] = 1444,
        },
        [13] = {
          ["key"] = "ground.type",
          ["value"] = "High",
          ["line"] = 1445,
        },
        [14] = {
          ["key"] = "ground.slidetime",
          ["value"] = "17",
          ["line"] = 1446,
        },
        [15] = {
          ["key"] = "ground.hittime",
          ["value"] = "17",
          ["line"] = 1447,
        },
        [16] = {
          ["key"] = "ground.velocity",
          ["value"] = "-5",
          ["line"] = 1448,
        },
        [17] = {
          ["key"] = "air.velocity",
          ["value"] = "-1,-7",
          ["line"] = 1449,
        },
        [18] = {
          ["key"] = "palfx.time",
          ["value"] = "20",
          ["line"] = 1450,
        },
        [19] = {
          ["key"] = "palfx.mul",
          ["value"] = "256,256,256",
          ["line"] = 1451,
        },
        [20] = {
          ["key"] = "palfx.add",
          ["value"] = "100,100,100",
          ["line"] = 1452,
        },
        [21] = {
          ["key"] = "palfx.sinadd",
          ["value"] = "-80,-80,-80,15",
          ["line"] = 1453,
        },
        [22] = {
          ["key"] = "palfx.color",
          ["value"] = "255",
          ["line"] = 1454,
        },
      },
    },
    [2] = {
      ["type"] = "CtrlSet",
      ["source"] = "pikachu.cns",
      ["line"] = 1469,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "CtrlSet",
          ["line"] = 1470,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "Time = 20",
          ["line"] = 1471,
        },
        [3] = {
          ["key"] = "value",
          ["value"] = "1",
          ["line"] = 1472,
        },
      },
    },
  },
}
config["states"][14] = {
  ["id"] = 1000,
  ["source"] = "pikachu.cns",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "S",
      ["line"] = 1890,
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "A",
      ["line"] = 1891,
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "S",
      ["line"] = 1892,
    },
    [4] = {
      ["key"] = "juggle",
      ["value"] = "1",
      ["line"] = 1893,
    },
    [5] = {
      ["key"] = "poweradd",
      ["value"] = "20",
      ["line"] = 1894,
    },
    [6] = {
      ["key"] = "ctrl",
      ["value"] = "1",
      ["line"] = 1895,
    },
    [7] = {
      ["key"] = "velset",
      ["value"] = "0,0",
      ["line"] = 1896,
    },
  },
  ["controllers"] = {
    [1] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cns",
      ["line"] = 1898,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 1899,
        },
        [2] = {
          ["key"] = "triggerall",
          ["value"] = "NumHelper(1002)=0",
          ["line"] = 1900,
        },
        [3] = {
          ["key"] = "trigger1",
          ["value"] = "time = 0",
          ["line"] = 1901,
        },
        [4] = {
          ["key"] = "value",
          ["value"] = "1001",
          ["line"] = 1902,
        },
        [5] = {
          ["key"] = "ctrl",
          ["value"] = "0",
          ["line"] = 1903,
        },
      },
    },
    [2] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cns",
      ["line"] = 1905,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 1906,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "AnimTime = 0",
          ["line"] = 1907,
        },
        [3] = {
          ["key"] = "value",
          ["value"] = "0",
          ["line"] = 1908,
        },
        [4] = {
          ["key"] = "ctrl",
          ["value"] = "1",
          ["line"] = 1909,
        },
      },
    },
  },
}
config["states"][15] = {
  ["id"] = 1001,
  ["source"] = "pikachu.cns",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "S",
      ["line"] = 1914,
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "A",
      ["line"] = 1915,
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "S",
      ["line"] = 1916,
    },
    [4] = {
      ["key"] = "juggle",
      ["value"] = "1",
      ["line"] = 1917,
    },
    [5] = {
      ["key"] = "poweradd",
      ["value"] = "20",
      ["line"] = 1918,
    },
    [6] = {
      ["key"] = "ctrl",
      ["value"] = "0",
      ["line"] = 1919,
    },
    [7] = {
      ["key"] = "anim",
      ["value"] = "1000",
      ["line"] = 1920,
    },
    [8] = {
      ["key"] = "velset",
      ["value"] = "0,0",
      ["line"] = 1921,
    },
  },
  ["controllers"] = {
    [1] = {
      ["type"] = "Helper",
      ["source"] = "pikachu.cns",
      ["line"] = 1967,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "Helper",
          ["line"] = 1968,
        },
        [2] = {
          ["key"] = "triggerall",
          ["value"] = "NumHelper(1002)=0",
          ["line"] = 1969,
        },
        [3] = {
          ["key"] = "trigger1",
          ["value"] = "animelem = 5",
          ["line"] = 1970,
        },
        [4] = {
          ["key"] = "helpertype",
          ["value"] = "normal",
          ["line"] = 1971,
        },
        [5] = {
          ["key"] = "name",
          ["value"] = "\034electro\034",
          ["line"] = 1972,
        },
        [6] = {
          ["key"] = "id",
          ["value"] = "1002",
          ["line"] = 1973,
        },
        [7] = {
          ["key"] = "stateno",
          ["value"] = "1002",
          ["line"] = 1974,
        },
        [8] = {
          ["key"] = "pos",
          ["value"] = "30,0",
          ["line"] = 1975,
        },
        [9] = {
          ["key"] = "postype",
          ["value"] = "p1",
          ["line"] = 1976,
        },
        [10] = {
          ["key"] = "facing",
          ["value"] = "1",
          ["line"] = 1977,
        },
        [11] = {
          ["key"] = "keyctrl",
          ["value"] = "0",
          ["line"] = 1978,
        },
        [12] = {
          ["key"] = "ownpal",
          ["value"] = "1",
          ["line"] = 1979,
        },
        [13] = {
          ["key"] = "supermove",
          ["value"] = "1",
          ["line"] = 1980,
        },
        [14] = {
          ["key"] = "sprpriority",
          ["value"] = "1",
          ["line"] = 1982,
        },
      },
    },
    [2] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cns",
      ["line"] = 1984,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 1985,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "AnimTime = 0",
          ["line"] = 1986,
        },
        [3] = {
          ["key"] = "value",
          ["value"] = "0",
          ["line"] = 1987,
        },
        [4] = {
          ["key"] = "ctrl",
          ["value"] = "1",
          ["line"] = 1988,
        },
      },
    },
  },
}
config["states"][16] = {
  ["id"] = 1002,
  ["source"] = "pikachu.cns",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "S",
      ["line"] = 1993,
    },
    [2] = {
      ["key"] = "ctrl",
      ["value"] = "0",
      ["line"] = 1994,
    },
    [3] = {
      ["key"] = "movetype",
      ["value"] = "A",
      ["line"] = 1995,
    },
    [4] = {
      ["key"] = "anim",
      ["value"] = "1002",
      ["line"] = 1996,
    },
    [5] = {
      ["key"] = "velset",
      ["value"] = "5,0",
      ["line"] = 1997,
    },
    [6] = {
      ["key"] = "sprpriority",
      ["value"] = "3",
      ["line"] = 1998,
    },
  },
  ["controllers"] = {
    [1] = {
      ["type"] = "Gravity",
      ["source"] = "pikachu.cns",
      ["line"] = 2000,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "Gravity",
          ["line"] = 2001,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "anim",
          ["line"] = 2002,
        },
      },
    },
    [2] = {
      ["type"] = "VelSet",
      ["source"] = "pikachu.cns",
      ["line"] = 2006,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "VelSet",
          ["line"] = 2007,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "Vel Y > 0",
          ["line"] = 2008,
        },
        [3] = {
          ["key"] = "trigger1",
          ["value"] = "Pos Y >= 0",
          ["line"] = 2009,
        },
        [4] = {
          ["key"] = "y",
          ["value"] = "0",
          ["line"] = 2010,
        },
      },
    },
    [3] = {
      ["type"] = "PosSet",
      ["source"] = "pikachu.cns",
      ["line"] = 2012,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "PosSet",
          ["line"] = 2013,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "Vel Y > 0",
          ["line"] = 2014,
        },
        [3] = {
          ["key"] = "trigger1",
          ["value"] = "Pos Y >= 0",
          ["line"] = 2015,
        },
        [4] = {
          ["key"] = "y",
          ["value"] = "0",
          ["line"] = 2016,
        },
      },
    },
    [4] = {
      ["type"] = "HitDef",
      ["source"] = "pikachu.cns",
      ["line"] = 2036,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "HitDef",
          ["line"] = 2037,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "time = 0",
          ["line"] = 2038,
        },
        [3] = {
          ["key"] = "attr",
          ["value"] = "S, NA",
          ["line"] = 2039,
        },
        [4] = {
          ["key"] = "damage",
          ["value"] = "40, 10",
          ["line"] = 2040,
        },
        [5] = {
          ["key"] = "animtype",
          ["value"] = "Light",
          ["line"] = 2041,
        },
        [6] = {
          ["key"] = "guardflag",
          ["value"] = "MA",
          ["line"] = 2042,
        },
        [7] = {
          ["key"] = "hitflag",
          ["value"] = "MAF",
          ["line"] = 2043,
        },
        [8] = {
          ["key"] = "priority",
          ["value"] = "3, Hit",
          ["line"] = 2044,
        },
        [9] = {
          ["key"] = "pausetime",
          ["value"] = "3, 8",
          ["line"] = 2045,
        },
        [10] = {
          ["key"] = "sparkno",
          ["value"] = "0",
          ["line"] = 2046,
        },
        [11] = {
          ["key"] = "sparkxy",
          ["value"] = "-10, -30",
          ["line"] = 2047,
        },
        [12] = {
          ["key"] = "hitsound",
          ["value"] = "s900,5",
          ["line"] = 2048,
        },
        [13] = {
          ["key"] = "guardsound",
          ["value"] = "6, 0",
          ["line"] = 2049,
        },
        [14] = {
          ["key"] = "ground.type",
          ["value"] = "High",
          ["line"] = 2050,
        },
        [15] = {
          ["key"] = "ground.slidetime",
          ["value"] = "3",
          ["line"] = 2051,
        },
        [16] = {
          ["key"] = "ground.hittime",
          ["value"] = "10",
          ["line"] = 2052,
        },
        [17] = {
          ["key"] = "ground.velocity",
          ["value"] = "-3",
          ["line"] = 2053,
        },
        [18] = {
          ["key"] = "airguard.velocity",
          ["value"] = "-2,-1",
          ["line"] = 2054,
        },
        [19] = {
          ["key"] = "air.type",
          ["value"] = "High",
          ["line"] = 2055,
        },
        [20] = {
          ["key"] = "ground.slidetime",
          ["value"] = "1",
          ["line"] = 2056,
        },
        [21] = {
          ["key"] = "ground.hittime",
          ["value"] = "6",
          ["line"] = 2057,
        },
        [22] = {
          ["key"] = "ground.velocity",
          ["value"] = "-1,-1",
          ["line"] = 2058,
        },
        [23] = {
          ["key"] = "air.velocity",
          ["value"] = "-2,-1",
          ["line"] = 2059,
        },
        [24] = {
          ["key"] = "palfx.time",
          ["value"] = "15",
          ["line"] = 2060,
        },
        [25] = {
          ["key"] = "palfx.mul",
          ["value"] = "256,256,256",
          ["line"] = 2061,
        },
        [26] = {
          ["key"] = "palfx.add",
          ["value"] = "100,100,180",
          ["line"] = 2062,
        },
        [27] = {
          ["key"] = "palfx.sinadd",
          ["value"] = "-80,-80,-80,6",
          ["line"] = 2063,
        },
        [28] = {
          ["key"] = "palfx.color",
          ["value"] = "250",
          ["line"] = 2064,
        },
      },
    },
    [5] = {
      ["type"] = "DestroySelf",
      ["source"] = "pikachu.cns",
      ["line"] = 2092,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "DestroySelf",
          ["line"] = 2093,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "time >= 60",
          ["line"] = 2094,
        },
        [3] = {
          ["key"] = "trigger2",
          ["value"] = "movecontact = 1",
          ["line"] = 2095,
        },
      },
    },
  },
}
config["states"][17] = {
  ["id"] = 1010,
  ["source"] = "pikachu.cns",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "S",
      ["line"] = 2114,
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "A",
      ["line"] = 2115,
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "S",
      ["line"] = 2116,
    },
    [4] = {
      ["key"] = "juggle",
      ["value"] = "1",
      ["line"] = 2117,
    },
    [5] = {
      ["key"] = "poweradd",
      ["value"] = "20",
      ["line"] = 2118,
    },
    [6] = {
      ["key"] = "ctrl",
      ["value"] = "1",
      ["line"] = 2119,
    },
    [7] = {
      ["key"] = "velset",
      ["value"] = "0,0",
      ["line"] = 2120,
    },
  },
  ["controllers"] = {
    [1] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cns",
      ["line"] = 2122,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 2123,
        },
        [2] = {
          ["key"] = "triggerall",
          ["value"] = "NumHelper(1002)=0",
          ["line"] = 2124,
        },
        [3] = {
          ["key"] = "trigger1",
          ["value"] = "time = 0",
          ["line"] = 2125,
        },
        [4] = {
          ["key"] = "value",
          ["value"] = "1011",
          ["line"] = 2126,
        },
        [5] = {
          ["key"] = "ctrl",
          ["value"] = "0",
          ["line"] = 2127,
        },
      },
    },
    [2] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cns",
      ["line"] = 2129,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 2130,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "AnimTime = 0",
          ["line"] = 2131,
        },
        [3] = {
          ["key"] = "value",
          ["value"] = "11",
          ["line"] = 2132,
        },
        [4] = {
          ["key"] = "ctrl",
          ["value"] = "1",
          ["line"] = 2133,
        },
      },
    },
  },
}
config["states"][18] = {
  ["id"] = 1011,
  ["source"] = "pikachu.cns",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "C",
      ["line"] = 2137,
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "A",
      ["line"] = 2138,
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "S",
      ["line"] = 2139,
    },
    [4] = {
      ["key"] = "juggle",
      ["value"] = "1",
      ["line"] = 2140,
    },
    [5] = {
      ["key"] = "poweradd",
      ["value"] = "20",
      ["line"] = 2141,
    },
    [6] = {
      ["key"] = "ctrl",
      ["value"] = "0",
      ["line"] = 2142,
    },
    [7] = {
      ["key"] = "anim",
      ["value"] = "1000",
      ["line"] = 2143,
    },
    [8] = {
      ["key"] = "velset",
      ["value"] = "0,0",
      ["line"] = 2144,
    },
  },
  ["controllers"] = {
    [1] = {
      ["type"] = "Helper",
      ["source"] = "pikachu.cns",
      ["line"] = 2186,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "Helper",
          ["line"] = 2187,
        },
        [2] = {
          ["key"] = "triggerall",
          ["value"] = "NumHelper(1002)=0",
          ["line"] = 2188,
        },
        [3] = {
          ["key"] = "trigger1",
          ["value"] = "animelem = 5",
          ["line"] = 2189,
        },
        [4] = {
          ["key"] = "helpertype",
          ["value"] = "normal",
          ["line"] = 2190,
        },
        [5] = {
          ["key"] = "name",
          ["value"] = "\034electro\034",
          ["line"] = 2191,
        },
        [6] = {
          ["key"] = "id",
          ["value"] = "1002",
          ["line"] = 2192,
        },
        [7] = {
          ["key"] = "stateno",
          ["value"] = "1002",
          ["line"] = 2193,
        },
        [8] = {
          ["key"] = "pos",
          ["value"] = "30,0",
          ["line"] = 2194,
        },
        [9] = {
          ["key"] = "postype",
          ["value"] = "p1",
          ["line"] = 2195,
        },
        [10] = {
          ["key"] = "facing",
          ["value"] = "1",
          ["line"] = 2196,
        },
        [11] = {
          ["key"] = "keyctrl",
          ["value"] = "0",
          ["line"] = 2197,
        },
        [12] = {
          ["key"] = "ownpal",
          ["value"] = "1",
          ["line"] = 2198,
        },
        [13] = {
          ["key"] = "supermove",
          ["value"] = "1",
          ["line"] = 2199,
        },
        [14] = {
          ["key"] = "sprpriority",
          ["value"] = "1",
          ["line"] = 2201,
        },
      },
    },
    [2] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cns",
      ["line"] = 2203,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 2204,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "AnimTime = 0",
          ["line"] = 2205,
        },
        [3] = {
          ["key"] = "value",
          ["value"] = "11",
          ["line"] = 2206,
        },
        [4] = {
          ["key"] = "ctrl",
          ["value"] = "1",
          ["line"] = 2207,
        },
      },
    },
  },
}
config["states"][19] = {
  ["id"] = 1020,
  ["source"] = "pikachu.cns",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "A",
      ["line"] = 2212,
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "A",
      ["line"] = 2213,
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "A",
      ["line"] = 2214,
    },
    [4] = {
      ["key"] = "juggle",
      ["value"] = "1",
      ["line"] = 2215,
    },
    [5] = {
      ["key"] = "poweradd",
      ["value"] = "20",
      ["line"] = 2216,
    },
    [6] = {
      ["key"] = "ctrl",
      ["value"] = "0",
      ["line"] = 2217,
    },
  },
  ["controllers"] = {
    [1] = {
      ["type"] = "ChangeState",
      ["source"] = "pikachu.cns",
      ["line"] = 2219,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "ChangeState",
          ["line"] = 2220,
        },
        [2] = {
          ["key"] = "triggerall",
          ["value"] = "NumHelper(1002)=0",
          ["line"] = 2221,
        },
        [3] = {
          ["key"] = "trigger1",
          ["value"] = "time = 0",
          ["line"] = 2222,
        },
        [4] = {
          ["key"] = "value",
          ["value"] = "1021",
          ["line"] = 2223,
        },
        [5] = {
          ["key"] = "ctrl",
          ["value"] = "0",
          ["line"] = 2224,
        },
      },
    },
    [2] = {
      ["type"] = "CtrlSet",
      ["source"] = "pikachu.cns",
      ["line"] = 2226,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "CtrlSet",
          ["line"] = 2227,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "Time = 10",
          ["line"] = 2228,
        },
        [3] = {
          ["key"] = "value",
          ["value"] = "1",
          ["line"] = 2229,
        },
      },
    },
  },
}
config["states"][20] = {
  ["id"] = 1021,
  ["source"] = "pikachu.cns",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "A",
      ["line"] = 2233,
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "A",
      ["line"] = 2234,
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "A",
      ["line"] = 2235,
    },
    [4] = {
      ["key"] = "juggle",
      ["value"] = "1",
      ["line"] = 2236,
    },
    [5] = {
      ["key"] = "poweradd",
      ["value"] = "20",
      ["line"] = 2237,
    },
    [6] = {
      ["key"] = "ctrl",
      ["value"] = "1",
      ["line"] = 2238,
    },
    [7] = {
      ["key"] = "anim",
      ["value"] = "1020",
      ["line"] = 2239,
    },
  },
  ["controllers"] = {
    [1] = {
      ["type"] = "Helper",
      ["source"] = "pikachu.cns",
      ["line"] = 2284,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "Helper",
          ["line"] = 2285,
        },
        [2] = {
          ["key"] = "triggerall",
          ["value"] = "NumHelper(1002)=0",
          ["line"] = 2286,
        },
        [3] = {
          ["key"] = "trigger1",
          ["value"] = "animelem = 4",
          ["line"] = 2287,
        },
        [4] = {
          ["key"] = "helpertype",
          ["value"] = "normal",
          ["line"] = 2288,
        },
        [5] = {
          ["key"] = "name",
          ["value"] = "\034electro\034",
          ["line"] = 2289,
        },
        [6] = {
          ["key"] = "id",
          ["value"] = "1002",
          ["line"] = 2290,
        },
        [7] = {
          ["key"] = "stateno",
          ["value"] = "1002",
          ["line"] = 2291,
        },
        [8] = {
          ["key"] = "pos",
          ["value"] = "5,0",
          ["line"] = 2292,
        },
        [9] = {
          ["key"] = "postype",
          ["value"] = "p1",
          ["line"] = 2293,
        },
        [10] = {
          ["key"] = "facing",
          ["value"] = "1",
          ["line"] = 2294,
        },
        [11] = {
          ["key"] = "keyctrl",
          ["value"] = "0",
          ["line"] = 2295,
        },
        [12] = {
          ["key"] = "ownpal",
          ["value"] = "1",
          ["line"] = 2296,
        },
        [13] = {
          ["key"] = "supermove",
          ["value"] = "1",
          ["line"] = 2297,
        },
        [14] = {
          ["key"] = "sprpriority",
          ["value"] = "1",
          ["line"] = 2299,
        },
      },
    },
    [2] = {
      ["type"] = "CtrlSet",
      ["source"] = "pikachu.cns",
      ["line"] = 2301,
      ["entries"] = {
        [1] = {
          ["key"] = "type",
          ["value"] = "CtrlSet",
          ["line"] = 2302,
        },
        [2] = {
          ["key"] = "trigger1",
          ["value"] = "Time = 10",
          ["line"] = 2303,
        },
        [3] = {
          ["key"] = "value",
          ["value"] = "1",
          ["line"] = 2304,
        },
      },
    },
  },
}
config["states"][21] = {
  ["id"] = 10,
  ["source"] = "<host:checkpoint-crouchDown>",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "C",
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "I",
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "N",
    },
    [4] = {
      ["key"] = "anim",
      ["value"] = "10",
    },
    [5] = {
      ["key"] = "ctrl",
      ["value"] = "1",
    },
    [6] = {
      ["key"] = "velset",
      ["value"] = "0,0",
    },
  },
  ["controllers"] = {

  },
}
config["states"][22] = {
  ["id"] = 11,
  ["source"] = "<host:checkpoint-crouch>",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "C",
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "I",
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "N",
    },
    [4] = {
      ["key"] = "anim",
      ["value"] = "11",
    },
    [5] = {
      ["key"] = "ctrl",
      ["value"] = "1",
    },
    [6] = {
      ["key"] = "velset",
      ["value"] = "0,0",
    },
  },
  ["controllers"] = {

  },
}
config["states"][23] = {
  ["id"] = 12,
  ["source"] = "<host:checkpoint-crouchUp>",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "C",
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "I",
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "N",
    },
    [4] = {
      ["key"] = "anim",
      ["value"] = "12",
    },
    [5] = {
      ["key"] = "ctrl",
      ["value"] = "0",
    },
    [6] = {
      ["key"] = "velset",
      ["value"] = "0,0",
    },
  },
  ["controllers"] = {

  },
}
config["states"][24] = {
  ["id"] = 100,
  ["source"] = "<host:checkpoint-runForward>",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "S",
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "I",
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "N",
    },
    [4] = {
      ["key"] = "anim",
      ["value"] = "100",
    },
    [5] = {
      ["key"] = "ctrl",
      ["value"] = "1",
    },
    [6] = {
      ["key"] = "velset",
      ["value"] = "0,0",
    },
  },
  ["controllers"] = {

  },
}
config["states"][25] = {
  ["id"] = 105,
  ["source"] = "<host:checkpoint-runBack>",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "A",
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "I",
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "N",
    },
    [4] = {
      ["key"] = "anim",
      ["value"] = "105",
    },
    [5] = {
      ["key"] = "ctrl",
      ["value"] = "0",
    },
    [6] = {
      ["key"] = "velset",
      ["value"] = "-4.5,-3.8",
    },
  },
  ["controllers"] = {

  },
}
config["states"][26] = {
  ["id"] = 106,
  ["source"] = "<host:checkpoint-runBackLanding>",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "S",
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "I",
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "N",
    },
    [4] = {
      ["key"] = "anim",
      ["value"] = "106",
    },
    [5] = {
      ["key"] = "ctrl",
      ["value"] = "0",
    },
    [6] = {
      ["key"] = "velset",
      ["value"] = "0,0",
    },
  },
  ["controllers"] = {

  },
}
config["states"][27] = {
  ["id"] = 20,
  ["source"] = "<host:checkpoint-walkForward>",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "S",
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "I",
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "N",
    },
    [4] = {
      ["key"] = "anim",
      ["value"] = "20",
    },
    [5] = {
      ["key"] = "ctrl",
      ["value"] = "1",
    },
    [6] = {
      ["key"] = "velset",
      ["value"] = "0,0",
    },
  },
  ["controllers"] = {

  },
}
config["states"][28] = {
  ["id"] = 40,
  ["source"] = "<host:checkpoint-jumpStart>",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "S",
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "I",
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "N",
    },
    [4] = {
      ["key"] = "anim",
      ["value"] = "40",
    },
    [5] = {
      ["key"] = "ctrl",
      ["value"] = "0",
    },
    [6] = {
      ["key"] = "velset",
      ["value"] = "0,0",
    },
  },
  ["controllers"] = {

  },
}
config["states"][29] = {
  ["id"] = 50,
  ["source"] = "<host:checkpoint-jumpNeutral>",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "A",
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "I",
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "N",
    },
    [4] = {
      ["key"] = "anim",
      ["value"] = "41",
    },
    [5] = {
      ["key"] = "ctrl",
      ["value"] = "1",
    },
    [6] = {
      ["key"] = "velset",
      ["value"] = "0,0",
    },
  },
  ["controllers"] = {

  },
}
config["states"][30] = {
  ["id"] = 52,
  ["source"] = "<host:checkpoint-landing>",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "S",
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "I",
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "N",
    },
    [4] = {
      ["key"] = "anim",
      ["value"] = "47",
    },
    [5] = {
      ["key"] = "ctrl",
      ["value"] = "0",
    },
    [6] = {
      ["key"] = "velset",
      ["value"] = "0,0",
    },
  },
  ["controllers"] = {

  },
}
config["states"][31] = {
  ["id"] = 120,
  ["source"] = "<host:checkpoint-guardStand>",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "S",
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "I",
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "N",
    },
    [4] = {
      ["key"] = "anim",
      ["value"] = "150",
    },
    [5] = {
      ["key"] = "ctrl",
      ["value"] = "1",
    },
    [6] = {
      ["key"] = "velset",
      ["value"] = "0,0",
    },
  },
  ["controllers"] = {

  },
}
config["states"][32] = {
  ["id"] = 130,
  ["source"] = "<host:checkpoint-guardStand>",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "S",
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "I",
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "N",
    },
    [4] = {
      ["key"] = "anim",
      ["value"] = "150",
    },
    [5] = {
      ["key"] = "ctrl",
      ["value"] = "1",
    },
    [6] = {
      ["key"] = "velset",
      ["value"] = "0,0",
    },
  },
  ["controllers"] = {

  },
}
config["states"][33] = {
  ["id"] = 131,
  ["source"] = "<host:checkpoint-guardCrouch>",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "C",
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "I",
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "N",
    },
    [4] = {
      ["key"] = "anim",
      ["value"] = "151",
    },
    [5] = {
      ["key"] = "ctrl",
      ["value"] = "1",
    },
    [6] = {
      ["key"] = "velset",
      ["value"] = "0,0",
    },
  },
  ["controllers"] = {

  },
}
config["states"][34] = {
  ["id"] = 132,
  ["source"] = "<host:checkpoint-guardAir>",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "A",
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "I",
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "N",
    },
    [4] = {
      ["key"] = "anim",
      ["value"] = "152",
    },
    [5] = {
      ["key"] = "ctrl",
      ["value"] = "1",
    },
    [6] = {
      ["key"] = "velset",
      ["value"] = "0,0",
    },
  },
  ["controllers"] = {

  },
}
config["states"][35] = {
  ["id"] = 150,
  ["source"] = "<host:checkpoint-guard>",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "S",
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "H",
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "N",
    },
    [4] = {
      ["key"] = "anim",
      ["value"] = "150",
    },
    [5] = {
      ["key"] = "ctrl",
      ["value"] = "0",
    },
    [6] = {
      ["key"] = "velset",
      ["value"] = "0,0",
    },
  },
  ["controllers"] = {

  },
}
config["states"][36] = {
  ["id"] = 151,
  ["source"] = "<host:checkpoint-guardCrouch>",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "C",
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "H",
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "N",
    },
    [4] = {
      ["key"] = "anim",
      ["value"] = "151",
    },
    [5] = {
      ["key"] = "ctrl",
      ["value"] = "0",
    },
    [6] = {
      ["key"] = "velset",
      ["value"] = "0,0",
    },
  },
  ["controllers"] = {

  },
}
config["states"][37] = {
  ["id"] = 152,
  ["source"] = "<host:checkpoint-guardAir>",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "A",
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "H",
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "N",
    },
    [4] = {
      ["key"] = "anim",
      ["value"] = "152",
    },
    [5] = {
      ["key"] = "ctrl",
      ["value"] = "0",
    },
    [6] = {
      ["key"] = "velset",
      ["value"] = "0,0",
    },
  },
  ["controllers"] = {

  },
}
config["states"][38] = {
  ["id"] = 5000,
  ["source"] = "<host:checkpoint-hit>",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "S",
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "H",
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "N",
    },
    [4] = {
      ["key"] = "anim",
      ["value"] = "5000",
    },
    [5] = {
      ["key"] = "ctrl",
      ["value"] = "0",
    },
    [6] = {
      ["key"] = "velset",
      ["value"] = "0,0",
    },
  },
  ["controllers"] = {

  },
}
config["states"][39] = {
  ["id"] = 5010,
  ["source"] = "<host:checkpoint-hitLowLight>",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "S",
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "H",
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "N",
    },
    [4] = {
      ["key"] = "anim",
      ["value"] = "5010",
    },
    [5] = {
      ["key"] = "ctrl",
      ["value"] = "0",
    },
    [6] = {
      ["key"] = "velset",
      ["value"] = "0,0",
    },
  },
  ["controllers"] = {

  },
}
config["states"][40] = {
  ["id"] = 5020,
  ["source"] = "<host:checkpoint-hitCrouch>",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "C",
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "H",
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "N",
    },
    [4] = {
      ["key"] = "anim",
      ["value"] = "5020",
    },
    [5] = {
      ["key"] = "ctrl",
      ["value"] = "0",
    },
    [6] = {
      ["key"] = "velset",
      ["value"] = "0,0",
    },
  },
  ["controllers"] = {

  },
}
config["states"][41] = {
  ["id"] = 5030,
  ["source"] = "<host:checkpoint-hitAir>",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "A",
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "H",
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "N",
    },
    [4] = {
      ["key"] = "anim",
      ["value"] = "5030",
    },
    [5] = {
      ["key"] = "ctrl",
      ["value"] = "0",
    },
    [6] = {
      ["key"] = "velset",
      ["value"] = "0,0",
    },
  },
  ["controllers"] = {

  },
}
config["states"][42] = {
  ["id"] = 5050,
  ["source"] = "<host:checkpoint-fall>",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "A",
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "H",
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "N",
    },
    [4] = {
      ["key"] = "anim",
      ["value"] = "5050",
    },
    [5] = {
      ["key"] = "ctrl",
      ["value"] = "0",
    },
    [6] = {
      ["key"] = "velset",
      ["value"] = "0,0",
    },
  },
  ["controllers"] = {

  },
}
config["states"][43] = {
  ["id"] = 5100,
  ["source"] = "<host:checkpoint-down>",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "L",
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "H",
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "N",
    },
    [4] = {
      ["key"] = "anim",
      ["value"] = "5110",
    },
    [5] = {
      ["key"] = "ctrl",
      ["value"] = "0",
    },
    [6] = {
      ["key"] = "velset",
      ["value"] = "0,0",
    },
  },
  ["controllers"] = {

  },
}
config["states"][44] = {
  ["id"] = 5110,
  ["source"] = "<host:checkpoint-down>",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "L",
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "H",
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "N",
    },
    [4] = {
      ["key"] = "anim",
      ["value"] = "5110",
    },
    [5] = {
      ["key"] = "ctrl",
      ["value"] = "0",
    },
    [6] = {
      ["key"] = "velset",
      ["value"] = "0,0",
    },
  },
  ["controllers"] = {

  },
}
config["states"][45] = {
  ["id"] = 5120,
  ["source"] = "<host:checkpoint-getUp>",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "L",
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "H",
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "N",
    },
    [4] = {
      ["key"] = "anim",
      ["value"] = "5120",
    },
    [5] = {
      ["key"] = "ctrl",
      ["value"] = "0",
    },
    [6] = {
      ["key"] = "velset",
      ["value"] = "0,0",
    },
  },
  ["controllers"] = {

  },
}
config["states"][46] = {
  ["id"] = 5150,
  ["source"] = "<host:checkpoint-ko>",
  ["entries"] = {
    [1] = {
      ["key"] = "type",
      ["value"] = "L",
    },
    [2] = {
      ["key"] = "movetype",
      ["value"] = "H",
    },
    [3] = {
      ["key"] = "physics",
      ["value"] = "N",
    },
    [4] = {
      ["key"] = "anim",
      ["value"] = "5150",
    },
    [5] = {
      ["key"] = "ctrl",
      ["value"] = "0",
    },
    [6] = {
      ["key"] = "velset",
      ["value"] = "0,0",
    },
  },
  ["controllers"] = {

  },
}
config["animations"] = {}
config["animations"][1] = {
  ["id"] = 0,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 7,
    [2] = 7,
    [3] = 7,
    [4] = 7,
    [5] = 7,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 0,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 7,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -41,
          [3] = 14,
          [4] = 1,
        },
      },
    },
    [2] = {
      ["group"] = 0,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 7,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -41,
          [3] = 14,
          [4] = 1,
        },
      },
    },
    [3] = {
      ["group"] = 0,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 7,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -41,
          [3] = 14,
          [4] = 1,
        },
      },
    },
    [4] = {
      ["group"] = 0,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 7,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -41,
          [3] = 14,
          [4] = 1,
        },
      },
    },
    [5] = {
      ["group"] = 0,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 7,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -41,
          [3] = 14,
          [4] = 1,
        },
      },
    },
  },
}
config["animations"][2] = {
  ["id"] = 10,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 2,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 11,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -15,
          [2] = -32,
          [3] = 22,
          [4] = 0,
        },
      },
    },
  },
}
config["animations"][3] = {
  ["id"] = 11,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 1,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 11,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 1,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -18,
          [2] = -28,
          [3] = 20,
          [4] = 0,
        },
      },
    },
  },
}
config["animations"][4] = {
  ["id"] = 12,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 2,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 11,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -17,
          [2] = -32,
          [3] = 22,
          [4] = 0,
        },
      },
    },
  },
}
config["animations"][5] = {
  ["id"] = 20,
  ["loopStart"] = 2,
  ["durations"] = {
    [1] = 1,
    [2] = 5,
    [3] = 5,
    [4] = 5,
    [5] = 5,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 20,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 1,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -16,
          [2] = -35,
          [3] = 19,
          [4] = 0,
        },
      },
    },
    [2] = {
      ["group"] = 20,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -16,
          [2] = -35,
          [3] = 19,
          [4] = 0,
        },
      },
    },
    [3] = {
      ["group"] = 20,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -16,
          [2] = -35,
          [3] = 19,
          [4] = 0,
        },
      },
    },
    [4] = {
      ["group"] = 20,
      ["index"] = 3,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -16,
          [2] = -35,
          [3] = 19,
          [4] = 0,
        },
      },
    },
    [5] = {
      ["group"] = 20,
      ["index"] = 4,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -16,
          [2] = -35,
          [3] = 19,
          [4] = 0,
        },
      },
    },
  },
}
config["animations"][6] = {
  ["id"] = 21,
  ["loopStart"] = 2,
  ["durations"] = {
    [1] = 1,
    [2] = 5,
    [3] = 5,
    [4] = 5,
    [5] = 5,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 20,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 1,
      ["flipH"] = true,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -19,
          [2] = -35,
          [3] = 16,
          [4] = 0,
        },
      },
    },
    [2] = {
      ["group"] = 20,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = true,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -19,
          [2] = -35,
          [3] = 16,
          [4] = 0,
        },
      },
    },
    [3] = {
      ["group"] = 20,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = true,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -19,
          [2] = -35,
          [3] = 16,
          [4] = 0,
        },
      },
    },
    [4] = {
      ["group"] = 20,
      ["index"] = 3,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = true,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -19,
          [2] = -35,
          [3] = 16,
          [4] = 0,
        },
      },
    },
    [5] = {
      ["group"] = 20,
      ["index"] = 4,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = true,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -19,
          [2] = -35,
          [3] = 16,
          [4] = 0,
        },
      },
    },
  },
}
config["animations"][7] = {
  ["id"] = 40,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 3,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 41,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 3,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -38,
          [3] = 13,
          [4] = 0,
        },
      },
    },
  },
}
config["animations"][8] = {
  ["id"] = 41,
  ["loopStart"] = 5,
  ["durations"] = {
    [1] = 2,
    [2] = 3,
    [3] = 3,
    [4] = 1,
    [5] = 3,
    [6] = 3,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 41,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -35,
          [3] = 14,
          [4] = 0,
        },
      },
    },
    [2] = {
      ["group"] = 41,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 3,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -45,
          [3] = 13,
          [4] = -4,
        },
      },
    },
    [3] = {
      ["group"] = 41,
      ["index"] = 3,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 3,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -45,
          [3] = 13,
          [4] = -4,
        },
      },
    },
    [4] = {
      ["group"] = 41,
      ["index"] = 4,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 1,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -45,
          [3] = 13,
          [4] = -4,
        },
      },
    },
    [5] = {
      ["group"] = 41,
      ["index"] = 6,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 3,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -45,
          [3] = 13,
          [4] = -4,
        },
      },
    },
    [6] = {
      ["group"] = 41,
      ["index"] = 7,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 3,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -45,
          [3] = 13,
          [4] = -4,
        },
      },
    },
  },
}
config["animations"][9] = {
  ["id"] = 42,
  ["loopStart"] = 14,
  ["durations"] = {
    [1] = 2,
    [2] = 2,
    [3] = 2,
    [4] = 2,
    [5] = 2,
    [6] = 2,
    [7] = 2,
    [8] = 2,
    [9] = 2,
    [10] = 2,
    [11] = 2,
    [12] = 2,
    [13] = 2,
    [14] = 4,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 41,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -37,
          [3] = 13,
          [4] = 0,
        },
      },
    },
    [2] = {
      ["group"] = 41,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -37,
          [3] = 13,
          [4] = 0,
        },
      },
    },
    [3] = {
      ["group"] = 41,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -44,
          [3] = 14,
          [4] = -7,
        },
      },
    },
    [4] = {
      ["group"] = 41,
      ["index"] = 3,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -44,
          [3] = 14,
          [4] = -7,
        },
      },
    },
    [5] = {
      ["group"] = 42,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -19,
          [2] = -47,
          [3] = 12,
          [4] = -14,
        },
      },
    },
    [6] = {
      ["group"] = 42,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -18,
          [2] = -47,
          [3] = 15,
          [4] = -16,
        },
      },
    },
    [7] = {
      ["group"] = 42,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -17,
          [2] = -46,
          [3] = 16,
          [4] = -15,
        },
      },
    },
    [8] = {
      ["group"] = 42,
      ["index"] = 3,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -46,
          [3] = 16,
          [4] = -11,
        },
      },
    },
    [9] = {
      ["group"] = 42,
      ["index"] = 4,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -15,
          [2] = -45,
          [3] = 15,
          [4] = -10,
        },
      },
    },
    [10] = {
      ["group"] = 42,
      ["index"] = 5,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -20,
          [2] = -41,
          [3] = 16,
          [4] = -13,
        },
      },
    },
    [11] = {
      ["group"] = 42,
      ["index"] = 6,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -20,
          [2] = -41,
          [3] = 16,
          [4] = -13,
        },
      },
    },
    [12] = {
      ["group"] = 42,
      ["index"] = 7,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -18,
          [2] = -47,
          [3] = 11,
          [4] = -12,
        },
      },
    },
    [13] = {
      ["group"] = 42,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -18,
          [2] = -47,
          [3] = 11,
          [4] = -12,
        },
      },
    },
    [14] = {
      ["group"] = 41,
      ["index"] = 7,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 4,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -44,
          [3] = 14,
          [4] = -8,
        },
      },
    },
  },
}
config["animations"][10] = {
  ["id"] = 43,
  ["loopStart"] = 10,
  ["durations"] = {
    [1] = 3,
    [2] = 3,
    [3] = 2,
    [4] = 2,
    [5] = 2,
    [6] = 2,
    [7] = 2,
    [8] = 2,
    [9] = 2,
    [10] = 2,
    [11] = 2,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 41,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 3,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -45,
          [3] = 14,
          [4] = -7,
        },
      },
    },
    [2] = {
      ["group"] = 41,
      ["index"] = 3,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 3,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -45,
          [3] = 14,
          [4] = -7,
        },
      },
    },
    [3] = {
      ["group"] = 43,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -18,
          [2] = -47,
          [3] = 10,
          [4] = -12,
        },
      },
    },
    [4] = {
      ["group"] = 43,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -20,
          [2] = -45,
          [3] = 13,
          [4] = -11,
        },
      },
    },
    [5] = {
      ["group"] = 43,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -20,
          [2] = -41,
          [3] = 15,
          [4] = -12,
        },
      },
    },
    [6] = {
      ["group"] = 43,
      ["index"] = 3,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -17,
          [2] = -43,
          [3] = 16,
          [4] = -11,
        },
      },
    },
    [7] = {
      ["group"] = 43,
      ["index"] = 4,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -46,
          [3] = 15,
          [4] = -11,
        },
      },
    },
    [8] = {
      ["group"] = 43,
      ["index"] = 6,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -19,
          [2] = -46,
          [3] = 16,
          [4] = -17,
        },
      },
    },
    [9] = {
      ["group"] = 43,
      ["index"] = 7,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -20,
          [2] = -48,
          [3] = 12,
          [4] = -13,
        },
      },
    },
    [10] = {
      ["group"] = 41,
      ["index"] = 6,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -44,
          [3] = 13,
          [4] = -5,
        },
      },
    },
    [11] = {
      ["group"] = 41,
      ["index"] = 7,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -44,
          [3] = 13,
          [4] = -5,
        },
      },
    },
  },
}
config["animations"][11] = {
  ["id"] = 47,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 3,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 41,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 3,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -41,
          [3] = 13,
          [4] = 0,
        },
      },
    },
  },
}
config["animations"][12] = {
  ["id"] = 100,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 5,
    [2] = 15,
    [3] = 3,
    [4] = 3,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 100,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -17,
          [2] = -36,
          [3] = 19,
          [4] = -2,
        },
      },
    },
    [2] = {
      ["group"] = 100,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 15,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -17,
          [2] = -36,
          [3] = 19,
          [4] = -2,
        },
      },
    },
    [3] = {
      ["group"] = 100,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 3,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -17,
          [2] = -36,
          [3] = 19,
          [4] = -2,
        },
      },
    },
    [4] = {
      ["group"] = 100,
      ["index"] = 3,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 3,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -17,
          [2] = -36,
          [3] = 19,
          [4] = -2,
        },
      },
    },
  },
}
config["animations"][13] = {
  ["id"] = 105,
  ["loopStart"] = 9,
  ["durations"] = {
    [1] = 2,
    [2] = 2,
    [3] = 2,
    [4] = 2,
    [5] = 2,
    [6] = 2,
    [7] = 2,
    [8] = 2,
    [9] = 2,
    [10] = 2,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 43,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -16,
          [2] = -47,
          [3] = 10,
          [4] = -12,
        },
      },
    },
    [2] = {
      ["group"] = 43,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -20,
          [2] = -42,
          [3] = 13,
          [4] = -11,
        },
      },
    },
    [3] = {
      ["group"] = 43,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -19,
          [2] = -41,
          [3] = 15,
          [4] = -12,
        },
      },
    },
    [4] = {
      ["group"] = 43,
      ["index"] = 3,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -17,
          [2] = -44,
          [3] = 16,
          [4] = -11,
        },
      },
    },
    [5] = {
      ["group"] = 43,
      ["index"] = 4,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -46,
          [3] = 15,
          [4] = -11,
        },
      },
    },
    [6] = {
      ["group"] = 43,
      ["index"] = 5,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -17,
          [2] = -47,
          [3] = 16,
          [4] = -14,
        },
      },
    },
    [7] = {
      ["group"] = 43,
      ["index"] = 6,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -19,
          [2] = -44,
          [3] = 16,
          [4] = -17,
        },
      },
    },
    [8] = {
      ["group"] = 43,
      ["index"] = 7,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -20,
          [2] = -49,
          [3] = 12,
          [4] = -14,
        },
      },
    },
    [9] = {
      ["group"] = 41,
      ["index"] = 6,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -15,
          [2] = -45,
          [3] = 13,
          [4] = -7,
        },
      },
    },
    [10] = {
      ["group"] = 41,
      ["index"] = 7,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -15,
          [2] = -45,
          [3] = 13,
          [4] = -7,
        },
      },
    },
  },
}
config["animations"][14] = {
  ["id"] = 150,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 4,
    [2] = 8,
    [3] = 4,
    [4] = -1,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 120,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 4,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -15,
          [2] = -36,
          [3] = 12,
          [4] = 0,
        },
      },
    },
    [2] = {
      ["group"] = 120,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 8,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -15,
          [2] = -36,
          [3] = 12,
          [4] = 0,
        },
      },
    },
    [3] = {
      ["group"] = 120,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 4,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -15,
          [2] = -36,
          [3] = 12,
          [4] = 0,
        },
      },
    },
    [4] = {
      ["group"] = 120,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = -1,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -15,
          [2] = -36,
          [3] = 12,
          [4] = 0,
        },
      },
    },
  },
}
config["animations"][15] = {
  ["id"] = 151,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = -1,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 121,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = -1,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -19,
          [2] = -27,
          [3] = 18,
          [4] = 0,
        },
      },
    },
  },
}
config["animations"][16] = {
  ["id"] = 152,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = -1,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 122,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = -1,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -44,
          [3] = 13,
          [4] = -7,
        },
      },
    },
  },
}
config["animations"][17] = {
  ["id"] = 200,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 2,
    [2] = 2,
    [3] = 2,
    [4] = 7,
    [5] = 2,
    [6] = 2,
    [7] = 2,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 200,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -17,
          [2] = -34,
          [3] = 21,
          [4] = 1,
        },
      },
    },
    [2] = {
      ["group"] = 200,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -17,
          [2] = -29,
          [3] = 21,
          [4] = 1,
        },
      },
    },
    [3] = {
      ["group"] = 200,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -17,
          [2] = -29,
          [3] = 21,
          [4] = 1,
        },
      },
    },
    [4] = {
      ["group"] = 200,
      ["index"] = 3,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 7,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = -6,
          [2] = -35,
          [3] = 64,
          [4] = 1,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -18,
          [2] = -29,
          [3] = 21,
          [4] = 0,
        },
        [2] = {
          [1] = 5,
          [2] = -29,
          [3] = 61,
          [4] = -3,
        },
      },
    },
    [5] = {
      ["group"] = 200,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = -6,
          [2] = -35,
          [3] = 64,
          [4] = 1,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -18,
          [2] = -29,
          [3] = 21,
          [4] = 0,
        },
        [2] = {
          [1] = 5,
          [2] = -29,
          [3] = 61,
          [4] = -3,
        },
      },
    },
    [6] = {
      ["group"] = 200,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = -6,
          [2] = -35,
          [3] = 64,
          [4] = 1,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -18,
          [2] = -29,
          [3] = 21,
          [4] = 0,
        },
        [2] = {
          [1] = 5,
          [2] = -29,
          [3] = 61,
          [4] = -3,
        },
      },
    },
    [7] = {
      ["group"] = 200,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = -6,
          [2] = -35,
          [3] = 64,
          [4] = 1,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -18,
          [2] = -33,
          [3] = 21,
          [4] = 0,
        },
        [2] = {
          [1] = 5,
          [2] = -29,
          [3] = 61,
          [4] = -3,
        },
      },
    },
  },
}
config["animations"][18] = {
  ["id"] = 210,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 3,
    [2] = 2,
    [3] = 2,
    [4] = 2,
    [5] = 2,
    [6] = 2,
    [7] = 2,
    [8] = 2,
    [9] = 2,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 210,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 3,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -36,
          [3] = 13,
          [4] = 0,
        },
      },
    },
    [2] = {
      ["group"] = 210,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -36,
          [3] = 13,
          [4] = 0,
        },
      },
    },
    [3] = {
      ["group"] = 210,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = 8,
          [2] = -35,
          [3] = 65,
          [4] = 0,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -36,
          [3] = 13,
          [4] = 0,
        },
        [2] = {
          [1] = 5,
          [2] = -31,
          [3] = 61,
          [4] = 0,
        },
      },
    },
    [4] = {
      ["group"] = 210,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = 8,
          [2] = -35,
          [3] = 65,
          [4] = 0,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -36,
          [3] = 13,
          [4] = 0,
        },
        [2] = {
          [1] = 5,
          [2] = -31,
          [3] = 61,
          [4] = 0,
        },
      },
    },
    [5] = {
      ["group"] = 210,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = 8,
          [2] = -35,
          [3] = 65,
          [4] = 0,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -36,
          [3] = 13,
          [4] = 0,
        },
        [2] = {
          [1] = 5,
          [2] = -31,
          [3] = 61,
          [4] = 0,
        },
      },
    },
    [6] = {
      ["group"] = 210,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = 8,
          [2] = -35,
          [3] = 65,
          [4] = 0,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -36,
          [3] = 13,
          [4] = 0,
        },
        [2] = {
          [1] = 5,
          [2] = -31,
          [3] = 61,
          [4] = 0,
        },
      },
    },
    [7] = {
      ["group"] = 210,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = 8,
          [2] = -35,
          [3] = 65,
          [4] = 0,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -36,
          [3] = 13,
          [4] = 0,
        },
        [2] = {
          [1] = 5,
          [2] = -31,
          [3] = 61,
          [4] = 0,
        },
      },
    },
    [8] = {
      ["group"] = 210,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = 8,
          [2] = -35,
          [3] = 65,
          [4] = 0,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -36,
          [3] = 13,
          [4] = 0,
        },
        [2] = {
          [1] = 5,
          [2] = -31,
          [3] = 61,
          [4] = 0,
        },
      },
    },
    [9] = {
      ["group"] = 210,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -36,
          [3] = 13,
          [4] = 0,
        },
      },
    },
  },
}
config["animations"][19] = {
  ["id"] = 220,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 3,
    [2] = 3,
    [3] = 4,
    [4] = 3,
    [5] = 3,
    [6] = 3,
    [7] = 2,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 11,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 3,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -18,
          [2] = -31,
          [3] = 20,
          [4] = 0,
        },
      },
    },
    [2] = {
      ["group"] = 20,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 3,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -16,
          [2] = -36,
          [3] = 21,
          [4] = 0,
        },
      },
    },
    [3] = {
      ["group"] = 220,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 4,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -24,
          [2] = -38,
          [3] = 22,
          [4] = -11,
        },
      },
    },
    [4] = {
      ["group"] = 220,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 3,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = -27,
          [2] = -41,
          [3] = 25,
          [4] = -8,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -24,
          [2] = -38,
          [3] = 22,
          [4] = -11,
        },
      },
    },
    [5] = {
      ["group"] = 220,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 3,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = -27,
          [2] = -41,
          [3] = 25,
          [4] = -8,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -24,
          [2] = -38,
          [3] = 22,
          [4] = -11,
        },
      },
    },
    [6] = {
      ["group"] = 220,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 3,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -24,
          [2] = -38,
          [3] = 22,
          [4] = -11,
        },
      },
    },
    [7] = {
      ["group"] = 220,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -24,
          [2] = -38,
          [3] = 22,
          [4] = -11,
        },
      },
    },
  },
}
config["animations"][20] = {
  ["id"] = 230,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 2,
    [2] = 5,
    [3] = 4,
    [4] = 2,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 230,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -17,
          [2] = -30,
          [3] = 21,
          [4] = 0,
        },
      },
    },
    [2] = {
      ["group"] = 230,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = 4,
          [2] = -38,
          [3] = 33,
          [4] = 0,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -17,
          [2] = -36,
          [3] = 31,
          [4] = 0,
        },
      },
    },
    [3] = {
      ["group"] = 230,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 4,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -17,
          [2] = -36,
          [3] = 31,
          [4] = 0,
        },
      },
    },
    [4] = {
      ["group"] = 230,
      ["index"] = 3,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -17,
          [2] = -31,
          [3] = 22,
          [4] = 0,
        },
      },
    },
  },
}
config["animations"][21] = {
  ["id"] = 240,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 2,
    [2] = 2,
    [3] = 2,
    [4] = 2,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 240,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -39,
          [3] = 14,
          [4] = 1,
        },
      },
    },
    [2] = {
      ["group"] = 240,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -39,
          [3] = 14,
          [4] = 1,
        },
      },
    },
    [3] = {
      ["group"] = 240,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = 3,
          [2] = -25,
          [3] = 31,
          [4] = -10,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -39,
          [3] = 14,
          [4] = 1,
        },
        [2] = {
          [1] = 1,
          [2] = -24,
          [3] = 30,
          [4] = -11,
        },
      },
    },
    [4] = {
      ["group"] = 240,
      ["index"] = 3,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -39,
          [3] = 14,
          [4] = 1,
        },
      },
    },
  },
}
config["animations"][22] = {
  ["id"] = 250,
  ["loopStart"] = 9,
  ["durations"] = {
    [1] = 2,
    [2] = 2,
    [3] = 2,
    [4] = 2,
    [5] = 2,
    [6] = 2,
    [7] = 2,
    [8] = 2,
    [9] = 2,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 250,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -17,
          [2] = -46,
          [3] = 11,
          [4] = -11,
        },
      },
    },
    [2] = {
      ["group"] = 250,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -19,
          [2] = -44,
          [3] = 14,
          [4] = -11,
        },
      },
    },
    [3] = {
      ["group"] = 250,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = 10,
          [2] = -41,
          [3] = 43,
          [4] = -12,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -18,
          [2] = -41,
          [3] = 15,
          [4] = -9,
        },
        [2] = {
          [1] = 7,
          [2] = -40,
          [3] = 41,
          [4] = -12,
        },
      },
    },
    [4] = {
      ["group"] = 250,
      ["index"] = 3,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = 8,
          [2] = -60,
          [3] = 41,
          [4] = -11,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -17,
          [2] = -45,
          [3] = 15,
          [4] = -11,
        },
        [2] = {
          [1] = 5,
          [2] = -59,
          [3] = 39,
          [4] = -28,
        },
      },
    },
    [5] = {
      ["group"] = 250,
      ["index"] = 4,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -47,
          [3] = 15,
          [4] = -12,
        },
      },
    },
    [6] = {
      ["group"] = 250,
      ["index"] = 5,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -17,
          [2] = -46,
          [3] = 15,
          [4] = -13,
        },
      },
    },
    [7] = {
      ["group"] = 250,
      ["index"] = 6,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -18,
          [2] = -45,
          [3] = 15,
          [4] = -16,
        },
      },
    },
    [8] = {
      ["group"] = 250,
      ["index"] = 7,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -18,
          [2] = -46,
          [3] = 12,
          [4] = -14,
        },
      },
    },
    [9] = {
      ["group"] = 41,
      ["index"] = 7,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -43,
          [3] = 13,
          [4] = -5,
        },
      },
    },
  },
}
config["animations"][23] = {
  ["id"] = 400,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 2,
    [2] = 2,
    [3] = 2,
    [4] = 7,
    [5] = 2,
    [6] = 2,
    [7] = 2,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 400,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -17,
          [2] = -30,
          [3] = 21,
          [4] = 0,
        },
      },
    },
    [2] = {
      ["group"] = 400,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -17,
          [2] = -30,
          [3] = 21,
          [4] = 0,
        },
      },
    },
    [3] = {
      ["group"] = 400,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -17,
          [2] = -30,
          [3] = 21,
          [4] = 0,
        },
      },
    },
    [4] = {
      ["group"] = 400,
      ["index"] = 3,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 7,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = -6,
          [2] = -23,
          [3] = 66,
          [4] = 1,
        },
        [2] = {
          [1] = -1,
          [2] = -37,
          [3] = 23,
          [4] = -12,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -18,
          [2] = -28,
          [3] = 20,
          [4] = 0,
        },
        [2] = {
          [1] = -1,
          [2] = -22,
          [3] = 65,
          [4] = -1,
        },
      },
    },
    [5] = {
      ["group"] = 400,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -18,
          [2] = -28,
          [3] = 20,
          [4] = 0,
        },
      },
    },
    [6] = {
      ["group"] = 400,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -18,
          [2] = -28,
          [3] = 20,
          [4] = 0,
        },
      },
    },
    [7] = {
      ["group"] = 400,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -18,
          [2] = -28,
          [3] = 20,
          [4] = 0,
        },
      },
    },
  },
}
config["animations"][24] = {
  ["id"] = 410,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 2,
    [2] = 2,
    [3] = 2,
    [4] = 7,
    [5] = 2,
    [6] = 2,
    [7] = 2,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 410,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -17,
          [2] = -29,
          [3] = 21,
          [4] = 0,
        },
      },
    },
    [2] = {
      ["group"] = 410,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -17,
          [2] = -29,
          [3] = 21,
          [4] = 0,
        },
      },
    },
    [3] = {
      ["group"] = 410,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -17,
          [2] = -29,
          [3] = 21,
          [4] = 0,
        },
      },
    },
    [4] = {
      ["group"] = 410,
      ["index"] = 3,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 7,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = -6,
          [2] = -23,
          [3] = 75,
          [4] = 1,
        },
        [2] = {
          [1] = -1,
          [2] = -37,
          [3] = 23,
          [4] = -12,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -18,
          [2] = -29,
          [3] = 20,
          [4] = 0,
        },
        [2] = {
          [1] = -7,
          [2] = -22,
          [3] = 73,
          [4] = -2,
        },
      },
    },
    [5] = {
      ["group"] = 410,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -18,
          [2] = -29,
          [3] = 20,
          [4] = 0,
        },
      },
    },
    [6] = {
      ["group"] = 410,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -18,
          [2] = -29,
          [3] = 20,
          [4] = 0,
        },
      },
    },
    [7] = {
      ["group"] = 410,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -18,
          [2] = -29,
          [3] = 20,
          [4] = 0,
        },
      },
    },
  },
}
config["animations"][25] = {
  ["id"] = 500,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 2,
    [2] = 2,
    [3] = 2,
    [4] = 2,
    [5] = 2,
    [6] = 2,
    [7] = 2,
    [8] = 2,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 500,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -18,
          [2] = -28,
          [3] = 21,
          [4] = 0,
        },
      },
    },
    [2] = {
      ["group"] = 500,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -21,
          [2] = -21,
          [3] = 21,
          [4] = 0,
        },
      },
    },
    [3] = {
      ["group"] = 500,
      ["index"] = 3,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = -21,
          [2] = -23,
          [3] = 23,
          [4] = 0,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -21,
          [2] = -21,
          [3] = 21,
          [4] = 0,
        },
      },
    },
    [4] = {
      ["group"] = 500,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = -21,
          [2] = -23,
          [3] = 23,
          [4] = 0,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -21,
          [2] = -21,
          [3] = 21,
          [4] = 0,
        },
      },
    },
    [5] = {
      ["group"] = 500,
      ["index"] = 3,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = -21,
          [2] = -23,
          [3] = 23,
          [4] = 0,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -21,
          [2] = -21,
          [3] = 21,
          [4] = 0,
        },
      },
    },
    [6] = {
      ["group"] = 500,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = -21,
          [2] = -23,
          [3] = 23,
          [4] = 0,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -21,
          [2] = -21,
          [3] = 21,
          [4] = 0,
        },
      },
    },
    [7] = {
      ["group"] = 500,
      ["index"] = 3,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = -21,
          [2] = -23,
          [3] = 23,
          [4] = 0,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -21,
          [2] = -21,
          [3] = 21,
          [4] = 0,
        },
      },
    },
    [8] = {
      ["group"] = 500,
      ["index"] = 4,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -18,
          [2] = -27,
          [3] = 19,
          [4] = 0,
        },
      },
    },
  },
}
config["animations"][26] = {
  ["id"] = 600,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 2,
    [2] = 2,
    [3] = 2,
    [4] = 2,
    [5] = 2,
    [6] = 2,
    [7] = 2,
    [8] = 2,
    [9] = 2,
    [10] = -1,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 41,
      ["index"] = 6,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -45,
          [3] = 14,
          [4] = -6,
        },
      },
    },
    [2] = {
      ["group"] = 600,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -45,
          [3] = 14,
          [4] = -6,
        },
      },
    },
    [3] = {
      ["group"] = 600,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = -1,
          [2] = -39,
          [3] = 37,
          [4] = -3,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -45,
          [3] = 14,
          [4] = -8,
        },
        [2] = {
          [1] = -3,
          [2] = -37,
          [3] = 35,
          [4] = -4,
        },
      },
    },
    [4] = {
      ["group"] = 600,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = 19,
          [2] = -25,
          [3] = 50,
          [4] = 7,
        },
        [2] = {
          [1] = 0,
          [2] = -43,
          [3] = 33,
          [4] = -2,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -45,
          [3] = 14,
          [4] = -7,
        },
        [2] = {
          [1] = 1,
          [2] = -41,
          [3] = 30,
          [4] = -4,
        },
        [3] = {
          [1] = 18,
          [2] = -23,
          [3] = 47,
          [4] = 6,
        },
      },
    },
    [5] = {
      ["group"] = 600,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = 18,
          [2] = -31,
          [3] = 49,
          [4] = 1,
        },
        [2] = {
          [1] = 0,
          [2] = -46,
          [3] = 33,
          [4] = -5,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -45,
          [3] = 15,
          [4] = -8,
        },
        [2] = {
          [1] = -1,
          [2] = -44,
          [3] = 31,
          [4] = -6,
        },
        [3] = {
          [1] = 19,
          [2] = -30,
          [3] = 47,
          [4] = -2,
        },
      },
    },
    [6] = {
      ["group"] = 600,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = 18,
          [2] = -31,
          [3] = 49,
          [4] = 1,
        },
        [2] = {
          [1] = 0,
          [2] = -46,
          [3] = 33,
          [4] = -5,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -45,
          [3] = 15,
          [4] = -8,
        },
        [2] = {
          [1] = -2,
          [2] = -44,
          [3] = 31,
          [4] = -7,
        },
        [3] = {
          [1] = 15,
          [2] = -29,
          [3] = 47,
          [4] = 1,
        },
      },
    },
    [7] = {
      ["group"] = 600,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = 18,
          [2] = -31,
          [3] = 49,
          [4] = 1,
        },
        [2] = {
          [1] = 0,
          [2] = -46,
          [3] = 33,
          [4] = -5,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -45,
          [3] = 15,
          [4] = -8,
        },
        [2] = {
          [1] = -2,
          [2] = -44,
          [3] = 31,
          [4] = -6,
        },
        [3] = {
          [1] = 16,
          [2] = -30,
          [3] = 47,
          [4] = 0,
        },
      },
    },
    [8] = {
      ["group"] = 600,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = 17,
          [2] = -27,
          [3] = 41,
          [4] = -6,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -45,
          [3] = 15,
          [4] = -8,
        },
        [2] = {
          [1] = 14,
          [2] = -25,
          [3] = 40,
          [4] = -6,
        },
      },
    },
    [9] = {
      ["group"] = 600,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = 17,
          [2] = -27,
          [3] = 41,
          [4] = -6,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -45,
          [3] = 15,
          [4] = -8,
        },
        [2] = {
          [1] = 14,
          [2] = -26,
          [3] = 40,
          [4] = -6,
        },
      },
    },
    [10] = {
      ["group"] = 41,
      ["index"] = 6,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = -1,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -45,
          [3] = 15,
          [4] = -8,
        },
      },
    },
  },
}
config["animations"][27] = {
  ["id"] = 610,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 2,
    [2] = 2,
    [3] = 2,
    [4] = 2,
    [5] = 2,
    [6] = 2,
    [7] = 2,
    [8] = 2,
    [9] = -1,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 610,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -16,
          [2] = -40,
          [3] = 12,
          [4] = -6,
        },
      },
    },
    [2] = {
      ["group"] = 610,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -18,
          [2] = -39,
          [3] = 18,
          [4] = -5,
        },
      },
    },
    [3] = {
      ["group"] = 610,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = -5,
          [2] = -54,
          [3] = 49,
          [4] = 4,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -36,
          [3] = 25,
          [4] = -5,
        },
        [2] = {
          [1] = 3,
          [2] = -52,
          [3] = 47,
          [4] = -3,
        },
      },
    },
    [4] = {
      ["group"] = 610,
      ["index"] = 3,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = -5,
          [2] = -54,
          [3] = 49,
          [4] = 4,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -10,
          [2] = -40,
          [3] = 25,
          [4] = -5,
        },
        [2] = {
          [1] = 3,
          [2] = -52,
          [3] = 46,
          [4] = -27,
        },
      },
    },
    [5] = {
      ["group"] = 610,
      ["index"] = 4,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = -5,
          [2] = -64,
          [3] = 49,
          [4] = -11,
        },
      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -7,
          [2] = -42,
          [3] = 25,
          [4] = -6,
        },
        [2] = {
          [1] = -8,
          [2] = -63,
          [3] = 20,
          [4] = -35,
        },
      },
    },
    [6] = {
      ["group"] = 610,
      ["index"] = 5,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -10,
          [2] = -41,
          [3] = 24,
          [4] = -8,
        },
      },
    },
    [7] = {
      ["group"] = 610,
      ["index"] = 6,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -40,
          [3] = 24,
          [4] = -12,
        },
      },
    },
    [8] = {
      ["group"] = 610,
      ["index"] = 7,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -41,
          [3] = 20,
          [4] = -6,
        },
      },
    },
    [9] = {
      ["group"] = 41,
      ["index"] = 7,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = -1,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -44,
          [3] = 15,
          [4] = -5,
        },
      },
    },
  },
}
config["animations"][28] = {
  ["id"] = 1000,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 2,
    [2] = 2,
    [3] = 2,
    [4] = 7,
    [5] = 2,
    [6] = 2,
    [7] = 2,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 1000,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -19,
          [2] = -29,
          [3] = 21,
          [4] = -1,
        },
      },
    },
    [2] = {
      ["group"] = 1000,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -19,
          [2] = -29,
          [3] = 21,
          [4] = -1,
        },
      },
    },
    [3] = {
      ["group"] = 1000,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -19,
          [2] = -29,
          [3] = 21,
          [4] = -1,
        },
      },
    },
    [4] = {
      ["group"] = 1000,
      ["index"] = 3,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 7,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -19,
          [2] = -29,
          [3] = 21,
          [4] = -1,
        },
      },
    },
    [5] = {
      ["group"] = 1000,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -19,
          [2] = -29,
          [3] = 21,
          [4] = -1,
        },
      },
    },
    [6] = {
      ["group"] = 1000,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -19,
          [2] = -29,
          [3] = 21,
          [4] = -1,
        },
      },
    },
    [7] = {
      ["group"] = 1000,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -19,
          [2] = -29,
          [3] = 21,
          [4] = -1,
        },
      },
    },
  },
}
config["animations"][29] = {
  ["id"] = 1002,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 5,
    [2] = 5,
    [3] = 5,
    [4] = 5,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 1002,
      ["index"] = 3,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = -11,
          [2] = -36,
          [3] = 13,
          [4] = 0,
        },
      },
      ["hurtBoxes"] = {

      },
    },
    [2] = {
      ["group"] = 1002,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = -9,
          [2] = -25,
          [3] = 8,
          [4] = 3,
        },
      },
      ["hurtBoxes"] = {

      },
    },
    [3] = {
      ["group"] = 1002,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = -7,
          [2] = -36,
          [3] = 12,
          [4] = 3,
        },
      },
      ["hurtBoxes"] = {

      },
    },
    [4] = {
      ["group"] = 1002,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -39,
          [3] = 13,
          [4] = -5,
        },
      },
      ["hurtBoxes"] = {

      },
    },
  },
}
config["animations"][30] = {
  ["id"] = 1020,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 2,
    [2] = 2,
    [3] = 2,
    [4] = 2,
    [5] = 2,
    [6] = 2,
    [7] = 2,
    [8] = -1,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 1020,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -44,
          [3] = 14,
          [4] = -10,
        },
      },
    },
    [2] = {
      ["group"] = 1020,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -44,
          [3] = 14,
          [4] = -10,
        },
      },
    },
    [3] = {
      ["group"] = 1020,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -44,
          [3] = 14,
          [4] = -10,
        },
      },
    },
    [4] = {
      ["group"] = 1020,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -44,
          [3] = 14,
          [4] = -10,
        },
      },
    },
    [5] = {
      ["group"] = 1020,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -44,
          [3] = 14,
          [4] = -10,
        },
      },
    },
    [6] = {
      ["group"] = 1020,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -44,
          [3] = 14,
          [4] = -10,
        },
      },
    },
    [7] = {
      ["group"] = 1020,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -44,
          [3] = 14,
          [4] = -10,
        },
      },
    },
    [8] = {
      ["group"] = 41,
      ["index"] = 7,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = -1,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -44,
          [3] = 14,
          [4] = -10,
        },
      },
    },
  },
}
config["animations"][31] = {
  ["id"] = 5000,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 4,
    [2] = 4,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 5000,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 4,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -37,
          [3] = 14,
          [4] = 0,
        },
      },
    },
    [2] = {
      ["group"] = 5000,
      ["index"] = 10,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 4,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -37,
          [3] = 14,
          [4] = 0,
        },
      },
    },
  },
}
config["animations"][32] = {
  ["id"] = 5001,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 5,
    [2] = 5,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 5000,
      ["index"] = 10,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -38,
          [3] = 12,
          [4] = 0,
        },
      },
    },
    [2] = {
      ["group"] = 5000,
      ["index"] = 11,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -38,
          [3] = 12,
          [4] = 0,
        },
      },
    },
  },
}
config["animations"][33] = {
  ["id"] = 5002,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 5,
    [2] = 5,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 5000,
      ["index"] = 11,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -16,
          [2] = -38,
          [3] = 11,
          [4] = 0,
        },
      },
    },
    [2] = {
      ["group"] = 5000,
      ["index"] = 20,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -16,
          [2] = -38,
          [3] = 11,
          [4] = 0,
        },
      },
    },
  },
}
config["animations"][34] = {
  ["id"] = 5010,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 5,
    [2] = 5,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 5010,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -37,
          [3] = 14,
          [4] = 1,
        },
      },
    },
    [2] = {
      ["group"] = 5010,
      ["index"] = 10,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -38,
          [3] = 14,
          [4] = 1,
        },
      },
    },
  },
}
config["animations"][35] = {
  ["id"] = 5011,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 5,
    [2] = 5,
    [3] = 5,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 5010,
      ["index"] = 10,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -38,
          [3] = 13,
          [4] = 0,
        },
      },
    },
    [2] = {
      ["group"] = 5010,
      ["index"] = 20,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -36,
          [3] = 13,
          [4] = 0,
        },
      },
    },
    [3] = {
      ["group"] = 5010,
      ["index"] = 21,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -35,
          [3] = 16,
          [4] = 0,
        },
      },
    },
  },
}
config["animations"][36] = {
  ["id"] = 5012,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 1,
    [2] = 5,
    [3] = 5,
    [4] = 5,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 5010,
      ["index"] = 20,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 1,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -36,
          [3] = 13,
          [4] = 0,
        },
      },
    },
    [2] = {
      ["group"] = 5010,
      ["index"] = 21,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -35,
          [3] = 15,
          [4] = 0,
        },
      },
    },
    [3] = {
      ["group"] = 5010,
      ["index"] = 20,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -13,
          [2] = -35,
          [3] = 15,
          [4] = 0,
        },
      },
    },
    [4] = {
      ["group"] = 5010,
      ["index"] = 21,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -35,
          [3] = 15,
          [4] = 0,
        },
      },
    },
  },
}
config["animations"][37] = {
  ["id"] = 5020,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 5,
    [2] = 5,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 5020,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -18,
          [2] = -29,
          [3] = 20,
          [4] = 0,
        },
      },
    },
    [2] = {
      ["group"] = 5020,
      ["index"] = 10,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -18,
          [2] = -29,
          [3] = 20,
          [4] = 0,
        },
      },
    },
  },
}
config["animations"][38] = {
  ["id"] = 5030,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 5,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 5030,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -18,
          [2] = -47,
          [3] = 16,
          [4] = -10,
        },
      },
    },
  },
}
config["animations"][39] = {
  ["id"] = 5050,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 5,
    [2] = 5,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 5030,
      ["index"] = 30,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -23,
          [2] = -45,
          [3] = 15,
          [4] = -19,
        },
      },
    },
    [2] = {
      ["group"] = 5030,
      ["index"] = 31,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -23,
          [2] = -45,
          [3] = 15,
          [4] = -19,
        },
      },
    },
  },
}
config["animations"][40] = {
  ["id"] = 5110,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 1,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 5040,
      ["index"] = 10,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 1,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -21,
          [2] = -25,
          [3] = 18,
          [4] = 0,
        },
      },
    },
  },
}
config["animations"][41] = {
  ["id"] = 5120,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 5,
    [2] = 3,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 5040,
      ["index"] = 11,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 5,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -21,
          [2] = -28,
          [3] = 16,
          [4] = -1,
        },
      },
    },
    [2] = {
      ["group"] = 11,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 3,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -19,
          [2] = -28,
          [3] = 18,
          [4] = -1,
        },
      },
    },
  },
}
config["animations"][42] = {
  ["id"] = 5150,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 1,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 5040,
      ["index"] = 10,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 1,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -19,
          [2] = -25,
          [3] = 16,
          [4] = 1,
        },
      },
    },
  },
}
config["animations"][43] = {
  ["id"] = 34675,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 2,
    [2] = 2,
    [3] = 2,
    [4] = 2,
    [5] = 2,
    [6] = 2,
    [7] = 2,
    [8] = 2,
    [9] = 2,
    [10] = 2,
    [11] = 2,
  },
  ["frames"] = {
    [1] = {
      ["group"] = -30872,
      ["index"] = 96,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {

      },
    },
    [2] = {
      ["group"] = -30872,
      ["index"] = 97,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {

      },
    },
    [3] = {
      ["group"] = -30872,
      ["index"] = 98,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {

      },
    },
    [4] = {
      ["group"] = -30872,
      ["index"] = 99,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {

      },
    },
    [5] = {
      ["group"] = -30872,
      ["index"] = 100,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {

      },
    },
    [6] = {
      ["group"] = -30872,
      ["index"] = 101,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {

      },
    },
    [7] = {
      ["group"] = -30872,
      ["index"] = 102,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {

      },
    },
    [8] = {
      ["group"] = -30872,
      ["index"] = 103,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {

      },
    },
    [9] = {
      ["group"] = -30872,
      ["index"] = 104,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {

      },
    },
    [10] = {
      ["group"] = -30872,
      ["index"] = 105,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {

      },
    },
    [11] = {
      ["group"] = -30872,
      ["index"] = 106,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 2,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {

      },
    },
  },
}
config["animations"][44] = {
  ["id"] = 106,
  ["loopStart"] = 1,
  ["durations"] = {
    [1] = 7,
    [2] = 7,
    [3] = 7,
    [4] = 7,
    [5] = 7,
  },
  ["frames"] = {
    [1] = {
      ["group"] = 0,
      ["index"] = 0,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 7,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -41,
          [3] = 14,
          [4] = 1,
        },
      },
    },
    [2] = {
      ["group"] = 0,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 7,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -41,
          [3] = 14,
          [4] = 1,
        },
      },
    },
    [3] = {
      ["group"] = 0,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 7,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -41,
          [3] = 14,
          [4] = 1,
        },
      },
    },
    [4] = {
      ["group"] = 0,
      ["index"] = 2,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 7,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -41,
          [3] = 14,
          [4] = 1,
        },
      },
    },
    [5] = {
      ["group"] = 0,
      ["index"] = 1,
      ["x"] = 0,
      ["y"] = 0,
      ["duration"] = 7,
      ["flipH"] = false,
      ["flipV"] = false,
      ["attackBoxes"] = {

      },
      ["hurtBoxes"] = {
        [1] = {
          [1] = -14,
          [2] = -41,
          [3] = 14,
          [4] = 1,
        },
      },
    },
  },
}
config["combat"] = {
  ["life"] = 900,
  ["attack"] = 80,
  ["defence"] = 90,
  ["xscale"] = 1,
  ["yscale"] = 1,
  ["localcoord"] = {
    [1] = 320,
    [2] = 240,
  },
  ["name"] = "Pikachu",
  ["victoryQuotes"] = {

  },
  ["guardState"] = 150,
  ["hitState"] = 5000,
  ["guardAnim"] = 150,
  ["hitAnims"] = {
    ["High"] = {
      ["Light"] = 5000,
      ["Medium"] = 5001,
      ["Hard"] = 5002,
    },
    ["Low"] = {
      ["Light"] = 5010,
      ["Medium"] = 5011,
      ["Hard"] = 5012,
    },
  },
  ["common"] = {
    ["animations"] = {
      ["idle"] = 0,
      ["walkForward"] = 20,
      ["walkBack"] = 21,
      ["runForward"] = 100,
      ["runBack"] = 105,
      ["runBackLanding"] = 106,
      ["crouchDown"] = 10,
      ["crouch"] = 11,
      ["crouchUp"] = 12,
      ["jumpStart"] = 40,
      ["jumpNeutral"] = 41,
      ["jumpForward"] = 42,
      ["jumpBack"] = 43,
      ["landing"] = 47,
      ["guardStand"] = 150,
      ["guardCrouch"] = 151,
      ["guardAir"] = 152,
      ["hitStandLight"] = 5000,
      ["hitStandMedium"] = 5001,
      ["hitStandHard"] = 5002,
      ["hitLowLight"] = 5010,
      ["hitLowMedium"] = 5011,
      ["hitLowHard"] = 5012,
      ["hitCrouch"] = 5020,
      ["hitAir"] = 5030,
      ["fall"] = 5050,
      ["down"] = 5110,
      ["getUp"] = 5120,
      ["ko"] = 5150,
    },
    ["movement"] = {
      ["runForward"] = 4.6,
      ["runBackX"] = -4.5,
      ["runBackY"] = -3.8,
      ["walkForward"] = 4.5,
      ["walkBack"] = -4.5,
      ["jump"] = {
        ["x"] = 0,
        ["y"] = -9.5,
      },
      ["jumpBack"] = -2.55,
      ["jumpForward"] = 2.5,
      ["airJump"] = {
        ["x"] = 0,
        ["y"] = -8,
      },
      ["airJumpBack"] = -2.55,
      ["airJumpForward"] = 2.5,
      ["airJumpNum"] = 1,
      ["airJumpHeight"] = 35,
      ["gravity"] = 0.44,
      ["standFriction"] = 0.85,
      ["crouchFriction"] = 0.82,
    },
    ["size"] = {
      ["groundBack"] = 15,
      ["groundFront"] = 16,
      ["height"] = 55,
    },
    ["reactions"] = {
      ["liedownTime"] = 60,
    },
    ["recoveryCommand"] = "recovery",
  },
}
config["gravity"] = 0.44
config["friction"] = 0.85
config["crouchFriction"] = 0.82
return config
