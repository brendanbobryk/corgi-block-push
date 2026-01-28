import { GRID_COLS } from "../components/constants";

const LEVELS = [
  {
    name: "Level 1",
    grid: [
      Array(GRID_COLS).fill(null).map(() => [
        { type: "WALL", properties: ["WALL"] }
      ]),
      [
        [{ type: "WALL", properties: ["WALL"] }],
        [{ type: "GOAL", properties: ["WIN"] }],
        [],
        [],
        [{ type: "WALL", properties: ["WALL"] }],
        [{ type: "BLOCK", properties: ["PUSH"] }],
        [{ type: "WALL", properties: ["WALL"] }]
      ],
      [
        [{ type: "WALL", properties: ["WALL"] }],
        [{ type: "WALL", properties: ["WALL"] }],
        [],
        [],
        [],
        [],
        [{ type: "WALL", properties: ["WALL"] }]
      ],
      [
        [{ type: "WALL", properties: ["WALL"] }],
        [{ type: "WALL", properties: ["WALL"] }],
        [],
        [{ type: "BLOCK", properties: ["PUSH"] }],
        [],
        [],
        [{ type: "WALL", properties: ["WALL"] }]
      ],
      [
        [{ type: "WALL", properties: ["WALL"] }],
        [{ type: "WALL", properties: ["WALL"] }],
        [{ type: "BLOCK", properties: ["PUSH"] }],
        [{ type: "WALL", properties: ["WALL"] }],
        [{ type: "WALL", properties: ["WALL"] }],
        [],
        [{ type: "WALL", properties: ["WALL"] }]
      ],
      [
        [{ type: "WALL", properties: ["WALL"] }],
        [],
        [],
        [{ type: "CORGI", properties: ["YOU"] }],
        [{ type: "WALL", properties: ["WALL"] }],
        [{ type: "TREAT", properties: ["COLLECTIBLE"] }],
        [{ type: "WALL", properties: ["WALL"] }]
      ],
      Array(GRID_COLS).fill(null).map(() => [
        { type: "WALL", properties: ["WALL"] }
      ]),
    ]
  }
];

export default LEVELS;
