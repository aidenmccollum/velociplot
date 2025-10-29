export function parseCSV(csvText: string): Record<string, number[]> {
  const allLines = csvText.split("\n");

  if (allLines.length < 2) {
    throw new Error("CSV must contain a header row and at least one data row.");
  }

  const firstLine = allLines[0];
  const headers = firstLine.split(",");
  for (let i = 0; i < headers.length; i++) {
    headers[i] = headers[i].trim().replaceAll(" ", "_");
    headers[i] = headers[i].trim().replaceAll("(", "");
    headers[i] = headers[i].trim().replaceAll(")", "");
  }

  const data: Record<string, number[]> = {};
  for (let i = 0; i < headers.length; i++) {
    data[headers[i]] = [];
  }

  for (let lineIndex = 1; lineIndex < allLines.length; lineIndex++) {
    const line = allLines[lineIndex];
    if (line.trim() === "") {
      continue;
    }

    const values = line.split(",");
    for (let i = 0; i < headers.length; i++) {
      let value = values[i] ? values[i].trim() : "";
      let num = parseFloat(value);
      if (!isNaN(num)) {
        data[headers[i]].push(num);
      } else {
        console.warn(
          'Skipping non-numeric value "' + value + '" in column ' + headers[i],
        );
      }
    }
  }

  return data;
}
