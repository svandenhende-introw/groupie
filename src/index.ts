import * as fs from "fs";
import * as z from "zod";
const PImage = require("pureimage");

import {
  drawLine,
  drawRect,
  drawText,
  drawTextWithBackground,
} from "./drawing";

// Lars:: Sloebers 3e keuze, even veel score als speelclub meisjes 2e keuze -> verlaagd naar 84
// Maxime:: Rakkers 1e keuze, even veel score als speelclub meisjes 2e keuze -> Rakkers verhoogd naar 81

const IDEAL_LEIDING_PER_GROUP = 2;
const MAX_ITERATIONS = 100;
let c = 0;

const groups = z.enum([
  "Sloebers",
  "Speelclub jongens",
  "Speelclub meisjes",
  "Rakkers",
  "Kwiks",
  "Tippers",
  "Toppers",
  "Keti's",
  "Aspi's",
]);

const people = z.enum([
  "Evi",
  "Floor",
  "Renee",
  "Sander",
  "Boelens",
  "Amber",
  "Denzel",
  "Eli",
  "Mouton",
  "Verkindere",
  "Gaelle",
  "Kyandro",
  "Lars",
  "Mathijs",
  "Maxime",
  "Robbe",
  "Rube",
  "Yoran",
]);

const jsonSchema = z.record(
  people,
  z.array(
    z.object({
      group: groups,
      // Score of 0-100 indicating how much a person would like to lead a certain group
      score: z.number().min(0).max(100),
    })
  )
);

const jsonData = JSON.parse(fs.readFileSync("./src/assets/data.json", "utf-8"));
jsonSchema.parse(jsonData);

type Group = z.infer<typeof groups>;
type Leiding = z.infer<typeof people>;

interface ScorePerGroup {
  group: Group;
  score: number;
}

const data: Map<string, ScorePerGroup[]> = new Map(Object.entries(jsonData));

// Init result based on all groups
const result = new Map<Group, Leiding[]>();
for (const group of Object.values(groups.Values)) {
  result.set(group, []);
}

const amountOfGroups = Object.values(groups.Values).length;

const sortScoresFn = (x: ScorePerGroup, y: ScorePerGroup) => {
  if (x.score > y.score) return -1;
  if (x.score < y.score) return 1;
  return 0;
};

const getFavouriteGroup = (props: {
  scores: ScorePerGroup[];
  after: Group | null;
}): ScorePerGroup => {
  // Only include scores > 0
  const sortedScores = props.scores
    .filter((s) => s.score > 0)
    .sort(sortScoresFn);

  const indexOfAfterGroup = sortedScores.findIndex(
    (s) => s.group === props.after
  );

  const sliceIdx = (indexOfAfterGroup + 1) % 3;
  return sortedScores.slice(sliceIdx, undefined)[0];
};

const getScoreForGroup = (props: {
  scores: ScorePerGroup[];
  group: Group;
}): ScorePerGroup => {
  return props.scores.find((s) => s.group === props.group)!;
};

const findGroupOfLeiding = (l: Leiding): Group | null => {
  for (const [group, leiding] of result) {
    if (leiding.indexOf(l) >= 0) return group;
  }

  return null;
};

const assignFavourites = () => {
  for (const [leiding, scores] of data) {
    const favo = getFavouriteGroup({ scores, after: null });
    result.set(favo.group, result.get(favo.group)!.concat(leiding as Leiding));
  }
};

const renderData = () => {
  console.log(
    `\n--------------------------------- Data ---------------------------------`
  );

  for (const [leiding, scores] of data) {
    console.log(`\n${leiding}`);
    for (const score of scores.filter((s) => s.score > 0).sort(sortScoresFn)) {
      console.log(
        `  -> ${score.score
          .toString()
          .padStart(3, " ")}% zin om leiding te geven aan de ${score.group}`
      );
    }
  }
};

const allLeiding = Object.values(people.Values);
let groupsWithTooLittleLeiding: Group[] = [];
let groupsWithTooMuchLeiding: Group[] = [];

const renderResult = () => {
  console.log(
    `\n------------------------------ Iteratie ${
      c + 1
    } ------------------------------`
  );

  const img = PImage.make(1920, 540);
  const ctx = img.getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, 1920, 540);

  let hasIncompleteGroup = false;
  let i = 0;

  groupsWithTooLittleLeiding = [];
  groupsWithTooMuchLeiding = [];

  for (const [group, leiding] of result) {
    console.log(`\n${group}`);

    if (movedGroups.includes(group)) {
      drawRect(
        ctx,
        "lightgreen",
        (1920 / amountOfGroups) * i,
        0,
        1920 / amountOfGroups,
        540,
        0
      );
    }

    if (!leiding.length) console.log("  -> Niemand");
    if (leiding.length < IDEAL_LEIDING_PER_GROUP) {
      hasIncompleteGroup = true;
      groupsWithTooLittleLeiding.push(group);
    }
    if (leiding.length > IDEAL_LEIDING_PER_GROUP) {
      groupsWithTooMuchLeiding.push(group);
    }

    let j = 0;
    for (const leidingMember of leiding) {
      const groupScore = data
        .get(leidingMember)!
        .find((l) => l.group === group)!.score;

      const sortedScores = data.get(leidingMember)!.sort(sortScoresFn);
      const givenScore = sortedScores.find((s) => s.group === group);
      const choiceNumber = sortedScores.indexOf(givenScore!);

      console.log(
        `  -> ${leidingMember} (score: ${groupScore}, keuze: ${
          choiceNumber + 1
        })`
      );

      if (movedLeiding.includes(leidingMember)) {
        drawRect(
          ctx,
          "lightcoral",
          (1920 / amountOfGroups) * i,
          140 + j * 64 - 24,
          1920 / amountOfGroups,
          16 + 24 + 24,
          0
        );
      }

      drawText(
        ctx,
        `${leidingMember}`,
        16,
        (1920 / amountOfGroups) * i + 16,
        140 + j * 64,
        "start"
      );

      drawText(
        ctx,
        ` -> (score: ${groupScore}, keuze: ${choiceNumber + 1})`,
        16,
        (1920 / amountOfGroups) * i + 16,
        140 + (j + 1) * 64 - 42,
        "start"
      );

      j++;
    }

    drawLine(
      ctx,
      (1920 / amountOfGroups) * i,
      0,
      (1920 / amountOfGroups) * i,
      540
    );
    drawText(
      ctx,
      group,
      20,
      (1920 / amountOfGroups) * i + 1920 / amountOfGroups / 2,
      48
    );
    drawLine(ctx, 0, 88, 1920, 88);
    i++;
  }

  drawTextWithBackground(ctx, `Iteratie ${c + 1}`, 14, 32, 540 - 32, "start");

  PImage.encodePNGToStream(img, fs.createWriteStream(`Iteratie_${c + 1}.png`))
    .then(() => {
      console.log("wrote out the png file to out.png");
    })
    .catch((e: any) => {
      console.log("there was an error writing");
      console.log(e);
    });

  if (!hasIncompleteGroup) {
    console.log(
      "\n🎉 Found solution where all groups have a sufficient amount of leiders"
    );
    c = MAX_ITERATIONS;
    return;
  }

  console.log(
    `\n------------------------------ Iteratie ${
      c + 1
    } ------------------------------`
  );
};

let movedLeiding: Leiding[] = [];
let movedGroups: Group[] = [];

const improveGroupsWithTooMuchLeiding = (): undefined => {
  // Render intermediate result
  renderResult();

  movedLeiding = [];
  movedGroups = [];

  // Ensure overflow is caught
  c += 1;
  if (c >= MAX_ITERATIONS) return;

  if (groupsWithTooMuchLeiding) {
    // Get group with too many leiding (randomly, otherwise infinite loop 🙃)
    const group =
      groupsWithTooMuchLeiding[
        Math.floor(Math.random() * groupsWithTooMuchLeiding.length)
      ];
    const leiding = result.get(group)!;

    // too many people want this group => Move some
    console.log(
      `\nTe veel mensen willen leiding geven aan de ${group} (${leiding.length})`
    );
    movedGroups.push(group);

    // decide who to move based on their next choice
    const leidingSortedToMove = leiding.sort((x, y) => {
      const xScoreForNextGroup = getFavouriteGroup({
        scores: data.get(x)!,
        after: group,
      }).score;
      const yScoreForNextGroup = getFavouriteGroup({
        scores: data.get(y)!,
        after: group,
      }).score;

      if (xScoreForNextGroup > yScoreForNextGroup) return -1;
      if (xScoreForNextGroup < yScoreForNextGroup) return 1;
      return 0;
    });

    // move those with the highest next choice
    leidingSortedToMove.slice(0, -IDEAL_LEIDING_PER_GROUP).forEach((l) => {
      const nextGroup = getFavouriteGroup({
        scores: data.get(l)!,
        after: group,
      });
      movedLeiding.push(l);
      console.log(
        ` > ${l} wordt verhuisd naar de volgende keuze ${nextGroup.group} met score ${nextGroup.score}`
      );

      result.set(nextGroup.group, result.get(nextGroup.group)!.concat(l));
    });

    // keep n with lowest next choice
    result.set(group, leidingSortedToMove.slice(-IDEAL_LEIDING_PER_GROUP));

    // now improve groups that are too small
    return improveGroupsWithTooLittleLeiding();
  }

  console.log("Optimale oplossing gevonden 🎉");
  return;
};

const improveGroupsWithTooLittleLeiding = (): undefined => {
  // Render intermediate result
  renderResult();
  movedLeiding = [];
  movedGroups = [];

  // Ensure overflow is caught
  c += 1;
  if (c >= MAX_ITERATIONS) return;

  if (groupsWithTooLittleLeiding) {
    // Get group with too many leiding (randomly, otherwise infinite loop 🙃)
    const group =
      groupsWithTooLittleLeiding[
        Math.floor(Math.random() * groupsWithTooLittleLeiding.length)
      ];
    const leidingOfGroup = result.get(group)!;

    // too little people want this group => Move some from the other groups
    console.log(
      `\nTe weinig mensen willen leiding geven aan de ${group} (${leidingOfGroup.length})`
    );

    // decide who to move based on their next choice
    const leidingSortedToMove = allLeiding
      // filter out leiding that is already in this group
      .filter((l) => leidingOfGroup.indexOf(l) === -1)
      .sort((x, y) => {
        const xScoreForThisGroup = getScoreForGroup({
          scores: data.get(x)!,
          group: group,
        }).score;
        const yScoreForThisGroup = getScoreForGroup({
          scores: data.get(y)!,
          group: group,
        }).score;

        if (xScoreForThisGroup > yScoreForThisGroup) return -1;
        if (xScoreForThisGroup < yScoreForThisGroup) return 1;
        return 0;
      });

    for (let i = 0; i < IDEAL_LEIDING_PER_GROUP - leidingOfGroup.length; i++) {
      const l = leidingSortedToMove[i];
      movedLeiding.push(l);

      // remove them from their current group
      const oldGroup = findGroupOfLeiding(l)!;
      movedGroups.push(oldGroup);

      const leidingOfOldGroup = [...result.get(oldGroup)!];
      leidingOfOldGroup.splice(leidingOfOldGroup.indexOf(l), 1);

      // remove this person from their old group
      result.set(oldGroup, leidingOfOldGroup);
      // add this person to the current group
      result.set(group, result.get(group)!.concat(l));

      console.log(` > ${l} wordt verhuisd van ${oldGroup} naar ${group}`);
    }

    // now improve groups that are too big
    return improveGroupsWithTooMuchLeiding();
  }

  console.log("Optimale oplossing gevonden 🎉");
  return;
};

// Show scores per person per group
renderData();

// Start off by giving everyone their first choice
assignFavourites();

// Start optimizing
improveGroupsWithTooLittleLeiding();
// improveGroupsWithTooMuchLeiding();
