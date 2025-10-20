import { evaluate } from "mathjs";

let exampleData: Record<string, number[]> = {
  load0: [0, 10, 20, 30, 5, 40, 1, 25],
  load1: [5, 3, 10, 40, 20, 10, 25, 17],
  load2: [2, 13, 20, 32, 19, 21, 34, 35],
};

export function computeLarexEquation(
  equation: string,
  data: Record<string, number[]>,
): [string, Record<string, number[]>] {
  // reading the equation and checking the formatting using regex
  const match = equation.match(/^\{([^{}]+)\}\s*=\s*(.+)$/);
  if (!match)
    throw new Error("Equation must be of the form {var} = expression");

  const [, outputVar, expr] = match;

  // removing the curly braces around the vars and letting mathjs do the calculations using the reference variables
  const formattedEq = expr.replace(/\{([^{}]+)\}/g, (_, name) => {
    const varName = name.trim();
    //making sure channel is in the data
    if (!data.hasOwnProperty(varName)) {
      throw new Error(`Unknown variable: ${varName}`);
    }
    // using the raw channel name as the unique identifier for mathjs
    return varName;
  });

  // Evaluate using mathjs
  const result = evaluate(formattedEq, data);

  if (!Array.isArray(result)) {
    throw new Error("Expected array result but got scalar");
  }

  // Assign back to dataset
  data[outputVar.trim()] = result;

  //returning the calculated data to process the results
  return [outputVar.trim(), data];
}

export function checkLarexFormat(
  equation: string,
  data: Record<string, number[]>,
) {
  //parsing to make sure the channel references are correct
  const [_, inputChannels] = extractChannelNames(equation);

  for (const chan in inputChannels) {
    if (Object.keys(data).includes(chan) == false) {
      console.error(`Channel ${chan} does not exist in exampleData`);
    }
  }
}

function extractChannelNames(input: string): string[][] {
  // regex to find the string inside the curly braces
  const regex = /\{([^{}]+)\}/g;

  const inputChannels: string[] = [];
  const outputChannels: string[] = [];

  let match: RegExpExecArray | null;

  const equationSplit = input.split("=");

  while ((match = regex.exec(equationSplit[1])) !== null) {
    inputChannels.push(match[1].trim());
  }

  while ((match = regex.exec(equationSplit[0])) !== null) {
    outputChannels.push(match[1].trim());
  }

  return [outputChannels, inputChannels];
}
