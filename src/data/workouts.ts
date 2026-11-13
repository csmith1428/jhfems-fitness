

export type Workout = {
  id: string;
  week: number;
  format?: "strength" | "intervals" | "circuit" | "amrap" | "emom";
  title: string;
  category: string;
  duration: string;
  warmup: string[];
  main: string[];
  cooldown: string[];
  scaling?: {
    beginner: string[];
    standard: string[];
    advanced: string[];
  };
};


export const workoutLibrary: Workout[] = [
  {
    id: "week-01-strength-a",
    week: 1,
    format: "strength",
    title: "Strength A",
    category: "LOWER BODY + PUSH",
    duration: "50–60 MIN",
    warmup: [
      "5 min easy bike or row",
      "10 bodyweight squats",
      "10 glute bridges",
      "10 arm circles each direction",
      "2 progressive squat warm-up sets",
    ],
    main: [
      "Barbell squat — 4 × 6",
      "DB bench press — 4 × 8",
      "Reverse lunges — 3 × 8 each leg",
      "Push-ups — 3 × 10",
      "Front plank — 3 × 40 sec",
    ],
    cooldown: [
      "3 min easy walking",
      "Hip flexor stretch — 45 sec each side",
      "Quad stretch — 45 sec each side",
      "Chest stretch — 45 sec each side",
    ],
  },

  {
    id: "week-01-strength-b",
    week: 1,
    format: "strength",
    title: "Strength B",
    category: "HINGE + PULL",
    duration: "50–60 MIN",
    warmup: [
      "5 min easy bike or row",
      "10 unloaded hip hinges",
      "10 band pull-aparts",
      "10 glute bridges",
      "2 progressive deadlift warm-up sets",
    ],
    main: [
      "Deadlift — 4 × 5",
      "Pull-ups or assisted pull-ups — 4 × 6",
      "DB row — 3 × 10 each side",
      "Romanian deadlift — 3 × 8",
      "Farmer carry — 4 × 30 m",
    ],
    cooldown: [
      "3 min easy walking",
      "Hamstring stretch — 45 sec each side",
      "Lat stretch — 45 sec each side",
      "Glute stretch — 45 sec each side",
    ],
  },
  {
    id: "week-01-conditioning",
    week: 1,
    format: "intervals",
    title: "Conditioning",
    category: "ENGINE",
    duration: "35–45 MIN",
    warmup: [
      "5 min easy cycling",
      "3 × 20 sec progressive efforts",
      "2 min easy recovery",
    ],
    main: [
      "6 rounds:",
      "2 min moderate-hard bike",
      "2 min easy recovery",
      "Maintain consistent output across rounds",
    ],
    cooldown: [
      "5 min progressively easier cycling",
      "Calf stretch — 45 sec each side",
      "Quad stretch — 45 sec each side",
    ],
  },
  {
    id: "week-01-functional",
    week: 1,
    format: "circuit",
    title: "Functional Fitness",
    category: "WORK CAPACITY",
    duration: "40–55 MIN",
    warmup: [
      "5 min easy row or bike",
      "10 bodyweight squats",
      "10 unloaded hip hinges",
      "10 shoulder circles",
      "2 light practice rounds",
    ],
    main: [
      "4 rounds at a sustainable pace:",
      "20 m sled push",
      "40 m farmer carry",
      "10 DB push presses",
      "12 step-ups",
      "Rest 90 sec between rounds",
    ],
    cooldown: [
      "3 min easy walking",
      "Hip flexor stretch — 45 sec each side",
      "Calf stretch — 45 sec each side",
      "Shoulder stretch — 45 sec each side",
    ],
  },

  {
    id: "week-02-strength-a",
    week: 2,
    format: "strength",
    title: "Strength A",
    category: "LOWER BODY + PUSH",
    duration: "50–65 MIN",
    warmup: [
      "5 min easy bike or row",
      "10 bodyweight squats",
      "10 alternating reverse lunges",
      "10 glute bridges",
      "10 arm circles each direction",
      "2–3 progressively heavier squat warm-up sets",
    ],
    main: [
      "Barbell squat — 4 × 6, add 2.5–5% if Week 1 technique was solid",
      "DB bench press — 4 × 8, increase slightly if all reps were controlled",
      "Reverse lunges — 3 × 10 each leg",
      "Push-ups — 3 × 10–12",
      "Front plank — 3 × 45 sec",
      "Rest 2–3 min on squats, 60–90 sec on accessory exercises",
    ],
    cooldown: [
      "3 min easy walking",
      "Hip flexor stretch — 45 sec each side",
      "Quad stretch — 45 sec each side",
      "Chest stretch — 45 sec each side",
    ],

    scaling: {
      beginner: [
        "Goblet squat — 3 × 8",
        "DB floor press — 3 × 10",
        "Supported reverse lunge — 2 × 8 each leg",
        "Incline push-ups — 2 × 8",
        "Front plank — 3 × 20 sec",
      ],
      standard: [
        "Barbell squat — 4 × 6, add load only if technique is solid",
        "DB bench press — 4 × 8",
        "Reverse lunges — 3 × 10 each leg",
        "Push-ups — 3 × 10–12",
        "Front plank — 3 × 45 sec",
      ],
      advanced: [
        "Barbell squat — 4 × 6 at RPE 8",
        "DB bench press — 4 × 8 at RPE 8",
        "Loaded reverse lunges — 3 × 10 each leg",
        "Weighted or tempo push-ups — 3 × 8–10",
        "Front plank — 3 × 60 sec",
      ],
    },
  },
  {
    id: "week-02-strength-b",
    week: 2,
    format: "strength",
    title: "Strength B",
    category: "HINGE + PULL",
    duration: "50–65 MIN",
    warmup: [
      "5 min easy rowing",
      "10 unloaded hip hinges",
      "10 glute bridges",
      "12 band pull-aparts",
      "8 light Romanian deadlifts",
      "2–3 progressive deadlift warm-up sets",
    ],
    main: [
      "Deadlift — 4 × 5, add 2.5–5% if Week 1 technique was solid",
      "Pull-ups or assisted pull-ups — 4 × 6–8",
      "DB row — 3 × 10 each side",
      "Romanian deadlift — 3 × 8",
      "Farmer carry — 4 × 35 m",
      "Rest 2–3 min on deadlifts, 60–90 sec on accessory exercises",
    ],
    cooldown: [
  "3 min easy walking",
  "Hamstring stretch — 45 sec each side",
  "Lat stretch — 45 sec each side",
  "Glute stretch — 45 sec each side",
],


    scaling: {
      beginner: [
        "Kettlebell deadlift — 3 × 8 at RPE 5–6",
        "Assisted pull-ups or lat pulldowns — 3 × 8",
        "Supported DB row — 3 × 10 each side",
        "DB Romanian deadlift — 2 × 10",
        "Farmer carry — 3 × 20 m at a manageable load",
        "Rest 60–90 sec between sets",
      ],
      standard: [
        "Deadlift — 4 × 5 at RPE 7",
        "Pull-ups or assisted pull-ups — 4 × 6–8",
        "DB row — 3 × 10 each side",
        "Romanian deadlift — 3 × 8",
        "Farmer carry — 4 × 35 m",
        "Rest 2–3 min on deadlifts; 60–90 sec on accessories",
      ],
      advanced: [
        "Deadlift — 4 × 5 at RPE 8",
        "Weighted pull-ups or challenging assisted pull-ups — 4 × 6",
        "Heavy DB row — 3 × 8 each side",
        "Romanian deadlift — 3 × 8 at RPE 7–8",
        "Heavy farmer carry — 4 × 35 m",
        "Rest 2–3 min on deadlifts; 90 sec on accessories",
      ],
    },
},
  {
    id: "week-02-conditioning",
    week: 2,
    format: "intervals",
    title: "Conditioning",
    category: "ENGINE",
    duration: "35–45 MIN",
    warmup: [
      "5 min easy bike",
      "3 × 20 sec progressive efforts",
      "2 min easy recovery",
    ],
    main: [
      "7 rounds:",
      "2 min moderate-hard cycling at RPE 7/10",
      "2 min easy recovery at RPE 2–3/10",
      "Maintain consistent output across all rounds",
      "Reduce intensity if output drops significantly",
    ],
    cooldown: [
      "5 min progressively easier cycling",
      "Calf stretch — 45 sec each side",
      "Quad stretch — 45 sec each side",
    ],

    scaling: {
      beginner: [
        "5 rounds:",
        "90 sec moderate cycling at RPE 5–6/10",
        "2 min easy recovery at RPE 2–3/10",
        "Maintain a pace that allows short sentences",
        "Reduce resistance if breathing or technique becomes difficult",
      ],
      standard: [
        "7 rounds:",
        "2 min moderate-hard cycling at RPE 7/10",
        "2 min easy recovery at RPE 2–3/10",
        "Maintain consistent output across all rounds",
        "Reduce intensity if output drops significantly",
      ],
      advanced: [
        "7 rounds:",
        "2 min hard cycling at RPE 8/10",
        "2 min easy recovery at RPE 2–3/10",
        "Aim for consistent output rather than an all-out sprint",
        "Reduce intensity if output drops significantly",
      ],
    },
  },
  {
    id: "week-02-functional",
    week: 2,
    format: "circuit",
    title: "Functional Fitness",
    category: "WORK CAPACITY",
    duration: "40–55 MIN",
    warmup: [
      "5 min easy row or bike",
      "10 bodyweight squats",
      "10 unloaded hip hinges",
      "10 shoulder circles",
      "10 alternating step-ups",
      "2 light practice rounds of the workout movements",
    ],
    main: [
      "4 rounds at a controlled, sustainable pace:",
      "25 m sled push",
      "40 m farmer carry",
      "10 DB push presses",
      "14 step-ups",
      "Rest 90 sec between rounds",
      "Prioritize movement quality over speed",
    ],
    cooldown: [
      "3 min easy walking",
      "Hip flexor stretch — 45 sec each side",
      "Calf stretch — 45 sec each side",
      "Shoulder stretch — 45 sec each side",
    ],

    scaling: {
      beginner: [
        "3 rounds at a comfortable, controlled pace:",
        "15 m light sled push",
        "20 m farmer carry with manageable dumbbells",
        "8 standing DB shoulder presses with light weights",
        "10 step-ups onto a low, stable platform",
        "Rest 2 min between rounds",
        "Focus on movement quality, not speed",
      ],
      standard: [
        "4 rounds at a controlled, sustainable pace:",
        "25 m sled push",
        "40 m farmer carry",
        "10 DB push presses",
        "14 step-ups",
        "Rest 90 sec between rounds",
        "Maintain consistent effort across all rounds",
      ],
      advanced: [
        "4 rounds at RPE 7–8:",
        "30 m moderately heavy sled push",
        "50 m heavy farmer carry",
        "12 DB push presses with controlled technique",
        "16 step-ups, optionally holding light dumbbells",
        "Rest 90 sec between rounds",
        "Prioritize consistent movement and safe mechanics",
      ],
    },
  },
];
