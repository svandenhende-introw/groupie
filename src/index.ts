import * as fs from "fs";
import * as z from "zod";

const MAX_LEIDING_PER_GROUP = 2;
const MAX_ITERATIONS = 100;
let c = 0;

const groups = z.enum([
  "Sloebers",
  "Speelclub jongens",
  "Speelclub meisjes",
  "Rakkers",
  "Kwils",
  "Tito's",
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
  "Margaux",
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

const sortScoresFn = (x: ScorePerGroup, y: ScorePerGroup) => {
  if (x.score > y.score) return -1;
  if (x.score < y.score) return 1;
  return 0;
};

const getFavouriteGroup = (props: {
  scores: ScorePerGroup[];
  after: Group | null;
}): ScorePerGroup => {
  const sortedScores = props.scores.sort(sortScoresFn);
  const indexOfAfterGroup = sortedScores.findIndex(
    (s) => s.group === props.after
  );

  return sortedScores.slice(indexOfAfterGroup + 1, undefined)[0];
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
    for (const score of scores.sort(sortScoresFn)) {
      console.log(
        `  -> ${score.score.toString().padStart(3, " ")} | ${score.group}`
      );
    }
  }
};

const renderResult = () => {
  console.log(
    `\n------------------------------ Iteratie ${
      c + 1
    } ------------------------------`
  );
  for (const [group, leiding] of result) {
    console.log(`\n${group}`);
    if (!leiding.length) console.log("  -> Niemand");
    for (const leidingMember of leiding) {
      const groupScore = data
        .get(leidingMember)!
        .find((l) => l.group === group)!.score;

      const sortedScores = data.get(leidingMember)!.sort((x, y) => {
        if (x.score > y.score) return -1;
        if (x.score < y.score) return 1;
        return 0;
      });

      const givenScore = sortedScores.find((s) => s.group === group);
      const choiceNumber = sortedScores.indexOf(givenScore!);

      console.log(
        `  -> ${leidingMember} (score: ${groupScore}, keuze: ${
          choiceNumber + 1
        })`
      );
    }
  }
  console.log(
    `\n------------------------------ Iteratie ${
      c + 1
    } ------------------------------`
  );
};

const improve = (): undefined => {
  // Render intermediate result
  renderResult();

  // Ensure overflow is caught
  c += 1;
  if (c == MAX_ITERATIONS) {
    console.log("  >> Gestopt door maximaal aantal iteraties");
    return;
  }

  for (const [group, leiding] of result) {
    if (leiding.length > MAX_LEIDING_PER_GROUP) {
      // too many people want this group => Move some
      console.log(
        `\nTe veel mensen willen leiding geven aan de ${group} (${leiding.length})`
      );

      // decide who to move based on their next choice
      const leidingSortedBasedOnNextChoice = leiding.sort((x, y) => {
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
      leidingSortedBasedOnNextChoice
        .slice(0, -MAX_LEIDING_PER_GROUP)
        .forEach((l) => {
          const nextGroup = getFavouriteGroup({
            scores: data.get(l)!,
            after: group,
          });
          console.log(
            ` > ${l} wordt verhuisd naar de volgende keuze ${nextGroup.group} met score ${nextGroup.score}`
          );

          result.set(nextGroup.group, result.get(nextGroup.group)!.concat(l));
        });

      // keep n with lowest next choice
      result.set(
        group,
        leidingSortedBasedOnNextChoice.slice(-MAX_LEIDING_PER_GROUP)
      );

      // check if further improvement is required
      return improve();
    }
  }

  console.log("Optimale oplossing gevonden 🎉");
  return;
};

// Show scores per person per group
renderData();

// Start off by giving everyone their first choice
assignFavourites();

// Start optimizing
improve();
